const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('./config/db');
const User = require('./models/User');
const Product = require('./models/Product');

const sampleProducts = [
  {
    title: "Classic White Oxford Shirt",
    description: "A timeless white oxford shirt crafted from premium 100% cotton. Features a button-down collar, chest pocket, and a tailored fit perfect for both office and casual settings.",
    price: 1299,
    originalPrice: 1999,
    category: "men",
    subCategory: "shirts",
    images: ["https://images.unsplash.com/photo-1602810316498-ab67cf68c8e1?w=600"],
    stock: 50,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Light Blue", "Navy"],
    rating: 4.5,
    numReviews: 128,
    featured: true,
    tags: ["shirt", "formal", "cotton", "classic"],
  },
  {
    title: "Slim Fit Chino Pants",
    description: "Modern slim fit chinos made from stretch cotton blend. These versatile trousers transition seamlessly from office to weekend wear with a comfortable mid-rise waist.",
    price: 1599,
    originalPrice: 2499,
    category: "men",
    subCategory: "pants",
    images: ["https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600"],
    stock: 40,
    sizes: ["28", "30", "32", "34", "36"],
    colors: ["Khaki", "Navy", "Olive", "Black"],
    rating: 4.3,
    numReviews: 95,
    featured: true,
    tags: ["pants", "chino", "slim fit", "casual"],
  },
  {
    title: "Premium Denim Jacket",
    description: "A wardrobe essential denim jacket with a vintage wash. Features classic chest pockets, button closure, and side vents for a relaxed, cool look.",
    price: 2499,
    originalPrice: 3999,
    category: "men",
    subCategory: "jackets",
    images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600"],
    stock: 30,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Light Blue", "Dark Blue", "Black"],
    rating: 4.7,
    numReviews: 204,
    featured: false,
    tags: ["jacket", "denim", "casual", "outerwear"],
  },
  {
    title: "Floral Wrap Dress",
    description: "An elegant floral print wrap dress with a flattering V-neckline and adjustable waist tie. Perfect for brunches, garden parties, and summer evenings. Made from lightweight viscose.",
    price: 1899,
    originalPrice: 2999,
    category: "women",
    subCategory: "dresses",
    images: ["https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600"],
    stock: 35,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Floral Pink", "Floral Blue", "Floral Yellow"],
    rating: 4.6,
    numReviews: 312,
    featured: true,
    tags: ["dress", "floral", "summer", "women"],
  },
  {
    title: "High-Waist Yoga Leggings",
    description: "Ultra-comfortable high-waist leggings crafted from 4-way stretch fabric with moisture-wicking technology. Features a hidden waistband pocket and seamless construction for all-day wear.",
    price: 999,
    originalPrice: 1599,
    category: "women",
    subCategory: "activewear",
    images: ["https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600"],
    stock: 60,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Navy", "Charcoal", "Forest Green"],
    rating: 4.8,
    numReviews: 450,
    featured: true,
    tags: ["leggings", "yoga", "activewear", "women"],
  },
  {
    title: "Oversized Knit Sweater",
    description: "Cozy oversized knit sweater in a relaxed silhouette. Made from a soft wool-blend yarn with ribbed cuffs and hem. The perfect layering piece for cooler days.",
    price: 1799,
    originalPrice: 2799,
    category: "women",
    subCategory: "tops",
    images: ["https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600"],
    stock: 25,
    sizes: ["S", "M", "L"],
    colors: ["Cream", "Camel", "Dusty Pink", "Sage Green"],
    rating: 4.4,
    numReviews: 167,
    featured: false,
    tags: ["sweater", "knit", "oversized", "women"],
  },
  {
    title: "Kids Graphic Tee Set",
    description: "Fun and vibrant graphic t-shirts for kids aged 4-12. Made from 100% organic cotton that's gentle on sensitive skin. Comes in a pack of 3 with different fun prints.",
    price: 799,
    originalPrice: 1299,
    category: "kids",
    subCategory: "tops",
    images: ["https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=600"],
    stock: 80,
    sizes: ["4Y", "6Y", "8Y", "10Y", "12Y"],
    colors: ["Mixed Pack"],
    rating: 4.5,
    numReviews: 230,
    featured: true,
    tags: ["kids", "tshirt", "graphic", "pack"],
  },
  {
    title: "Kids Denim Overalls",
    description: "Adorable and durable denim overalls perfect for active kids. Features adjustable straps, multiple pockets, and reinforced knee panels. Machine washable and built to last.",
    price: 1199,
    originalPrice: 1799,
    category: "kids",
    subCategory: "bottoms",
    images: ["https://images.unsplash.com/photo-1519278409-1f56fdda7fe5?w=600"],
    stock: 45,
    sizes: ["2Y", "4Y", "6Y", "8Y", "10Y"],
    colors: ["Light Blue", "Dark Blue"],
    rating: 4.6,
    numReviews: 189,
    featured: false,
    tags: ["kids", "overalls", "denim", "casual"],
  },
  {
    title: "Men's Running Shorts",
    description: "Lightweight 2-in-1 running shorts with inner compression liner. Features a 5-inch inseam, reflective details, and a zippered back pocket for your essentials.",
    price: 899,
    originalPrice: 1399,
    category: "men",
    subCategory: "activewear",
    images: ["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600"],
    stock: 55,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Navy", "Grey", "Red"],
    rating: 4.4,
    numReviews: 142,
    featured: false,
    tags: ["shorts", "running", "activewear", "men"],
  },
  {
    title: "Women's Blazer",
    description: "A sharp tailored blazer in a modern fit. Crafted from a premium stretch fabric with notch lapels, flap pockets, and a single button closure. Perfect for power dressing.",
    price: 2999,
    originalPrice: 4499,
    category: "women",
    subCategory: "jackets",
    images: ["https://images.unsplash.com/photo-1548778943-5bbeeb1ba6c1?w=600"],
    stock: 20,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Camel", "White", "Navy"],
    rating: 4.7,
    numReviews: 98,
    featured: true,
    tags: ["blazer", "formal", "women", "office"],
  },
  {
    title: "Kids Hooded Raincoat",
    description: "A waterproof and windproof hooded raincoat for adventurous kids. Features sealed seams, reflective strips for safety, and a packable design. Fun colours that kids will love.",
    price: 1499,
    originalPrice: 2199,
    category: "kids",
    subCategory: "jackets",
    images: ["https://images.unsplash.com/photo-1518770660439-4636190af475?w=600"],
    stock: 30,
    sizes: ["2Y", "4Y", "6Y", "8Y", "10Y", "12Y"],
    colors: ["Yellow", "Red", "Blue", "Green"],
    rating: 4.5,
    numReviews: 156,
    featured: false,
    tags: ["kids", "raincoat", "waterproof", "outerwear"],
  },
  {
    title: "Men's Polo Shirt",
    description: "Classic pique polo shirt with a ribbed collar and two-button placket. Made from premium cotton for breathability. An essential for smart-casual occasions.",
    price: 999,
    originalPrice: 1599,
    category: "men",
    subCategory: "tops",
    images: ["https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600"],
    stock: 70,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Navy", "Red", "Forest Green", "Black"],
    rating: 4.3,
    numReviews: 215,
    featured: false,
    tags: ["polo", "shirt", "men", "casual"],
  },
];

const seedDB = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@dripstore.com',
      password: adminPassword,
      role: 'admin',
    });

    // Create test user
    const userPassword = await bcrypt.hash('user123', 10);
    const user = await User.create({
      name: 'Test User',
      email: 'user@dripstore.com',
      password: userPassword,
      role: 'user',
    });

    // Insert products
    await Product.insertMany(sampleProducts);

    console.log('✅ Database seeded successfully!');
    console.log('👤 Admin: admin@dripstore.com / admin123');
    console.log('👤 User: user@dripstore.com / user123');
    console.log(`📦 ${sampleProducts.length} products inserted`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedDB();