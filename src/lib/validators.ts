import { z } from 'zod';

export const ContactFormSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters.' }).max(50),
    email: z.string().email({ message: 'Invalid email address.' }),
    mobile: z.string().regex(/^[0-9]{10,15}$/, { message: 'Invalid phone number.' }),
    message: z.string().optional(),
});

export const ProductSchema = z.object({
    name: z.string().min(2).max(100),
    description: z.string().min(5),
    price: z.string().regex(/^\d+(\.\d{1,2})?$/, { message: 'Invalid price format' }),
    image: z.string().url(),
    categoryId: z.number().int().positive(),
});

export const CategorySchema = z.object({
    name: z.string().min(2).max(50),
    slug: z.string().min(2).max(50).regex(/^[a-z0-9-]+$/, { message: 'Slug must be lowercase alphanumeric with hyphens' }),
});

export const OrderStatusSchema = z.object({
    orderId: z.number().int().positive(),
    status: z.enum(['pending', 'preparing', 'ready', 'completed', 'cancelled']),
});

export const LoginSchema = z.object({
    phone: z.string().regex(/^[0-9]{10}$/, { message: "Phone number must be 10 digits" }),
});
