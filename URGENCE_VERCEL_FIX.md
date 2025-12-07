# 🔥 FIX URGENT - ERREURS VERCEL

## ❌ PROBLÈMES IDENTIFIÉS

1. **MongoDB non configuré** dans Vercel
2. **Erreur** : `querySrv ENOTFOUND _mongodb._tcp.ib-calender`
3. **Aucune donnée** ne peut être sauvegardée
4. **Aucune évaluation** ne peut être chargée

---

## ✅ SOLUTION EN 3 ÉTAPES

### ÉTAPE 1 : Configurer MongoDB Atlas (SI PAS DÉJÀ FAIT)

1. Allez sur https://www.mongodb.com/cloud/atlas
2. Créez un compte GRATUIT
3. Créez un cluster (M0 - gratuit)
4. Créez un utilisateur :
   - Username : `ibcalendar`
   - Password : `VOTRE_MOT_DE_PASSE_SECURISE`
5. Autorisez toutes les IP :
   - Network Access → Add IP Address
   - **0.0.0.0/0** (pour autoriser Vercel)
6. Obtenez votre URI :
   - Clusters → Connect → Connect your application
   - Copiez l'URI (format : `mongodb+srv://...`)

**Exemple d'URI :**
```
mongodb+srv://ibcalendar:MOT_DE_PASSE@cluster0.xxxxx.mongodb.net/ib-calendar?retryWrites=true&w=majority
```

---

### ÉTAPE 2 : Ajouter MONGODB_URI dans Vercel

1. **Allez sur Vercel** : https://vercel.com
2. **Sélectionnez votre projet** : `IB-Calender` ou similaire
3. **Cliquez sur "Settings"** (Paramètres)
4. **Cliquez sur "Environment Variables"** dans le menu gauche
5. **Ajoutez une nouvelle variable** :
   - **Key (Nom)** : `MONGODB_URI`
   - **Value (Valeur)** : COLLEZ VOTRE URI MongoDB (de l'étape 1)
   - **Cochez les 3 environnements** : Production, Preview, Development
6. **Cliquez sur "Save"**

---

### ÉTAPE 3 : Redéployer le projet

Après avoir ajouté la variable d'environnement :

**Option A - Via Vercel Dashboard :**
1. Allez dans l'onglet "Deployments"
2. Trouvez le dernier déploiement
3. Cliquez sur les 3 points `...`
4. Cliquez sur **"Redeploy"**
5. Cochez **"Use existing Build Cache"** : NON
6. Cliquez sur **"Redeploy"**

**Option B - Via Git (PLUS SIMPLE) :**
```bash
# Juste pusher un commit vide pour redéployer
cd /home/user/webapp
git commit --allow-empty -m "fix: force redeploy with MongoDB config"
git push origin main
```

---

## 🔍 VÉRIFICATION

Après le redéploiement (attendre 2-3 minutes) :

1. **Ouvrez votre site Vercel**
2. **Ouvrez la Console développeur** (F12)
3. **Allez dans l'onglet Network**
4. **Rechargez la page** (F5)

**Vous devriez voir :**
- ✅ `style.css` chargé (status 200)
- ✅ `script.js` chargé (status 200)
- ✅ Pas d'erreur MongoDB dans les logs Vercel

---

## 📊 COMMENT VÉRIFIER LES LOGS VERCEL

1. Allez sur https://vercel.com/votre-projet
2. Cliquez sur l'onglet **"Logs"** ou **"Functions"**
3. Vous devriez voir :
   - ✅ `✅ Connexion à MongoDB réussie.`
   - ❌ PLUS D'ERREUR `querySrv ENOTFOUND`

---

## ⚠️ SI LE PROBLÈME PERSISTE

### Vérifiez MongoDB Atlas :

1. **Network Access** : 0.0.0.0/0 DOIT être autorisé
2. **Database User** : L'utilisateur DOIT exister
3. **URI correcte** : Format `mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/ib-calendar`
4. **Remplacez** `<password>` par le vrai mot de passe
5. **Remplacez** `myFirstDatabase` par `ib-calendar`

### Testez l'URI localement :

```bash
# Dans le terminal
cd /home/user/webapp
echo "MONGODB_URI=votre_uri_mongodb_ici" > .env
npm start
```

Si ça fonctionne localement mais pas sur Vercel, c'est que la variable d'environnement n'est pas bien configurée dans Vercel.

---

## 🎯 RÉSUMÉ RAPIDE

1. ✅ Créer compte MongoDB Atlas (gratuit)
2. ✅ Obtenir URI de connexion
3. ✅ Ajouter `MONGODB_URI` dans Vercel → Settings → Environment Variables
4. ✅ Redéployer le projet
5. ✅ Attendre 2-3 minutes
6. ✅ Vider cache navigateur (Ctrl+F5)
7. ✅ Tester l'application

---

## 📞 SI VOUS ÊTES BLOQUÉ

**Envoyez-moi :**
1. Une capture d'écran de Vercel → Settings → Environment Variables
2. Les logs Vercel (masquez les mots de passe !)
3. La console du navigateur (F12 → Console)

**Problème le plus commun :**
- 🔴 MONGODB_URI pas défini dans Vercel
- 🔴 0.0.0.0/0 pas autorisé dans MongoDB Atlas
- 🔴 Mot de passe incorrect dans l'URI

---

**UNE FOIS MONGODB CONFIGURÉ, TOUT FONCTIONNERA !** 🎉
