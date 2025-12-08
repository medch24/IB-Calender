// Test de connexion MongoDB - Script de diagnostic
// Usage: node test-connexion-mongodb.js

require('dotenv').config();
const mongoose = require('mongoose');

console.log('═'.repeat(70));
console.log('🧪 TEST DE CONNEXION MONGODB - IB CALENDER');
console.log('═'.repeat(70));
console.log('');

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URL;

// Vérification de l'URI
console.log('📋 ÉTAPE 1/4 : Vérification de l\'URI');
console.log('─'.repeat(70));

if (!MONGODB_URI) {
  console.error('❌ ERREUR : MONGODB_URI non définie !');
  console.error('💡 Créez un fichier .env avec :');
  console.error('   MONGODB_URI=mongodb+srv://...');
  process.exit(1);
}

// Masquer le mot de passe pour l'affichage
const maskedURI = MONGODB_URI.substring(0, 25) + '***' + MONGODB_URI.substring(MONGODB_URI.length - 40);
console.log('✅ URI détectée :', maskedURI);
console.log('');

// Vérifications de l'URI
console.log('📋 ÉTAPE 2/4 : Analyse de l\'URI');
console.log('─'.repeat(70));

const checks = [
  { test: MONGODB_URI.startsWith('mongodb+srv://'), message: 'Protocole mongodb+srv://' },
  { test: MONGODB_URI.includes('@'), message: 'Identifiants présents' },
  { test: MONGODB_URI.includes('mongodb.net'), message: 'Hostname MongoDB Atlas' },
  { test: MONGODB_URI.includes('/ib-calendar'), message: 'Nom de base de données (ib-calendar)' },
  { test: MONGODB_URI.includes('?'), message: 'Paramètres de connexion' },
];

let allChecksPassed = true;
checks.forEach(check => {
  if (check.test) {
    console.log(`✅ ${check.message}`);
  } else {
    console.log(`❌ ${check.message}`);
    allChecksPassed = false;
  }
});

console.log('');

if (!allChecksPassed) {
  console.error('⚠️  Certains paramètres de l\'URI semblent incorrects.');
  console.error('💡 URI attendue : mongodb+srv://user:pass@cluster.mongodb.net/ib-calendar?...');
  console.error('');
}

// Test de connexion
console.log('📋 ÉTAPE 3/4 : Test de connexion');
console.log('─'.repeat(70));
console.log('⏳ Connexion en cours...');
console.log('');

mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 10000, // Timeout de 10 secondes pour le test
})
.then(() => {
  console.log('═'.repeat(70));
  console.log('✅✅✅ CONNEXION RÉUSSIE ! ✅✅✅');
  console.log('═'.repeat(70));
  console.log('');
  console.log('📊 Informations de connexion :');
  console.log('   - État :', mongoose.connection.readyState === 1 ? '✅ Connecté' : '❌ Déconnecté');
  console.log('   - Base de données :', mongoose.connection.name);
  console.log('   - Host :', mongoose.connection.host);
  console.log('');
  console.log('🎯 LA BASE DE DONNÉES EST PRÊTE !');
  console.log('');
  console.log('✅ Vous pouvez maintenant :');
  console.log('   1. Démarrer le serveur : npm start');
  console.log('   2. Configurer la même URI dans Vercel');
  console.log('   3. Redéployer votre application');
  console.log('');
  console.log('═'.repeat(70));
  
  // Tester la création d'un document de test
  console.log('');
  console.log('📋 ÉTAPE 4/4 : Test d\'écriture dans la base');
  console.log('─'.repeat(70));
  
  const TestSchema = new mongoose.Schema({
    message: String,
    timestamp: Date
  });
  const TestModel = mongoose.model('Test', TestSchema);
  
  const testDoc = new TestModel({
    message: 'Test de connexion réussi',
    timestamp: new Date()
  });
  
  return testDoc.save();
})
.then(doc => {
  console.log('✅ Document de test créé avec succès !');
  console.log('   ID :', doc._id);
  console.log('');
  console.log('🎉 TOUS LES TESTS SONT PASSÉS !');
  console.log('');
  console.log('═'.repeat(70));
  process.exit(0);
})
.catch(err => {
  console.log('═'.repeat(70));
  console.log('❌❌❌ ÉCHEC DE CONNEXION ❌❌❌');
  console.log('═'.repeat(70));
  console.log('');
  console.log('📋 Détails de l\'erreur :');
  console.log('   Type :', err.name);
  console.log('   Message :', err.message);
  if (err.code) console.log('   Code :', err.code);
  console.log('');
  console.log('═'.repeat(70));
  console.log('💡 SOLUTIONS POSSIBLES');
  console.log('═'.repeat(70));
  console.log('');
  
  if (err.message.includes('IP') || err.message.includes('whitelist')) {
    console.log('🔐 PROBLÈME : IP non autorisée dans MongoDB Atlas');
    console.log('');
    console.log('✅ SOLUTION :');
    console.log('   1. Allez sur https://cloud.mongodb.com');
    console.log('   2. Sélectionnez votre projet');
    console.log('   3. Menu gauche → Network Access');
    console.log('   4. Cliquez sur "ADD IP ADDRESS"');
    console.log('   5. Sélectionnez "ALLOW ACCESS FROM ANYWHERE"');
    console.log('   6. Cela ajoutera 0.0.0.0/0 (toutes les IPs)');
    console.log('   7. Cliquez sur "Confirm"');
    console.log('   8. Attendez 1-2 minutes et relancez ce test');
    console.log('');
  } else if (err.message.includes('Authentication') || err.message.includes('auth')) {
    console.log('🔑 PROBLÈME : Identifiants incorrects');
    console.log('');
    console.log('✅ SOLUTION :');
    console.log('   1. Allez sur https://cloud.mongodb.com');
    console.log('   2. Menu gauche → Database Access');
    console.log('   3. Vérifiez que l\'utilisateur "mohamedsherif2025" existe');
    console.log('   4. Si besoin, créez un nouvel utilisateur');
    console.log('   5. Permissions : "Read and write to any database"');
    console.log('   6. Mettez à jour le .env avec les bons identifiants');
    console.log('');
  } else if (err.message.includes('ENOTFOUND') || err.message.includes('querySrv')) {
    console.log('🌐 PROBLÈME : Impossible de résoudre le nom de domaine');
    console.log('');
    console.log('✅ SOLUTION :');
    console.log('   1. Vérifiez votre connexion Internet');
    console.log('   2. Vérifiez que le hostname est correct dans l\'URI');
    console.log('   3. Essayez depuis un autre réseau');
    console.log('   4. Vérifiez que le cluster existe dans MongoDB Atlas');
    console.log('');
  } else {
    console.log('⚠️  PROBLÈME : Erreur inconnue');
    console.log('');
    console.log('✅ SOLUTIONS GÉNÉRALES :');
    console.log('   1. Vérifiez que le cluster MongoDB est actif (pas en pause)');
    console.log('   2. Vérifiez que l\'URI est complète et correcte');
    console.log('   3. Consultez GUIDE_MONGODB_ATLAS.md pour plus de détails');
    console.log('   4. Relancez ce test après corrections');
    console.log('');
  }
  
  console.log('═'.repeat(70));
  console.log('📖 GUIDE COMPLET : Lisez GUIDE_MONGODB_ATLAS.md');
  console.log('═'.repeat(70));
  console.log('');
  
  process.exit(1);
});

// Gestion des déconnexions
mongoose.connection.on('error', err => {
  console.error('❌ Erreur MongoDB :', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB déconnecté');
});
