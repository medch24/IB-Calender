// ═══════════════════════════════════════════════════════════════
// TEST DE CONNEXION MONGODB
// ═══════════════════════════════════════════════════════════════

require('dotenv').config();
const { connectToDatabase } = require('./lib/mongodb');

async function testConnection() {
  console.log('\n🔌 TEST DE CONNEXION MONGODB');
  console.log('════════════════════════════════════════════\n');

  try {
    console.log('1️⃣  Vérification de la variable MONGODB_URI...');
    
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI non définie dans .env');
      console.error('');
      console.error('📝 Créez un fichier .env avec :');
      console.error('MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database');
      process.exit(1);
    }

    const uri = process.env.MONGODB_URI;
    const masked = uri.replace(/:[^:@]+@/, ':****@');
    console.log('✅ MONGODB_URI définie');
    console.log('🔗', masked);
    console.log('');

    console.log('2️⃣  Tentative de connexion...');
    const startTime = Date.now();
    
    const { db, client } = await connectToDatabase();
    
    const duration = Date.now() - startTime;
    console.log(`✅ Connexion réussie en ${duration}ms`);
    console.log('');

    console.log('3️⃣  Informations de la base de données...');
    console.log('📊 Nom de la base:', db.databaseName);
    console.log('');

    console.log('4️⃣  Liste des collections...');
    const collections = await db.listCollections().toArray();
    
    if (collections.length === 0) {
      console.log('⚠️  Aucune collection trouvée');
      console.log('   (Normal si la base est nouvelle)');
    } else {
      collections.forEach(col => {
        console.log(`   📁 ${col.name}`);
      });
    }
    console.log('');

    console.log('5️⃣  Test de la collection "evaluations"...');
    const evalCollection = db.collection('evaluations');
    const count = await evalCollection.countDocuments();
    console.log(`📈 Nombre d'évaluations: ${count}`);
    
    if (count > 0) {
      console.log('');
      console.log('📄 Exemple d\'évaluation:');
      const sample = await evalCollection.findOne();
      console.log(JSON.stringify(sample, null, 2));
    }
    console.log('');

    console.log('6️⃣  Test de ping...');
    await db.admin().ping();
    console.log('✅ Ping réussi');
    console.log('');

    console.log('════════════════════════════════════════════');
    console.log('✅ TOUS LES TESTS RÉUSSIS !');
    console.log('════════════════════════════════════════════\n');

    await client.close();
    process.exit(0);

  } catch (error) {
    console.error('');
    console.error('════════════════════════════════════════════');
    console.error('❌ ERREUR DE CONNEXION');
    console.error('════════════════════════════════════════════');
    console.error('');
    console.error('Type:', error.name);
    console.error('Message:', error.message);
    
    if (error.code) {
      console.error('Code:', error.code);
    }
    
    console.error('');
    console.error('💡 SOLUTIONS POSSIBLES:');
    console.error('');

    if (error.message.includes('authentication failed') || error.message.includes('bad auth')) {
      console.error('🔐 Problème d\'authentification:');
      console.error('   → Vérifiez le username dans MONGODB_URI');
      console.error('   → Vérifiez le password dans MONGODB_URI');
      console.error('   → MongoDB Atlas → Database Access');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      console.error('🌐 Problème DNS:');
      console.error('   → Vérifiez l\'URL du cluster dans MONGODB_URI');
      console.error('   → Exemple: @cluster.mongodb.net');
    } else if (error.message.includes('ETIMEDOUT') || error.message.includes('Timeout')) {
      console.error('⏱️  Timeout de connexion:');
      console.error('   → Vérifiez Network Access dans MongoDB Atlas');
      console.error('   → Ajoutez 0.0.0.0/0 pour autoriser toutes les IPs');
    } else if (error.message.includes('connection') && error.message.includes('closed')) {
      console.error('🔒 Connexion refusée:');
      console.error('   → MongoDB Atlas → Network Access');
      console.error('   → ADD IP ADDRESS → ALLOW ACCESS FROM ANYWHERE (0.0.0.0/0)');
      console.error('   → Attendez 5-10 minutes pour la propagation');
    } else if (error.message.includes('MongoServerSelectionError')) {
      console.error('🎯 Impossible de sélectionner un serveur:');
      console.error('   → Vérifiez que le cluster n\'est pas en pause');
      console.error('   → Vérifiez Network Access (IP Whitelist)');
      console.error('   → MongoDB Atlas → Clusters → Status');
    }

    console.error('');
    console.error('📚 Documentation:');
    console.error('   → Lisez SOLUTION_VERCEL_V2.md');
    console.error('   → Section "DÉPANNAGE"');
    console.error('');

    process.exit(1);
  }
}

// Exécution
testConnection();
