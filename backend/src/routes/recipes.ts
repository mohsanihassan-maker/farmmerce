import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/recipes - List all recipes
router.get('/', async (req, res) => {
    try {
        const recipes = await prisma.recipe.findMany({
            include: { ingredients: true }
        });
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch recipes' });
    }
});

// POST /api/recipes - Create a new recipe
router.post('/', async (req, res) => {
    try {
        const { title, description, instructions, imageUrl, servings, mealType, ingredients } = req.body;

        if (!title || !ingredients || !Array.isArray(ingredients)) {
            return res.status(400).json({ error: 'Title and ingredients are required' });
        }

        const recipe = await prisma.recipe.create({
            data: {
                title,
                description,
                instructions,
                imageUrl,
                servings: parseInt(servings) || 4,
                mealType: mealType || 'LUNCH',
                ingredients: {
                    create: ingredients.map((ing: any) => ({
                        name: ing.name,
                        productKeyword: ing.productKeyword,
                        quantity: parseInt(ing.quantity) || 1
                    }))
                }
            },
            include: { ingredients: true }
        });

        res.json(recipe);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create recipe' });
    }
});

// POST /api/recipes/seed - Helper to populate data for testing
router.post('/seed', async (req, res) => {
    try {
        await prisma.recipe.create({
            data: {
                title: 'Fresh Tomato Basil Pasta',
                description: 'A simple, fresh Italian classic.',
                instructions: 'Boil pasta. Chop tomatoes and basil. Mix with olive oil and serve.',
                imageUrl: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
                ingredients: {
                    create: [
                        { name: 'Fresh Tomatoes', productKeyword: 'tomato', quantity: 3 },
                        { name: 'Basil Bunch', productKeyword: 'basil', quantity: 1 }
                    ]
                }
            }
        });
        await prisma.recipe.create({
            data: {
                title: 'Vegetable Stir Fry',
                description: 'Healthy and quick dinner.',
                instructions: 'Chop all veggies. Stir fry in hot pan with soy sauce.',
                imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
                ingredients: {
                    create: [
                        { name: 'Carrots', productKeyword: 'carrot', quantity: 2 },
                        { name: 'Broccoli', productKeyword: 'broccoli', quantity: 1 },
                        { name: 'Peppers', productKeyword: 'pepper', quantity: 2 }
                    ]
                }
            }
        });
        res.json({ message: 'Seeded recipes' });
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

// POST /api/recipes/generate-plan - THE ALGORITHM (CASCADING BREAKFAST, LUNCH, DINNER)
router.post('/generate-plan', async (req, res) => {
    try {
        const { budget, days = 7 } = req.body;
        const totalDays = parseInt(days.toString());
        const budgetLimit = parseFloat(budget);

        // 1. Fetch all recipes
        const allRecipes = await prisma.recipe.findMany({
            include: { ingredients: true }
        });

        const feasibleRecipes: any = {
            BREAKFAST: [],
            LUNCH: [],
            DINNER: []
        };

        // 2. Calculate Real-Time Cost for each Recipe and categorize
        for (const recipe of allRecipes) {
            let totalRecipeCost = 0;
            const matchedProducts = [];
            let isFeasible = true;

            for (const ingredient of recipe.ingredients) {
                const products = await prisma.product.findMany({
                    where: {
                        name: { contains: ingredient.productKeyword },
                        stock: { gte: ingredient.quantity }
                    },
                    orderBy: { price: 'asc' },
                    take: 1
                });

                if (products.length > 0) {
                    const bestProduct = products[0];
                    const cost = Number(bestProduct.price) * ingredient.quantity;
                    totalRecipeCost += cost;
                    matchedProducts.push({
                        ...bestProduct,
                        requiredQty: ingredient.quantity,
                        ingredientName: ingredient.name
                    });
                } else {
                    isFeasible = false;
                    break;
                }
            }

            if (isFeasible) {
                const item = {
                    recipe,
                    cost: totalRecipeCost,
                    products: matchedProducts
                };
                if (recipe.mealType === 'BREAKFAST') feasibleRecipes.BREAKFAST.push(item);
                else if (recipe.mealType === 'LUNCH') feasibleRecipes.LUNCH.push(item);
                else if (recipe.mealType === 'DINNER') feasibleRecipes.DINNER.push(item);
                else feasibleRecipes.LUNCH.push(item); // Fallback
            }
        }

        // 3. Generate Plan
        const selectedPlan = [];
        let totalCost = 0;

        for (let d = 1; d <= totalDays; d++) {
            const dayPlan: any = { day: d, meals: {} };

            // Pick one for each type if budget allows
            const mealTypes = ['BREAKFAST', 'LUNCH', 'DINNER'];
            for (const type of mealTypes) {
                const options = feasibleRecipes[type];
                if (options.length > 0) {
                    // Simple random selection for variety
                    const randomPick = options[Math.floor(Math.random() * options.length)];

                    if (totalCost + randomPick.cost <= budgetLimit) {
                        dayPlan.meals[type] = randomPick;
                        totalCost += randomPick.cost;
                    }
                }
            }
            if (Object.keys(dayPlan.meals).length > 0) {
                selectedPlan.push(dayPlan);
            }
        }

        res.json({
            daysPlanned: totalDays,
            days: selectedPlan,
            totalCost: totalCost.toFixed(2),
            message: selectedPlan.length < totalDays
                ? `Note: Plan only covers ${selectedPlan.length} days due to budget.`
                : 'Full meal plan generated successfully!'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to generate plan' });
    }
});

export default router;
