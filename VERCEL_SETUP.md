# 🚀 Guide de Déploiement sur Vercel

Ce guide vous explique comment déployer l'application Calendrier des Évaluations KIS sur Vercel.

## 📋 Prérequis

1. **Compte MongoDB Atlas** configuré avec :
   - Un cluster (gratuit M0 suffisant)
   - Un utilisateur de base de données
   - Accès réseau autorisé pour toutes les IP (0.0.0.0/0)
   - URI de connexion prête

2. **Compte Vercel** (gratuit) :
   - Allez sur https://vercel.com/signup
   - Connectez-vous avec votre compte GitHub

## 🎯 Étapes de Déploiement

### Méthode 1 : Via l'Interface Vercel (Recommandée)

#### Étape 1 : Importer le Projet

1. Connectez-vous à https://vercel.com
2. Cliquez sur **"Add New..."** → **"Project"**
3. Sélectionnez **"Import Git Repository"**
4. Cherchez et sélectionnez le dépôt **"IB-Calender"**
5. Cliquez sur **"Import"**

#### Étape 2 : Configurer le Projet

1. **Framework Preset** : Détecté automatiquement (Other)
2. **Root Directory** : Laissez par défaut (`./`)
3. **Build Command** : Laissez vide (pas de build nécessaire)
4. **Output Directory** : Laissez vide
5. **Install Command** : `npm install` (automatique)

#### Étape 3 : Ajouter les Variables d'Environnement

⚠️ **IMPORTANT** : Cette étape est OBLIGATOIRE

1. Cliquez sur **"Environment Variables"**
2. Ajoutez la variable suivante :

   ```
   Name: MONGODB_URI
   Value: mongodb+srv://username:password@cluster.mongodb.net/ib-calendar?retryWrites=true&w=majority
   ```

   **Remplacez** :
   - `username` par votre nom d'utilisateur MongoDB
   - `password` par votre mot de passe MongoDB
   - `cluster` par l'adresse de votre cluster

3. Sélectionnez tous les environnements :
   - ✅ Production
   - ✅ Preview
   - ✅ Development

4. Cliquez sur **"Add"**

#### Étape 4 : Déployer

1. Cliquez sur **"Deploy"**
2. Attendez la fin du déploiement (environ 1-2 minutes)
3. Une fois terminé, cliquez sur **"Visit"** pour voir votre site

### Méthode 2 : Via la CLI Vercel

#### Installation de Vercel CLI

```bash
npm install -g vercel
```

#### Connexion à Vercel

```bash
vercel login
```

#### Déploiement

```bash
cd /chemin/vers/IB-Calender
vercel --prod
```

Lors du déploiement, répondez aux questions :

```
? Set up and deploy "~/IB-Calender"? [Y/n] Y
? Which scope do you want to deploy to? Votre compte
? Link to existing project? [y/N] N
? What's your project's name? ib-calendar
? In which directory is your code located? ./
```

#### Ajouter les Variables d'Environnement

```bash
vercel env add MONGODB_URI production
```

Collez votre URI MongoDB quand demandé.

Pour ajouter aussi en preview et development :

```bash
vercel env add MONGODB_URI preview
vercel env add MONGODB_URI development
```

#### Redéployer avec les variables

```bash
vercel --prod
```

## 🔧 Configuration MongoDB Atlas pour Vercel

### 1. Autoriser toutes les IP

Vercel utilise des IP dynamiques, il faut donc autoriser toutes les adresses :

1. Allez sur MongoDB Atlas
2. Cliquez sur **"Network Access"** (dans le menu latéral)
3. Cliquez sur **"Add IP Address"**
4. Sélectionnez **"Allow Access from Anywhere"**
5. IP Address : `0.0.0.0/0`
6. Cliquez sur **"Confirm"**

### 2. Vérifier l'URI de connexion

Votre URI doit ressembler à :

```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/ib-calendar?retryWrites=true&w=majority
```

**Points importants** :
- Remplacez `<username>` et `<password>` par vos identifiants
- Le nom de la base de données est `ib-calendar`
- Gardez les paramètres `?retryWrites=true&w=majority`

### 3. Tester la connexion

Dans votre terminal local :

```bash
# Installez mongosh (MongoDB Shell)
# macOS
brew install mongosh

# Windows (via Chocolatey)
choco install mongosh

# Linux
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
sudo apt-get install -y mongodb-mongosh

# Testez la connexion
mongosh "votre_uri_mongodb_complet"
```

Si la connexion réussit, votre URI est correcte.

## ✅ Vérification du Déploiement

### 1. Vérifier que le site est accessible

Ouvrez l'URL Vercel (ex: `https://ib-calendar-xxxxx.vercel.app`)

Vous devriez voir :
- ✅ L'interface du calendrier
- ✅ Le sélecteur de classe fonctionnel
- ✅ Les boutons "Ajouter une évaluation"
- ✅ Le bouton "Générer Word"

### 2. Tester l'ajout d'une évaluation

1. Sélectionnez une classe (ex: PEI1)
2. Cliquez sur "+ Ajouter une évaluation" (semaine 2)
3. Remplissez le formulaire
4. Cliquez sur "Enregistrer"
5. Rechargez la page
6. ✅ L'évaluation doit toujours être là (preuve que MongoDB fonctionne)

### 3. Vérifier les logs Vercel

Si vous avez des erreurs :

1. Allez sur https://vercel.com/dashboard
2. Cliquez sur votre projet "ib-calendar"
3. Cliquez sur l'onglet **"Functions"**
4. Cliquez sur une fonction pour voir les logs
5. Cherchez les erreurs MongoDB

## 🐛 Résolution de Problèmes

### Erreur : "MONGODB_URI n'est pas définie"

**Solution** :
1. Vérifiez que vous avez bien ajouté `MONGODB_URI` dans les variables d'environnement Vercel
2. Redéployez le projet : `vercel --prod` ou via l'interface
3. Attendez 2 minutes pour la propagation

### Erreur : "Authentication failed" MongoDB

**Solutions** :
1. Vérifiez votre nom d'utilisateur et mot de passe
2. Assurez-vous qu'il n'y a pas de caractères spéciaux mal encodés dans le mot de passe
3. Si votre mot de passe contient des caractères spéciaux, encodez-les :
   - `@` → `%40`
   - `:` → `%3A`
   - `/` → `%2F`
   - `?` → `%3F`
   - `#` → `%23`
   - `[` → `%5B`
   - `]` → `%5D`

### Erreur : "Network error" ou "Connection timeout"

**Solutions** :
1. Vérifiez que vous avez autorisé `0.0.0.0/0` dans Network Access MongoDB
2. Attendez quelques minutes (propagation DNS)
3. Vérifiez que votre cluster MongoDB est actif (pas en pause)

### Erreur 500 : "Internal Server Error"

**Solutions** :
1. Consultez les logs Vercel (voir section "Vérifier les logs")
2. Vérifiez que tous les fichiers sont bien présents sur GitHub
3. Vérifiez que `vercel.json` est correct
4. Redéployez : `vercel --prod`

### Les évaluations ne persistent pas

**Solutions** :
1. Testez la connexion MongoDB localement (voir section "Tester la connexion")
2. Vérifiez que la variable `MONGODB_URI` est bien configurée
3. Vérifiez les logs de la fonction dans Vercel
4. Assurez-vous que l'URI contient bien le nom de la base de données `ib-calendar`

## 🔄 Redéployer après des modifications

### Via Git (Automatique)

1. Faites vos modifications localement
2. Committez : `git add . && git commit -m "message"`
3. Poussez : `git push origin main`
4. Vercel redéploiera automatiquement (webhook GitHub)

### Via CLI

```bash
vercel --prod
```

### Via l'Interface Vercel

1. Allez sur votre projet
2. Cliquez sur **"Deployments"**
3. Cliquez sur **"Redeploy"** sur le dernier déploiement

## 📊 Monitoring

### Voir les métriques

1. Dashboard Vercel → Votre projet
2. Onglet **"Analytics"** : Voir le trafic
3. Onglet **"Functions"** : Voir les performances des API

### Alertes

Vous pouvez configurer des alertes email dans :
- Vercel Dashboard → Settings → Notifications

## 🔒 Sécurité

### Variables d'environnement

⚠️ **NE JAMAIS** committer le fichier `.env` avec vos vraies credentials
⚠️ Utilisez uniquement Vercel pour stocker `MONGODB_URI`
⚠️ Changez régulièrement votre mot de passe MongoDB

### Backup MongoDB

1. MongoDB Atlas → Cluster → Backup
2. Configurez des snapshots automatiques (gratuit pour M10+)
3. Pour M0 (gratuit), exportez manuellement :

```bash
mongodump --uri="votre_uri_mongodb"
```

## 📈 Scaling

L'application est serverless et scale automatiquement avec Vercel.

**Limites du plan gratuit Vercel** :
- 100 GB de bande passante / mois
- 100 heures de build / mois
- Invocations illimitées

**Limites du plan gratuit MongoDB Atlas (M0)** :
- 512 MB de stockage
- Connexions limitées
- Pour plus : passer à M10 ($0.08/heure)

## 🎉 Succès !

Si tout fonctionne :
- ✅ Votre site est en ligne sur `https://ib-calendar-xxxxx.vercel.app`
- ✅ Les évaluations sont sauvegardées dans MongoDB
- ✅ Génération Word fonctionnelle
- ✅ Séparation par classe opérationnelle

**Bravo ! Votre application est déployée ! 🚀**

## 📞 Support

En cas de problème persistant :
1. Consultez les logs Vercel
2. Vérifiez la documentation MongoDB Atlas
3. Ouvrez une issue sur GitHub : https://github.com/medch24/IB-Calender/issues

---

**Dernière mise à jour** : 2025-10-27
