export type Product = {
    id: string;
    name: string;
    description: string;
    price: number;
    category: 'chai' | 'snacks' | 'combos';
    image: string;
    popular?: boolean;
};

export const products: Product[] = [
    {
        id: '1',
        name: 'Masala Chai',
        description: 'Our signature tea brewed with fresh ginger, cardamom, and secret spices.',
        price: 25,
        category: 'chai',
        image: '/images/masala-chai.jpg',
        popular: true,
    },
    {
        id: '2',
        name: 'Elaichi Chai',
        description: 'Aromatic cardamom tea for a refreshing break.',
        price: 20,
        category: 'chai',
        image: '/images/elaichi-chai.jpg',
    },
    {
        id: '3',
        name: 'Ginger Chai',
        description: 'Strong ginger tea perfect for cold weather.',
        price: 20,
        category: 'chai',
        image: '/images/ginger-chai.jpg',
    },
    {
        id: '4',
        name: 'Bun Maska',
        description: 'Soft fresh bun slathered with generous butter.',
        price: 40,
        category: 'snacks',
        image: '/images/bun-maska.jpg',
        popular: true,
    },
    {
        id: '5',
        name: 'Vegetable Samosa (2pcs)',
        description: 'Crispy pastry filled with spiced potatoes and peas.',
        price: 30,
        category: 'snacks',
        image: '/images/samosa.jpg',
        popular: true,
    },
    {
        id: '6',
        name: 'Vada Pav',
        description: 'The Indian burger - spicy potato fitter in a pav.',
        price: 35,
        category: 'snacks',
        image: '/images/vada-pav.jpg',
    },
    {
        id: '7',
        name: 'Breakfast Combo',
        description: 'Masala Chai + Bun Maska',
        price: 60,
        category: 'combos',
        image: '/images/combo-1.jpg',
        popular: true,
    },
    {
        id: '8',
        name: 'Snack Combo',
        description: '2 Samosas + 2 Masala Chai',
        price: 100,
        category: 'combos',
        image: '/images/combo-2.jpg',
    },
];
