import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Highway Tea Shop on NH-24 | Best Chai in Ghaziabad',
    description: 'Looking for a highway tea shop on NH-24? Stop by Monu Chai for the best tea, samosas, and evening snacks right on the Delhi Meerut Expressway.',
    keywords: ['highway tea shop NH-24', 'tea shop Ghaziabad', 'best tea NH-24']
};

export const revalidate = 60;

export default function TeaShopNH24() {
    return (
        <div style={{ padding: '120px 20px 40px', maxWidth: '800px', margin: '0 auto', color: '#fff' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#F2B705' }}>The Best Tea Shop on NH-24 Ghaziabad</h1>

            <p style={{ fontSize: '1.2rem', lineHeight: '1.6', marginBottom: '2rem' }}>
                If you are driving along the Delhi Meerut Expressway or travelling through Ghaziabad, finding the perfect highway tea shop is essential. That's why Monu Chai has become the favorite pit stop for travelers, truck drivers, and families looking for a refreshing cup of kadak chai and hot, crispy snacks.
            </p>

            <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#4ade80' }}>Fresh Kadak Chai Near Delhi Meerut Expressway</h2>
            <p style={{ marginBottom: '1.5rem', lineHeight: '1.6' }}>
                A road trip isn't complete without a strong cup of tea. We brew our tea fresh using a unique blend of premium tea leaves and aromatic spices. Pair it with our famous <Link href="/snacks-shop-ghaziabad-highway" style={{ color: '#F2B705', textDecoration: 'underline' }}>crispy samosas and snacks</Link> for the ultimate highway breakfast or evening refreshment.
            </p>

            <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#4ade80' }}>Why Choose Our Highway Tea Shop?</h2>
            <ul style={{ listStyleType: 'disc', paddingLeft: '20px', marginBottom: '2rem', lineHeight: '1.6' }}>
                <li><strong>Easy Parking:</strong> We know parking on NH-24 can be tough. We offer ample, safe parking right in front of the shop.</li>
                <li><strong>Fast Service:</strong> Get back on the road quickly. Our fresh tea and snacks are served hot and fast.</li>
                <li><strong>Clean Environment:</strong> Enjoy your chai in a clean, hygienic, and welcoming space.</li>
                <li><strong>Late Night Availability:</strong> We are open from 6:00 AM to 11:00 PM to serve your early morning and late night cravings.</li>
            </ul>

            <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>
                Ready for a break? <Link href="/contact" style={{ color: '#F2B705', textDecoration: 'underline' }}>Get directions to our tea shop</Link> or check out our <Link href="/menu" style={{ color: '#F2B705', textDecoration: 'underline' }}>full highway menu</Link>. We can't wait to serve you!
            </p>
        </div>
    );
}
