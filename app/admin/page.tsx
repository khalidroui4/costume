'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, LogOut, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import ProductForm, { type Product, type ProductCategory } from '@/components/admin/ProductForm';
import { isAdminLoggedIn, removeAdminUser, getAdminUser } from '@/lib/admin-auth';
import {
  getAllCostumes,
  getSoldCostumeIds,
  getRentedCostumeIds,
  getCostumeStatuses,
  markCostumeAsSold,
  confirmRentalReturn,
  removeCostumeFromPublic,
  getCostumeById,
  showCostume,
} from '@/lib/costume-storage';
import { staticCostumes, type Costume } from '@/data/costumes';

export default function AdminDashboard() {
  const router = useRouter();
  const [allCostumes, setAllCostumes] = useState<Product[]>([]);
  const [soldCostumes, setSoldCostumes] = useState<Product[]>([]);
  const [rentedCostumes, setRentedCostumes] = useState<Product[]>([]);
  const [hiddenCostumes, setHiddenCostumes] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCostume, setEditingCostume] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<'sale' | 'rent' | 'sold' | 'rented' | 'hidden'>('sale');

  useEffect(() => {
    checkAuth();
    loadCostumes();
  }, []);

  const checkAuth = () => {
    if (!isAdminLoggedIn()) {
      router.push('/login');
      toast.error('Accès non autorisé');
      return;
    }
  };

  const loadCostumes = () => {
    setLoading(true);
    try {
      // Only get custom products added by admin
      const all: Product[] = [];
      
      if (typeof window !== 'undefined') {
        const customProducts = JSON.parse(localStorage.getItem('customCostumes') || '[]');
        all.push(...customProducts);
      }
      
      const soldIds = getSoldCostumeIds();
      const rentedIds = getRentedCostumeIds();
      const statuses = getCostumeStatuses();

      // Separate products by type and status
      const saleCostumes = all.filter((c) => c._id && c.type === 'sale' && c.available && !soldIds.includes(c._id) && !rentedIds.includes(c._id));
      const rentCostumes = all.filter((c) => c._id && c.type === 'rent' && c.available && !soldIds.includes(c._id) && !rentedIds.includes(c._id));
      const sold = soldIds.map((id) => {
        const product = all.find(p => p._id === id);
        return product;
      }).filter((c) => c !== undefined) as Product[];
      const rented = rentedIds.map((id) => {
        const product = all.find(p => p._id === id);
        if (product) {
          const status = statuses.find((s) => s.costumeId === id);
          return { ...product, rentedUntil: status?.rentedUntil, rentedBy: status?.rentedBy };
        }
        return null;
      }).filter((c) => c !== null) as (Product & { rentedUntil?: string; rentedBy?: string })[];
      const hidden = all.filter((c) => !c.available);

      setAllCostumes(all);
      setSoldCostumes(sold);
      setRentedCostumes(rented);
    } catch (error) {
      toast.error('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce costume ?')) return;
    
    // Remove from localStorage custom products
    const customProducts = JSON.parse(localStorage.getItem('customCostumes') || '[]');
    const newCustom = customProducts.filter((c: Product) => c._id !== id);
    localStorage.setItem('customCostumes', JSON.stringify(newCustom));
    
    // Also remove from sold/rented lists
    removeCostumeFromPublic(id);
    
    toast.success('Costume supprimé');
    loadCostumes();
  };

  const handleEdit = (costume: Product) => {
    setEditingCostume(costume);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingCostume(null);
    loadCostumes();
  };

  const handleMarkAsSold = (costumeId: string) => {
    markCostumeAsSold(costumeId);
    toast.success('Costume marqué comme vendu');
    loadCostumes();
  };

  const handleConfirmReturn = (costumeId: string) => {
    confirmRentalReturn(costumeId);
    toast.success('Retour de location confirmé - Costume disponible');
    loadCostumes();
  };

  const handleRemoveFromPublic = (costumeId: string) => {
    removeCostumeFromPublic(costumeId);
    toast.success('Costume retiré du site public');
    loadCostumes();
  };

  const handleLogout = () => {
    removeAdminUser();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
    toast.success('Déconnexion réussie');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  const saleCostumes = allCostumes.filter((c) => c._id && c.type === 'sale' && !getSoldCostumeIds().includes(c._id) && !getRentedCostumeIds().includes(c._id));
  const rentCostumes = allCostumes.filter((c) => c._id && c.type === 'rent' && !getSoldCostumeIds().includes(c._id) && !getRentedCostumeIds().includes(c._id));

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">ADMIN DASHBOARD</h1>
            <p className="text-gray-400">Connecté en tant que: {getAdminUser()?.email}</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => {
                setEditingCostume(null);
                setShowForm(true);
              }}
              className="bg-white text-black px-6 py-3 rounded-lg font-bold hover:bg-gray-200 transition-colors flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Ajouter un produit
            </button>
            <button
              onClick={handleLogout}
              className="bg-gray-800 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-700 transition-colors flex items-center"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Déconnexion
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-900 p-6 rounded-lg">
              <p className="text-gray-400 mb-2">Total Costumes</p>
              <p className="text-3xl font-bold">{allCostumes.length}</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg">
              <p className="text-gray-400 mb-2">En Vente (Disponible)</p>
              <p className="text-3xl font-bold">{saleCostumes.length}</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg">
              <p className="text-gray-400 mb-2">En Location (Disponible)</p>
              <p className="text-3xl font-bold">{rentCostumes.length}</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg">
              <p className="text-gray-400 mb-2">Vendus / Loués</p>
              <p className="text-3xl font-bold">{soldCostumes.length + rentedCostumes.length}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-800">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('sale')}
              className={`pb-4 px-4 font-bold transition-colors ${
                activeTab === 'sale'
                  ? 'text-white border-b-2 border-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              COSTUMES EN VENTE ({saleCostumes.length})
            </button>
            <button
              onClick={() => setActiveTab('rent')}
              className={`pb-4 px-4 font-bold transition-colors ${
                activeTab === 'rent'
                  ? 'text-white border-b-2 border-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              COSTUMES EN LOCATION ({rentCostumes.length})
            </button>
            <button
              onClick={() => setActiveTab('sold')}
              className={`pb-4 px-4 font-bold transition-colors ${
                activeTab === 'sold'
                  ? 'text-white border-b-2 border-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              COSTUMES VENDUS ({soldCostumes.length})
            </button>
            <button
              onClick={() => setActiveTab('rented')}
              className={`pb-4 px-4 font-bold transition-colors ${
                activeTab === 'rented'
                  ? 'text-white border-b-2 border-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              COSTUMES LOUÉS ({rentedCostumes.length})
            </button>
          </div>
        </div>

        {/* Content based on active tab */}
        <div>
          {activeTab === 'sale' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Costumes en Vente (Disponibles)</h2>
              {saleCostumes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {saleCostumes.map((costume) => (
                    <AdminCostumeCard
                      key={costume._id}
                      costume={costume}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onMarkAsSold={() => costume._id && handleMarkAsSold(costume._id)}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-12">Aucun costume en vente disponible</p>
              )}
            </div>
          )}

          {activeTab === 'rent' && (
            <div> 
              <h2 className="text-2xl font-bold mb-6">Costumes en Location (Disponibles)</h2>
              {rentCostumes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rentCostumes.map((costume) => (
                    <AdminCostumeCard
                      key={costume._id}
                      costume={costume}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-12">Aucun costume en location disponible</p>
              )}
            </div>
          )}

          {activeTab === 'sold' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Costumes Vendus</h2>
              {soldCostumes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {soldCostumes.map((costume) => (
                    <AdminCostumeCard
                      key={costume._id}
                      costume={costume}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onRemoveFromPublic={() => costume._id && handleRemoveFromPublic(costume._id)}
                      status="sold"
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-12">Aucun costume vendu</p>
              )}
            </div>
          )}

          {activeTab === 'rented' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Costumes Actuellement Loués</h2>
              {rentedCostumes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rentedCostumes.map((costume) => (
                    <AdminRentedCard
                      key={costume._id}
                      costume={costume as Product & { rentedUntil?: string; rentedBy?: string }}
                      onConfirmReturn={() => costume._id && handleConfirmReturn(costume._id)}
                      onRemoveFromPublic={() => costume._id && handleRemoveFromPublic(costume._id)}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-12">Aucun costume actuellement loué</p>
              )}
            </div>
          )}

          {activeTab === 'hidden' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Costumes Masqués</h2>
              {hiddenCostumes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {hiddenCostumes.map((costume) => (
                    <AdminCostumeCard
                      key={costume._id}
                      costume={costume}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onShow={() => {
                        costume._id && showCostume(costume._id);
                        toast.success('Costume réactivé');
                        loadCostumes();
                      }}
                      status="hidden"
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-12">Aucun costume masqué</p>
              )}
            </div>
          )}
        </div>

        {showForm && (
          <ProductForm
            product={editingCostume as Product}
            onClose={handleFormClose}
          />
        )}
      </div>
    </div>
  );
}

// Admin Costume Card Component
function AdminCostumeCard({
  costume,
  onEdit,
  onDelete,
  onMarkAsSold,
  onRemoveFromPublic,
  onShow,
  status,
}: {
  costume: Product;
  onEdit: (costume: Product) => void;
  onDelete: (id: string) => void;
  onMarkAsSold?: () => void;
  onRemoveFromPublic?: () => void;
  onShow?: () => void;
  status?: 'sold' | 'rented' | 'hidden';
}) {
  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden">
      <div className="relative aspect-[3/4] bg-gray-800">
        <img
          src={costume.images[0] || 'https://via.placeholder.com/400x500/1a1a1a/ffffff?text=Costume'}
          alt={costume.name}
          className="w-full h-full object-cover"
        />
        {status === 'sold' && (
          <div className="absolute top-2 right-2">
            <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">VENDU</span>
          </div>
        )}
        {status === 'hidden' && (
          <div className="absolute top-2 right-2">
            <span className="bg-gray-600 text-white px-2 py-1 rounded text-xs font-bold">MASQUÉ</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{costume.name}</h3>
        <p className="text-gray-400 mb-4">
          {costume.type === 'sale' ? `${costume.price}€` : `${costume.rentPrice}€/jour`}
        </p>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => onEdit(costume)}
            className="flex-1 bg-white text-black py-2 px-4 rounded font-bold hover:bg-gray-200 transition-colors flex items-center justify-center text-sm"
          >
            <Edit className="w-4 h-4 mr-2" />
            Modifier
          </button>
          <button
            onClick={() => costume._id && onDelete(costume._id)}
            className="flex-1 bg-red-600 text-white py-2 px-4 rounded font-bold hover:bg-red-700 transition-colors flex items-center justify-center text-sm"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Supprimer
          </button>
          {onMarkAsSold && costume.type === 'sale' && (
            <button
              onClick={onMarkAsSold}
              className="w-full bg-yellow-600 text-white py-2 px-4 rounded font-bold hover:bg-yellow-700 transition-colors text-sm mt-2"
            >
              Marquer comme vendu
            </button>
          )}
          {onRemoveFromPublic && (
            <button
              onClick={onRemoveFromPublic}
              className="w-full bg-gray-700 text-white py-2 px-4 rounded font-bold hover:bg-gray-600 transition-colors text-sm mt-2"
            >
              Retirer du site public
            </button>
          )}
          {onShow && (
            <button
              onClick={onShow}
              className="w-full bg-green-600 text-white py-2 px-4 rounded font-bold hover:bg-green-700 transition-colors text-sm mt-2"
            >
              Réactiver le costume
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Admin Rented Card Component
function AdminRentedCard({
  costume,
  onConfirmReturn,
  onRemoveFromPublic,
}: {
  costume: Product & { rentedUntil?: string; rentedBy?: string };
  onConfirmReturn: () => void;
  onRemoveFromPublic: () => void;
}) {
  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden border-2 border-blue-600">
      <div className="relative aspect-[3/4] bg-gray-800">
        <img
          src={costume.images[0] || 'https://via.placeholder.com/400x500/1a1a1a/ffffff?text=Costume'}
          alt={costume.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">LOUÉ</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{costume.name}</h3>
        <p className="text-gray-400 mb-2">{costume.rentPrice}€/jour</p>
        {costume.rentedUntil && (
          <p className="text-sm text-gray-500 mb-2">
            Loué jusqu'au: {new Date(costume.rentedUntil).toLocaleDateString('fr-FR')}
          </p>
        )}
        {costume.rentedBy && (
          <p className="text-sm text-gray-500 mb-4">
            Client: {costume.rentedBy}
          </p>
        )}
        <div className="space-y-2">
          <button
            onClick={onConfirmReturn}
            className="w-full bg-green-600 text-white py-2 px-4 rounded font-bold hover:bg-green-700 transition-colors flex items-center justify-center"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Confirmer le retour
          </button>
          <button
            onClick={onRemoveFromPublic}
            className="w-full bg-gray-700 text-white py-2 px-4 rounded font-bold hover:bg-gray-600 transition-colors"
          >
            Retirer du site public
          </button>
        </div>
      </div>
    </div>
  );
}
