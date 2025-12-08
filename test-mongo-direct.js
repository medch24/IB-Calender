const mongoose = require('mongoose');

const URI = 'mongodb+srv://mohamedsherif2025:Mmedch86@ibcalender.zusslxh.mongodb.net/ib-calendar?retryWrites=true&w=majority&appName=ibcalender';

console.log('━'.repeat(60));
console.log('🔍 TEST DIRECT CONNEXION MONGODB');
console.log('━'.repeat(60));
console.log('');
console.log('URI:', URI.substring(0, 30) + '***');
console.log('');

mongoose.connect(URI, {
  serverSelectionTimeoutMS: 10000
})
.then(() => {
  console.log('━'.repeat(60));
  console.log('✅✅✅ CONNEXION RÉUSSIE ! ✅✅✅');
  console.log('━'.repeat(60));
  console.log('📊 Base de données:', mongoose.connection.name);
  console.log('🌐 Host:', mongoose.connection.host);
  console.log('🔌 État:', mongoose.connection.readyState);
  console.log('━'.repeat(60));
  console.log('');
  console.log('🎯 L\'URI fonctionne ! Le problème est dans Vercel.');
  console.log('💡 Configurez MONGODB_URI dans Vercel Environment Variables');
  console.log('');
  process.exit(0);
})
.catch(err => {
  console.log('━'.repeat(60));
  console.log('❌❌❌ ÉCHEC CONNEXION ! ❌❌❌');
  console.log('━'.repeat(60));
  console.log('Erreur:', err.message);
  console.log('');
  
  if (err.message.includes('IP')) {
    console.log('🔐 PROBLÈME : IP non autorisée');
    console.log('');
    console.log('✅ SOLUTION :');
    console.log('1. https://cloud.mongodb.com');
    console.log('2. Network Access');
    console.log('3. SUPPRIMEZ 0.0.0.0/0 existant');
    console.log('4. ADD IP ADDRESS');
    console.log('5. ALLOW ACCESS FROM ANYWHERE');
    console.log('6. Attendez 2-3 minutes');
    console.log('7. Relancez : node test-mongo-direct.js');
  } else if (err.message.includes('Auth')) {
    console.log('🔑 PROBLÈME : Identifiants incorrects');
    console.log('');
    console.log('✅ SOLUTION :');
    console.log('1. Vérifiez username: mohamedsherif2025');
    console.log('2. Vérifiez password: Mmedch86');
    console.log('3. Database Access dans MongoDB Atlas');
  } else {
    console.log('⚠️  PROBLÈME : Autre erreur');
    console.log('');
    console.log('✅ SOLUTION :');
    console.log('1. Vérifiez cluster actif (pas Paused)');
    console.log('2. Vérifiez URI complète et correcte');
    console.log('3. Lisez SOLUTION_URGENTE.md');
  }
  
  console.log('');
  console.log('━'.repeat(60));
  process.exit(1);
});
