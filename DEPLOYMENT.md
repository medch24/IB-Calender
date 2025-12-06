# 🚀 Guide de Déploiement - Calendrier KIS

## 📦 Déploiement sur Vercel (Production)

### Option 1 : Via GitHub (Automatique - Recommandé)

L'application est déjà configurée pour le déploiement automatique sur Vercel.

#### Étapes :
1. Les changements sont automatiquement détectés sur la branche `main`
2. Vercel build et déploie automatiquement
3. L'application est accessible via votre URL Vercel

#### Variables d'environnement Vercel :
Assurez-vous d'avoir configuré dans Vercel Dashboard :

```env
MONGODB_URI=mongodb+srv://cherifmed2010:Mmedch86@ib-calender.jec0ben.mongodb.net/ib-calendar?retryWrites=true&w=majority&appName=Ib-calender
```

### Option 2 : Via CLI Vercel

```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter
vercel login

# Déployer
vercel --prod

# Configurer la variable d'environnement
vercel env add MONGODB_URI
```

---

## 🔧 Configuration MongoDB Atlas

### Connexion Actuelle
- **Cluster** : ib-calender.jec0ben.mongodb.net
- **Utilisateur** : cherifmed2010
- **Base de données** : ib-calendar
- **Collection** : evaluations

### Vérifications à Faire

#### 1. Whitelist IP
Dans MongoDB Atlas Dashboard :
- Aller dans "Network Access"
- Vérifier que `0.0.0.0/0` est autorisé (pour Vercel)

#### 2. Connexion String
Format correct :
```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```

#### 3. Permissions Utilisateur
L'utilisateur doit avoir :
- `readWrite` sur la base de données `ib-calendar`
- Accès à la collection `evaluations`

---

## 🖥️ Déploiement Local (Développement)

### Prérequis
- Node.js 14+ installé
- MongoDB accessible (local ou Atlas)

### Installation

```bash
# Cloner le repo
git clone https://github.com/medch24/IB-Calender.git
cd IB-Calender

# Installer les dépendances
npm install

# Créer le fichier .env
cp .env.example .env

# Éditer .env avec votre URI MongoDB
nano .env
```

### Lancement

```bash
# Démarrer le serveur
npm start

# L'application sera disponible sur
# http://localhost:3000
```

---

## 🔍 Résolution de Problèmes

### Erreur : "Cannot connect to MongoDB"

**Cause** : URI MongoDB incorrecte ou réseau bloqué

**Solutions** :
1. Vérifier l'URI dans `.env` (local) ou Vercel Dashboard (production)
2. Vérifier Network Access dans MongoDB Atlas
3. Tester la connexion avec MongoDB Compass

### Erreur : "Module not found"

**Cause** : Dépendances non installées

**Solution** :
```bash
rm -rf node_modules package-lock.json
npm install
```

### Erreur : "Port 3000 already in use"

**Cause** : Un autre processus utilise le port

**Solutions** :
```bash
# Option 1 : Tuer le processus
kill -9 $(lsof -ti:3000)

# Option 2 : Utiliser un autre port
PORT=3001 npm start
```

### Les évaluations ne s'affichent pas

**Causes possibles** :
1. MongoDB non connecté → Vérifier les logs serveur
2. Mauvaise classe sélectionnée → Changer de classe dans le menu
3. Cache navigateur → Faire Ctrl+F5 pour rafraîchir

**Vérifications** :
```bash
# Vérifier les logs Vercel
vercel logs

# Tester l'API directement
curl https://votre-app.vercel.app/api/evaluations?classe=PEI1
```

---

## 📊 Monitoring et Logs

### Logs Vercel
```bash
# Voir les logs en temps réel
vercel logs --follow

# Logs d'une fonction spécifique
vercel logs /api/evaluations
```

### Logs MongoDB
- Aller dans MongoDB Atlas Dashboard
- Cliquer sur votre cluster
- Onglet "Monitoring" → "Logs"

---

## 🔄 Mise à Jour de l'Application

### Sur Vercel (Automatique)
```bash
# Faire vos modifications
git add .
git commit -m "Description des changements"
git push origin main

# Vercel déploie automatiquement !
```

### Forcer un Redéploiement
```bash
vercel --prod --force
```

---

## 🛡️ Sécurité

### Variables Sensibles
⚠️ **NE JAMAIS** commiter :
- `.env` (déjà dans .gitignore)
- Mots de passe MongoDB
- Clés API

### Bonnes Pratiques
1. Utiliser des variables d'environnement
2. Mettre à jour régulièrement les dépendances
3. Activer l'authentification IP sur MongoDB
4. Utiliser HTTPS (automatique avec Vercel)

---

## 📱 Test de l'Application

### Test Local
```bash
npm start
# Ouvrir http://localhost:3000
```

### Test Production
```
https://votre-app.vercel.app
```

### Checklist de Test
- [ ] Page s'affiche correctement
- [ ] Sélection de classe fonctionne
- [ ] Ajout d'évaluation fonctionne
- [ ] Évaluations s'affichent
- [ ] Suppression fonctionne
- [ ] Génération Word fonctionne
- [ ] Design responsive (mobile/tablet/desktop)
- [ ] MongoDB enregistre correctement

---

## 🎨 Personnalisation du Design

### Modifier les Couleurs
Éditer `public/style.css` :

```css
:root {
  --primary-blue: #1e3a8a;      /* Couleur principale */
  --accent-orange: #f97316;      /* Couleur d'accent */
  --success-green: #10b981;      /* Succès */
  /* ... autres variables ... */
}
```

### Modifier les Animations
```css
/* Désactiver toutes les animations */
* {
  animation: none !important;
  transition: none !important;
}
```

---

## 📞 Support

### Documentation
- [README.md](./README.md) - Guide utilisateur
- [CHANGELOG.md](./CHANGELOG.md) - Historique des versions
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Ce fichier

### Liens Utiles
- 📦 [Vercel Dashboard](https://vercel.com/dashboard)
- 🗄️ [MongoDB Atlas](https://cloud.mongodb.com/)
- 📚 [Documentation Node.js](https://nodejs.org/docs/)
- 🎨 [Documentation Express](https://expressjs.com/)

### Contact
- **GitHub** : [medch24/IB-Calender](https://github.com/medch24/IB-Calender)
- **Issues** : [Signaler un problème](https://github.com/medch24/IB-Calender/issues)

---

## 🎯 Checklist de Déploiement

Avant de déployer en production :

- [x] Code testé localement
- [x] Variables d'environnement configurées
- [x] MongoDB accessible et configuré
- [x] Design responsive vérifié
- [x] Toutes les fonctionnalités testées
- [x] .gitignore configuré correctement
- [x] Documentation à jour
- [ ] Tests effectués sur différents navigateurs
- [ ] Performance optimisée
- [ ] Sécurité vérifiée

---

**Dernière mise à jour** : 2024-12-06  
**Version** : 2.0  
**Status** : ✅ Production Ready
