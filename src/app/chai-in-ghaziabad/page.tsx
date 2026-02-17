import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Best Chai in Ghaziabad Highway NH24 | Highway Chai & Chinese Point',
    description: 'Looking for the best chai in Ghaziabad? Visit Highway Chai & Chinese Point near NH24 for authentic masala chai, samosas, and Chinese snacks.',
    keywords: ['chai in ghaziabad', 'best tea stall nh24', 'highway chai', 'masala chai ghaziabad'],
    openGraph: {
        images: [`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto,w_1200/chai-hero`]
    }
};

export default function ChaiInGhaziabad() {
    return (
        <main className="min-h-screen bg-zinc-950 text-white pt-24 pb-12 px-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-black text-amber-500 mb-6 leading-tight">
                    Best Chai & Snacks in <span className="text-white">Ghaziabad Highway</span>
                </h1>

                <div className="relative w-full h-[400px] mb-8 rounded-2xl overflow-hidden shadow-2xl border border-zinc-800">
                    <Image
                        src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto,w_1200/chai-hero`}
                        alt="Best Chai in Ghaziabad"
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-700"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />
                </div>

                <div className="prose prose-invert prose-lg max-w-none">
                    <p className="text-xl text-zinc-300 mb-6">
                        If you are driving through NH24 or looking for a perfect evening hangout spot,
                        <strong> Highway Chai & Chinese Point </strong> is your ultimate destination.
                        We serve the most authentic <em>Adrak Elaichi Chai</em>, crispy Samosas, and spicy Chowmein.
                    </p>

                    <h2 className="text-2xl font-bold text-amber-400 mt-8 mb-4">Why We Are Famous Near NH24?</h2>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none pl-0">
                        <li className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                            <span className="text-amber-500 font-bold block mb-2">🌿 Fresh Ingredients</span>
                            We use premium tea leaves and farm-fresh ginger/cardamom.
                        </li>
                        <li className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                            <span className="text-amber-500 font-bold block mb-2">🔥 Kulhad Experience</span>
                            Enjoy the earthy aroma of traditional clay cups.
                        </li>
                        <li className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                            <span className="text-amber-500 font-bold block mb-2">🍜 Chinese Fusion</span>
                            Best Chilli Potato and Chowmein in the area.
                        </li>
                        <li className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                            <span className="text-amber-500 font-bold block mb-2">🛣️ Highway Vibes</span>
                            Open late night for travelers and chai lovers.
                        </li>
                    </ul>

                    <div className="mt-12 p-8 bg-zinc-900 rounded-2xl text-center border border-amber-500/20">
                        <h3 className="text-2xl font-bold mb-4">Ready to Taste?</h3>
                        <p className="mb-6 text-zinc-400">Visit us today or order online.</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/#menu"
                                className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-full transition-all hover:shadow-[0_0_20px_rgba(245,158,11,0.4)]"
                            >
                                View Menu
                            </Link>
                            <a
                                href="tel:+919876543210"
                                className="px-8 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-full border border-zinc-700 transition-all"
                            >
                                Call Now
                            </a>
                        </div>
                    </div>

                    <div className="mt-16 pt-8 border-t border-zinc-800">
                        <h4 className="text-sm font-bold text-zinc-500 mb-4 uppercase tracking-wider">Explore More Locations</h4>
                        <div className="flex flex-wrap gap-4 text-sm text-amber-500 font-medium">
                            <Link href="/chai-near-nh24" className="hover:text-amber-400 underline">Chai Near NH24</Link>
                            <Link href="/best-chai-ghaziabad-highway" className="hover:text-amber-400 underline">Best Chai on Highway</Link>
                            <Link href="/chinese-food-ghaziabad-highway" className="hover:text-amber-400 underline">Chinese Food Point</Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
