# 🔧 Correction de l'Erreur 500 - MONGODB_URI

## 🔴 Erreur Actuelle

Vous voyez cette erreur dans les logs Vercel :

```
Error: MONGODB_URI n'est pas définie.
Node.js process exited with exit status: 1
```

## 🎯 Cause du Problème

L'application ne peut pas démarrer car la variable d'environnement `MONGODB_URI` n'est **pas configurée** dans Vercel. C'est une erreur de configuration, **pas une erreur de code**.

## ✅ Solution Étape par Étape

### Étape 1 : Obtenir votre URI MongoDB

Si vous n'avez pas encore de compte MongoDB :

1. **Créer un compte MongoDB Atlas**
   - Allez sur : https://www.mongodb.com/cloud/atlas/register
   - Inscrivez-vous (gratuit)

2. **Créer un cluster gratuit**
   - Sélectionnez le plan **M0** (gratuit)
   - Région : Choisissez la plus proche (ex: Europe - France)
   - Nom du cluster : Gardez le défaut ou nommez-le "IB-Calendar"
   - Cliquez sur **"Create Cluster"** (ça prend 3-5 minutes)

3. **Créer un utilisateur de base de données**
   - Dans le menu latéral, cliquez sur **"Database Access"**
   - Cliquez sur **"Add New Database User"**
   - Authentication Method : **"Password"**
   - Username : `ib-admin` (ou ce que vous voulez)
   - Password : Générez un mot de passe sécurisé ou créez le vôtre
   - **⚠️ NOTEZ CE MOT DE PASSE !**
   - Database User Privileges : **"Atlas admin"** ou **"Read and write to any database"**
   - Cliquez sur **"Add User"**

4. **Autoriser l'accès depuis n'importe où**
   - Dans le menu latéral, cliquez sur **"Network Access"**
   - Cliquez sur **"Add IP Address"**
   - Cliquez sur **"ALLOW ACCESS FROM ANYWHERE"**
   - IP Address : `0.0.0.0/0` (déjà rempli)
   - Comment : `Vercel Access`
   - Cliquez sur **"Confirm"**

5. **Obtenir l'URI de connexion**
   - Retournez sur **"Database"** (menu latéral)
   - Sur votre cluster, cliquez sur **"Connect"**
   - Choisissez **"Connect your application"**
   - Driver : **"Node.js"**, Version : **"4.1 or later"**
   - Copiez la connection string qui ressemble à :
   
   ```
   mongodb+srv://ib-admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

6. **Modifier l'URI**
   - Remplacez `<password>` par votre vrai mot de passe
   - Ajoutez `/ib-calendar` après `.mongodb.net/`
   - URI finale :
   
   ```
   mongodb+srv://ib-admin:VOTRE_MOT_DE_PASSE@cluster0.xxxxx.mongodb.net/ib-calendar?retryWrites=true&w=majority
   ```

### Étape 2 : Ajouter l'URI dans Vercel

#### Option A : Via l'Interface Vercel (Plus facile)

1. **Allez sur Vercel**
   - Connectez-vous à https://vercel.com
   - Cliquez sur votre projet **"ib-calendar"** ou **"IB-Calender"**

2. **Ouvrir les Settings**
   - Cliquez sur l'onglet **"Settings"** en haut

3. **Ajouter la variable**
   - Dans le menu latéral, cliquez sur **"Environment Variables"**
   - Dans le champ **"Name"**, tapez : `MONGODB_URI`
   - Dans le champ **"Value"**, collez votre URI complète :
   
   ```
   mongodb+srv://ib-admin:VOTRE_MOT_DE_PASSE@cluster0.xxxxx.mongodb.net/ib-calendar?retryWrites=true&w=majority
   ```

   - **⚠️ IMPORTANT** : Cochez les 3 cases :
     - ✅ Production
     - ✅ Preview
     - ✅ Development
   
   - Cliquez sur **"Save"**

4. **Redéployer**
   - Allez sur l'onglet **"Deployments"**
   - Sur le dernier déploiement, cliquez sur les 3 points **"..."**
   - Cliquez sur **"Redeploy"**
   - Attendez 1-2 minutes

5. **Tester**
   - Cliquez sur **"Visit"** pour ouvrir votre site
   - ✅ Vous devriez voir le calendrier sans erreur !

#### Option B : Via la CLI Vercel

```bash
# 1. Installer Vercel CLI (si pas déjà fait)
npm install -g vercel

# 2. Se connecter
vercel login

# 3. Aller dans le dossier du projet
cd /chemin/vers/IB-Calender

# 4. Ajouter la variable pour Production
vercel env add MONGODB_URI production

# Quand demandé, collez votre URI MongoDB complète

# 5. Ajouter aussi pour Preview et Development
vercel env add MONGODB_URI preview
vercel env add MONGODB_URI development

# 6. Redéployer
vercel --prod
```

### Étape 3 : Vérification

1. **Ouvrir votre site**
   - URL Vercel : `https://votre-projet.vercel.app`

2. **Tester l'ajout d'une évaluation**
   - Sélectionnez "PEI1"
   - Cliquez sur "+ Ajouter une évaluation" (semaine 2)
   - Remplissez : Matière "Mathématiques", Unité "Algèbre", Critère "A"
   - Cliquez sur "Enregistrer"

3. **Recharger la page**
   - Appuyez sur F5 ou rechargez
   - ✅ L'évaluation doit toujours être là !
   - ✅ Cela prouve que MongoDB fonctionne !

## 🔍 Vérifier que tout fonctionne

### Tester la connexion MongoDB localement

```bash
# 1. Créer un fichier .env local (déjà fait)
# Éditez .env et mettez votre URI

# 2. Tester localement
cd /chemin/vers/IB-Calender
npm install
npm start

# 3. Ouvrir http://localhost:3000
# Si ça marche localement, ça marchera sur Vercel
```

### Vérifier les logs Vercel

1. Dashboard Vercel → Votre projet
2. Onglet **"Functions"**
3. Cliquez sur une fonction (ex: `index.js`)
4. Vous devriez voir :
   ```
   ✅ Connexion à MongoDB réussie.
   ```

Si vous voyez encore :
```
❌ Error: MONGODB_URI n'est pas définie.
```

Alors la variable n'est pas encore configurée ou vous n'avez pas redéployé.

## ⚠️ Problèmes Courants

### "Authentication failed" MongoDB

**Cause** : Mot de passe incorrect ou caractères spéciaux mal encodés

**Solution** :
```
Si votre mot de passe est : P@ss#2024
Encodez-le comme : P%40ss%232024

Caractères à encoder :
@ → %40
# → %23
$ → %24
% → %25
^ → %5E
& → %26
* → %2A
( → %28
) → %29
```

### "Network error" ou timeout

**Cause** : IP non autorisée dans MongoDB

**Solution** :
- MongoDB Atlas → Network Access
- Vérifiez que `0.0.0.0/0` est présent
- Attendez 2 minutes pour la propagation

### Erreur persiste après ajout de MONGODB_URI

**Cause** : Vercel n'a pas redéployé avec la nouvelle variable

**Solution** :
1. Attendez 5 minutes
2. Allez sur Deployments
3. Cliquez sur "Redeploy" du dernier déploiement
4. Attendez que ça finisse
5. Testez à nouveau

## 🎉 Résultat Final

Après avoir suivi ces étapes, vous devriez avoir :

✅ Site accessible sur Vercel
✅ Pas d'erreur 500
✅ Ajout d'évaluations fonctionnel
✅ Suppression d'évaluations fonctionnelle
✅ Génération Word fonctionnelle
✅ Séparation par classe fonctionnelle
✅ Données persistantes dans MongoDB

## 📞 Besoin d'Aide ?

Si après avoir suivi toutes ces étapes, vous avez toujours des problèmes :

1. **Vérifiez les logs Vercel** (onglet Functions)
2. **Testez localement** avec `npm start`
3. **Vérifiez votre URI MongoDB** (essayez de vous connecter avec mongosh)
4. **Ouvrez une issue** sur GitHub avec :
   - Les logs d'erreur complets
   - Votre configuration Vercel (sans les mots de passe !)
   - Les étapes que vous avez déjà essayées

## 🔐 Rappel Sécurité

⚠️ **NE JAMAIS** :
- Commiter le fichier `.env` avec vos credentials
- Partager votre URI MongoDB publiquement
- Mettre votre mot de passe MongoDB dans le code

✅ **TOUJOURS** :
- Utiliser les variables d'environnement Vercel
- Changer votre mot de passe MongoDB régulièrement
- Limiter les accès dans MongoDB (utilisateur avec droits minimaux)

---

**Dernière mise à jour** : 2025-10-27

Bon courage ! 💪🚀
