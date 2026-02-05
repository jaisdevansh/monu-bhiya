import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About Us | Monu Chai',
    description: 'Our story and tradition.',
};

import AboutClient from './AboutClient';

export default function AboutPage() {
    return <AboutClient />;
}
