import mongoose from 'mongoose';
import connectDB from '../lib/mongodb';
import Costume from '../models/Costume';
import User from '../models/User';
import bcrypt from 'bcryptjs';

const sampleCostumes = [
  {
    name: 'Costume Classique Noir',
    description: 'Costume élégant en laine noire, parfait pour les occasions formelles et les mariages. Finition impeccable et coupe moderne.',
    type: 'sale',
    price: 299,
    size: ['M', 'L', 'XL'],
    color: ['Noir'],
    images: [
      'https://via.placeholder.com/800x1000/000000/ffffff?text=Costume+Noir',
      'https://via.placeholder.com/800x1000/1a1a1a/ffffff?text=Costume+Noir+2',
    ],
    jacket: { size: 'L', color: 'Noir', material: 'Laine' },
    pants: { size: 'L', color: 'Noir', material: 'Laine' },
    shirt: { size: 'L', color: 'Blanc', material: 'Coton' },
    tie: { color: 'Noir', material: 'Soie' },
    belt: { size: 'L', color: 'Noir', material: 'Cuir' },
    available: true,
  },
  {
    name: 'Costume Bleu Marine',
    description: 'Costume moderne en bleu marine, idéal pour les événements professionnels. Style contemporain et élégant.',
    type: 'sale',
    price: 349,
    size: ['S', 'M', 'L', 'XL'],
    color: ['Bleu'],
    images: [
      'https://via.placeholder.com/800x1000/000080/ffffff?text=Costume+Bleu',
    ],
    jacket: { size: 'M', color: 'Bleu Marine', material: 'Laine' },
    pants: { size: 'M', color: 'Bleu Marine', material: 'Laine' },
    shirt: { size: 'M', color: 'Blanc', material: 'Coton' },
    tie: { color: 'Bleu', material: 'Soie' },
    belt: { size: 'M', color: 'Marron', material: 'Cuir' },
    available: true,
  },
  {
    name: 'Costume de Mariage Premium',
    description: 'Costume de mariage haut de gamme en laine super 120s. Parfait pour votre grand jour avec une finition exceptionnelle.',
    type: 'rent',
    price: 599,
    rentPrice: 120,
    size: ['M', 'L', 'XL'],
    color: ['Noir', 'Gris'],
    images: [
      'https://via.placeholder.com/800x1000/2a2a2a/ffffff?text=Costume+Mariage',
    ],
    jacket: { size: 'L', color: 'Noir', material: 'Laine Super 120s' },
    pants: { size: 'L', color: 'Noir', material: 'Laine Super 120s' },
    shirt: { size: 'L', color: 'Blanc', material: 'Coton Égyptien' },
    tie: { color: 'Argent', material: 'Soie' },
    belt: { size: 'L', color: 'Noir', material: 'Cuir Italien' },
    available: true,
  },
  {
    name: 'Costume Gris Anthracite',
    description: 'Costume élégant en gris anthracite, polyvalent pour tous les événements. Style intemporel et raffiné.',
    type: 'sale',
    price: 279,
    size: ['S', 'M', 'L'],
    color: ['Gris'],
    images: [
      'https://via.placeholder.com/800x1000/4a4a4a/ffffff?text=Costume+Gris',
    ],
    jacket: { size: 'M', color: 'Gris Anthracite', material: 'Laine' },
    pants: { size: 'M', color: 'Gris Anthracite', material: 'Laine' },
    shirt: { size: 'M', color: 'Blanc', material: 'Coton' },
    tie: { color: 'Gris', material: 'Soie' },
    belt: { size: 'M', color: 'Noir', material: 'Cuir' },
    available: true,
  },
  {
    name: 'Costume Cérémonie',
    description: 'Costume de cérémonie traditionnel, disponible à la location. Élégance et sobriété pour les événements officiels.',
    type: 'rent',
    price: 450,
    rentPrice: 80,
    size: ['M', 'L', 'XL', 'XXL'],
    color: ['Noir'],
    images: [
      'https://via.placeholder.com/800x1000/1a1a1a/ffffff?text=Costume+Ceremonie',
    ],
    jacket: { size: 'L', color: 'Noir', material: 'Laine' },
    pants: { size: 'L', color: 'Noir', material: 'Laine' },
    shirt: { size: 'L', color: 'Blanc', material: 'Coton' },
    tie: { color: 'Noir', material: 'Soie' },
    belt: { size: 'L', color: 'Noir', material: 'Cuir' },
    available: true,
  },
  {
    name: 'Costume Marron Élégant',
    description: 'Costume en marron foncé, choix original et distingué. Parfait pour se démarquer avec style.',
    type: 'sale',
    price: 329,
    size: ['M', 'L', 'XL'],
    color: ['Marron'],
    images: [
      'https://via.placeholder.com/800x1000/8B4513/ffffff?text=Costume+Marron',
    ],
    jacket: { size: 'L', color: 'Marron Foncé', material: 'Laine' },
    pants: { size: 'L', color: 'Marron Foncé', material: 'Laine' },
    shirt: { size: 'L', color: 'Beige', material: 'Coton' },
    tie: { color: 'Marron', material: 'Soie' },
    belt: { size: 'L', color: 'Marron', material: 'Cuir' },
    available: true,
  },
  {
    name: 'Costume Smoking Noir',
    description: 'Smoking classique en noir, idéal pour les soirées et événements formels. Style intemporel et sophistiqué.',
    type: 'rent',
    price: 550,
    rentPrice: 100,
    size: ['S', 'M', 'L', 'XL'],
    color: ['Noir'],
    images: [
      'https://via.placeholder.com/800x1000/000000/ffffff?text=Smoking+Noir',
    ],
    jacket: { size: 'M', color: 'Noir', material: 'Laine' },
    pants: { size: 'M', color: 'Noir', material: 'Laine' },
    shirt: { size: 'M', color: 'Blanc', material: 'Coton' },
    tie: { color: 'Noir', material: 'Soie' },
    belt: { size: 'M', color: 'Noir', material: 'Cuir' },
    available: true,
  },
  {
    name: 'Costume Beige Moderne',
    description: 'Costume beige clair, choix moderne et décontracté. Parfait pour les événements d\'été et les occasions moins formelles.',
    type: 'sale',
    price: 269,
    size: ['S', 'M', 'L'],
    color: ['Beige'],
    images: [
      'https://via.placeholder.com/800x1000/F5DEB3/000000?text=Costume+Beige',
    ],
    jacket: { size: 'M', color: 'Beige', material: 'Laine' },
    pants: { size: 'M', color: 'Beige', material: 'Laine' },
    shirt: { size: 'M', color: 'Blanc', material: 'Coton' },
    tie: { color: 'Beige', material: 'Soie' },
    belt: { size: 'M', color: 'Marron', material: 'Cuir' },
    available: true,
  },
  {
    name: 'Costume Business Professionnel',
    description: 'Costume professionnel en gris foncé, parfait pour le bureau et les réunions importantes. Coupe classique et élégante.',
    type: 'sale',
    price: 389,
    size: ['M', 'L', 'XL', 'XXL'],
    color: ['Gris'],
    images: [
      'https://via.placeholder.com/800x1000/696969/ffffff?text=Costume+Business',
    ],
    jacket: { size: 'L', color: 'Gris Foncé', material: 'Laine' },
    pants: { size: 'L', color: 'Gris Foncé', material: 'Laine' },
    shirt: { size: 'L', color: 'Blanc', material: 'Coton' },
    tie: { color: 'Gris', material: 'Soie' },
    belt: { size: 'L', color: 'Noir', material: 'Cuir' },
    available: true,
  },
  {
    name: 'Costume Soirée Élégant',
    description: 'Costume de soirée haut de gamme, disponible à la location. Parfait pour les galas et événements prestigieux.',
    type: 'rent',
    price: 650,
    rentPrice: 150,
    size: ['M', 'L', 'XL'],
    color: ['Noir'],
    images: [
      'https://via.placeholder.com/800x1000/1a1a1a/ffffff?text=Costume+Soiree',
    ],
    jacket: { size: 'L', color: 'Noir', material: 'Laine Super 150s' },
    pants: { size: 'L', color: 'Noir', material: 'Laine Super 150s' },
    shirt: { size: 'L', color: 'Blanc', material: 'Coton Égyptien' },
    tie: { color: 'Noir', material: 'Soie' },
    belt: { size: 'L', color: 'Noir', material: 'Cuir Italien' },
    available: true,
  },
];

async function seed() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Clear existing data
    await Costume.deleteMany({});
    console.log('Cleared existing costumes');

    // Create sample costumes
    const costumes = await Costume.insertMany(sampleCostumes);
    console.log(`Created ${costumes.length} costumes`);
    console.log(`- ${costumes.filter(c => c.type === 'sale').length} en vente`);
    console.log(`- ${costumes.filter(c => c.type === 'rent').length} en location`);

    // Create admin user
    const adminEmail = 'admin@costume-store.com';
    const adminPassword = 'admin123';

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      const admin = await User.create({
        name: 'Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
      });
      console.log('Created admin user:', adminEmail);
      console.log('Admin password:', adminPassword);
    } else {
      console.log('Admin user already exists');
    }

    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();

