export type Category = 'HT' | 'Intercom' | 'TOA';

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  description: string;
  image: string;
  features: string[];
  specs: Record<string, string>;
}

export const products: Product[] = [
  {
    id: 'ht-baofeng-uv82',
    name: 'Baofeng UV-82',
    category: 'HT',
    price: 25000,
    description: 'Handy Talky Dual Band dengan kualitas suara jernih dan baterai tahan lama. Cocok untuk event organizer, keamanan, dan kegiatan outdoor.',
    image: 'https://images.unsplash.com/photo-1620401537439-900932152825?q=80&w=1000&auto=format&fit=crop', // Placeholder
    features: ['Dual PTT (Push To Talk)', 'Dual Band VHF/UHF', 'FM Radio', 'Flashlight'],
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
    image: 'https://images.unsplash.com/photo-1588612546437-452932289f84?q=80&w=1000&auto=format&fit=crop', // Placeholder
    features: ['Military Grade Durability', '750mW Audio Power', 'Water Resistant', 'Long Battery Life'],
    specs: {
      'Frequency Range': '136-174MHz',
      'Output Power': '5.5W',
      'Waterproof Rating': 'IP54',
    },
  },
  {
    id: 'intercom-hollyland',
    name: 'Hollyland Solidcom C1',
    category: 'Intercom',
    price: 350000,
    description: 'Sistem intercom wireless full-duplex tanpa beltpack. Sangat ringan dan nyaman digunakan untuk tim produksi video dan event.',
    image: 'https://images.unsplash.com/photo-1590845947698-8924d7409b56?q=80&w=1000&auto=format&fit=crop', // Placeholder
    features: ['Full-Duplex Communication', '1000ft Range', 'No Beltpack Required', 'Crystal Clear Audio'],
    specs: {
      'Frequency': '1.9GHz',
      'Latency': '<35ms',
      'Battery Life': 'Up to 10 hours',
    },
  },
  {
    id: 'toa-megaphone-zr2015',
    name: 'TOA Megaphone ZR-2015',
    category: 'TOA',
    price: 40000,
    description: 'Megaphone dengan suara lantang dan sirine. Ringan dan mudah dibawa, ideal untuk pengumuman, gathering, atau evakuasi.',
    image: 'https://images.unsplash.com/photo-1520697786279-1a84092b774d?q=80&w=1000&auto=format&fit=crop', // Placeholder
    features: ['Siren Function', 'Detachable Microphone', 'Antibacterial Treatment', 'Durable ABS Resin'],
    specs: {
      'Output': '15W Rated / 23W Max',
      'Range': 'Voice: 400m / Siren: 500m',
      'Battery': '6 x C size',
    },
  },
];
