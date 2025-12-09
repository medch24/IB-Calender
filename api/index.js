const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();

// Configuration CORS
app.use(cors());
app.use(express.json());

// Configuration Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ SUPABASE_URL ou SUPABASE_ANON_KEY manquant');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Test de connexion
app.get('/api/test', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('evaluations')
      .select('count');
    
    if (error) throw error;
    
    res.json({
      success: true,
      message: 'Connexion à Supabase réussie',
      count: data.length
    });
  } catch (error) {
    console.error('Erreur test Supabase:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/evaluations - Récupérer toutes les évaluations
app.get('/api/evaluations', async (req, res) => {
  try {
    console.log('📥 GET /api/evaluations - Récupération des évaluations');
    
    const { data, error } = await supabase
      .from('evaluations')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) {
      console.error('❌ Erreur Supabase:', error);
      throw error;
    }
    
    console.log(`✅ ${data.length} évaluations récupérées`);
    res.json(data);
  } catch (error) {
    console.error('❌ Erreur chargement:', error);
    res.status(500).json({
      error: 'Erreur lors du chargement des évaluations',
      details: error.message
    });
  }
});

// GET /api/evaluations/:classe - Récupérer les évaluations d'une classe
app.get('/api/evaluations/:classe', async (req, res) => {
  try {
    const { classe } = req.params;
    console.log(`📥 GET /api/evaluations/${classe}`);
    
    const { data, error } = await supabase
      .from('evaluations')
      .select('*')
      .eq('classe', classe)
      .order('semaine', { ascending: true });
    
    if (error) {
      console.error('❌ Erreur Supabase:', error);
      throw error;
    }
    
    console.log(`✅ ${data.length} évaluations trouvées pour ${classe}`);
    res.json(data);
  } catch (error) {
    console.error('❌ Erreur chargement:', error);
    res.status(500).json({
      error: 'Erreur lors du chargement des évaluations',
      details: error.message
    });
  }
});

// POST /api/evaluations - Ajouter une évaluation
app.post('/api/evaluations', async (req, res) => {
  try {
    const { classe, semaine, matiere, unite, critere } = req.body;
    
    console.log('📝 POST /api/evaluations - Ajout évaluation:', {
      classe, semaine, matiere, unite, critere
    });
    
    // Validation
    if (!classe || !semaine || !matiere || !unite || !critere) {
      return res.status(400).json({
        error: 'Tous les champs sont requis'
      });
    }
    
    const { data, error } = await supabase
      .from('evaluations')
      .insert([{
        classe: classe.trim(),
        semaine: semaine.toString().trim(),
        matiere: matiere.trim(),
        unite: unite.trim(),
        critere: critere.trim()
      }])
      .select();
    
    if (error) {
      console.error('❌ Erreur Supabase:', error);
      throw error;
    }
    
    console.log('✅ Évaluation ajoutée:', data[0]);
    res.status(201).json(data[0]);
  } catch (error) {
    console.error('❌ Erreur ajout:', error);
    res.status(500).json({
      error: 'Erreur lors de l\'ajout de l\'évaluation',
      details: error.message
    });
  }
});

// PUT /api/evaluations/:id - Modifier une évaluation
app.put('/api/evaluations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { classe, semaine, matiere, unite, critere } = req.body;
    
    console.log(`📝 PUT /api/evaluations/${id} - Modification`);
    
    const updateData = {};
    if (classe) updateData.classe = classe.trim();
    if (semaine) updateData.semaine = semaine.toString().trim();
    if (matiere) updateData.matiere = matiere.trim();
    if (unite) updateData.unite = unite.trim();
    if (critere) updateData.critere = critere.trim();
    
    const { data, error } = await supabase
      .from('evaluations')
      .update(updateData)
      .eq('id', id)
      .select();
    
    if (error) {
      console.error('❌ Erreur Supabase:', error);
      throw error;
    }
    
    if (data.length === 0) {
      return res.status(404).json({
        error: 'Évaluation non trouvée'
      });
    }
    
    console.log('✅ Évaluation modifiée:', data[0]);
    res.json(data[0]);
  } catch (error) {
    console.error('❌ Erreur modification:', error);
    res.status(500).json({
      error: 'Erreur lors de la modification de l\'évaluation',
      details: error.message
    });
  }
});

// DELETE /api/evaluations/:id - Supprimer une évaluation
app.delete('/api/evaluations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🗑️ DELETE /api/evaluations/${id}`);
    
    const { data, error } = await supabase
      .from('evaluations')
      .delete()
      .eq('id', id)
      .select();
    
    if (error) {
      console.error('❌ Erreur Supabase:', error);
      throw error;
    }
    
    if (data.length === 0) {
      return res.status(404).json({
        error: 'Évaluation non trouvée'
      });
    }
    
    console.log('✅ Évaluation supprimée');
    res.json({ message: 'Évaluation supprimée avec succès' });
  } catch (error) {
    console.error('❌ Erreur suppression:', error);
    res.status(500).json({
      error: 'Erreur lors de la suppression de l\'évaluation',
      details: error.message
    });
  }
});

// Route de test
app.get('/api', (req, res) => {
  res.json({
    message: 'API Calendrier des Évaluations - Supabase',
    version: '2.0.0',
    endpoints: [
      'GET /api/test',
      'GET /api/evaluations',
      'GET /api/evaluations/:classe',
      'POST /api/evaluations',
      'PUT /api/evaluations/:id',
      'DELETE /api/evaluations/:id'
    ]
  });
});

// Export pour Vercel
module.exports = app;
