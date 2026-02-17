'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/context/ToastContext';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ReactLenis } from 'lenis/react';
import Image from 'next/image';
import Link from 'next/link';
import { Phone, ShoppingBag, Plus, MessageCircle, Star, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import styles from './page.module.css';
import { ContactFormSchema } from '@/lib/validators'; // Import Zod Schema

// Types
type Product = {
    id: number;
    name: string;
    description: string;
    price: string;
    image: string;
    categorySlug: string;
    isPopular: boolean | null;
    isAvailable: boolean | null;
};

type Category = {
    id: number;
    name: string;
    slug: string;
};

// Cloudinary Optimization Helper
const getOptimizedUrl = (url: string, width = 800) => {
    if (!url) return '';
    if (url.includes('cloudinary.com')) return url; // Already optimized

    // Use Cloudinary fetch for external images if Cloud Name is valid
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    if (cloudName && url.startsWith('http')) {
        return `https://res.cloudinary.com/${cloudName}/image/fetch/f_auto,q_auto,w_${width}/${url}`;
    }
    return url;
};

// Motion Image Component
const MotionImage = motion(Image);

// Carousel Images (Unsplash)
const HERO_IMAGES = [
    'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=1200', // Chai
    'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=1200', // Samosa
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=1200', // Burger
    'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=1200'  // Tea cup
];

export default function HomeClient({ products, categories }: { products: Product[], categories: Category[] }) {
    const { addItem } = useCart();
    const { showToast } = useToast();

    // Carousel State
    const [currentImage, setCurrentImage] = useState(0);

    // Filter State
    const [activeTab, setActiveTab] = useState('all');

    // Modal State
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    // Contact Form State
    const [formState, setFormState] = useState({ name: '', email: '', mobile: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    // Client-side mounting for Portal
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Auto-play Carousel
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % HERO_IMAGES.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    const filteredProducts = activeTab === 'all'
        ? products
        : products.filter(p => p.categorySlug === activeTab);

    // Simplified categories for landing pageTabs
    const displayCategories = [
        { id: 0, name: 'All', slug: 'all' },
        ...categories.filter(c => ['snacks', 'chai', 'burgers-sandwiches'].includes(c.slug))
    ];

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormErrors({});

        // Client-Side Zod Validation
        const validation = ContactFormSchema.safeParse(formState);

        if (!validation.success) {
            const errors: Record<string, string> = {};
            validation.error.issues.forEach((issue) => {
                const key = issue.path[0]?.toString() || 'root';
                errors[key] = issue.message;
            });
            setFormErrors(errors);
            showToast('Please fix the errors in the form', 'error');
            return;
        }

        setIsSubmitting(true);
        // Simulate sending
        setTimeout(() => {
            showToast(`Thanks ${formState.name}! We'll contact you shortly.`, 'success');
            setIsSubmitting(false);
            setFormState({ name: '', email: '', mobile: '', message: '' });
        }, 1500);
    };

    return (
        <ReactLenis root>
            <div className={styles.container}>
                {/* Animation Layer */}
                <div className={styles.animatedBackground}>
                    <div className={`${styles.blob} ${styles.blob1}`}></div>
                    <div className={`${styles.blob} ${styles.blob2}`}></div>
                    <div className={`${styles.blob} ${styles.blob3}`}></div>
                </div>
                <div className={styles.textureOverlay}></div>

                {/* ================= HERO SECTION ================= */}
                <section className={styles.hero}>
                    <div className={styles.heroContent}>
                        {/* Text Side */}
                        <motion.div
                            className={styles.heroText}
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            {/* Owner Badge */}
                            <div className={styles.ownerBadge}>
                                <div className={styles.ownerAvatar}>
                                    <Image
                                        src="https://avataaars.io/?avatarStyle=Circle&topType=ShortHairShortFlat&accessoriesType=Sunglasses&hairColor=Black&facialHairType=BeardLight&clotheType=Hoodie&clotheColor=Red&eyeType=Happy&eyebrowType=Default&mouthType=Smile&skinColor=Light"
                                        alt="Monu Bhai Owner"
                                        width={50}
                                        height={50}
                                        className={styles.ownerImage}
                                        unoptimized
                                    />
                                </div>
                                <div className={styles.ownerName}>
                                    Monu Bhai <span>Owner & Chef</span>
                                </div>
                            </div>

                            <h1 className={styles.heroTitle}>
                                Fresh Chai & <br />
                                <span className={styles.highlight}>Snacks</span> Served Hot
                            </h1>

                            <p className={styles.heroSubtext}>
                                Authentic taste delivered to your desk. Experience the magic of spices and fresh ingredients.
                            </p>

                            <div className={styles.heroButtons}>
                                <motion.a
                                    href="#menu"
                                    className={styles.btnPrimary}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <ShoppingBag size={20} /> Shop Now
                                </motion.a>
                                <motion.a
                                    href="tel:+919876543210"
                                    className={styles.btnSecondary}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => showToast('Calling Monu Bhai: +91 98765 43210', 'info')}
                                >
                                    <Phone size={20} style={{ marginRight: '8px' }} /> Call Now
                                </motion.a>
                            </div>
                        </motion.div>

                        {/* Visual Side */}
                        <motion.div
                            className={styles.heroVisual}
                            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <div className={styles.imageContainer}>
                                <AnimatePresence mode="popLayout">
                                    <MotionImage
                                        key={currentImage}
                                        src={getOptimizedUrl(HERO_IMAGES[currentImage], 1200)}
                                        alt="Delicious Food"
                                        width={600}
                                        height={600}
                                        className={styles.heroMainImage}
                                        initial={{ opacity: 0, scale: 1.1 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.5 }}
                                        priority
                                    />
                                </AnimatePresence>
                                <div className={styles.heroOverlay} style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }} />
                            </div>

                            {/* Floating Card */}
                            <motion.div
                                className={styles.floatingCard}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.8 }}
                            >
                                <div style={{ background: '#FFF', borderRadius: '50%', padding: '8px' }}>
                                    <Star size={20} color="#F2B705" fill="#F2B705" />
                                </div>
                                <div className={styles.ratingBox}>
                                    <div className={styles.stars}>
                                        <Star size={12} fill="#F2B705" />
                                        <Star size={12} fill="#F2B705" />
                                        <Star size={12} fill="#F2B705" />
                                        <Star size={12} fill="#F2B705" />
                                        <Star size={12} fill="#F2B705" />
                                    </div>
                                    <span className={styles.ratingText}>5k+ Happy Customers</span>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* ================= SPECIAL OFFERS ================= */}
                <section className={styles.section}>
                    <motion.h2
                        className={styles.sectionTitle}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        Today's Special ⭐
                    </motion.h2>

                    <div className={styles.specialsGrid}>
                        {/* Offer 1 */}
                        <motion.div
                            className={styles.offerCard}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            onClick={() => setSelectedProduct({
                                id: 9001,
                                name: 'Samosa + Chutney',
                                description: 'Crispy Samosa served with spicy tangy chutney.',
                                price: '10',
                                image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=200',
                                categorySlug: 'snacks',
                                isPopular: true,
                                isAvailable: true
                            })}
                        >
                            <div className="relative w-full h-[180px]">
                                <Image
                                    src={getOptimizedUrl('https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=200', 400)}
                                    alt="Samosa"
                                    fill
                                    className={styles.offerImage}
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                            <h3 className={styles.offerName}>Samosa + Chutney</h3>
                            <div className={styles.offerPrice}>₹10</div>
                            <button className={styles.orderBtn} onClick={(e) => {
                                e.stopPropagation();
                                addItem({ id: 'sp-1', name: 'Samosa Special', price: 10, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=200' })
                            }}>Order Now</button>
                        </motion.div>

                        {/* Offer 2 */}
                        <motion.div
                            className={styles.offerCard}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            onClick={() => setSelectedProduct({
                                id: 9002,
                                name: 'Samosa + Sabzi',
                                description: 'A hearty meal of Samosa crushed into spicy potato curry.',
                                price: '20',
                                image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=200',
                                categorySlug: 'snacks',
                                isPopular: true,
                                isAvailable: true
                            })}
                        >
                            <div className="relative w-full h-[180px]">
                                <Image
                                    src={getOptimizedUrl('https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=200', 400)}
                                    alt="Samosa Sabzi"
                                    fill
                                    className={styles.offerImage}
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                            <h3 className={styles.offerName}>Samosa + Sabzi</h3>
                            <div className={styles.offerPrice}>₹20</div>
                            <button className={styles.orderBtn} onClick={(e) => {
                                e.stopPropagation();
                                addItem({ id: 'sp-2', name: 'Samosa Sabzi Special', price: 20, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=200' })
                            }}>Order Now</button>
                        </motion.div>

                        {/* Offer 3 */}
                        <motion.div
                            className={styles.offerCard}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            onClick={() => setSelectedProduct({
                                id: 9003,
                                name: 'Bread Pakoda + Sabzi',
                                description: 'Deep fried bread fritters served with rich vegetable curry.',
                                price: '20',
                                image: 'https://images.unsplash.com/photo-1605333534887-19601d4d38c6?auto=format&fit=crop&q=80&w=200',
                                categorySlug: 'snacks',
                                isPopular: true,
                                isAvailable: true
                            })}
                        >
                            <div className="relative w-full h-[180px]">
                                <Image
                                    src={getOptimizedUrl('https://images.unsplash.com/photo-1605333534887-19601d4d38c6?auto=format&fit=crop&q=80&w=200', 400)}
                                    alt="Bread Pakoda"
                                    fill
                                    className={styles.offerImage}
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                            <h3 className={styles.offerName}>Bread Pakoda + Sabzi</h3>
                            <div className={styles.offerPrice}>₹20</div>
                            <button className={styles.orderBtn} onClick={(e) => {
                                e.stopPropagation();
                                addItem({ id: 'sp-3', name: 'Bread Pakoda Special', price: 20, image: 'https://images.unsplash.com/photo-1605333534887-19601d4d38c6?auto=format&fit=crop&q=80&w=200' })
                            }}>Order Now</button>
                        </motion.div>
                    </div>
                </section>

                {/* ================= ALL PRODUCTS ================= */}
                <section className={styles.section} id="menu">
                    <motion.h2
                        className={styles.sectionTitle}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        Our Menu
                    </motion.h2>

                    {/* Filter Tabs */}
                    <div className={styles.menuTabs}>
                        {displayCategories.map(cat => (
                            <button
                                key={cat.id}
                                className={`${styles.tab} ${activeTab === cat.slug ? styles.activeTab : ''}`}
                                onClick={() => setActiveTab(cat.slug)}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    {/* Product Grid */}
                    <div className={styles.productGrid}>
                        <AnimatePresence mode="popLayout">
                            {filteredProducts.map((product) => (
                                <motion.div
                                    key={product.id}
                                    className={`${styles.productCard} ${!product.isAvailable ? styles.outOfStock : ''}`}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                    whileHover={{ y: -5 }}
                                    onClick={() => setSelectedProduct(product)}
                                >
                                    <div style={{ position: 'relative', width: '100%', height: '160px', overflow: 'hidden' }}>
                                        <Image
                                            src={getOptimizedUrl(product.image, 400)}
                                            alt={product.name}
                                            fill
                                            className={styles.productImage}
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            style={{ objectFit: 'cover' }}
                                        />
                                    </div>
                                    <div className={styles.productInfo}>
                                        <h3 className={styles.productTitle}>{product.name}</h3>
                                        <div className={styles.productRow}>
                                            <span className={styles.priceTag}>₹{product.price}</span>
                                            <motion.button
                                                className={styles.addFab}
                                                whileTap={{ scale: 0.8 }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    addItem({
                                                        id: product.id.toString(),
                                                        name: product.name,
                                                        price: parseFloat(product.price),
                                                        image: product.image
                                                    });
                                                }}
                                            >
                                                <Plus size={18} />
                                            </motion.button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </section>

                {/* ================= CONTACT FORM ================= */}
                <section className={styles.contactSection}>
                    <h2 className={styles.sectionTitle}>
                        Let's Connect
                    </h2>

                    <div className={styles.contactContainer}>
                        <p className={styles.contactDescription}>
                            Have a craving or a question? Reach out to us.
                        </p>

                        <form onSubmit={handleFormSubmit}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Name</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    placeholder="Your Name"
                                    value={formState.name}
                                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                                    required
                                />
                                {formErrors.name && <span className="text-red-500 text-xs mt-1 block">{formErrors.name}</span>}
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Email Address</label>
                                <input
                                    type="email"
                                    className={styles.input}
                                    placeholder="yourname@gmail.com"
                                    value={formState.email}
                                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                                    required
                                />
                                {formErrors.email && <span className="text-red-500 text-xs mt-1 block">{formErrors.email}</span>}
                            </div>
                            {formState.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && formState.mobile === process.env.NEXT_PUBLIC_ADMIN_PHONE && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="mb-4"
                                >
                                    <a
                                        href="/admin/login"
                                        className="block w-full text-center py-2 bg-zinc-800 text-amber-500 rounded font-bold border border-amber-500/50 hover:bg-zinc-700 transition-all"
                                    >
                                        Access Admin Dashboard 🔒
                                    </a>
                                </motion.div>
                            )}
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Mobile Number</label>
                                <input
                                    type="tel"
                                    className={styles.input}
                                    placeholder="+91..."
                                    value={formState.mobile}
                                    onChange={(e) => setFormState({ ...formState, mobile: e.target.value })}
                                    required
                                />
                                {formErrors.mobile && <span className="text-red-500 text-xs mt-1 block">{formErrors.mobile}</span>}
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Message (Optional)</label>
                                <textarea
                                    className={styles.textarea}
                                    placeholder="What do you want to tell us?"
                                    value={formState.message}
                                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                                />
                                {formErrors.message && <span className="text-red-500 text-xs mt-1 block">{formErrors.message}</span>}
                            </div>
                            <motion.button
                                type="submit"
                                className={styles.submitBtn}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Sending...' : 'Send Message'}
                            </motion.button>
                        </form>

                        <div className={styles.contactLinks}>
                            <a
                                href="tel:+919876543210"
                                className={styles.contactLink}
                                onClick={() => showToast('Calling Monu Bhai: +91 98765 43210', 'info')}
                            >
                                <div className={styles.iconCircle}>
                                    <Phone size={24} />
                                </div>
                                Call Now
                            </a>
                            <a href="https://wa.me/919876543210?text=Hi!%20I%20want%20to%20place%20an%20order." className={styles.contactLink}>
                                <div className={styles.iconCircle}>
                                    <MessageCircle size={24} />
                                </div>
                                WhatsApp
                            </a>
                        </div>
                    </div>
                </section>

                {/* ================= PRODUCT DETAIL MODAL (PORTAL) ================= */}
                {mounted && createPortal(
                    <AnimatePresence>
                        {selectedProduct && (
                            <div className={styles.modalOverlay} onClick={() => setSelectedProduct(null)}>
                                <motion.div
                                    className={styles.modalContent}
                                    onClick={(e) => e.stopPropagation()}
                                    initial={{ opacity: 0, scale: 0.8, y: 50 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.8, y: 50 }}
                                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                >
                                    <button className={styles.closeButton} onClick={() => setSelectedProduct(null)}>
                                        <X size={24} />
                                    </button>

                                    <div className={styles.modalImageContainer}>
                                        <Image
                                            src={getOptimizedUrl(selectedProduct.image, 800)}
                                            alt={selectedProduct.name}
                                            width={600}
                                            height={400}
                                            className={styles.modalImage}
                                            style={{ objectFit: 'cover' }}
                                        />
                                    </div>

                                    <div className={styles.modalDetails}>
                                        <div className={styles.modalHeader}>
                                            <h2 className={styles.modalTitle}>{selectedProduct.name}</h2>
                                            <span className={styles.modalPrice}>₹{selectedProduct.price}</span>
                                        </div>

                                        <p className={styles.modalDescription}>
                                            {selectedProduct.description || "Freshly prepared with authentic spices and love. A perfect treat for your cravings."}
                                        </p>

                                        <div className={styles.modalActions}>
                                            <motion.button
                                                className={styles.modalAddBtn}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => {
                                                    addItem({
                                                        id: selectedProduct.id.toString(),
                                                        name: selectedProduct.name,
                                                        price: parseFloat(selectedProduct.price),
                                                        image: selectedProduct.image
                                                    });
                                                    setSelectedProduct(null);
                                                }}
                                            >
                                                Add to Cart — ₹{selectedProduct.price}
                                            </motion.button>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>,
                    document.body
                )}
            </div>
        </ReactLenis>
    );
}
