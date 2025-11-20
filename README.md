# Costume Store - Full-Stack E-commerce

Application full-stack pour la vente et la location de costumes, construite avec Next.js, TypeScript, MongoDB et Tailwind CSS.

## Fonctionnalités

### Client
- ✅ Page d'accueil avec affichage de tous les costumes
- ✅ Filtres par taille, couleur et type (vente/location)
- ✅ Séparation des costumes en vente et en location
- ✅ Page de détail avec toutes les informations (veste, pantalon, chemise, cravate, ceinture)
- ✅ Ajout au panier
- ✅ Bouton "Contacter le propriétaire" avec lien WhatsApp automatique
- ✅ Panier avec résumé et commande via WhatsApp
- ✅ Système d'authentification (login/register)

### Admin
- ✅ Dashboard admin avec statistiques
- ✅ CRUD complet pour les costumes
- ✅ Gestion séparée des costumes en vente et en location
- ✅ Interface de gestion intuitive

### Design
- ✅ Design dark theme inspiré de Jules
- ✅ Interface moderne et épurée
- ✅ Responsive pour mobile et desktop
- ✅ Grille de produits optimisée

## Technologies

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB avec Mongoose
- **Authentication**: JWT
- **UI**: Lucide React Icons, React Hot Toast

## Installation

1. **Cloner le projet**
```bash
git clone <repository-url>
cd costume-store
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**
```bash
cp .env.local.example .env.local
```

Éditer `.env.local` et configurer:
```env
MONGODB_URI=mongodb://localhost:27017/costume-store
NEXTAUTH_SECRET=your-secret-key-here
JWT_SECRET=your-jwt-secret-here
NEXT_PUBLIC_WHATSAPP_NUMBER=+33123456789
```

4. **Démarrer MongoDB**
Assurez-vous que MongoDB est en cours d'exécution sur votre machine.

5. **Lancer le serveur de développement**
```bash
npm run dev
```

6. **Ouvrir dans le navigateur**
```
http://localhost:3000
```

## Structure du Projet

```
costume-store/
├── app/
│   ├── api/              # API Routes
│   │   ├── auth/         # Authentication
│   │   └── costumes/      # CRUD Costumes
│   ├── admin/            # Admin Dashboard
│   ├── cart/              # Shopping Cart
│   ├── costume/[id]/      # Costume Detail
│   ├── login/             # Auth Pages
│   └── page.tsx           # Home Page
├── components/
│   ├── admin/             # Admin Components
│   └── ...                # Shared Components
├── lib/                   # Utilities
├── models/                # MongoDB Models
└── public/                # Static Files
```

## Utilisation

### Seed la base de données

Pour créer des données de test (costumes et compte admin):

```bash
npm run seed
```

Cela créera:
- 10 costumes d'exemple (mix de vente et location) pour tester le site
- Un compte admin:
  - Email: `admin@costume-store.com`
  - Password: `admin123`

### Créer un compte admin manuellement

1. S'inscrire via `/login`
2. Modifier manuellement dans MongoDB pour changer le rôle en `admin`:
```javascript
db.users.updateOne(
  { email: "votre@email.com" },
  { $set: { role: "admin" } }
)
```

### Ajouter des costumes

1. Se connecter en tant qu'admin
2. Accéder au dashboard `/admin`
3. Cliquer sur "Ajouter un costume"
4. Remplir le formulaire avec tous les détails
5. Sauvegarder

### Contact WhatsApp

Le bouton "Contacter le propriétaire" ouvre automatiquement WhatsApp avec:
- Le numéro configuré dans `NEXT_PUBLIC_WHATSAPP_NUMBER`
- Un message pré-rempli avec le nom du costume et le lien

## Scripts

- `npm run dev` - Démarre le serveur de développement
- `npm run build` - Build pour la production
- `npm run start` - Démarre le serveur de production
- `npm run lint` - Lance ESLint

## Notes

- Les images utilisent des placeholders par défaut. Remplacez-les par vos propres URLs d'images.
- Le panier est stocké dans localStorage (côté client).
- Pour la production, configurez correctement les variables d'environnement et utilisez une base de données MongoDB sécurisée.

## License

MIT

