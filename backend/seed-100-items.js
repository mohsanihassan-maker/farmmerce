const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedRealistic100Items() {
  console.log('🖼️ Updating 100+ Items with Realistic Imagery...');

  const farmerId = 1; // Joe's Organic Farm

  const categoryImages = {
    'Vegetables': [
      'https://images.unsplash.com/photo-1595855709915-0b043928a491?w=800&q=80',
      'https://images.unsplash.com/photo-1566385101042-1a000c1268c4?w=800&q=80',
      'https://images.unsplash.com/photo-1592394933324-998bd5eccfbb?w=800&q=80'
    ],
    'Fruits': [
      'https://images.unsplash.com/photo-1619566636858-adf3ef46400c?w=800&q=80',
      'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&q=80',
      'https://images.unsplash.com/photo-1550258114-b8a917d63057?w=800&q=80'
    ],
    'Tubers': [
      'https://images.unsplash.com/photo-1596003906949-67221c37965c?w=800&q=80',
      'https://images.unsplash.com/photo-1590779033100-9f60502a3a3d?w=800&q=80'
    ],
    'Grains': [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80',
      'https://images.unsplash.com/photo-1536511118311-66487e411ea2?w=800&q=80'
    ],
    'Oils': [
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&q=80',
      'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80'
    ],
    'Spices': [
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80',
      'https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=800&q=80'
    ],
    'Livestock': [
      'https://images.unsplash.com/photo-1604503468506-a8da13d827d0?w=800&q=80',
      'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=80'
    ],
    'Bundles': [
      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80',
      'https://images.unsplash.com/photo-1488459711615-ef58135bc9ef?w=800&q=80'
    ]
  };

  const categoryProducts = {
    'Vegetables': [
      { name: 'Fresh Shoko (Green)', price: 400, unit: 'Bunch' },
      { name: 'Tete (Spinach)', price: 400, unit: 'Bunch' },
      { name: 'Ewedu Leaves', price: 500, unit: 'Bunch' },
      { name: 'Bitter Leaf (Washed)', price: 800, unit: 'Pack' },
      { name: 'Fluted Pumpkin (Ugu)', price: 600, unit: 'Bunch' },
      { name: 'Cucumber (Large)', price: 1200, unit: 'Pack of 3' },
      { name: 'Garden Egg (Green)', price: 1500, unit: 'Bowl' },
      { name: 'Carrots', price: 900, unit: 'Pack' },
      { name: 'Spring Onions', price: 500, unit: 'Bunch' },
      { name: 'Lettuce', price: 1200, unit: 'Head' },
      { name: 'Green Bell Peppers', price: 1800, unit: 'Pack' }
    ],
    'Fruits': [
      { name: 'Pawpaw (Large)', price: 1500, unit: 'Piece' },
      { name: 'Banana (Bunch)', price: 2500, unit: 'Bunch' },
      { name: 'Mango (Kerosene)', price: 2000, unit: 'Bowl' },
      { name: 'Avocado Pear', price: 1800, unit: 'Pack of 4' },
      { name: 'Fresh Lime', price: 800, unit: 'Bag' },
      { name: 'Lemon', price: 1000, unit: 'Pack' },
      { name: 'Local Oranges', price: 2000, unit: 'Bag' },
      { name: 'Soursop', price: 3500, unit: 'Piece' },
      { name: 'Tangerines', price: 1500, unit: 'Bag' },
      { name: 'Guava', price: 1200, unit: 'Bowl' }
    ],
    'Tubers': [
      { name: 'Pona Yam (Large)', price: 3500, unit: 'Tubers' },
      { name: 'Abeokuta Yam', price: 2800, unit: 'Tubers' },
      { name: 'Water Yam', price: 2500, unit: 'Tubers' },
      { name: 'Irish Potato', price: 4500, unit: 'Small Bag' },
      { name: 'White Sweet Potato', price: 1200, unit: 'Bowl' },
      { name: 'Cocoyam (Red)', price: 2200, unit: 'Bowl' },
      { name: 'Cassava Roots', price: 1500, unit: 'Bunch' }
    ],
    'Grains': [
      { name: 'White Beans (Oloyin)', price: 5500, unit: 'Paint Bucket' },
      { name: 'Brown Beans (Honey)', price: 6200, unit: 'Paint Bucket' },
      { name: 'White Garri (Ijebu)', price: 4800, unit: 'Paint Bucket' },
      { name: 'Yellow Garri', price: 5200, unit: 'Paint Bucket' },
      { name: 'Millet (Dawa)', price: 3500, unit: 'Mudu' },
      { name: 'Guinea Corn', price: 3800, unit: 'Mudu' },
      { name: 'White Corn (Dry)', price: 3000, unit: 'Mudu' },
      { name: 'Local Ofada Rice', price: 8500, unit: '5kg' },
      { name: 'Abakaliki Rice', price: 7800, unit: '5kg' },
      { name: 'Wheat Flour', price: 4500, unit: '5kg' }
    ],
    'Oils': [
      { name: 'Red Palm Oil (4L)', price: 12500, unit: 'Gallon' },
      { name: 'Groundnut Oil (5L)', price: 15800, unit: 'Gallon' },
      { name: 'Soya Bean Oil (3L)', price: 9500, unit: 'Gallon' },
      { name: 'Bleached Palm Oil', price: 6000, unit: '2L' },
      { name: 'Coconut Oil (Virgin)', price: 4500, unit: '500ml' }
    ],
    'Spices': [
      { name: 'Dry Pepper (Rodo)', price: 2500, unit: 'Paint Bucket' },
      { name: 'Dry Tatashe', price: 3000, unit: 'Paint Bucket' },
      { name: 'Fresh Ginger', price: 1200, unit: 'Bowl' },
      { name: 'Fresh Garlic', price: 1500, unit: 'Bowl' },
      { name: 'Uziza Leaves (Dry)', price: 800, unit: 'Pack' },
      { name: 'Scent Leaves (Dry)', price: 500, unit: 'Pack' },
      { name: 'Curry Powder', price: 1200, unit: 'Pack' },
      { name: 'Thyme (Leaf)', price: 1000, unit: 'Pack' },
      { name: 'Nutmeg (Whole)', price: 500, unit: 'Pack' }
    ],
    'Livestock': [
      { name: 'Whole Frozen Chicken', price: 7500, unit: 'Piece' },
      { name: 'Chicken Wings', price: 4500, unit: '1kg' },
      { name: 'Turkey Parts', price: 8500, unit: '1kg' },
      { name: 'Beef (Prime Cut)', price: 6500, unit: '1kg' },
      { name: 'Goat Meat (Diced)', price: 7800, unit: '1kg' },
      { name: 'Assorted (Shaki/Liver)', price: 5500, unit: '1kg' },
      { name: 'Fresh Eggs (Crate)', price: 4800, unit: 'Crate' },
      { name: 'Day Old Chicks', price: 12000, unit: 'Carton of 50' },
      { name: 'Smoked Catfish (Medium)', price: 4500, unit: '4 Pieces' }
    ],
    'Bundles': [
      { name: 'Breakfast Starter Bundle', price: 15500, unit: 'Monthly' },
      { name: 'Soup Essentials Pack', price: 12800, unit: 'Monthly' },
      { name: 'Fruit Salad Bowl', price: 8500, unit: 'Weekly' }
    ]
  };

  // 1. Delete all existing products (to refresh with realistic images)
  await prisma.product.deleteMany({});
  console.log('🗑️ Existing products cleared.');

  let count = 0;
  for (const [category, products] of Object.entries(categoryProducts)) {
    const categoryImgs = categoryImages[category];
    for (const p of products) {
      for (let i = 0; i < 2; i++) {
        const suffix = i === 0 ? '' : ' (Large)';
        const randomImg = categoryImgs[Math.floor(Math.random() * categoryImgs.length)];
        
        await prisma.product.create({
          data: {
            name: `${p.name}${suffix}`,
            description: `${p.name} sourced directly from verified local farmers. High-energy produce for a healthy lifestyle.`,
            price: p.price + (i * (p.price * 0.15)),
            unit: p.unit,
            stock: 20 + Math.floor(Math.random() * 81),
            categoryName: category,
            imageUrl: randomImg,
            farmerId: farmerId,
            harvestDate: new Date()
          }
        });
        count++;
      }
    }
  }

  console.log(`✅ Successfully seeded ${count} products with realistic imagery!`);
}

seedRealistic100Items()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
