# Cuvinte Banatene - Dicționar

Un dicționar web modern pentru cuvintele din Banat, construit cu React, Express și TypeScript.

## Funcționalități

- 🔍 **Căutare de cuvinte** - Caută cuvinte după nume, definiție sau descriere
- 📚 **Colecție de cuvinte** - Vezi o selecție de cuvinte pe pagina principală
- 🔤 **Listare alfabetică** - Toate cuvintele organizate alfabetic
- 📖 **Detalii cuvinte** - Pagini detaliate cu definiții, exemple și informații suplimentare
- 🎨 **Design modern** - Interfață plăcută și responsivă
- 🚀 **Performanță** - Aplicație rapidă și optimizată

## Tehnologii

### Frontend

- React 18
- TypeScript
- React Router
- Axios
- Vite

### Backend

- Express.js
- TypeScript
- CORS
- Helmet

## Instalare și rulare

### Cerințe

- Node.js (versiunea 16 sau mai nouă)
- npm

### Pași de instalare

1. **Clonează repository-ul**

   ```bash
   git clone <repository-url>
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
│   │   └── index.ts        # Punctul de intrare
│   ├── package.json
│   └── tsconfig.json
├── frontend/               # Frontend React
│   ├── src/
│   │   ├── components/     # Componente React
│   │   ├── pages/          # Paginile aplicației
│   │   ├── services/       # Servicii API
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

### Căutare

- `GET /api/search?q=query` - Caută cuvinte

### Health Check

- `GET /api/health` - Verifică starea serverului

## Dezvoltare

Pentru a adăuga cuvinte noi, editează fișierul `backend/src/data/words.ts` și adaugă obiecte noi în array-ul `sampleWords`.

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
  createdAt: Date;
  updatedAt: Date;
}
```

## Contribuții

Contribuțiile sunt binevenite! Pentru a contribui:

1. Fork repository-ul
2. Creează o ramură pentru funcționalitatea ta
3. Fă modificările
4. Trimite un pull request

## Licență

MIT License


