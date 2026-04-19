export type Category = 'HT' | 'Jasa Broadcasting' | 'Paket';

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  description: string;
  image: string;
  features: string[];
  specs: Record<string, string>;
  stock: number;
}

export const products: Product[] = [
  {
    id: 'ht-baofeng-uv82',
    name: 'Baofeng UV-82',
    category: 'HT',
    price: 25000,
    description: 'Handy Talky Dual Band dengan kualitas suara jernih dan baterai tahan lama. Cocok untuk event organizer, keamanan, dan kegiatan outdoor.',
    image: '/gambar_ht_baofeng.png',
    features: ['Dual PTT (Push To Talk)', 'Dual Band VHF/UHF', 'FM Radio', 'Flashlight'],
    stock: 10,
    specs: {
      'Frequency Range': '136-174MHz / 400-520MHz',
      'Battery': '2800mAh Li-ion',
      'Range': 'Up to 5km (open area)',
    },
  },
  {
    id: 'ht-icom-v80',
    name: 'Icom IC-V80',
    category: 'HT',
    price: 50000,
    description: 'HT profesional dengan body tangguh standar militer. Suara audio yang kuat dan jernih, sangat handal untuk lapangan.',
    image: '/gambar_ht_icon.png',
    features: ['Military Grade Durability', '750mW Audio Power', 'Water Resistant', 'Long Battery Life'],
    stock: 5,
    specs: {
      'Frequency Range': '136-174MHz',
      'Output Power': '5.5W',
      'Waterproof Rating': 'IP54',
    },
  },
];
