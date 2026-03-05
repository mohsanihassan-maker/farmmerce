import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding ...');

    // Create Users (Farmers)
    const farmer1 = await prisma.user.upsert({
        where: { email: 'farmer.joe@example.com' },
        update: {},
        create: {
            email: 'farmer.joe@example.com',
            name: 'Joe\'s Organic Farm',
            password: 'password123',
            role: 'FARMER',
        },
    });

    const farmer2 = await prisma.user.upsert({
        where: { email: 'green.acres@example.com' },
        update: {},
        create: {
            email: 'green.acres@example.com',
            name: 'Green Acres Co-op',
            password: 'password123',
            role: 'FARMER',
        },
    });

    const farmer3 = await prisma.user.upsert({
        where: { email: 'mama.sarah@example.com' },
        update: {},
        create: {
            email: 'mama.sarah@example.com',
            name: 'Mama Sarah\'s Garden',
            password: 'password123',
            role: 'FARMER',
        },
    });

    const admin = await prisma.user.upsert({
        where: { email: 'admin@fammerce.com' },
        update: {},
        create: {
            email: 'admin@fammerce.com',
            name: 'Platform Admin',
            password: 'adminpassword',
            role: 'ADMIN',
        },
    });

    // Create Categories
    const categories = ['Vegetables', 'Fruits', 'Tubers', 'Grains', 'Oils', 'Spices', 'Livestock'];
    for (const cat of categories) {
        await prisma.category.upsert({
            where: { name: cat },
            update: {},
            create: { name: cat }
        });
    }

    // Create Products
    const productsData = [
        // Vegetables
        {
            name: 'Fresh Spinach (Efo)',
            description: 'Organic spinach leaves, freshly picked.',
            price: 500,
            unit: 'bundle',
            category: 'Vegetables',
            imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
            stock: 50,
            farmerId: farmer1.id,
        },
        {
            name: 'Red Tomatoes',
            description: 'Juicy, vine-ripened tomatoes.',
            price: 1200,
            unit: 'kg',
            category: 'Vegetables',
            imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
            stock: 100,
            farmerId: farmer2.id,
        },
        {
            name: 'Bell Peppers (Rodo)',
            description: 'Spicy scotch bonnet peppers.',
            price: 800,
            unit: 'kg',
            category: 'Vegetables',
            imageUrl: 'https://images.unsplash.com/photo-1563565375-f3fdf5dbc239?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
            stock: 30,
            farmerId: farmer1.id,
        },
        {
            name: 'Onions',
            description: 'Dry red onions.',
            price: 600,
            unit: 'kg',
            category: 'Vegetables',
            imageUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
            stock: 80,
            farmerId: farmer2.id,
        },
        {
            name: 'Okra',
            description: 'Fresh green okra fingers.',
            price: 400,
            unit: 'basket',
            category: 'Vegetables',
            imageUrl: 'https://images.unsplash.com/photo-1425543103986-226d3d8d13d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
            stock: 40,
            farmerId: farmer1.id,
        },
        {
            name: 'Egusi (Melon Seeds)',
            description: 'Ground melon seeds for soup.',
            price: 1500,
            unit: 'cup',
            category: 'Vegetables',
            imageUrl: 'https://images.unsplash.com/photo-1515543904379-3d757afe726e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80', // generic seeds
            stock: 60,
            farmerId: farmer2.id,
        },
        // Fruits
        {
            name: 'Sweet Watermelon',
            description: 'Sugar baby watermelons, very sweet.',
            price: 1500,
            unit: 'fruit',
            category: 'Fruits',
            imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
            stock: 20,
            farmerId: farmer3.id,
        },
        {
            name: 'Pineapples',
            description: 'Juicy pineapples from Badagry.',
            price: 1000,
            unit: 'fruit',
            category: 'Fruits',
            imageUrl: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
            stock: 45,
            farmerId: farmer3.id,
        },
        // Tubers & Grains (Carbs)
        {
            name: 'White Yam',
            description: 'Premium white yam tubers.',
            price: 2500,
            unit: 'tuber',
            category: 'Tubers',
            imageUrl: 'https://images.unsplash.com/photo-1593106578502-27f50a41dcf2?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
            stock: 15,
            farmerId: farmer2.id,
        },
        {
            name: 'Sweet Potatoes',
            description: 'Nutritious orange-fleshed sweet potatoes.',
            price: 900,
            unit: 'kg',
            category: 'Tubers',
            imageUrl: 'https://images.unsplash.com/photo-1596097635121-14b63b7a0c19?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
            stock: 60,
            farmerId: farmer2.id,
        },
        {
            name: 'Local Rice (Ofada)',
            description: 'Stone-free, tasty local rice.',
            price: 4500,
            unit: 'kg',
            category: 'Grains',
            imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
            stock: 100,
            farmerId: farmer1.id,
        },
        {
            name: 'Garri (Ijebu)',
            description: 'Crispy and sour Ijebu Garri.',
            price: 1200,
            unit: 'paint bucket',
            category: 'Grains',
            imageUrl: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80', // generic meal
            stock: 80,
            farmerId: farmer3.id,
        },
        {
            name: 'Beans (Oloyin)',
            description: 'Sweet honey beans, clean and picked.',
            price: 3000,
            unit: 'kg',
            category: 'Grains',
            imageUrl: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
            stock: 50,
            farmerId: farmer1.id,
        },
        // Oils & Spices
        {
            name: 'Palm Oil',
            description: 'Red palm oil, unadulterated.',
            price: 1800,
            unit: 'liter',
            category: 'Oils',
            imageUrl: 'https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
            stock: 40,
            farmerId: farmer2.id,
        },
        {
            name: 'Ground Crayfish',
            description: 'Pure ground crayfish for seasoning.',
            price: 1000,
            unit: 'cup',
            category: 'Spices',
            imageUrl: 'https://plus.unsplash.com/premium_photo-1675252369719-dd52bc69c3df?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
            stock: 100,
            farmerId: farmer3.id,
        },
        // Livestock
        {
            name: 'Fresh Eggs',
            description: 'Crate of 30 large eggs.',
            price: 3500,
            unit: 'crate',
            category: 'Livestock',
            imageUrl: 'https://images.unsplash.com/photo-1569288063643-5d29054b0125?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
            stock: 25,
            farmerId: farmer3.id,
        },
        {
            name: 'Whole Chicken',
            description: 'Freshly dressed broiler chicken.',
            price: 5000,
            unit: 'bird',
            category: 'Livestock',
            imageUrl: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
            stock: 10,
            farmerId: farmer3.id,
        },
        {
            name: 'Beef Cuts',
            description: 'Fresh lean beef cuts.',
            price: 4000,
            unit: 'kg',
            category: 'Livestock',
            imageUrl: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
            stock: 20,
            farmerId: farmer1.id,
        },
        {
            name: 'Dried Fish (Panla)',
            description: 'Smoked fish for soups.',
            price: 2000,
            unit: 'pack',
            category: 'Livestock',
            imageUrl: 'https://images.unsplash.com/photo-1534939561126-855f8621818e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
            stock: 30,
            farmerId: farmer2.id,
        }
    ];

    for (const p of productsData) {
        const existing = await prisma.product.findFirst({ where: { name: p.name } });
        if (!existing) {
            await prisma.product.create({
                data: {
                    name: p.name,
                    description: p.description,
                    price: p.price,
                    unit: p.unit,
                    stock: p.stock,
                    imageUrl: p.imageUrl,
                    category: { connect: { name: p.category } },
                    farmer: { connect: { id: p.farmerId } }
                }
            });
        }
    }

    // ... Existing products ...

    // NEW SMALLER UNITS FOR BUDGET PLANNING
    const budgetProducts = [
        {
            name: 'Eggs (Half Dozen)',
            description: 'Pack of 6 fresh eggs.',
            price: 800,
            unit: 'pack',
            category: 'Livestock',
            imageUrl: 'https://images.unsplash.com/photo-1569288063643-5d29054b0125?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
            stock: 100,
            farmerId: farmer3.id,
        },
        {
            name: 'Beef Chunks (500g)',
            description: 'Pack of fresh beef chunks.',
            price: 2000,
            unit: 'pack',
            category: 'Livestock',
            imageUrl: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
            stock: 50,
            farmerId: farmer1.id,
        },
        {
            name: 'Chicken Parts (1kg)',
            description: 'Fresh chicken parts.',
            price: 2500,
            unit: 'kg',
            category: 'Livestock',
            imageUrl: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
            stock: 40,
            farmerId: farmer3.id,
        },
        {
            name: 'Pepper Mix (Small)',
            description: 'Blend of tomatoes and peppers for one pot.',
            price: 500,
            unit: 'pack',
            category: 'Vegetables',
            imageUrl: 'https://images.unsplash.com/photo-1563565375-f3fdf5dbc239?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
            stock: 200,
            farmerId: farmer2.id,
        },
        {
            name: 'Garri (Cup)',
            description: 'Single cup of Garri.',
            price: 150,
            unit: 'cup',
            category: 'Grains',
            imageUrl: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
            stock: 500,
            farmerId: farmer3.id
        }
    ];

    for (const p of budgetProducts) {
        const existing = await prisma.product.findFirst({ where: { name: p.name } });
        if (!existing) {
            await prisma.product.create({
                data: {
                    name: p.name,
                    description: p.description,
                    price: p.price,
                    unit: p.unit,
                    stock: p.stock,
                    imageUrl: p.imageUrl,
                    category: { connect: { name: p.category } },
                    farmer: { connect: { id: p.farmerId } }
                }
            });
        }
    }

    // Create Recipes
    const recipesData = [
        {
            title: 'Akara & Ogi',
            description: 'Fried bean cakes with fermented corn pudding.',
            instructions: 'Peel beans, blend with onions and peppers. Fry in hot oil. Serve with hot Ogi.',
            imageUrl: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?ixlib=rb-4.2.1&auto=format&fit=crop&w=800&q=60',
            mealType: 'BREAKFAST',
            ingredients: [
                { name: 'Beans', keyword: 'Beans', quantity: 0.5 },
                { name: 'Onions', keyword: 'Onion', quantity: 1 },
                { name: 'Pepper Mix', keyword: 'Pepper', quantity: 1 },
                { name: 'Vegetable Oil', keyword: 'Oil', quantity: 0.2 }
            ]
        },
        {
            title: 'Yam and Egg Sauce',
            description: 'Boiled yam with scrambled egg sauce.',
            instructions: 'Boil yam until soft. Fry eggs with tomatoes and peppers.',
            imageUrl: 'https://images.unsplash.com/photo-1593106578502-27f50a41dcf2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
            mealType: 'BREAKFAST',
            ingredients: [
                { name: 'Yam', keyword: 'Yam', quantity: 1 },
                { name: 'Eggs', keyword: 'Egg', quantity: 1 },
                { name: 'Pepper Mix', keyword: 'Pepper', quantity: 1 },
                { name: 'Onions', keyword: 'Onion', quantity: 1 }
            ]
        },
        {
            title: 'Oatmeal with Fruits',
            description: 'Healthy oats topped with fresh fruits.',
            instructions: 'Cook oats with water/milk. Top with sliced watermelon and pineapple.',
            imageUrl: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
            mealType: 'BREAKFAST',
            ingredients: [
                { name: 'Watermelon', keyword: 'Watermelon', quantity: 0.2 },
                { name: 'Pineapple', keyword: 'Pineapple', quantity: 0.2 }
            ]
        },
        {
            title: 'Village Rice & Chicken',
            description: 'Classic local rice with spicy chicken stew.',
            instructions: 'Parboil rice. Fry chicken. Make stew with tomatoes and peppers. Mix.',
            imageUrl: 'https://images.unsplash.com/photo-1574484284002-952d92456975?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
            mealType: 'LUNCH',
            ingredients: [
                { name: 'Ofada Rice', keyword: 'Rice', quantity: 1 },
                { name: 'Chicken', keyword: 'Chicken', quantity: 1 },
                { name: 'Pepper Mix', keyword: 'Pepper', quantity: 1 },
                { name: 'Onions', keyword: 'Onion', quantity: 1 },
                { name: 'Palm Oil', keyword: 'Oil', quantity: 1 }
            ]
        },
        {
            title: 'Egusi Soup with Eba',
            description: 'Rich melon seed soup served with Eba (Garri).',
            instructions: 'Make Eba with hot water. Fry egusi in palm oil with peppers and crayfish. Add stock fish/meat and vegetables.',
            imageUrl: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
            mealType: 'LUNCH',
            ingredients: [
                { name: 'Garri', keyword: 'Garri', quantity: 2 },
                { name: 'Egusi', keyword: 'Egusi', quantity: 1 },
                { name: 'Palm Oil', keyword: 'Palm Oil', quantity: 1 },
                { name: 'Spinach', keyword: 'Spinach', quantity: 1 },
                { name: 'Crayfish', keyword: 'Crayfish', quantity: 0.5 },
                { name: 'Pepper Mix', keyword: 'Pepper', quantity: 1 }
            ]
        },
        {
            title: 'Budget Egusi',
            description: 'Simple Egusi soup for a quick lunch.',
            instructions: 'Cook egusi with spinach and spices.',
            imageUrl: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
            mealType: 'LUNCH',
            ingredients: [
                { name: 'Garri', keyword: 'Garri', quantity: 2 },
                { name: 'Egusi', keyword: 'Egusi', quantity: 0.5 },
                { name: 'Spinach', keyword: 'Spinach', quantity: 1 },
                { name: 'Pepper Mix', keyword: 'Pepper', quantity: 1 },
                { name: 'Palm Oil', keyword: 'Palm Oil', quantity: 0.2 }
            ]
        },
        {
            title: 'Beans Porridge (Ewa Agoyin Style)',
            description: 'Soft beans cooked with peppery palm oil sauce.',
            instructions: 'Boil beans until very soft. Fry peppers in bleached palm oil. Mash beans slightly.',
            imageUrl: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
            mealType: 'DINNER',
            ingredients: [
                { name: 'Beans', keyword: 'Beans', quantity: 0.5 },
                { name: 'Palm Oil', keyword: 'Palm Oil', quantity: 0.2 },
                { name: 'Onions', keyword: 'Onion', quantity: 1 },
                { name: 'Pepper Mix', keyword: 'Pepper', quantity: 1 },
                { name: 'Crayfish', keyword: 'Crayfish', quantity: 0.2 }
            ]
        },
        {
            title: 'Okra Soup with Beef',
            description: 'Slimy and delicious Okra soup with beef chunks.',
            instructions: 'Boil beef with spices. Add chopped okra and palm oil. Cook for 5 mins.',
            imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
            mealType: 'DINNER',
            ingredients: [
                { name: 'Okra', keyword: 'Okra', quantity: 1 },
                { name: 'Beef', keyword: 'Beef', quantity: 1 },
                { name: 'Palm Oil', keyword: 'Palm Oil', quantity: 0.2 },
                { name: 'Crayfish', keyword: 'Crayfish', quantity: 0.2 },
                { name: 'Pepper Mix', keyword: 'Pepper', quantity: 1 }
            ]
        },
        {
            title: 'Fruit Salad Deluxe',
            description: 'A refreshing mix of watermelon and pineapple.',
            instructions: 'Cube watermelon and pineapple. Chill and serve.',
            imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
            mealType: 'DINNER',
            ingredients: [
                { name: 'Watermelon', keyword: 'Watermelon', quantity: 1 },
                { name: 'Pineapple', keyword: 'Pineapple', quantity: 1 }
            ]
        }
    ];

    for (const r of recipesData) {
        // Upsert logic for recipes to update ingredients if changed
        const existing = await prisma.recipe.findFirst({ where: { title: r.title } });
        if (existing) {
            // Delete old ingredients to refresh
            await prisma.ingredient.deleteMany({ where: { recipeId: existing.id } });
            await prisma.recipe.update({
                where: { id: existing.id },
                data: {
                    ingredients: {
                        create: r.ingredients.map(ing => ({
                            name: ing.name,
                            productKeyword: ing.keyword,
                            quantity: ing.quantity
                        }))
                    },
                    mealType: r.mealType
                }
            });
        } else {
            await prisma.recipe.create({
                data: {
                    title: r.title,
                    description: r.description,
                    instructions: r.instructions,
                    imageUrl: r.imageUrl,
                    ingredients: {
                        create: r.ingredients.map(ing => ({
                            name: ing.name,
                            productKeyword: ing.keyword,
                            quantity: ing.quantity
                        }))
                    },
                    mealType: r.mealType
                }
            })
        }
    }

    console.log('Seeding finished.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
