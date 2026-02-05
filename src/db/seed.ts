import { db } from './index';
import { categories, products, orders, orderItems } from './schema';
import * as dotenv from 'dotenv';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// Load env vars for standalone execution
dotenv.config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is missing');
}

const sql = neon(process.env.DATABASE_URL);
const dbInstance = drizzle(sql);

async function main() {
    console.log('Seeding database...');

    // Optional: Clear existing data (Be careful in production!)
    await dbInstance.delete(orderItems);
    await dbInstance.delete(orders);
    await dbInstance.delete(products);
    await dbInstance.delete(categories);

    // 1. Categories
    const [catChai] = await dbInstance.insert(categories).values({
        name: 'Chai',
        slug: 'chai',
        description: 'Hot authentic tea'
    }).returning({ id: categories.id });

    const [catSnacks] = await dbInstance.insert(categories).values({
        name: 'Snacks',
        slug: 'snacks',
        description: 'Crispy bites'
    }).returning({ id: categories.id });

    const [catBurgers] = await dbInstance.insert(categories).values({
        name: 'Burgers & Sandwiches',
        slug: 'burgers-sandwiches',
        description: 'Filling and tasty'
    }).returning({ id: categories.id });

    const [catPizzaPasta] = await dbInstance.insert(categories).values({
        name: 'Pizza & Pasta',
        slug: 'pizza-pasta',
        description: 'Italian cravings'
    }).returning({ id: categories.id });

    const [catMaggieRice] = await dbInstance.insert(categories).values({
        name: 'Maggie & Rice',
        slug: 'maggie-rice',
        description: 'Comfort food'
    }).returning({ id: categories.id });

    const [catBeverages] = await dbInstance.insert(categories).values({
        name: 'Beverages',
        slug: 'beverages',
        description: 'Cool refreshing drinks'
    }).returning({ id: categories.id });


    // 2. Products
    const allProducts = [
        // Chai
        {
            name: 'Masala Chai',
            description: 'Signature spiced tea with aromatic herbs',
            price: '25.00',
            image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=500',
            categoryId: catChai.id,
            isPopular: true
        },
        {
            name: 'Ginger Chai',
            description: 'Strong tea brewed with fresh ginger',
            price: '20.00',
            image: 'https://images.unsplash.com/photo-1619052552627-d7255d6b499d?auto=format&fit=crop&q=80&w=500',
            categoryId: catChai.id,
        },
        {
            name: 'Plain Tea',
            description: 'Classic hot tea',
            price: '15.00',
            image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=500',
            categoryId: catChai.id,
        },

        // Snacks
        {
            name: 'Veg Samosa',
            description: 'Crispy fried pastry filled with spiced potatoes',
            price: '15.00',
            image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=500',
            categoryId: catSnacks.id,
            isPopular: true
        },
        {
            name: 'Bread Pakoda',
            description: 'Deep fried bread stuffed with potato filling',
            price: '20.00',
            image: 'https://images.unsplash.com/photo-1605333534887-19601d4d38c6?auto=format&fit=crop&q=80&w=500', // Generic fritter
            categoryId: catSnacks.id,
        },
        {
            name: 'Veg Cutlet',
            description: 'Hearty vegetable patties',
            price: '30.00',
            image: 'https://images.unsplash.com/photo-1604085792782-9646487e1a61?auto=format&fit=crop&q=80&w=500',
            categoryId: catSnacks.id,
        },
        {
            name: 'Aloo Tikki',
            description: 'Crispy spiced potato patties',
            price: '35.00',
            image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=500',
            categoryId: catSnacks.id,
        },
        {
            name: 'Veg Momos',
            description: 'Steamed dumplings with vegetable filling',
            price: '50.00',
            image: 'https://images.unsplash.com/photo-1626776877554-d00d782756ae?auto=format&fit=crop&q=80&w=500',
            categoryId: catSnacks.id,
            isPopular: true
        },
        {
            name: 'Paneer Momos',
            description: 'Steamed dumplings with paneer filling',
            price: '70.00',
            image: 'https://plus.unsplash.com/premium_photo-1673758913926-444a70659929?auto=format&fit=crop&q=80&w=500',
            categoryId: catSnacks.id,
        },
        {
            name: 'French Fries',
            description: 'Classic salted crispy fries',
            price: '60.00',
            image: 'https://images.unsplash.com/photo-1518013431117-e5952c874f94?auto=format&fit=crop&q=80&w=500',
            categoryId: catSnacks.id,
        },

        // Burgers & Sandwiches
        {
            name: 'Veg Sandwich',
            description: 'Fresh vegetables between soft bread slices',
            price: '40.00',
            image: 'https://images.unsplash.com/photo-1550505393-25a4cf963884?auto=format&fit=crop&q=80&w=500',
            categoryId: catBurgers.id,
        },
        {
            name: 'Grilled Sandwich',
            description: 'Toasted sandwich with melted cheese and veggies',
            price: '60.00',
            image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=500',
            categoryId: catBurgers.id,
            isPopular: true
        },
        {
            name: 'Veg Burger',
            description: 'Burger with veg patty and fresh lettuce',
            price: '50.00',
            image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=500',
            categoryId: catBurgers.id,
        },
        {
            name: 'Paneer Burger',
            description: 'Burger with premium paneer slice and sauces',
            price: '70.00',
            image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=500',
            categoryId: catBurgers.id,
        },

        // Pizza & Pasta
        {
            name: 'Veg Pizza',
            description: 'Classic pizza with onions, capsicum, and cheese',
            price: '120.00',
            image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=500',
            categoryId: catPizzaPasta.id,
        },
        {
            name: 'Paneer Pizza',
            description: 'Pizza topped with marinated paneer cubes',
            price: '150.00',
            image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=500',
            categoryId: catPizzaPasta.id,
            isPopular: true
        },
        {
            name: 'Red Sauce Pasta',
            description: 'Penne pasta in tangy tomato basil sauce',
            price: '100.00',
            image: 'https://images.unsplash.com/photo-1627042633145-c7644d19bd45?auto=format&fit=crop&q=80&w=500',
            categoryId: catPizzaPasta.id,
        },
        {
            name: 'White Sauce Pasta',
            description: 'Creamy cheesy alfredo pasta',
            price: '120.00',
            image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&q=80&w=500',
            categoryId: catPizzaPasta.id,
        },

        // Maggie & Rice
        {
            name: 'Plain Maggie',
            description: 'Classic 2-minute noodles',
            price: '30.00',
            image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&q=80&w=500',
            categoryId: catMaggieRice.id,
        },
        {
            name: 'Veg Maggie',
            description: 'Maggie noodles loaded with fresh veggies',
            price: '40.00',
            image: 'https://images.unsplash.com/photo-1515543904379-3d757afe72e3?auto=format&fit=crop&q=80&w=500', // Noodle bowl
            categoryId: catMaggieRice.id,
        },
        {
            name: 'Veg Fried Rice',
            description: 'Stir-fried rice with chinese vegetables',
            price: '90.00',
            image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80&w=500',
            categoryId: catMaggieRice.id,
        },
        {
            name: 'Paneer Fried Rice',
            description: 'Fried rice with soft paneer chunks',
            price: '110.00',
            image: 'https://images.unsplash.com/photo-1603133872878-684f208fb74b?auto=format&fit=crop&q=80&w=500',
            categoryId: catMaggieRice.id,
        },

        // Beverages
        {
            name: 'Cold Coffee',
            description: 'Chilled creamy coffee',
            price: '60.00',
            image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=500',
            categoryId: catBeverages.id,
            isPopular: true
        },
        {
            name: 'Vanilla Shake',
            description: 'Classic thick vanilla milkshake',
            price: '70.00',
            image: 'https://images.unsplash.com/photo-1579954115545-a9a550d90d01?auto=format&fit=crop&q=80&w=500',
            categoryId: catBeverages.id,
        },
        {
            name: 'Chocolate Shake',
            description: 'Rich and decadent chocolate milkshake',
            price: '80.00',
            image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=500',
            categoryId: catBeverages.id,
            isPopular: true
        },
    ];

    await dbInstance.insert(products).values(allProducts);

    console.log('Seeding finished!');
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
