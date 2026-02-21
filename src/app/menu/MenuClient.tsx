'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Flame, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import styles from './page.module.css';
import { ReactLenis } from 'lenis/react';

// Types definition matching the DB schema roughly
type Category = {
    id: number;
    slug: string;
    name: string;
};

type Product = {
    id: number;
    name: string;
    description: string;
    price: string;
    image: string;
    categorySlug: string;
};

export default function MenuClient({
    initialProducts,
    categories,
    settings
}: {
    initialProducts: Product[],
    categories: Category[],
    settings?: any
}) {
    const [activeCategory, setActiveCategory] = useState('all');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [mounted, setMounted] = useState(false);
    const { addItem } = useCart();

    useEffect(() => {
        setMounted(true);
    }, []);

    const filteredProducts = activeCategory === 'all'
        ? initialProducts
        : initialProducts.filter(p => p.categorySlug === activeCategory);

    return (
        <ReactLenis root>
            <div className={styles.menuContainer}>
                {/* Hero Section */}
                <motion.div
                    className={styles.header}
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <h1 className={styles.title}>Our <span style={{ color: '#fff' }}>Menu</span></h1>
                    <p className={styles.subtitle}>
                        Handcrafted with love, served with tradition. <br />
                        Experience the authentic taste of {settings?.storeName || 'Monu Chai'}.
                    </p>
                </motion.div>

                {/* Category Tabs */}
                <div className={styles.tabs}>
                    <button
                        onClick={() => setActiveCategory('all')}
                        className={`${styles.tab} ${activeCategory === 'all' ? styles.activeTab : ''}`}
                    >
                        All
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.slug)}
                            className={`${styles.tab} ${activeCategory === cat.slug ? styles.activeTab : ''}`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Product Grid */}
                <motion.div
                    layout
                    className={styles.grid}
                >
                    <AnimatePresence mode='popLayout'>
                        {filteredProducts.map((product, index) => (
                            <motion.div
                                key={product.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                transition={{ duration: 0.4, delay: index * 0.05 }}
                                className={styles.card}
                                onClick={() => setSelectedProduct(product)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className={styles.imageContainer}>
                                    {/* Mock Best Seller Logic */}
                                    {product.id % 3 === 0 && (
                                        <div className={styles.badge}>
                                            <Flame size={14} style={{ display: 'inline', marginRight: '4px' }} />
                                            Best Seller
                                        </div>
                                    )}
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        loading="lazy"
                                    />
                                </div>
                                <div className={styles.content}>
                                    <h3 className={styles.productName}>{product.name}</h3>
                                    <p className={styles.description}>{product.description}</p>
                                    <div className={styles.cardFooter}>
                                        <span className={styles.price}>₹{product.price}</span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                addItem({
                                                    id: product.id.toString(),
                                                    name: product.name,
                                                    price: parseFloat(product.price),
                                                    image: product.image
                                                });
                                            }}
                                            className={styles.addBtn}
                                            aria-label={`Add ${product.name} to cart`}
                                        >
                                            <Plus size={24} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

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
                                        <img src={selectedProduct.image} alt={selectedProduct.name} className={styles.modalImage} />
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
