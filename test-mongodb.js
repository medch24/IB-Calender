// Script de test MongoDB
// Utilisation : node test-mongodb.js

require('dotenv').config();
const mongoose = require('mongoose');

console.log('\n🔍 TEST DE CONNEXION MONGODB\n');
console.log('━'.repeat(50));

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URL;

if (!MONGODB_URI) {
  console.error('❌ ERREUR : Variable MONGODB_URI non trouvée !');
  console.error('💡 Créez un fichier .env avec :');
  console.error('   MONGODB_URI=mongodb+srv://...\n');
  process.exit(1);
}

console.log('📋 URI détectée :', MONGODB_URI.replace(/:[^:@]+@/, ':***@'));
console.log('━'.repeat(50));
console.log('\n⏳ Tentative de connexion...\n');

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ SUCCÈS ! Connexion à MongoDB établie !');
  console.log('✅ Base de données prête à l\'emploi');
  console.log('\n━'.repeat(50));
  console.log('🎉 Tout fonctionne ! Vous pouvez fermer ce script.\n');
  process.exit(0);
})
.catch(err => {
  console.error('❌ ÉCHEC de connexion à MongoDB !');
  console.error('━'.repeat(50));
  console.error('\n📋 Détails de l\'erreur :');
  console.error(err.message);
  console.error('\n💡 Solutions possibles :');
  console.error('   1. Vérifiez que l\'URI est correcte');
  console.error('   2. Vérifiez que 0.0.0.0/0 est autorisé dans MongoDB Atlas');
  console.error('   3. Vérifiez le nom d\'utilisateur et mot de passe');
  console.error('   4. Assurez-vous que le cluster est actif\n');
  process.exit(1);
});

// Timeout de 10 secondes
setTimeout(() => {
  console.error('⏰ TIMEOUT : La connexion prend trop de temps');
  console.error('💡 Vérifiez votre connexion internet et l\'URI MongoDB');
  process.exit(1);
}, 10000);
