'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { verifyAdminCredentials, isAdminEmail, setAdminUser } from '@/lib/admin-auth';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check if admin login
      if (isLogin && isAdminEmail(formData.email)) {
        if (verifyAdminCredentials(formData.email, formData.password)) {
          setAdminUser({
            email: formData.email,
            name: 'Admin',
            role: 'admin',
          });
          toast.success('Connexion admin réussie');
          router.push('/admin');
          setLoading(false);
          return;
        } else {
          toast.error('Mot de passe incorrect');
          setLoading(false);
          return;
        }
      }

      // Regular user login/register (with API if available)
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const body = isLogin
        ? { email: formData.email, password: formData.password }
        : formData;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        toast.success(isLogin ? 'Connexion réussie' : 'Inscription réussie');
        
        // Redirect based on role
        if (data.data.user.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/');
        }
      } else {
        toast.error(data.error || 'Une erreur est survenue');
      }
    } catch (error) {
      // If API fails, allow admin login only
      if (isLogin && isAdminEmail(formData.email)) {
        if (verifyAdminCredentials(formData.email, formData.password)) {
          setAdminUser({
            email: formData.email,
            name: 'Admin',
            role: 'admin',
          });
          toast.success('Connexion admin réussie');
          router.push('/admin');
        } else {
          toast.error('Mot de passe incorrect');
        }
      } else {
        toast.error('Une erreur est survenue');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-4xl font-bold">
            {isLogin ? 'CONNEXION' : 'INSCRIPTION'}
          </h2>
          <p className="mt-2 text-center text-gray-400">
            {isLogin
              ? 'Connectez-vous à votre compte'
              : 'Créez un nouveau compte'}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {!isLogin && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Nom
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required={!isLogin}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-white"
                placeholder="Votre nom"
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-white"
              placeholder="votre@email.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-white"
              placeholder="••••••••"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black py-3 px-4 rounded-lg font-bold hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              {loading
                ? 'Chargement...'
                : isLogin
                ? 'Se connecter'
                : "S'inscrire"}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setFormData({ name: '', email: '', password: '' });
              }}
              className="text-gray-400 hover:text-white"
            >
              {isLogin
                ? "Pas de compte ? S'inscrire"
                : 'Déjà un compte ? Se connecter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

