// Native fetch in Node 18+

async function testLogistics() {
    try {
        const baseUrl = 'http://localhost:3000/api';

        // 1. Get a Buyer
        console.log('Fetching users to find a buyer...');
        // Since we don't have a direct "get all users" endpoint that returns roles easily publically, 
        // we might need to rely on seed data or login.
        // But for testing, let's just try to create a dummy order with buyerId=1 (from seed).
        // If it fails, we'll know.

        // 2. Get a Product
        console.log('Fetching products...');
        const productsRes = await fetch(`${baseUrl}/products`);
        const products = await productsRes.json();
        if (products.length === 0) throw new Error('No products found to order');
        const product = products[0];

        // 3. Create an Order
        console.log('Creating a test order...');
        const orderPayload = {
            items: [{ productId: product.id, quantity: 1 }],
            totalAmount: product.price,
            buyerId: 2, // Assuming ID 2 is a buyer from seed (usually 1 is farmer, 2 is buyer)
            shippingAddress: '123 Test St, Logistics City',
            paymentMethod: 'cod'
        };

        const createRes = await fetch(`${baseUrl}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderPayload)
        });

        if (!createRes.ok) {
            const errText = await createRes.text();
            throw new Error(`Failed to create order: ${createRes.status} ${errText}`);
        }

        const newOrder = await createRes.json();
        console.log(`Order created with ID: ${newOrder.id}`);

        // 4. Update Status (Logistics)
        console.log('Updating status to SHIPPED...');
        const updateRes = await fetch(`${baseUrl}/orders/${newOrder.id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                status: 'SHIPPED',
                trackingNote: 'Rider: Speedy Joe'
            })
        });

        const updatedOrder = await updateRes.json();
        console.log('Update Result:', updatedOrder);

        // 5. Verify
        if (updatedOrder.status === 'SHIPPED' && updatedOrder.trackingNote === 'Rider: Speedy Joe') {
            console.log('SUCCESS: Logistics flow verified!');
        } else {
            console.error('FAILURE: Order status mismatch.');
        }

    } catch (error) {
        console.error('Test Failed:', error);
    }
}

testLogistics();
