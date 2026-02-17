import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Best Chai on Ghaziabad Highway | Authentic Taste',
    description: 'Voted Best Chai on Ghaziabad Highway. Experience authentic kulhad chai, ginger tea, and masala tea at Highway Chai & Chinese Point.',
    keywords: ['best chai ghaziabad', 'top tea stall highway', 'chai lover ghaziabad', 'best tea shop nh24'],
    openGraph: {
        images: [`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto,w_1200/best-chai`]
    }
};

export default function BestChaiGhaziabad() {
    return (
        <main className="min-h-screen bg-zinc-950 text-white pt-24 pb-12 px-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-black text-amber-500 mb-6 leading-tight">
                    Voted Best Chai on <span className="text-white">Ghaziabad Highway</span>
                </h1>

                <div className="relative w-full h-[400px] mb-8 rounded-2xl overflow-hidden shadow-2xl border border-zinc-800">
                    <Image
                        src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto,w_1200/best-chai`}
                        alt="Best Chai in Ghaziabad"
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-700"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />
                </div>

                <div className="prose prose-invert prose-lg max-w-none">
                    <p className="text-xl text-zinc-300 mb-6">
                        Chai is not just a drink, it's an emotion. At <strong>Highway Chai & Chinese Point</strong>, we understand this emotion perfectly.
                        Our chai is brewed to perfection using a secret blend of spices.
                    </p>

                    <h2 className="text-2xl font-bold text-amber-400 mt-8 mb-4">Our Special Varieties</h2>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none pl-0">
                        <li className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                            <span className="text-amber-500 font-bold block mb-2">☕ Masala Chai</span>
                            Rich and spicy, perfect for energetic start.
                        </li>
                        <li className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                            <span className="text-amber-500 font-bold block mb-2">🍋 Lemon Tea</span>
                            Refreshing and light.
                        </li>
                        <li className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                            <span className="text-amber-500 font-bold block mb-2">🍯 Ginger Honey Tea</span>
                            Best for throat and health.
                        </li>
                        <li className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                            <span className="text-amber-500 font-bold block mb-2">🍵 Elaichi Chai</span>
                            Aromatic and soothing.
                        </li>
                    </ul>

                    <div className="mt-12 p-8 bg-zinc-900 rounded-2xl text-center border border-amber-500/20">
                        <h3 className="text-2xl font-bold mb-4">Experience the Best!</h3>
                        <p className="mb-6 text-zinc-400">Join thousands of happy customers.</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/#menu"
                                className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-full transition-all hover:shadow-[0_0_20px_rgba(245,158,11,0.4)]"
                            >
                                Order Online
                            </Link>
                            <a
                                href="tel:+919876543210"
                                className="px-8 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-full border border-zinc-700 transition-all"
                            >
                                Call for Delivery
                            </a>
                        </div>
                    </div>

                    <div className="mt-16 pt-8 border-t border-zinc-800">
                        <h4 className="text-sm font-bold text-zinc-500 mb-4 uppercase tracking-wider">Explore More</h4>
                        <div className="flex flex-wrap gap-4 text-sm text-amber-500 font-medium">
                            <Link href="/chai-in-ghaziabad" className="hover:text-amber-400 underline">Chai in Ghaziabad</Link>
                            <Link href="/chinese-food-ghaziabad-highway" className="hover:text-amber-400 underline">Chinese Food</Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
