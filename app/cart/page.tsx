'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { markCostumeAsSold, markCostumeAsRented } from '@/lib/costume-storage';

interface CartItem {
  costumeId: string;
  costumeName: string;
  type: 'sale' | 'rent';
  price: number;
  image: string;
  quantity: number;
}

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    loadCart();
    window.addEventListener('cartUpdated', loadCart);
    return () => window.removeEventListener('cartUpdated', loadCart);
  }, []);

  const loadCart = () => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);
  };

  const removeItem = (index: number) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    toast.success('Article retiré du panier');
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity < 1) {
      removeItem(index);
      return;
    }
    const newCart = [...cart];
    newCart[index].quantity = quantity;
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

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

        <h1 className="text-4xl font-bold mb-8">PANIER</h1>

        {cart.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="w-24 h-24 mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400 text-xl mb-4">Votre panier est vide</p>
            <Link
              href="/"
              className="inline-block bg-white text-black px-6 py-3 rounded-lg font-bold hover:bg-gray-200 transition-colors"
            >
              Continuer les achats
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-900 rounded-lg p-6 flex gap-6"
                >
                  <Link href={`/costume/${item.costumeId}`}>
                    <div className="relative w-32 h-40 bg-gray-800 rounded overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image || 'https://via.placeholder.com/200x300/1a1a1a/ffffff?text=Costume'}
                        alt={item.costumeName}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </Link>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <Link href={`/costume/${item.costumeId}`}>
                          <h3 className="text-xl font-semibold hover:text-gray-400">
                            {item.costumeName}
                          </h3>
                        </Link>
                        <p className="text-gray-400 text-sm mt-1">
                          {item.type === 'sale' ? 'Vente' : 'Location'}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(index)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-400">Quantité:</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(index, item.quantity - 1)}
                            className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center hover:bg-gray-700"
                          >
                            -
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(index, item.quantity + 1)}
                            className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center hover:bg-gray-700"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="text-xl font-bold">
                        {item.price * item.quantity}€
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-900 rounded-lg p-6 sticky top-24">
                <h2 className="text-2xl font-bold mb-6">Résumé</h2>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Sous-total</span>
                    <span className="font-semibold">{total}€</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Livraison</span>
                    <span className="font-semibold">Gratuite</span>
                  </div>
                  <div className="border-t border-gray-700 pt-4">
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total</span>
                      <span>{total}€</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+33123456789';
                    const items = cart.map(item => `- ${item.costumeName} (${item.type === 'sale' ? 'Vente' : 'Location'}) x${item.quantity}`).join('\n');
                    const message = encodeURIComponent(
                      `Bonjour, je souhaite commander:\n\n${items}\n\nTotal: ${total}€`
                    );
                    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${message}`;
                    window.open(whatsappUrl, '_blank');
                    
                    // Mark as sold/rented when ordering
                    cart.forEach((item: any) => {
                      if (item.type === 'sale') {
                        markCostumeAsSold(item.costumeId);
                      } else {
                        const rentedUntil = new Date();
                        rentedUntil.setDate(rentedUntil.getDate() + 7); // 7 days default
                        markCostumeAsRented(item.costumeId, rentedUntil.toISOString(), 'Client WhatsApp');
                      }
                    });
                    // Clear cart
                    localStorage.setItem('cart', '[]');
                    window.dispatchEvent(new Event('cartUpdated'));
                  }}
                  className="w-full bg-green-600 text-white py-4 px-6 rounded-lg font-bold hover:bg-green-700 transition-colors"
                >
                  Commander via WhatsApp
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

