'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

interface Costume {
  _id?: string;
  name: string;
  description: string;
  type: 'sale' | 'rent';
  price: number;
  rentPrice?: number;
  size: string[];
  color: string[];
  images: string[];
  jacket: any;
  pants: any;
  shirt: any;
  tie: any;
  belt: any;
  available: boolean;
}

interface CostumeFormProps {
  costume: Costume | null;
  onClose: () => void;
}

export default function CostumeForm({ costume, onClose }: CostumeFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'sale' as 'sale' | 'rent',
    price: 0,
    rentPrice: 0,
    size: [] as string[],
    color: [] as string[],
    images: [''] as string[],
    jacket: { size: '', color: '', material: '' },
    pants: { size: '', color: '', material: '' },
    shirt: { size: '', color: '', material: '' },
    tie: { color: '', material: '' },
    belt: { size: '', color: '', material: '' },
    available: true,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (costume) {
      setFormData({
        name: costume.name || '',
        description: costume.description || '',
        type: costume.type || 'sale',
        price: costume.price || 0,
        rentPrice: costume.rentPrice || 0,
        size: costume.size || [],
        color: costume.color || [],
        images: costume.images && costume.images.length > 0 ? costume.images : [''],
        jacket: costume.jacket || { size: '', color: '', material: '' },
        pants: costume.pants || { size: '', color: '', material: '' },
        shirt: costume.shirt || { size: '', color: '', material: '' },
        tie: costume.tie || { color: '', material: '' },
        belt: costume.belt || { size: '', color: '', material: '' },
        available: costume.available !== undefined ? costume.available : true,
      });
    }
  }, [costume]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Save to localStorage for custom costumes
      const customCostumes = JSON.parse(localStorage.getItem('customCostumes') || '[]');
      
      const costumeData = {
        ...formData,
        _id: costume?._id || `custom-${Date.now()}`,
        images: formData.images.filter(img => img.trim() !== ''),
      };

      if (costume?._id) {
        // Update existing costume
        const index = customCostumes.findIndex((c: Costume) => c._id === costume._id);
        if (index !== -1) {
          customCostumes[index] = costumeData;
        } else {
          // Try to update in static costumes (read-only, so we add to custom)
          customCostumes.push(costumeData);
        }
      } else {
        // Add new costume
        customCostumes.push(costumeData);
      }

      localStorage.setItem('customCostumes', JSON.stringify(customCostumes));
      toast.success(costume?._id ? 'Costume modifié' : 'Costume créé');
      onClose();
    } catch (error) {
      toast.error('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const colors = ['Noir', 'Bleu', 'Gris', 'Marron', 'Beige', 'Blanc', 'Autre'];

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {costume?._id ? 'Modifier le costume' : 'Nouveau costume'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nom</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'sale' | 'rent' })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white"
              >
                <option value="sale">Vente</option>
                <option value="rent">Location</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Prix (€)</label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white"
              />
            </div>
            {formData.type === 'rent' && (
              <div>
                <label className="block text-sm font-medium mb-2">Prix Location/jour (€)</label>
                <input
                  type="number"
                  required
                  value={formData.rentPrice}
                  onChange={(e) => setFormData({ ...formData, rentPrice: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white"
                />
              </div>
            )}
          </div>

          {/* Sizes and Colors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tailles disponibles</label>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <label key={size} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.size.includes(size)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({ ...formData, size: [...formData.size, size] });
                        } else {
                          setFormData({ ...formData, size: formData.size.filter((s) => s !== size) });
                        }
                      }}
                      className="mr-2"
                    />
                    <span>{size}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Couleurs disponibles</label>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <label key={color} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.color.includes(color)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({ ...formData, color: [...formData.color, color] });
                        } else {
                          setFormData({ ...formData, color: formData.color.filter((c) => c !== color) });
                        }
                      }}
                      className="mr-2"
                    />
                    <span>{color}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium mb-2">Images (URLs)</label>
            {formData.images.map((image, index) => (
              <input
                key={index}
                type="url"
                value={image}
                onChange={(e) => {
                  const newImages = [...formData.images];
                  newImages[index] = e.target.value;
                  setFormData({ ...formData, images: newImages });
                }}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white mb-2"
                placeholder="https://..."
              />
            ))}
            <button
              type="button"
              onClick={() => setFormData({ ...formData, images: [...formData.images, ''] })}
              className="text-sm text-gray-400 hover:text-white"
            >
              + Ajouter une image
            </button>
          </div>

          {/* Costume Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Détails du Costume</h3>
            
            <div className="bg-gray-800 p-4 rounded">
              <h4 className="font-semibold mb-3">Veste</h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Taille</label>
                  <input
                    type="text"
                    value={formData.jacket.size}
                    onChange={(e) => setFormData({
                      ...formData,
                      jacket: { ...formData.jacket, size: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Couleur</label>
                  <input
                    type="text"
                    value={formData.jacket.color}
                    onChange={(e) => setFormData({
                      ...formData,
                      jacket: { ...formData.jacket, color: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Matériau</label>
                  <input
                    type="text"
                    value={formData.jacket.material}
                    onChange={(e) => setFormData({
                      ...formData,
                      jacket: { ...formData.jacket, material: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded">
              <h4 className="font-semibold mb-3">Pantalon</h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Taille</label>
                  <input
                    type="text"
                    value={formData.pants.size}
                    onChange={(e) => setFormData({
                      ...formData,
                      pants: { ...formData.pants, size: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Couleur</label>
                  <input
                    type="text"
                    value={formData.pants.color}
                    onChange={(e) => setFormData({
                      ...formData,
                      pants: { ...formData.pants, color: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Matériau</label>
                  <input
                    type="text"
                    value={formData.pants.material}
                    onChange={(e) => setFormData({
                      ...formData,
                      pants: { ...formData.pants, material: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded">
              <h4 className="font-semibold mb-3">Chemise</h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Taille</label>
                  <input
                    type="text"
                    value={formData.shirt.size}
                    onChange={(e) => setFormData({
                      ...formData,
                      shirt: { ...formData.shirt, size: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Couleur</label>
                  <input
                    type="text"
                    value={formData.shirt.color}
                    onChange={(e) => setFormData({
                      ...formData,
                      shirt: { ...formData.shirt, color: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Matériau</label>
                  <input
                    type="text"
                    value={formData.shirt.material}
                    onChange={(e) => setFormData({
                      ...formData,
                      shirt: { ...formData.shirt, material: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded">
              <h4 className="font-semibold mb-3">Cravate</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Couleur</label>
                  <input
                    type="text"
                    value={formData.tie.color}
                    onChange={(e) => setFormData({ ...formData, tie: { ...formData.tie, color: e.target.value } })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Matériau</label>
                  <input
                    type="text"
                    value={formData.tie.material}
                    onChange={(e) => setFormData({ ...formData, tie: { ...formData.tie, material: e.target.value } })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded">
              <h4 className="font-semibold mb-3">Ceinture</h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Taille</label>
                  <input
                    type="text"
                    value={formData.belt.size}
                    onChange={(e) => setFormData({ ...formData, belt: { ...formData.belt, size: e.target.value } })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Couleur</label>
                  <input
                    type="text"
                    value={formData.belt.color}
                    onChange={(e) => setFormData({ ...formData, belt: { ...formData.belt, color: e.target.value } })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Matériau</label>
                  <input
                    type="text"
                    value={formData.belt.material}
                    onChange={(e) => setFormData({ ...formData, belt: { ...formData.belt, material: e.target.value } })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.available}
                onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                className="mr-2"
              />
              <span>Disponible</span>
            </label>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-white text-black py-3 px-6 rounded-lg font-bold hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              {loading ? 'Enregistrement...' : costume?._id ? 'Modifier' : 'Créer'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-800 text-white py-3 px-6 rounded-lg font-bold hover:bg-gray-700 transition-colors"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

