// ═══════════════════════════════════════════════════════════════
// MONGODB CONNECTION - Optimisé pour Vercel Serverless
// ═══════════════════════════════════════════════════════════════

const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'ib-calender'; // Nom de la base de données

if (!MONGODB_URI) {
  console.error('❌ ERREUR: MONGODB_URI non définie dans les variables d\'environnement');
  console.error('Variables disponibles:', Object.keys(process.env).filter(k => k.includes('MONGO')));
}

// Cache global pour réutilisation entre invocations serverless
let cachedClient = null;
let cachedDb = null;

/**
 * Connexion MongoDB avec cache pour performances serverless
 * @returns {Promise<Db>} Instance de la base de données MongoDB
 */
async function connectToDatabase() {
  // Réutiliser la connexion existante si disponible
  if (cachedDb && cachedClient) {
    try {
      // Ping rapide pour vérifier que la connexion est vivante
      await cachedClient.db().admin().ping();
      console.log('✅ Réutilisation connexion MongoDB (cache)');
      return { db: cachedDb, client: cachedClient };
    } catch (error) {
      console.log('⚠️  Connexion expirée, reconnexion...');
      cachedDb = null;
      cachedClient = null;
    }
  }

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI non définie. Vérifiez vos variables d\'environnement Vercel.');
  }

  console.log('⏳ Nouvelle connexion à MongoDB...');
  console.log('🔗 Cluster:', MONGODB_URI.match(/@([^/]+)/)?.[1] || 'unknown');
  console.log('📊 Database:', DB_NAME);

  try {
    // Options de connexion optimisées pour Vercel serverless
    const client = new MongoClient(MONGODB_URI, {
      maxPoolSize: 10,
      minPoolSize: 2,
      maxIdleTimeMS: 30000,
      serverSelectionTimeoutMS: 10000, // 10 secondes max
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      retryWrites: true,
      retryReads: true,
      w: 'majority',
      // Désactiver le monitoring pour réduire la latence
      serverMonitoringMode: 'poll',
      heartbeatFrequencyMS: 30000
    });

    // Connexion avec timeout
    await Promise.race([
      client.connect(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout connexion MongoDB (10s)')), 10000)
      )
    ]);

    const db = client.db(DB_NAME);

    // Vérification rapide de la connexion
    await db.admin().ping();

    // Lister les collections (pour debug)
    const collections = await db.listCollections().toArray();
    console.log('🏷️  Collections:', collections.map(c => c.name).join(', ') || 'aucune');

    // Mettre en cache
    cachedClient = client;
    cachedDb = db;

    console.log('✅ CONNEXION MONGODB RÉUSSIE');
    
    return { db, client };
  } catch (error) {
    console.error('❌ ERREUR CONNEXION MONGODB');
    console.error('Type:', error.name);
    console.error('Message:', error.message);
    console.error('Code:', error.code);

    // Messages d'aide selon le type d'erreur
    if (error.message.includes('authentication failed') || error.message.includes('bad auth')) {
      console.error('🔐 SOLUTION: Vérifiez le username/password dans MONGODB_URI');
      console.error('   → MongoDB Atlas → Database Access → Modifier l\'utilisateur');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      console.error('🌐 SOLUTION: Problème DNS ou nom du cluster incorrect');
      console.error('   → Vérifiez l\'URL du cluster dans MongoDB Atlas');
    } else if (error.message.includes('ETIMEDOUT') || error.message.includes('Timeout')) {
      console.error('⏱️  SOLUTION: Timeout de connexion');
      console.error('   → Vérifiez Network Access dans MongoDB Atlas');
      console.error('   → Ajoutez 0.0.0.0/0 (autoriser toutes les IPs)');
    } else if (error.message.includes('connection') && error.message.includes('closed')) {
      console.error('🔒 SOLUTION: Connexion refusée par le firewall MongoDB Atlas');
      console.error('   → MongoDB Atlas → Network Access → ADD IP ADDRESS');
      console.error('   → Sélectionnez "ALLOW ACCESS FROM ANYWHERE" (0.0.0.0/0)');
      console.error('   → Attendez 5-10 minutes pour la propagation');
    } else if (error.message.includes('MongoServerSelectionError')) {
      console.error('🎯 SOLUTION: Impossible de sélectionner un serveur MongoDB');
      console.error('   → Vérifiez que le cluster n\'est pas en pause');
      console.error('   → Vérifiez Network Access (IP Whitelist)');
    }

    throw error;
  }
}

module.exports = { connectToDatabase };
