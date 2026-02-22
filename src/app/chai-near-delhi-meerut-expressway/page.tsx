import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Fresh Chai & Snacks on Delhi Meerut Expressway | Monu Chai',
    description: 'Looking for a refreshing tea stall near the Delhi Meerut Expressway? Monu Chai offers the best kadak chai and hot snacks for hungry travelers. Stop by NH-24 Ghaziabad.',
    keywords: ['chai near Delhi Meerut Expressway', 'tea stall Expressway', 'best chai near me']
};

export const revalidate = 60;

export default function ChaiExpressway() {
    return (
        <div style={{ padding: '120px 20px 40px', maxWidth: '800px', margin: '0 auto', color: '#fff' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#F2B705' }}>Fresh Chai Near Delhi Meerut Expressway</h1>

            <p style={{ fontSize: '1.2rem', lineHeight: '1.6', marginBottom: '2rem' }}>
                Driving down the Delhi Meerut Expressway? Take a well-deserved break at Monu Chai, located conveniently right off NH-24 in Ghaziabad. We serve the freshest, most authentic kadak chai to re-energize your journey.
            </p>

            <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#4ade80' }}>Your Go-To Highway Breakfast & Evening Snacks Stop</h2>
            <p style={{ marginBottom: '1.5rem', lineHeight: '1.6' }}>
                Whether you're starting an early morning road trip or driving home late, our shop provides the perfect <Link href="/tea-shop-nh24-ghaziabad" style={{ color: '#F2B705', textDecoration: 'underline' }}>highway tea stop</Link>. A hot cup of our signature masala chai paired with perfectly <Link href="/snacks-shop-ghaziabad-highway" style={{ color: '#F2B705', textDecoration: 'underline' }}>fried pakoras or samosas</Link> is exactly what you need. Our secret recipe keeps locals and travelers coming back for more.
            </p>

            <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#4ade80' }}>Delicious Options Beyond Chai</h2>
            <ul style={{ listStyleType: 'disc', paddingLeft: '20px', marginBottom: '2rem', lineHeight: '1.6' }}>
                <li><strong>Spicy Burgers:</strong> Grab a quick bite that's easy to eat on the go.</li>
                <li><strong>Hot Samosas with Tangy Chutney:</strong> The classic companion to Indian highway tea.</li>
                <li><strong>Chinese Fast Food:</strong> Craving something savory? Try our chowmein or paneer rolls.</li>
            </ul>

            <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>
                We make highway driving better. Check our <Link href="/menu" style={{ color: '#F2B705', textDecoration: 'underline' }}>full menu</Link> or get <Link href="/contact" style={{ color: '#F2B705', textDecoration: 'underline' }}>directions to our NH-24 tea stall</Link> today.
            </p>
        </div>
    );
}
