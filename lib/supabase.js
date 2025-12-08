// ═══════════════════════════════════════════════════════════════
// SUPABASE CONNECTION - Client PostgreSQL
// ═══════════════════════════════════════════════════════════════

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ ERREUR: Variables Supabase non définies');
  console.error('Variables disponibles:', Object.keys(process.env).filter(k => k.includes('SUPABASE')));
  throw new Error('SUPABASE_URL et SUPABASE_ANON_KEY requis dans les variables d\'environnement');
}

// Créer le client Supabase (singleton)
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

console.log('✅ Client Supabase initialisé');
console.log('🔗 URL:', SUPABASE_URL);

/**
 * Tester la connexion Supabase
 * @returns {Promise<boolean>}
 */
async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('evaluations')
      .select('count', { count: 'exact', head: true });

    if (error) throw error;

    console.log('✅ Connexion Supabase réussie');
    return true;
  } catch (error) {
    console.error('❌ Erreur connexion Supabase:', error.message);
    return false;
  }
}

module.exports = { supabase, testConnection };
