
import ContactClient from './ContactClient';

export const metadata = {
    title: 'Contact Us | Monu Chai',
    description: 'Get in touch with Monu Chai in Ghaziabad. Call us, chat on WhatsApp, or visit our cafe for the best chai in town.',
};

export const revalidate = 60;

import { getStoreSettings } from '@/app/admin/actions';

export default async function ContactPage() {
    const settings = await getStoreSettings();
    return <ContactClient settings={settings} />;
}
