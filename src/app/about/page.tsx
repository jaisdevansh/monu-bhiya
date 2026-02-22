import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About Us | Monu Chai',
    description: 'Our story and tradition.',
};

export const revalidate = 60;

import { getStoreSettings } from '@/app/admin/actions';
import AboutClient from './AboutClient';

export default async function AboutPage() {
    const settings = await getStoreSettings();
    return <AboutClient settings={settings} />;
}
