
async function test() {
    console.log('Testing /api/recipes/generate-plan...');
    try {
        const response = await fetch('http://localhost:3000/api/recipes/generate-plan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ budget: 5000, days: 3 })
        });

        console.log('Status:', response.status);
        if (response.ok) {
            const data = await response.json();
            console.log('Plan generated successfully!');
            console.log('Total Cost:', data.totalCost);
            console.log('Meals Count:', data.mealsCount);
            console.log('First Meal:', data.plan[0]?.recipe?.title);
        } else {
            console.log('Error Response:', await response.text());
        }
    } catch (error) {
        console.error('Fetch Error:', error);
    }
}
test();
