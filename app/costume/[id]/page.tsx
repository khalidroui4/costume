'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ShoppingCart, MessageCircle, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { staticCostumes, type Costume } from '@/data/costumes';
import { getCostumeById } from '@/lib/costume-storage';

export default function CostumeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [costume, setCostume] = useState<Costume | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    // Only look in custom costumes (admin-added)
    let foundCostume: Costume | undefined;
    
    if (typeof window !== 'undefined') {
      const customCostumes = JSON.parse(localStorage.getItem('customCostumes') || '[]');
      foundCostume = customCostumes.find((c: Costume) => c._id === params.id);
    }
    
    // Also try getCostumeById (which checks custom first)
    if (!foundCostume) {
      foundCostume = getCostumeById(params.id as string);
    }
    
    if (foundCostume) {
      setCostume(foundCostume);
      if (foundCostume.images && foundCostume.images.length > 0) {
        setSelectedImage(0);
      }
    } else {
      toast.error('Costume introuvable');
      router.push('/');
    }
  }, [params.id, router]);

  const handleAddToCart = () => {
    if (!costume) return;

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(
      (item: any) => item.costumeId === costume._id && item.type === costume.type
    );

    if (existingItem) {
      toast.error('Ce produit est déjà dans le panier');
      return;
    }

    cart.push({
      costumeId: costume._id,
      costumeName: costume.name,
      type: costume.type,
      price: costume.type === 'sale' ? costume.price : costume.rentPrice,
      image: costume.images[0] || '',
      quantity: 1,
    });

    localStorage.setItem('cart', JSON.stringify(cart));
    toast.success('Ajouté au panier');
    
    // Update cart count in navbar
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleContactOwner = () => {
    if (!costume) return;

    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+33123456789';
    const costumeUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/costume/${costume._id}`;
    const message = encodeURIComponent(
      `Bonjour, je suis intéressé(e) par ce costume:\n\n${costume.name}\n${costumeUrl}`
    );
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${message}`;

    if (typeof window !== 'undefined') {
      window.open(whatsappUrl, '_blank');
    }
  };

  if (!costume) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  const mainImage = costume.images[selectedImage] || 'https://via.placeholder.com/800x1000/1a1a1a/ffffff?text=Costume';

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center text-gray-400 hover:text-white mb-8"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Retour
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="relative aspect-[3/4] bg-gray-900 rounded-lg overflow-hidden mb-4">
              <Image
                src={mainImage}
                alt={costume.name}
                fill
                className="object-cover"
              />
            </div>
            {costume.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {costume.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 ${
                      selectedImage === index
                        ? 'border-white'
                        : 'border-transparent hover:border-gray-600'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${costume.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div className="mb-6">
              <span
                className={`inline-block px-3 py-1 rounded text-sm font-bold mb-4 ${
                  costume.type === 'sale'
                    ? 'bg-green-600 text-white'
                    : 'bg-blue-600 text-white'
                }`}
              >
                {costume.type === 'sale' ? 'EN VENTE' : 'EN LOCATION'}
              </span>
              <h1 className="text-4xl font-bold mb-4">{costume.name}</h1>
              <p className="text-gray-400 text-lg mb-6">{costume.description}</p>
            </div>

            {/* Price */}
            <div className="mb-8">
              {costume.type === 'sale' ? (
                <div className="text-4xl font-bold">{costume.price}€</div>
              ) : (
                <div className="text-4xl font-bold">{costume.rentPrice}€/jour</div>
              )}
            </div>

            {/* Details */}
            <div className="space-y-6 mb-8">
              <div>
                <h3 className="text-xl font-bold mb-4">Détails du Costume</h3>
                <div className="space-y-4 bg-gray-900 p-6 rounded-lg">
                  <div>
                    <h4 className="font-semibold mb-2">Veste</h4>
                    <p className="text-gray-400 text-sm">
                      Taille: {costume.jacket.size} | Couleur: {costume.jacket.color} | Matériau: {costume.jacket.material}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Pantalon</h4>
                    <p className="text-gray-400 text-sm">
                      Taille: {costume.pants.size} | Couleur: {costume.pants.color} | Matériau: {costume.pants.material}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Chemise</h4>
                    <p className="text-gray-400 text-sm">
                      Taille: {costume.shirt.size} | Couleur: {costume.shirt.color} | Matériau: {costume.shirt.material}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Cravate</h4>
                    <p className="text-gray-400 text-sm">
                      Couleur: {costume.tie.color} | Matériau: {costume.tie.material}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Ceinture</h4>
                    <p className="text-gray-400 text-sm">
                      Taille: {costume.belt.size} | Couleur: {costume.belt.color} | Matériau: {costume.belt.material}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Tailles disponibles</h4>
                <div className="flex flex-wrap gap-2">
                  {costume.size.map((size) => (
                    <span
                      key={size}
                      className="px-3 py-1 bg-gray-800 rounded text-sm"
                    >
                      {size}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Couleurs disponibles</h4>
                <div className="flex flex-wrap gap-2">
                  {costume.color.map((color) => (
                    <span
                      key={color}
                      className="px-3 py-1 bg-gray-800 rounded text-sm"
                    >
                      {color}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              {costume.available ? (
                <>
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-white text-black py-4 px-6 rounded-lg font-bold hover:bg-gray-200 transition-colors flex items-center justify-center"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Ajouter au panier
                  </button>
                  <button
                    onClick={handleContactOwner}
                    className="w-full bg-green-600 text-white py-4 px-6 rounded-lg font-bold hover:bg-green-700 transition-colors flex items-center justify-center"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Contacter le propriétaire
                  </button>
                </>
              ) : (
                <div className="w-full bg-gray-800 text-gray-400 py-4 px-6 rounded-lg font-bold text-center">
                  Indisponible
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

