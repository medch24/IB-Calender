# Calendrier des Évaluations – KIS (PEI/DP)

Application web pour gérer le calendrier des évaluations critériées pour Kawthar International School.

## 🚀 Fonctionnalités

- ✅ Interface séparée par classe (PEI1-5, DP1-2)
- ✅ Ajout/Suppression d'évaluations critériées
- ✅ Génération de documents Word professionnels
- ✅ Sauvegarde dans MongoDB
- ✅ Design moderne conforme aux standards IB

## 📦 Installation

### Prérequis
- Node.js (v14 ou supérieur)
- MongoDB Atlas (compte gratuit)
- Git

### Étapes d'installation

1. **Cloner le dépôt**
```bash
git clone https://github.com/medch24/IB-Calender.git
cd IB-Calender
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer MongoDB**
   - Créez un compte sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Créez un cluster gratuit
   - Créez un utilisateur de base de données
   - Obtenez votre URI de connexion

4. **Configurer les variables d'environnement**
   - Copiez le fichier `.env.example` en `.env`
   - Remplacez `MONGODB_URI` par votre URI MongoDB

```env
MONGODB_URI=mongodb+srv://votre_username:votre_password@cluster.mongodb.net/ib-calendar?retryWrites=true&w=majority
PORT=3000
```

5. **Lancer l'application localement**
```bash
npm start
```

L'application sera accessible sur `http://localhost:3000`

## 🌐 Déploiement sur Vercel

### Option 1 : Via GitHub (Recommandé)

1. Connectez votre compte GitHub à Vercel
2. Importez le dépôt `IB-Calender`
3. Ajoutez les variables d'environnement dans Vercel :
   - `MONGODB_URI` : Votre URI MongoDB
4. Déployez !

### Option 2 : Via CLI Vercel

```bash
npm install -g vercel
vercel login
vercel --prod
```

Lors du déploiement, ajoutez la variable d'environnement :
```bash
vercel env add MONGODB_URI
```

## 📝 Configuration MongoDB

### Étapes détaillées

1. **Créer un compte MongoDB Atlas**
   - Allez sur https://www.mongodb.com/cloud/atlas/register
   - Créez un compte gratuit

2. **Créer un cluster**
   - Choisissez le plan gratuit (M0)
   - Sélectionnez une région proche (ex: Europe - France)
   - Cliquez sur "Create Cluster"

3. **Créer un utilisateur**
   - Allez dans "Database Access"
   - Cliquez sur "Add New Database User"
   - Choisissez "Password" comme méthode d'authentification
   - Notez le nom d'utilisateur et le mot de passe

4. **Configurer l'accès réseau**
   - Allez dans "Network Access"
   - Cliquez sur "Add IP Address"
   - Choisissez "Allow Access from Anywhere" (0.0.0.0/0)
   - Pour Vercel, c'est nécessaire

5. **Obtenir l'URI de connexion**
   - Retournez sur "Clusters"
   - Cliquez sur "Connect"
   - Choisissez "Connect your application"
   - Copiez l'URI (format: `mongodb+srv://...`)
   - Remplacez `<password>` par votre mot de passe
   - Remplacez `myFirstDatabase` par `ib-calendar`

Exemple d'URI :
```
mongodb+srv://username:password123@cluster0.xxxxx.mongodb.net/ib-calendar?retryWrites=true&w=majority
```

## 🛠️ Technologies

- **Frontend** : HTML5, CSS3, JavaScript (Vanilla)
- **Backend** : Node.js, Express.js
- **Base de données** : MongoDB Atlas
- **Hébergement** : Vercel (Serverless)
- **Génération Word** : HTML/CSS exportable

## 📖 Utilisation

### Ajouter une évaluation

1. Sélectionnez une classe dans le menu déroulant
2. Cliquez sur "+ Ajouter une évaluation" dans la semaine souhaitée
3. Remplissez le formulaire :
   - Matière
   - Unité/Thème
   - Critère (A, B, C ou D)
4. Cliquez sur "Enregistrer et Ajouter une Autre Évaluation"

### Générer un document Word

1. Sélectionnez la classe
2. Cliquez sur le bouton "Générer Word" en haut à droite
3. Le document HTML sera téléchargé
4. Ouvrez-le avec Microsoft Word
5. Enregistrez-le au format .docx si nécessaire

### Supprimer une évaluation

1. Cliquez sur le bouton "✖" sur l'évaluation
2. Confirmez la suppression

## 🎨 Personnalisation

Les couleurs et styles peuvent être modifiés dans `public/style.css` :

```css
:root {
  --blue: #1a3c8e;          /* Couleur principale IB */
  --orange: #ff9f40;        /* Couleur d'accentuation */
  --grey-bg: #f5f6fa;       /* Fond de l'application */
  /* ... autres variables ... */
}
```

## 🐛 Résolution de problèmes

### Erreur de connexion MongoDB

- Vérifiez que l'URI est correcte
- Assurez-vous que l'IP est autorisée (0.0.0.0/0 pour Vercel)
- Vérifiez le nom d'utilisateur et mot de passe

### Erreur 500 sur Vercel

- Vérifiez les variables d'environnement dans Vercel
- Consultez les logs Vercel pour plus de détails

### Les évaluations ne s'affichent pas

- Ouvrez la console du navigateur (F12)
- Vérifiez les erreurs réseau
- Assurez-vous que l'API répond correctement

## 📄 Structure du projet

```
IB-Calender/
├── public/              # Fichiers frontend
│   ├── index.html      # Interface principale
│   ├── style.css       # Styles
│   └── script.js       # Logique client
├── index.js            # Serveur Express + API
├── package.json        # Dépendances
├── vercel.json         # Configuration Vercel
├── .env               # Variables d'environnement (local)
├── .gitignore         # Fichiers ignorés par Git
└── README.md          # Documentation
```

## 🤝 Contribution

Les contributions sont les bienvenues !

1. Fork le projet
2. Créez une branche (`git checkout -b feature/amélioration`)
3. Committez vos changements (`git commit -m 'Ajout d'une fonctionnalité'`)
4. Poussez vers la branche (`git push origin feature/amélioration`)
5. Ouvrez une Pull Request

## 📧 Contact

Pour toute question ou problème :
- GitHub Issues : https://github.com/medch24/IB-Calender/issues
- Email : [votre email]

## 📜 Licence

Ce projet est sous licence MIT.

---

**Kawthar International School (KIS)**
Programme d'Éducation Intermédiaire (PEI) & Programme du Diplôme (DP)
