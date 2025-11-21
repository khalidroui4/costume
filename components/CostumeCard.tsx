'use client';

import Link from 'next/link';
import Image from 'next/image';

interface Costume {
  _id: string;
  name: string;
  description: string;
  type: 'sale' | 'rent';
  price: number;
  rentPrice?: number;
  size: string[];
  color: string[];
  images: string[];
  available: boolean;
}

interface CostumeCardProps {
  costume: Costume;
}
/* hqlq hqlq hqlq */
/* dhdhdhdhdhdh */ 

export default function CostumeCard({ costume }: CostumeCardProps) {
  const imageUrl = costume.images[0] || 'https://via.placeholder.com/400x500/1a1a1a/ffffff?text=Costume';

  return (
    <Link href={`/costume/${costume._id}`}>
      <div className="group bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-all duration-300 cursor-pointer">
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={imageUrl}
            alt={costume.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {!costume.available && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white font-bold">INDISPONIBLE</span>
            </div>
          )}
          <div className="absolute top-2 right-2">
            <span className={`px-2 py-1 rounded text-xs font-bold ${
              costume.type === 'sale' 
                ? 'bg-green-600 text-white' 
                : 'bg-blue-600 text-white'
            }`}>
              {costume.type === 'sale' ? 'VENTE' : 'LOCATION'}
            </span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-1">{costume.name}</h3>
          <p className="text-gray-400 text-sm mb-3 line-clamp-2">{costume.description}</p>
          <div className="flex items-center justify-between">
            <div>
              {costume.type === 'sale' ? (
                <span className="text-xl font-bold">{costume.price}€</span>
              ) : (
                <span className="text-xl font-bold">{costume.rentPrice}€/jour</span>
              )}
            </div>
            <div className="text-xs text-gray-500">
              {costume.size.length} taille{costume.size.length > 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

