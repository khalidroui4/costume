'use client';

import { Edit, Trash2 } from 'lucide-react';
import Image from 'next/image';

interface Costume {
  _id: string;
  name: string;
  type: 'sale' | 'rent';
  price: number;
  rentPrice?: number;
  images: string[];
  available: boolean;
}

interface CostumeListProps {
  costumes: Costume[];
  onEdit: (costume: Costume) => void;
  onDelete: (id: string) => void;
}

export default function CostumeList({
  costumes,
  onEdit,
  onDelete,
}: CostumeListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {costumes.map((costume) => (
        <div
          key={costume._id}
          className="bg-gray-900 rounded-lg overflow-hidden"
        >
          <div className="relative aspect-[3/4] bg-gray-800">
            <Image
              src={costume.images[0] || 'https://via.placeholder.com/400x500/1a1a1a/ffffff?text=Costume'}
              alt={costume.name}
              fill
              className="object-cover"
            />
            <div className="absolute top-2 right-2">
              <span
                className={`px-2 py-1 rounded text-xs font-bold ${
                  costume.type === 'sale'
                    ? 'bg-green-600 text-white'
                    : 'bg-blue-600 text-white'
                }`}
              >
                {costume.type === 'sale' ? 'VENTE' : 'LOCATION'}
              </span>
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2">{costume.name}</h3>
            <p className="text-gray-400 mb-4">
              {costume.type === 'sale'
                ? `${costume.price}€`
                : `${costume.rentPrice}€/jour`}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(costume)}
                className="flex-1 bg-white text-black py-2 px-4 rounded font-bold hover:bg-gray-200 transition-colors flex items-center justify-center"
              >
                <Edit className="w-4 h-4 mr-2" />
                Modifier
              </button>
              <button
                onClick={() => onDelete(costume._id)}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded font-bold hover:bg-red-700 transition-colors flex items-center justify-center"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Supprimer
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

