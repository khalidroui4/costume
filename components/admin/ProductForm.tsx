'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Upload, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { convertFileToBase64, validateImageFile } from '@/lib/image-upload';

export type ProductCategory = 'costume' | 'jacket' | 'pants' | 'shirt' | 'tie' | 'belt' | 'wallet';

export interface Product {
  _id?: string;
  name: string;
  description: string;
  category: ProductCategory;
  type: 'sale' | 'rent';
  price: number;
  rentPrice?: number;
  size: string[];
  color: string[];
  images: string[]; // Base64 or URLs
  // For complete costumes
  jacket?: { size: string; color: string; material: string };
  pants?: { size: string; color: string; material: string };
  shirt?: { size: string; color: string; material: string };
  tie?: { color: string; material: string };
  belt?: { size: string; color: string; material: string };
  // For individual items
  material?: string;
  available: boolean;
}

interface ProductFormProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductForm({ product, onClose }: ProductFormProps) {
  const [formData, setFormData] = useState<Product>({
    name: '',
    description: '',
    category: 'costume',
    type: 'sale',
    price: 0,
    rentPrice: 0,
    size: [],
    color: [],
    images: [],
    available: true,
  });

  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState<boolean[]>([]);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  const handleImageUpload = async (file: File, index: number) => {
    if (!validateImageFile(file)) {
      toast.error('Format d\'image invalide. Utilisez JPG, PNG ou WEBP (max 5MB)');
      return;
    }

    const newUploading = [...uploadingImages];
    newUploading[index] = true;
    setUploadingImages(newUploading);

    try {
      const base64 = await convertFileToBase64(file);
      const newImages = [...formData.images];
      newImages[index] = base64;
      setFormData({ ...formData, images: newImages });
      toast.success('Image uploadée avec succès');
    } catch (error) {
      toast.error('Erreur lors de l\'upload de l\'image');
    } finally {
      const newUploading = [...uploadingImages];
      newUploading[index] = false;
      setUploadingImages(newUploading);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file, index);
    }
  };

  const addImageSlot = () => {
    setFormData({ ...formData, images: [...formData.images, ''] });
    setUploadingImages([...uploadingImages, false]);
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
    const newUploading = uploadingImages.filter((_, i) => i !== index);
    setUploadingImages(newUploading);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const customProducts = JSON.parse(localStorage.getItem('customCostumes') || '[]');
      
      const productData: Product = {
        ...formData,
        _id: product?._id || `custom-${Date.now()}`,
        images: formData.images.filter(img => img.trim() !== ''),
      };

      if (product?._id) {
        const index = customProducts.findIndex((p: Product) => p._id === product._id);
        if (index !== -1) {
          customProducts[index] = productData;
        } else {
          customProducts.push(productData);
        }
      } else {
        customProducts.push(productData);
      }

      localStorage.setItem('customCostumes', JSON.stringify(customProducts));
      toast.success(product?._id ? 'Produit modifié' : 'Produit créé');
      onClose();
    } catch (error) {
      toast.error('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const colors = ['Noir', 'Bleu', 'Gris', 'Marron', 'Beige', 'Blanc', 'Autre'];
  const categories: { value: ProductCategory; label: string }[] = [
    { value: 'costume', label: 'Costume Complet' },
    { value: 'jacket', label: 'Veste' },
    { value: 'pants', label: 'Pantalon' },
    { value: 'shirt', label: 'Chemise' },
    { value: 'tie', label: 'Cravate' },
    { value: 'belt', label: 'Ceinture' },
    { value: 'wallet', label: 'Portefeuille' },
  ];

  const showCostumeDetails = formData.category === 'costume';
  const showSize = formData.category !== 'tie' && formData.category !== 'wallet';
  const showMaterial = formData.category !== 'costume';

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {product?._id ? 'Modifier le produit' : 'Nouveau produit'}
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
              <label className="block text-sm font-medium mb-2">Catégorie</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
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
            <div>
              <label className="block text-sm font-medium mb-2">Prix (€)</label>
              <input
                type="number"
                required
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white"
              />
            </div>
          </div>

          {formData.type === 'rent' && (
            <div>
              <label className="block text-sm font-medium mb-2">Prix Location/jour (€)</label>
              <input
                type="number"
                required
                step="0.01"
                value={formData.rentPrice || 0}
                onChange={(e) => setFormData({ ...formData, rentPrice: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white"
              />
            </div>
          )}

          {/* Sizes and Colors */}
          {showSize && (
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
          )}

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

          {/* Material for individual items */}
          {showMaterial && (
            <div>
              <label className="block text-sm font-medium mb-2">Matériau</label>
              <input
                type="text"
                value={formData.material || ''}
                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white"
                placeholder="Ex: Coton, Laine, Cuir..."
              />
            </div>
          )}

          {/* Images Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">Images</label>
            <div className="space-y-4">
              {formData.images.map((image, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <div className="flex-1">
                    {image.startsWith('data:') || image.startsWith('http') ? (
                      <div className="relative">
                        <img
                          src={image}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-48 object-cover rounded border border-gray-700"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-700 rounded p-4 text-center">
                        <input
                          ref={(el) => {
                            fileInputRefs.current[index] = el;
                          }}
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          onChange={(e) => handleFileInputChange(e, index)}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRefs.current[index]?.click()}
                          disabled={uploadingImages[index]}
                          className="flex flex-col items-center gap-2 text-gray-400 hover:text-white disabled:opacity-50"
                        >
                          <Upload className="w-8 h-8" />
                          <span>{uploadingImages[index] ? 'Upload...' : 'Cliquez pour uploader'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addImageSlot}
                className="w-full border-2 border-dashed border-gray-700 rounded p-4 text-center text-gray-400 hover:text-white hover:border-gray-600 transition-colors"
              >
                + Ajouter une image
              </button>
            </div>
          </div>

          {/* Costume Details - only for complete costumes */}
          {showCostumeDetails && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold">Détails du Costume</h3>
              
              <div className="bg-gray-800 p-4 rounded">
                <h4 className="font-semibold mb-3">Veste</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Taille</label>
                    <input
                      type="text"
                      value={formData.jacket?.size || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        jacket: { ...formData.jacket, size: e.target.value, color: formData.jacket?.color || '', material: formData.jacket?.material || '' }
                      })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Couleur</label>
                    <input
                      type="text"
                      value={formData.jacket?.color || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        jacket: { ...formData.jacket, size: formData.jacket?.size || '', color: e.target.value, material: formData.jacket?.material || '' }
                      })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Matériau</label>
                    <input
                      type="text"
                      value={formData.jacket?.material || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        jacket: { ...formData.jacket, size: formData.jacket?.size || '', color: formData.jacket?.color || '', material: e.target.value }
                      })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Similar blocks for pants, shirt, tie, belt */}
              <div className="bg-gray-800 p-4 rounded">
                <h4 className="font-semibold mb-3">Pantalon</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Taille</label>
                    <input
                      type="text"
                      value={formData.pants?.size || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        pants: { ...formData.pants, size: e.target.value, color: formData.pants?.color || '', material: formData.pants?.material || '' }
                      })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Couleur</label>
                    <input
                      type="text"
                      value={formData.pants?.color || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        pants: { ...formData.pants, size: formData.pants?.size || '', color: e.target.value, material: formData.pants?.material || '' }
                      })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Matériau</label>
                    <input
                      type="text"
                      value={formData.pants?.material || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        pants: { ...formData.pants, size: formData.pants?.size || '', color: formData.pants?.color || '', material: e.target.value }
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
                      value={formData.shirt?.size || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        shirt: { ...formData.shirt, size: e.target.value, color: formData.shirt?.color || '', material: formData.shirt?.material || '' }
                      })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Couleur</label>
                    <input
                      type="text"
                      value={formData.shirt?.color || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        shirt: { ...formData.shirt, size: formData.shirt?.size || '', color: e.target.value, material: formData.shirt?.material || '' }
                      })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Matériau</label>
                    <input
                      type="text"
                      value={formData.shirt?.material || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        shirt: { ...formData.shirt, size: formData.shirt?.size || '', color: formData.shirt?.color || '', material: e.target.value }
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
                      value={formData.tie?.color || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        tie: { ...formData.tie, color: e.target.value, material: formData.tie?.material || '' }
                      })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Matériau</label>
                    <input
                      type="text"
                      value={formData.tie?.material || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        tie: { ...formData.tie, color: formData.tie?.color || '', material: e.target.value }
                      })}
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
                      value={formData.belt?.size || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        belt: { ...formData.belt, size: e.target.value, color: formData.belt?.color || '', material: formData.belt?.material || '' }
                      })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Couleur</label>
                    <input
                      type="text"
                      value={formData.belt?.color || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        belt: { ...formData.belt, size: formData.belt?.size || '', color: e.target.value, material: formData.belt?.material || '' }
                      })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Matériau</label>
                    <input
                      type="text"
                      value={formData.belt?.material || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        belt: { ...formData.belt, size: formData.belt?.size || '', color: formData.belt?.color || '', material: e.target.value }
                      })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

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
              {loading ? 'Enregistrement...' : product?._id ? 'Modifier' : 'Créer'}
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

