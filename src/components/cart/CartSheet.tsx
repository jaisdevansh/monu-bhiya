'use client';

import { useCart } from '@/context/CartContext';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import styles from './CartSheet.module.css';
import { useRouter } from 'next/navigation';

export default function CartSheet() {
    const { isCartOpen, closeCart, items, updateQuantity, removeItem, total } = useCart();
    const router = useRouter();

    const handleCheckout = () => {
        closeCart();
        router.push('/checkout');
    };

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={styles.cartOverlay}
                        onClick={closeCart}
                    />
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className={styles.cartOverlay}
                        style={{ pointerEvents: 'none', background: 'transparent' }}
                    >
                        {/* Wrapper to isolate the sheet for animation but allow pointer events only on sheet */}
                        <div className={styles.cartSheet} style={{ pointerEvents: 'auto', marginLeft: 'auto' }}>
                            <div className={styles.header}>
                                <div className={styles.title}>
                                    <ShoppingBag size={20} />
                                    Your Cart
                                </div>
                                <button onClick={closeCart} className={styles.closeBtn}>
                                    <X size={20} />
                                </button>
                            </div>

                            <div className={styles.cartItems}>
                                {items.length === 0 ? (
                                    <div className={styles.emptyState}>
                                        <ShoppingBag size={48} />
                                        <p>Your cart is empty.</p>
                                        <button onClick={closeCart} className="btn btn-secondary text-sm">
                                            Start Shopping
                                        </button>
                                    </div>
                                ) : (
                                    items.map((item) => (
                                        <div key={item.id} className={styles.item}>
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className={styles.itemImage}
                                            />
                                            <div className={styles.itemDetails}>
                                                <div>
                                                    <div className="flex justify-between">
                                                        <h4 className={styles.itemName}>{item.name}</h4>
                                                        <button
                                                            onClick={() => removeItem(item.id)}
                                                            className={styles.removeBtn}
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                    <div className={styles.itemPrice}>₹{item.price}</div>
                                                </div>
                                                <div className={styles.quantityControls}>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, -1)}
                                                        className={styles.qtyBtn}
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className={styles.qty}>{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, 1)}
                                                        className={styles.qtyBtn}
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {items.length > 0 && (
                                <div className={styles.footer}>
                                    <div className={styles.totalRow}>
                                        <span>Total</span>
                                        <span className="text-gradient">₹{total}</span>
                                    </div>
                                    <button onClick={handleCheckout} className={`btn btn-primary ${styles.checkoutBtn}`}>
                                        Proceed to Checkout
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
