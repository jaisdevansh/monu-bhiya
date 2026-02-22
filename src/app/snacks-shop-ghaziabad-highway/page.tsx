import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Highway Snacks Shop in Ghaziabad | Samosa & Chinese Food',
    description: 'Hungry on the highway? Visit our snacks shop on NH-24 in Ghaziabad. Enjoy crispy samosas, bread pakodas, burgers, and hot chai right off the highway.',
    keywords: ['snacks shop Ghaziabad highway', 'samosa near Ghaziabad highway', 'highway breakfast NH-24']
};

export const revalidate = 60;

export default function HighwaySnacks() {
    return (
        <div style={{ padding: '120px 20px 40px', maxWidth: '800px', margin: '0 auto', color: '#fff' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#F2B705' }}>The Ultimate Highway Snacks Shop in Ghaziabad</h1>

            <p style={{ fontSize: '1.2rem', lineHeight: '1.6', marginBottom: '2rem' }}>
                No road trip is complete without great snacks! Located directly on NH-24, Monu Chai is the top destination for delicious, freshly-made highway snacks. From early morning breakfast cravings to late-night hunger pangs, we are the go-to spot for Ghaziabad highway travelers.
            </p>

            <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#4ade80' }}>Craving Samosa Near Ghaziabad Highway?</h2>
            <p style={{ marginBottom: '1.5rem', lineHeight: '1.6' }}>
                Our famous hot and crispy samosas with spicy chutney are a local legend. Driving down the <Link href="/chai-near-delhi-meerut-expressway" style={{ color: '#F2B705', textDecoration: 'underline' }}>Delhi Meerut Expressway</Link>, you can't miss our welcoming shop. Pair your snacks with a fresh cup of our renowned <Link href="/tea-shop-nh24-ghaziabad" style={{ color: '#F2B705', textDecoration: 'underline' }}>highway tea</Link>, and your journey will be instantly better.
            </p>

            <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#4ade80' }}>Our Highway Snacks Menu</h2>
            <ul style={{ listStyleType: 'disc', paddingLeft: '20px', marginBottom: '2rem', lineHeight: '1.6' }}>
                <li><strong>Samosa & Bread Pakoda with Sabzi:</strong> A filling, hot meal that hits the spot perfectly.</li>
                <li><strong>Stuffed Parathas:</strong> Fresh, buttery parathas for a hearty breakfast stop.</li>
                <li><strong>Burgers & Sandwiches:</strong> Fast and fresh if you're eating in the car.</li>
                <li><strong>Spicy Noodles & Spring Rolls:</strong> Authentic Indian-style Chinese food right on NH-24.</li>
            </ul>

            <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>
                Drop by today, enjoy easy parking, and dig into the best street food the Ghaziabad highway has to offer. Browse our complete <Link href="/menu" style={{ color: '#F2B705', textDecoration: 'underline' }}>snack menu</Link> or get <Link href="/contact" style={{ color: '#F2B705', textDecoration: 'underline' }}>quick directions online</Link>.
            </p>
        </div>
    );
}
