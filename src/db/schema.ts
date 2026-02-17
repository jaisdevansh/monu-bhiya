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
    paymentMethod: text('payment_method').default('COD'), // 'COD', 'UPI'
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

export const storeSettings = pgTable('store_settings', {
    id: serial('id').primaryKey(), // Usually only row 1
    // Section 1: Store Settings
    storeName: text('store_name').default('Monu Chai').notNull(),
    logoUrl: text('logo_url').default(''),
    description: text('description').default('The best chai in town!'),
    phone: text('phone').default(''),
    email: text('email').default(''),
    address: text('address').default(''),
    googleMapsLink: text('google_maps_link').default(''),

    // Section 2: Payment Settings
    upiId: text('upi_id').default(''),
    upiQrCodeUrl: text('upi_qr_code_url').default(''),
    upiEnabled: boolean('upi_enabled').default(false),
    codEnabled: boolean('cod_enabled').default(true),

    // Section 3: Timings
    storeOpen: boolean('store_open').default(true), // Global toggle
    timings: json('timings'), // { monday: { open: '09:00', close: '22:00', isClosed: false }, ... }

    // Section 4: Admin Profile
    adminName: text('admin_name').default('Admin'),
    adminEmail: text('admin_email').default(''),
    adminPhotoUrl: text('admin_photo_url').default(''),
    passwordHash: text('password_hash'), // Separate from admins table if requested, or replace admins usage

    // Section 5: Notifications
    orderNotifications: boolean('order_notifications').default(true),
    soundNotifications: boolean('sound_notifications').default(true),
    emailNotifications: boolean('email_notifications').default(false),

    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});
