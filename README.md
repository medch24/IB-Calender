# 📅 Calendrier des Évaluations - KIS

Application complète de gestion du calendrier des évaluations pour Kawthar International School.

## 🎯 Fonctionnalités

- ✅ **Gestion par classe** : PEI 1-5, DP 1-2
- ✅ **7 matières** : Français LL, Anglais AL, Mathématiques, Sciences, IS, Arts, Design
- ✅ **39 semaines** avec types spéciaux (Orientation, Vacances, Examens)
- ✅ **Ajout/Suppression** d'évaluations (Unité + Critère)
- ✅ **Filtrage par matière** avec onglets
- ✅ **Export** : ZIP, Matière actuelle, Document complet
- ✅ **Design traditionnel** Al Kawthar (blanc/gris, logo centré)
- ✅ **Base de données MongoDB** pour sauvegarde persistante

## 📁 Structure (6 fichiers essentiels)

```
├── api/
│   └── index.js          # Backend Express + MongoDB
├── public/
│   ├── index.html        # Interface utilisateur
│   ├── style.css         # Design traditionnel
│   └── script.js         # Fonctionnalités JavaScript
├── package.json          # Dépendances
└── vercel.json           # Configuration Vercel
```

## 🚀 Déploiement Vercel

### 1️⃣ Configurer MongoDB URI

**Allez sur** : https://vercel.com/votre-compte/ib-calender

**Settings** → **Environment Variables** → **Add New**

**Key** : `MONGODB_URI`

**Value** :
```
mongodb+srv://mohamedsherif2025:Mmedch86@ibcalender.zusslxh.mongodb.net/ib-calendar?retryWrites=true&w=majority&appName=ibcalender
```

**Cochez** : ✅ Production, ✅ Preview, ✅ Development

**Cliquez** : **Save**

### 2️⃣ Redéployer

**Deployments** → Dernier déploiement → `...` → **Redeploy**

### 3️⃣ Vérifier les logs

Après 2-3 minutes, dans **View Function Logs**, vous devriez voir :

```
✅ CONNEXION MONGODB RÉUSSIE
📊 Base de données prête
```

## 💻 Développement Local

### Installation

```bash
npm install
```

### Configuration

Créez un fichier `.env` :

```env
MONGODB_URI=mongodb+srv://mohamedsherif2025:Mmedch86@ibcalender.zusslxh.mongodb.net/ib-calendar?retryWrites=true&w=majority&appName=ibcalender
PORT=3000
```

### Démarrage

```bash
npm start
```

Ouvrez : http://localhost:3000

## 🎨 Design

- **Header blanc** avec logo Al Kawthar centré (180px)
- **Fond gris clair** (#F5F5F5) pour la page
- **Bordures grises** (#CCCCCC) classiques
- **Onglets matières** avec indicateur actif bleu (#003366)
- **Cards blanches** avec ombres légères
- **Formulaire beige** (#FFF8E8) avec bordure orange dashed
- **Police** : Arial, Helvetica, sans-serif
- **Responsive** : adaptation mobile/tablette

## 📊 API Endpoints

### Health Check
```
GET /api/health
```

### Récupérer évaluations
```
GET /api/evaluations?classe=PEI1
```

### Ajouter évaluation
```
POST /api/evaluations
Body: {
  "classe": "PEI1",
  "semaine": "S1",
  "matiere": "Français LL",
  "unite": "Unité 1",
  "critere": "A"
}
```

### Supprimer évaluation
```
DELETE /api/evaluations/:id
```

## 🔒 Configuration MongoDB Atlas

### Network Access
1. Allez sur https://cloud.mongodb.com
2. Menu gauche → **Network Access**
3. **ADD IP ADDRESS**
4. Sélectionnez **ALLOW ACCESS FROM ANYWHERE** (0.0.0.0/0)
5. **Confirm**
6. Attendez 1-2 minutes

### Database Access
1. Menu gauche → **Database Access**
2. Vérifiez que l'utilisateur `mohamedsherif2025` existe
3. Permissions : **Read and write to any database**

## ✅ Tests Locaux Réussis

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 Configuration MongoDB
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ URI détectée : mongodb+srv://mohame***Name=ibcalender
⏳ Connexion à MongoDB...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 Serveur démarré : http://localhost:3000
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ CONNEXION MONGODB RÉUSSIE
📊 Base de données prête
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 🛠️ Technologies

- **Backend** : Node.js, Express.js, Mongoose
- **Base de données** : MongoDB Atlas
- **Frontend** : HTML5, CSS3, JavaScript (Vanilla)
- **Déploiement** : Vercel (Serverless)
- **Design** : Responsive, traditionnel, professionnel

## 📝 Changelog

### Version 3.0.0 (2025-12-08)

**🚀 RECONSTRUCTION TOTALE**

- ✅ Structure propre avec 6 fichiers essentiels
- ✅ Backend MongoDB sans options dépréciées
- ✅ Design traditionnel Al Kawthar
- ✅ Fonctionnalités complètes testées
- ✅ Suppression de 26 fichiers inutiles
- ✅ Tests locaux réussis
- ✅ Prêt pour déploiement Vercel

## 🆘 Dépannage

### Erreur : "MONGODB_URI non définie"
**Solution** : Configurez la variable dans Vercel Environment Variables

### Erreur : "IP not whitelisted"
**Solution** : Autorisez 0.0.0.0/0 dans MongoDB Atlas Network Access

### Erreur : "Authentication failed"
**Solution** : Vérifiez username/password dans Database Access

### Design non appliqué après déploiement
**Solution** : Videz le cache du navigateur (Ctrl+F5 ou navigation privée)

## 📞 Support

Pour toute question ou problème, référez-vous aux logs Vercel :
**Deployments** → Dernier déploiement → **View Function Logs**

---

**Projet** : Calendrier des Évaluations KIS  
**Version** : 3.0.0  
**Date** : 2025-12-08  
**Statut** : ✅ Production Ready
