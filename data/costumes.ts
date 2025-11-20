export interface Costume {
  _id: string;
  name: string;
  description: string;
  type: 'sale' | 'rent';
  price: number;
  rentPrice?: number;
  size: string[];
  color: string[];
  images: string[];
  jacket: {
    size: string;
    color: string;
    material: string;
  };
  pants: {
    size: string;
    color: string;
    material: string;
  };
  shirt: {
    size: string;
    color: string;
    material: string;
  };
  tie: {
    color: string;
    material: string;
  };
  belt: {
    size: string;
    color: string;
    material: string;
  };
  available: boolean;
}

export const staticCostumes: Costume[] = [
  {
    _id: '1',
    name: 'Costume Classique Noir',
    description: 'Costume élégant en laine noire, parfait pour les occasions formelles et les mariages. Finition impeccable et coupe moderne.',
    type: 'sale',
    price: 299,
    size: ['M', 'L', 'XL'],
    color: ['Noir'],
    images: [
      'https://images.unsplash.com/photo-1594938291221-94f18cbb566b?w=800&h=1000&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1000&fit=crop&q=80',
    ],
    jacket: { size: 'L', color: 'Noir', material: 'Laine' },
    pants: { size: 'L', color: 'Noir', material: 'Laine' },
    shirt: { size: 'L', color: 'Blanc', material: 'Coton' },
    tie: { color: 'Noir', material: 'Soie' },
    belt: { size: 'L', color: 'Noir', material: 'Cuir' },
    available: true,
  },
  {
    _id: '2',
    name: 'Costume Bleu Marine',
    description: 'Costume moderne en bleu marine, idéal pour les événements professionnels. Style contemporain et élégant.',
    type: 'sale',
    price: 349,
    size: ['S', 'M', 'L', 'XL'],
    color: ['Bleu'],
    images: [
      'https://images.unsplash.com/photo-1624222247344-550fb60583fd?w=800&h=1000&fit=crop&q=80',
    ],
    jacket: { size: 'M', color: 'Bleu Marine', material: 'Laine' },
    pants: { size: 'M', color: 'Bleu Marine', material: 'Laine' },
    shirt: { size: 'M', color: 'Blanc', material: 'Coton' },
    tie: { color: 'Bleu', material: 'Soie' },
    belt: { size: 'M', color: 'Marron', material: 'Cuir' },
    available: true,
  },
  {
    _id: '3',
    name: 'Costume de Mariage Premium',
    description: 'Costume de mariage haut de gamme en laine super 120s. Parfait pour votre grand jour avec une finition exceptionnelle.',
    type: 'rent',
    price: 599,
    rentPrice: 120,
    size: ['M', 'L', 'XL'],
    color: ['Noir', 'Gris'],
    images: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1000&fit=crop&q=80',
    ],
    jacket: { size: 'L', color: 'Noir', material: 'Laine Super 120s' },
    pants: { size: 'L', color: 'Noir', material: 'Laine Super 120s' },
    shirt: { size: 'L', color: 'Blanc', material: 'Coton Égyptien' },
    tie: { color: 'Argent', material: 'Soie' },
    belt: { size: 'L', color: 'Noir', material: 'Cuir Italien' },
    available: true,
  },
  {
    _id: '4',
    name: 'Costume Gris Anthracite',
    description: 'Costume élégant en gris anthracite, polyvalent pour tous les événements. Style intemporel et raffiné.',
    type: 'sale',
    price: 279,
    size: ['S', 'M', 'L'],
    color: ['Gris'],
    images: [
      'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=800&h=1000&fit=crop&q=80',
    ],
    jacket: { size: 'M', color: 'Gris Anthracite', material: 'Laine' },
    pants: { size: 'M', color: 'Gris Anthracite', material: 'Laine' },
    shirt: { size: 'M', color: 'Blanc', material: 'Coton' },
    tie: { color: 'Gris', material: 'Soie' },
    belt: { size: 'M', color: 'Noir', material: 'Cuir' },
    available: true,
  },
  {
    _id: '5',
    name: 'Costume Cérémonie',
    description: 'Costume de cérémonie traditionnel, disponible à la location. Élégance et sobriété pour les événements officiels.',
    type: 'rent',
    price: 450,
    rentPrice: 80,
    size: ['M', 'L', 'XL', 'XXL'],
    color: ['Noir'],
    images: [
      'https://images.unsplash.com/photo-1594938291221-94f18cbb566b?w=800&h=1000&fit=crop&q=80',
    ],
    jacket: { size: 'L', color: 'Noir', material: 'Laine' },
    pants: { size: 'L', color: 'Noir', material: 'Laine' },
    shirt: { size: 'L', color: 'Blanc', material: 'Coton' },
    tie: { color: 'Noir', material: 'Soie' },
    belt: { size: 'L', color: 'Noir', material: 'Cuir' },
    available: true,
  },
  {
    _id: '6',
    name: 'Costume Marron Élégant',
    description: 'Costume en marron foncé, choix original et distingué. Parfait pour se démarquer avec style.',
    type: 'sale',
    price: 329,
    size: ['M', 'L', 'XL'],
    color: ['Marron'],
    images: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1000&fit=crop&q=80',
    ],
    jacket: { size: 'L', color: 'Marron Foncé', material: 'Laine' },
    pants: { size: 'L', color: 'Marron Foncé', material: 'Laine' },
    shirt: { size: 'L', color: 'Beige', material: 'Coton' },
    tie: { color: 'Marron', material: 'Soie' },
    belt: { size: 'L', color: 'Marron', material: 'Cuir' },
    available: true,
  },
  {
    _id: '7',
    name: 'Costume Smoking Noir',
    description: 'Smoking classique en noir, idéal pour les soirées et événements formels. Style intemporel et sophistiqué.',
    type: 'rent',
    price: 550,
    rentPrice: 100,
    size: ['S', 'M', 'L', 'XL'],
    color: ['Noir'],
    images: [
      'https://images.unsplash.com/photo-1516914943479-89db7d9ae7f2?w=800&h=1000&fit=crop&q=80',
    ],
    jacket: { size: 'M', color: 'Noir', material: 'Laine' },
    pants: { size: 'M', color: 'Noir', material: 'Laine' },
    shirt: { size: 'M', color: 'Blanc', material: 'Coton' },
    tie: { color: 'Noir', material: 'Soie' },
    belt: { size: 'M', color: 'Noir', material: 'Cuir' },
    available: true,
  },
  {
    _id: '8',
    name: 'Costume Beige Moderne',
    description: 'Costume beige clair, choix moderne et décontracté. Parfait pour les événements d\'été et les occasions moins formelles.',
    type: 'sale',
    price: 269,
    size: ['S', 'M', 'L'],
    color: ['Beige'],
    images: [
      'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=800&h=1000&fit=crop&q=80',
    ],
    jacket: { size: 'M', color: 'Beige', material: 'Laine' },
    pants: { size: 'M', color: 'Beige', material: 'Laine' },
    shirt: { size: 'M', color: 'Blanc', material: 'Coton' },
    tie: { color: 'Beige', material: 'Soie' },
    belt: { size: 'M', color: 'Marron', material: 'Cuir' },
    available: true,
  },
  {
    _id: '9',
    name: 'Costume Business Professionnel',
    description: 'Costume professionnel en gris foncé, parfait pour le bureau et les réunions importantes. Coupe classique et élégante.',
    type: 'sale',
    price: 389,
    size: ['M', 'L', 'XL', 'XXL'],
    color: ['Gris'],
    images: [
      'https://images.unsplash.com/photo-1624222247344-550fb60583fd?w=800&h=1000&fit=crop&q=80',
    ],
    jacket: { size: 'L', color: 'Gris Foncé', material: 'Laine' },
    pants: { size: 'L', color: 'Gris Foncé', material: 'Laine' },
    shirt: { size: 'L', color: 'Blanc', material: 'Coton' },
    tie: { color: 'Gris', material: 'Soie' },
    belt: { size: 'L', color: 'Noir', material: 'Cuir' },
    available: true,
  },
  {
    _id: '10',
    name: 'Costume Soirée Élégant',
    description: 'Costume de soirée haut de gamme, disponible à la location. Parfait pour les galas et événements prestigieux.',
    type: 'rent',
    price: 650,
    rentPrice: 150,
    size: ['M', 'L', 'XL'],
    color: ['Noir'],
    images: [
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&h=1000&fit=crop&q=80',
    ],
    jacket: { size: 'L', color: 'Noir', material: 'Laine Super 150s' },
    pants: { size: 'L', color: 'Noir', material: 'Laine Super 150s' },
    shirt: { size: 'L', color: 'Blanc', material: 'Coton Égyptien' },
    tie: { color: 'Noir', material: 'Soie' },
    belt: { size: 'L', color: 'Noir', material: 'Cuir Italien' },
    available: true,
  },
];
