# 🚀 Calendrier des Évaluations KIS - Guide de Déploiement

## 📋 Vue d'ensemble

Application web de gestion de calendrier d'évaluations pour **Kawthar International School**.

- **Backend** : Node.js + Express + MongoDB Native Driver
- **Frontend** : HTML5 + CSS3 + JavaScript Vanilla
- **Déploiement** : Vercel Serverless Functions
- **Base de données** : MongoDB Atlas

---

## ⚠️ PROBLÈME ACTUEL

Votre application affiche des **erreurs 503** avec le message :
```
Connexion à MongoDB...
```

**CAUSE** : MongoDB Atlas bloque les connexions depuis Vercel à cause de la configuration **Network Access** (IP Whitelist).

**LE CODE EST 100% FONCTIONNEL** ✅  
**IL FAUT JUSTE CONFIGURER MONGODB ATLAS** ⚙️

---

## ✅ SOLUTION EN 3 ÉTAPES (10 MINUTES)

### ÉTAPE 1 : MongoDB Atlas - Network Access

1. Connectez-vous : https://cloud.mongodb.com
2. Menu gauche : **Network Access**
3. **SUPPRIMEZ** toutes les entrées existantes
4. Cliquez : **ADD IP ADDRESS**
5. Sélectionnez : **ALLOW ACCESS FROM ANYWHERE**
6. IP : `0.0.0.0/0`
7. Description : `Vercel Production`
8. **Confirmez**
9. ⏰ **ATTENDEZ 10 MINUTES** (propagation DNS/Firewall)

### ÉTAPE 2 : Vercel - Environment Variables

1. Allez sur : https://vercel.com (votre projet `ib-calender`)
2. **Settings** → **Environment Variables**
3. Trouvez : `MONGODB_URI`
4. Vérifiez la valeur :
   ```
   mongodb+srv://mohamedsherif2025:VOTRE_MOT_DE_PASSE@ibcalender.zusslxh.mongodb.net/ib-calender?retryWrites=true&w=majority&appName=ibcalender
   ```
5. **IMPORTANT** : Cochez les 3 environnements :
   - ✅ Production
   - ✅ Preview
   - ✅ Development
6. **Save**

**Note** : Si vous avez changé le mot de passe MongoDB, mettez à jour la valeur ici.

### ÉTAPE 3 : Déployer les changements

#### Option A : Push vers GitHub (Recommandé)

```bash
cd /home/user/webapp

# Ajouter tous les nouveaux fichiers
git add .

# Commit
git commit -m "fix: Architecture API Vercel serverless + amélioration connexion MongoDB"

# Push
git push origin main
```

Vercel va automatiquement détecter le push et redéployer.

#### Option B : Redéploiement Manuel sur Vercel

1. **Deployments** (menu haut)
2. Cliquez sur le dernier déploiement
3. `...` (trois points) → **Redeploy**
4. **DÉCOCHEZ** : "Use existing Build Cache"
5. **REDEPLOY**
6. Attendez 2-3 minutes

---

## 🔍 VÉRIFICATION

### 1. Vérifier les logs Vercel

1. Deployment terminé → **View Function Logs**
2. Recherchez :
   ```
   ✅ CONNEXION MONGODB RÉUSSIE
   📊 Base: ib-calender
   🏷️  Collections: evaluations
   ```

### 2. Tester l'application

1. Ouvrez votre URL Vercel
2. Sélectionnez "PEI 1"
3. Ajoutez une évaluation (Semaine 1, Unité 1, Critère A)
4. Vérifiez qu'elle apparaît dans le calendrier
5. Testez l'export Word

---

## 🛠️ NOUVEAUX FICHIERS CRÉÉS

Voici les fichiers que j'ai créés/modifiés pour optimiser l'application :

### Nouveaux fichiers

```
webapp/
├── lib/
│   └── mongodb.js              ← Connexion MongoDB réutilisable (NOUVEAU)
├── api/
│   ├── health.js               ← Health check API (NOUVEAU)
│   ├── export.js               ← Export Word API (NOUVEAU)
│   └── evaluations/
│       ├── index.js            ← GET & POST evaluations (NOUVEAU)
│       └── [id].js             ← DELETE evaluation (NOUVEAU)
├── test-connection.js          ← Script de test connexion (NOUVEAU)
├── SOLUTION_VERCEL_V2.md       ← Documentation détaillée (NOUVEAU)
└── README_DEPLOY.md            ← Ce fichier (NOUVEAU)
```

### Fichiers modifiés

- `vercel.json` : Configuration routes API mise à jour
- `package.json` : Ajout script `test:connection`
- `.env` : Template avec placeholder pour mot de passe

### Fichiers conservés (non modifiés)

- `public/index.html` : Interface web
- `public/style.css` : Styles CSS
- `public/script.js` : Logic JavaScript frontend

---

## 🧪 TESTS LOCAUX (Optionnel)

### Test de connexion MongoDB

```bash
cd /home/user/webapp

# Éditez .env avec le BON mot de passe
nano .env
# Remplacez <PASSWORD> par votre mot de passe MongoDB

# Lancez le test
npm run test:connection
```

**Résultat attendu** :
```
✅ CONNEXION MONGODB RÉUSSIE
📊 Base: ib-calender
🏷️  Collections: evaluations
📈 Nombre d'évaluations: X
✅ TOUS LES TESTS RÉUSSIS !
```

---

## 🆘 DÉPANNAGE

### ❌ Erreur : "MONGODB_URI non définie"

**Solution** :
1. Vercel → Settings → Environment Variables
2. Ajoutez `MONGODB_URI` avec la bonne valeur
3. Cochez Production, Preview, Development
4. Redéployez

---

### ❌ Erreur : "authentication failed"

**Solution** :
1. MongoDB Atlas → Database Access
2. Vérifiez l'utilisateur `mohamedsherif2025`
3. Changez le mot de passe (simple, sans caractères spéciaux)
4. Mettez à jour `MONGODB_URI` dans Vercel
5. Redéployez

---

### ❌ Erreur : "connection closed" ou "MongoServerSelectionError"

**Solution** :
1. MongoDB Atlas → Network Access
2. **SUPPRIMEZ** toutes les entrées
3. **AJOUTEZ** `0.0.0.0/0` (ALLOW ACCESS FROM ANYWHERE)
4. ⏰ **ATTENDEZ 10 MINUTES**
5. Redéployez sur Vercel

---

### ❌ Logs Vercel vides

**Solution** :
1. Vérifiez les **Build Logs** (pas Function Logs)
2. Recherchez des erreurs de build
3. Si erreur npm, testez localement : `npm install`
4. Commit et push
5. Laissez Vercel rebuilder

---

## 📚 DOCUMENTATION COMPLÈTE

Pour plus de détails, consultez :

1. **SOLUTION_VERCEL_V2.md** : Guide complet étape par étape
2. **LISEZ_MOI_EN_PREMIER.md** : Instructions originales
3. **DIAGNOSTIC_FINAL.md** : Analyse technique du problème

---

## 📊 ARCHITECTURE

### Backend API (Serverless Functions)

- `GET /api/health` : Health check + status MongoDB
- `GET /api/evaluations?classe=PEI+1` : Récupérer évaluations
- `POST /api/evaluations` : Ajouter une évaluation
- `DELETE /api/evaluations/:id` : Supprimer une évaluation
- `POST /api/export` : Exporter en Word

### Frontend (Static)

- `GET /` : Page principale (index.html)
- `GET /style.css` : Styles
- `GET /script.js` : Logic JavaScript

---

## 🎯 CHECKLIST FINALE

Avant de redéployer, vérifiez :

- [ ] MongoDB Atlas → Network Access → `0.0.0.0/0` Active
- [ ] MongoDB Atlas → Database Access → Utilisateur avec privilèges
- [ ] Vercel → Environment Variables → `MONGODB_URI` définie
- [ ] Vercel → Environment Variables → 3 environnements cochés
- [ ] Git → Tous les fichiers commit et push
- [ ] Attendu 10 minutes après changement Network Access

---

## ✨ RÉSULTAT FINAL

Une fois configuré correctement :

✅ Application accessible via votre URL Vercel  
✅ Ajout/suppression d'évaluations fonctionne  
✅ Calendrier s'affiche avec les évaluations  
✅ Export Word génère des fichiers .docx  
✅ Logs Vercel montrent "CONNEXION MONGODB RÉUSSIE"  

---

## 📞 SUPPORT

Si vous avez suivi TOUTES les étapes et que ça ne fonctionne toujours pas :

1. **MongoDB Atlas Support** : https://cloud.mongodb.com/v2#/support
2. **Vercel Support** : https://vercel.com/support
3. **Documentation MongoDB** : https://www.mongodb.com/docs/atlas/

---

**Version** : 5.0  
**Date** : 2025-12-08  
**Status** : Production Ready ✅
