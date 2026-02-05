import { pgTable, serial, text, integer, boolean, timestamp, decimal, json } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const categories = pgTable('categories', {
    id: serial('id').primaryKey(),
    slug: text('slug').notNull().unique(), // 'chai', 'snacks'
    name: text('name').notNull(),
    description: text('description'),
    createdAt: timestamp('created_at').defaultNow(),
});

export const products = pgTable('products', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description').notNull(),
    price: decimal('price', { precision: 10, scale: 2 }).notNull(),
    image: text('image').notNull(),
    categoryId: integer('category_id').references(() => categories.id),
    isPopular: boolean('is_popular').default(false),
    isAvailable: boolean('is_available').default(true),
    badgeText: text('badge_text'), // e.g. "Best with Chai ☕"
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const orders = pgTable('orders', {
    id: serial('id').primaryKey(),
    customerName: text('customer_name').notNull(),
    customerEmail: text('customer_email').default('').notNull(),
    customerPhone: text('customer_phone').notNull(),
    customerAddress: text('customer_address').notNull(),
    totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
    status: text('status').default('pending').notNull(), // 'pending', 'confirmed', 'completed', 'cancelled'
    createdAt: timestamp('created_at').defaultNow(),
});

export const orderItems = pgTable('order_items', {
    id: serial('id').primaryKey(),
    orderId: integer('order_id').references(() => orders.id).notNull(),
    productId: integer('product_id').references(() => products.id).notNull(),
    productName: text('product_name').notNull(), // Snapshot in case product changes
    price: decimal('price', { precision: 10, scale: 2 }).notNull(), // Snapshot price
    quantity: integer('quantity').notNull(),
});

export const ordersRelations = relations(orders, ({ many }) => ({
    items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
    order: one(orders, {
        fields: [orderItems.orderId],
        references: [orders.id],
    }),
}));

export const admins = pgTable('admins', {
    id: serial('id').primaryKey(),
    email: text('email').notNull().unique(),
    passwordHash: text('password_hash').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
});
