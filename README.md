# Cuvinte Banatene - Dictionary

A modern web dictionary for Banat words, built with React, Express, and TypeScript.

## Features

- 🔍 **Word Search** - Search words by name, definition, or description
- 📚 **Word Collection** - View a selection of words on the homepage
- 🔤 **Alphabetical Listing** - All words organized alphabetically
- 📖 **Word Details** - Detailed pages with definitions, examples, and additional information
- 🎨 **Modern Design** - Beautiful and responsive interface with shadcn/ui components
- 🚀 **Performance** - Fast and optimized application
- 👥 **User Management** - Authentication system with admin and contributor roles
- ❤️ **Appreciation System** - Heart-based liking system for words
- 📧 **Email Verification** - Secure user registration with email verification

## Technologies

### Frontend

- React 18
- TypeScript
- React Router
- Axios
- Vite
- Tailwind CSS
- shadcn/ui components
- Lucide React icons

### Backend

- Express.js
- TypeScript
- CORS
- Helmet
- SQLite database
- JWT authentication
- Email service integration

## Installation and Running

### Requirements

- Node.js (version 16 or newer)
- npm

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/dev-bomo/cuvinte-banatene.git
   cd cuvinte-banatene
   ```

2. **Install dependencies**

   ```bash
   npm run install:all
   ```

3. **Run the application in development mode**
   ```bash
   npm run dev
   ```

This command will start:

- Backend on port 5000
- Frontend on port 3000

### Available Commands

- `npm run dev` - Run frontend and backend in parallel
- `npm run dev:frontend` - Run only the frontend
- `npm run dev:backend` - Run only the backend
- `npm run build` - Build the application for production
- `npm run install:all` - Install all dependencies

## Project Structure

```
cuvinte-banatene/
├── backend/                 # Express.js Backend
│   ├── src/
│   │   ├── data/           # Word data
│   │   ├── routes/         # API routes
│   │   ├── models/         # Database models
│   │   ├── middleware/     # Authentication middleware
│   │   ├── services/       # Email services
│   │   └── index.ts        # Entry point
│   ├── package.json
│   └── tsconfig.json
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── ui/         # shadcn/ui components
│   │   │   └── ...
│   │   ├── pages/          # Application pages
│   │   ├── services/       # API services
│   │   ├── contexts/       # React contexts
│   │   └── main.tsx        # Entry point
│   ├── package.json
│   └── vite.config.ts
├── shared/                 # Shared TypeScript types
│   └── types.ts
└── package.json           # Main configuration
```

## API Endpoints

### Words

- `GET /api/words` - Get all words (with pagination)
- `GET /api/words/alphabetical` - Get words in alphabetical order
- `GET /api/words/:id` - Get a specific word
- `POST /api/words` - Create a new word (admin only)
- `PUT /api/words/:id` - Update a word (admin only)
- `DELETE /api/words/:id` - Delete a word (admin only)

### Search

- `GET /api/search?q=query` - Search words

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-email` - Email verification

### Users

- `GET /api/users` - Get all users (admin only)
- `POST /api/users` - Create new user (admin only)
- `PUT /api/users/:id` - Update user (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)

### Smiles

- `POST /api/smiles/:wordId` - Add smile to word
- `DELETE /api/smiles/:wordId` - Remove smile from word
- `GET /api/smiles/user` - Get user's smiled words

### Health Check

- `GET /api/health` - Check server status

## Development

To add new words, you can use the admin interface or edit the database directly. The application includes a comprehensive admin panel for word management.

Word structure:

```typescript
{
  id: string;
  word: string;
  definition: string;
  shortDescription: string;
  category?: string;
  origin?: string;
  examples?: string[];
  pronunciation?: string;
  smileCount: number;
  createdAt: Date;
  updatedAt: Date;
}
```

## User Roles

- **Admin**: Full access to all features, can manage words and users
- **Contributor**: Can add and edit words, limited user management
- **Guest**: Can view words and search, limited functionality

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a branch for your feature
3. Make your changes
4. Submit a pull request

## License

MIT License

---

# Cuvinte Banatene - Dicționar

Un dicționar web modern pentru cuvintele din Banat, construit cu React, Express și TypeScript.

## Funcționalități

- 🔍 **Căutare de cuvinte** - Caută cuvinte după nume, definiție sau descriere
- 📚 **Colecție de cuvinte** - Vezi o selecție de cuvinte pe pagina principală
- 🔤 **Listare alfabetică** - Toate cuvintele organizate alfabetic
- 📖 **Detalii cuvinte** - Pagini detaliate cu definiții, exemple și informații suplimentare
- 🎨 **Design modern** - Interfață plăcută și responsivă cu componente shadcn/ui
- 🚀 **Performanță** - Aplicație rapidă și optimizată
- 👥 **Gestionare utilizatori** - Sistem de autentificare cu roluri de admin și contributor
- ❤️ **Sistem de apreciere** - Sistem de apreciere bazat pe inimi pentru cuvinte
- 📧 **Verificare email** - Înregistrare sigură cu verificare email

## Tehnologii

### Frontend

- React 18
- TypeScript
- React Router
- Axios
- Vite
- Tailwind CSS
- Componente shadcn/ui
- Iconițe Lucide React

### Backend

- Express.js
- TypeScript
- CORS
- Helmet
- Baza de date SQLite
- Autentificare JWT
- Integrare serviciu email

## Instalare și rulare

### Cerințe

- Node.js (versiunea 16 sau mai nouă)
- npm

### Pași de instalare

1. **Clonează repository-ul**

   ```bash
   git clone https://github.com/dev-bomo/cuvinte-banatene.git
   cd cuvinte-banatene
   ```

2. **Instalează dependențele**

   ```bash
   npm run install:all
   ```

3. **Rulează aplicația în modul dezvoltare**
   ```bash
   npm run dev
   ```

Această comandă va porni:

- Backend-ul pe portul 5000
- Frontend-ul pe portul 3000

### Comenzi disponibile

- `npm run dev` - Rulează frontend și backend în paralel
- `npm run dev:frontend` - Rulează doar frontend-ul
- `npm run dev:backend` - Rulează doar backend-ul
- `npm run build` - Construiește aplicația pentru producție
- `npm run install:all` - Instalează toate dependențele

## Structura proiectului

```
cuvinte-banatene/
├── backend/                 # Backend Express.js
│   ├── src/
│   │   ├── data/           # Datele cuvintelor
│   │   ├── routes/         # Rutele API
│   │   ├── models/         # Modelele bazei de date
│   │   ├── middleware/     # Middleware de autentificare
│   │   ├── services/       # Servicii email
│   │   └── index.ts        # Punctul de intrare
│   ├── package.json
│   └── tsconfig.json
├── frontend/               # Frontend React
│   ├── src/
│   │   ├── components/     # Componente React
│   │   │   ├── ui/         # Componente shadcn/ui
│   │   │   └── ...
│   │   ├── pages/          # Paginile aplicației
│   │   ├── services/       # Servicii API
│   │   ├── contexts/       # Contexturi React
│   │   └── main.tsx        # Punctul de intrare
│   ├── package.json
│   └── vite.config.ts
├── shared/                 # Tipuri TypeScript partajate
│   └── types.ts
└── package.json           # Configurația principală
```

## API Endpoints

### Cuvinte

- `GET /api/words` - Obține toate cuvintele (cu paginare)
- `GET /api/words/alphabetical` - Obține cuvintele în ordine alfabetică
- `GET /api/words/:id` - Obține un cuvânt specific
- `POST /api/words` - Creează un cuvânt nou (doar admin)
- `PUT /api/words/:id` - Actualizează un cuvânt (doar admin)
- `DELETE /api/words/:id` - Șterge un cuvânt (doar admin)

### Căutare

- `GET /api/search?q=query` - Caută cuvinte

### Autentificare

- `POST /api/auth/register` - Înregistrare utilizator
- `POST /api/auth/login` - Autentificare utilizator
- `POST /api/auth/verify-email` - Verificare email

### Utilizatori

- `GET /api/users` - Obține toți utilizatorii (doar admin)
- `POST /api/users` - Creează utilizator nou (doar admin)
- `PUT /api/users/:id` - Actualizează utilizator (doar admin)
- `DELETE /api/users/:id` - Șterge utilizator (doar admin)

### Zâmbete

- `POST /api/smiles/:wordId` - Adaugă zâmbet la cuvânt
- `DELETE /api/smiles/:wordId` - Elimină zâmbet de la cuvânt
- `GET /api/smiles/user` - Obține cuvintele la care utilizatorul a zâmbit

### Health Check

- `GET /api/health` - Verifică starea serverului

## Dezvoltare

Pentru a adăuga cuvinte noi, poți folosi interfața de admin sau edita direct baza de date. Aplicația include un panou de administrare cuprinzător pentru gestionarea cuvintelor.

Structura unui cuvânt:

```typescript
{
  id: string;
  word: string;
  definition: string;
  shortDescription: string;
  category?: string;
  origin?: string;
  examples?: string[];
  pronunciation?: string;
  smileCount: number;
  createdAt: Date;
  updatedAt: Date;
}
```

## Roluri utilizatori

- **Admin**: Acces complet la toate funcționalitățile, poate gestiona cuvinte și utilizatori
- **Contributor**: Poate adăuga și edita cuvinte, gestionare limitată a utilizatorilor
- **Guest**: Poate vizualiza cuvinte și căuta, funcționalitate limitată

## Contribuții

Contribuțiile sunt binevenite! Pentru a contribui:

1. Fork repository-ul
2. Creează o ramură pentru funcționalitatea ta
3. Fă modificările
4. Trimite un pull request

## Licență

MIT License