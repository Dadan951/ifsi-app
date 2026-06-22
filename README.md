# NursesPrep

Plateforme de révision en ligne pour les étudiants en IFSI (Institut de Formation en Soins Infirmiers).  
Quiz, flashcards, exercices, fiches de révision et suivi de progression — organisés par semestre, UE et chapitre.

**Production** → [www.nursesprep.fr](https://www.nursesprep.fr)

---

## Stack technique

| Côté | Technologies |
|---|---|
| Frontend | React 18, React Router, Framer Motion, Tailwind CSS |
| Backend | Node.js, Express.js |
| Base de données | MongoDB Atlas (Mongoose) |
| Auth | JWT, bcryptjs, Google OAuth 2.0 (passport) |
| Paiement | Stripe |
| Email | Nodemailer, Resend |
| IA | Anthropic SDK (génération de quiz et fiches) |
| Déploiement | Railway (backend), Vercel (frontend) |

---

## Structure du projet

```
ifsi-app/
├── backend/
│   ├── controllers/       # Logique métier (auth, quiz, flashcards…)
│   ├── middleware/        # protect, adminOnly, requirePlan
│   ├── models/            # Schémas Mongoose (User, Quiz, Flashcard…)
│   ├── routes/            # Routes Express
│   ├── seeds/             # Données initiales (quiz S1, flashcards…)
│   └── server.js          # Point d'entrée
└── frontend/
    └── src/
        ├── components/    # Composants réutilisables
        ├── context/       # AuthContext, ThemeContext
        └── pages/         # Pages (Dashboard, Quiz, Flashcards, Admin…)
```

---

## Variables d'environnement

### Backend (Railway)

```env
MONGO_URI=
JWT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
FRONTEND_URL=https://www.nursesprep.fr
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
RESEND_API_KEY=
EMAIL_FROM=
ANTHROPIC_API_KEY=
VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
```

### Frontend (Vercel)

```env
REACT_APP_API_URL=https://api.nursesprep.fr/api
```

---

## Lancer en local

```bash
# Backend
cd backend
npm install
cp .env.example .env   # remplir les variables
node server.js

# Frontend (autre terminal)
cd frontend
npm install
npm start
```

---

## Fonctionnalités

- **Quiz** — catalogue organisé par semestre → UE → chapitre, avec suivi de progression
- **Flashcards** — cartes de révision avec système de mémorisation
- **Exercices** — QCM et cas cliniques
- **Fiches de révision** — synthèses générées par IA
- **Annales** — sujets des années précédentes
- **Bibliothèque médicaments** — base de données médicamenteuse intégrée
- **Génération IA** — quiz et fiches personnalisés via Claude (Anthropic)
- **Abonnements** — plan gratuit (10 quiz/mois), étudiant et premium via Stripe
- **Google OAuth** — connexion avec un compte Google
- **Espace admin** — gestion des quiz, flashcards, utilisateurs, tickets
- **Notifications push** — rappels de révision
- **Suivi de progression** — statistiques, streak, objectifs quotidiens
- **Groupes** — espaces d'échange entre étudiants

---

## Déploiement

Le backend est déployé sur **Railway** (redéploiement automatique sur push `main`).  
Le frontend est déployé sur **Vercel** (build automatique sur push `main`).

---

## Contenu pédagogique — Semestre 1

| UE | Intitulé | Chapitres |
|---|---|---|
| UE 1.1 | Psychologie, sociologie, anthropologie | 5 |
| UE 1.3 | Législation, éthique, déontologie | 5 |
| UE 2.1 | Biologie fondamentale | 5 |
| UE 2.2 | Cycles de la vie et grandes fonctions | 5 |
| UE 2.10 | Infectiologie et hygiène | 5 |
| UE 2.11 | Pharmacologie et thérapeutiques | 5 |
| UE 3.1 | Raisonnement et démarche clinique infirmière | 4 |
| UE 4.1 | Soins de confort et de bien-être | 5 |
| UE 6.1 | Méthodes de travail et TIC | 5 |

180 quiz · 1 440 questions au total pour le Semestre 1.
