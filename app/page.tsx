'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Filter, X } from 'lucide-react';
import CostumeCard from '@/components/CostumeCard';
import FilterPanel from '@/components/FilterPanel';
import { type Costume } from '@/data/costumes';
import { getAvailableCostumes, getSoldCostumeIds, getRentedCostumeIds, hideCostume, markCostumeAsRented } from '@/lib/costume-storage';
import { isAdminLoggedIn } from '@/lib/admin-auth';
import { EyeOff, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

export default function HomePage() {
  const searchParams = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [filters, setFilters] = useState({
    type: searchParams.get('type') || '',
    category: '',
    size: '',
    color: '',
  });

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setIsAdmin(isAdminLoggedIn());
    
    // Listen for costume status changes
    const handleStatusChange = () => {
      setRefreshKey(prev => prev + 1);
    };
    
    window.addEventListener('costumeStatusChanged', handleStatusChange);
    return () => window.removeEventListener('costumeStatusChanged', handleStatusChange);
  }, []);

  // Filter costumes based on selected filters
  const costumes = useMemo(() => {
    // Get available costumes (only admin-added costumes)
    let filtered = getAvailableCostumes();

    if (filters.type) {
      filtered = filtered.filter(c => c.type === filters.type);
    }

    if (filters.category) {
      filtered = filtered.filter(c => (c as any).category === filters.category);
    }

    if (filters.size) {
      filtered = filtered.filter(c => c.size.includes(filters.size));
    }

    if (filters.color) {
      filtered = filtered.filter(c => c.color.includes(filters.color));
    }

    return filtered;
  }, [filters, refreshKey]);

  const handleHideCostume = (costumeId: string) => {
    hideCostume(costumeId);
    toast.success('Costume masqué du site');
  };

  const handleMarkAsRented = (costumeId: string) => {
    const rentedUntil = new Date();
    rentedUntil.setDate(rentedUntil.getDate() + 7); // Default 7 days
    markCostumeAsRented(costumeId, rentedUntil.toISOString(), 'Admin');
    toast.success('Costume marqué comme loué');
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ type: '', category: '', size: '', color: '' });
  };

  const saleCostumes = costumes.filter((c) => c.type === 'sale');
  const rentCostumes = costumes.filter((c) => c.type === 'rent');

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-gray-900 to-black py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            COSTUMES DE QUALITÉ
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Vente et Location - Des costumes pour toutes vos occasions
          </p>
        </div>
      </div>

      {/* Filters Button - Mobile */}
      <div className="md:hidden sticky top-16 z-40 bg-black border-b border-gray-800">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full px-4 py-3 flex items-center justify-between text-white"
        >
          <span className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filtres
          </span>
          {showFilters ? <X className="w-5 h-5" /> : null}
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filter Sidebar - Desktop */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <FilterPanel
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
            />
          </aside>

          {/* Filter Panel - Mobile */}
          {showFilters && (
            <div className="fixed inset-0 bg-black z-50 md:hidden">
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Filtres</h2>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-2"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <FilterPanel
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onClearFilters={clearFilters}
                />
              </div>
            </div>
          )}

          {/* Main Content */}
          <main className="flex-1">
            <>
              {/* Sale Section */}
              {(!filters.type || filters.type === 'sale') && (
                <section className="mb-12">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold">EN VENTE</h2>
                    <span className="text-gray-400">
                      {costumes.filter(c => c.type === 'sale').length} costume{costumes.filter(c => c.type === 'sale').length > 1 ? 's' : ''}
                    </span>
                  </div>
                  {costumes.filter(c => c.type === 'sale').length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {costumes.filter(c => c.type === 'sale').map((costume) => (
                        <div key={costume._id} className="relative group">
                          <CostumeCard costume={costume} />
                          {isAdmin && (
                            <div className="absolute top-2 right-2 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleHideCostume(costume._id);
                                }}
                                className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors shadow-lg"
                                title="Masquer le costume"
                              >
                                <EyeOff className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-center py-12">
                      Aucun costume en vente disponible
                    </p>
                  )}
                </section>
              )}

              {/* Rent Section */}
              {(!filters.type || filters.type === 'rent') && (
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold">EN LOCATION</h2>
                    <span className="text-gray-400">
                      {costumes.filter(c => c.type === 'rent').length} costume{costumes.filter(c => c.type === 'rent').length > 1 ? 's' : ''}
                    </span>
                  </div>
                  {costumes.filter(c => c.type === 'rent').length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {costumes.filter(c => c.type === 'rent').map((costume) => (
                        <div key={costume._id} className="relative group">
                          <CostumeCard costume={costume} />
                          {isAdmin && (
                            <div className="absolute top-2 right-2 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleHideCostume(costume._id);
                                }}
                                className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors shadow-lg"
                                title="Masquer le costume"
                              >
                                <EyeOff className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleMarkAsRented(costume._id);
                                }}
                                className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors shadow-lg"
                                title="Marquer comme loué"
                              >
                                <Calendar className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-center py-12">
                      Aucun costume en location disponible
                    </p>
                  )}
                </section>
              )}
            </>
          </main>
        </div>
      </div>
    </div>
  );
}

