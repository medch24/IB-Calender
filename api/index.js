const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const { Document, Packer, Paragraph, TextRun, Table, TableCell, TableRow, WidthType, AlignmentType, HeadingLevel, BorderStyle } = require('docx');

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

// GET /api/evaluations - Récupérer toutes les évaluations (avec filtre optionnel)
app.get('/api/evaluations', async (req, res) => {
  try {
    const { classe } = req.query;
    
    if (classe) {
      // Si classe est fournie en query parameter
      console.log(`📥 GET /api/evaluations?classe=${classe}`);
      
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
    } else {
      // Récupérer toutes les évaluations
      console.log('📥 GET /api/evaluations - Récupération de toutes les évaluations');
      
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
    }
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

// POST /api/export - Exporter en Word
app.post('/api/export', async (req, res) => {
  try {
    const { classe, matiere, evaluations } = req.body;
    
    console.log(`📝 POST /api/export - ${classe} - ${matiere} (${evaluations.length} évaluations)`);
    
    if (!classe || !matiere || !evaluations || evaluations.length === 0) {
      return res.status(400).json({
        error: 'Données invalides pour l\'export'
      });
    }
    
    // Générer le document Word
    const doc = await generateWordDocument(classe, matiere, evaluations);
    
    // Convertir en buffer
    const buffer = await Packer.toBuffer(doc);
    
    // Nom du fichier
    // Nom du fichier (sans caractères accentués pour Vercel)
    const safeMatiere = matiere
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '_');
    const filename = `Calendrier_${classe}_${safeMatiere}.docx`;
    
    // Envoyer le fichier
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);
    
    console.log(`✅ Document Word généré: ${filename}`);
  } catch (error) {
    console.error('❌ Erreur export Word:', error);
    res.status(500).json({
      error: 'Erreur lors de l\'export Word',
      details: error.message
    });
  }
});

// Fonction de génération du document Word
async function generateWordDocument(classe, matiere, evaluations) {
  // Grouper par semaine
  const evalsByWeek = {};
  evaluations.forEach(eval => {
    if (!evalsByWeek[eval.semaine]) {
      evalsByWeek[eval.semaine] = [];
    }
    evalsByWeek[eval.semaine].push(eval);
  });
  
  // Trier les semaines
  const sortedWeeks = Object.keys(evalsByWeek).sort((a, b) => {
    const numA = parseInt(a.replace('S', ''));
    const numB = parseInt(b.replace('S', ''));
    return numA - numB;
  });
  
  // Créer le document
  const children = [];
  
  // En-tête
  children.push(
    new Paragraph({
      text: 'Calendrier des Évaluations',
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 }
    }),
    new Paragraph({
      text: 'Kawthar International School - Année 2025-2026',
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 }
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Classe: ${classe}`,
          bold: true,
          size: 28
        })
      ],
      spacing: { after: 200 }
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Matière: ${matiere}`,
          bold: true,
          size: 28
        })
      ],
      spacing: { after: 400 }
    })
  );
  
  // Tableau des évaluations
  const tableRows = [
    // En-tête du tableau
    new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph({ text: 'Semaine', bold: true })],
          shading: { fill: '2E5C8A' },
          width: { size: 20, type: WidthType.PERCENTAGE }
        }),
        new TableCell({
          children: [new Paragraph({ text: 'Matière', bold: true })],
          shading: { fill: '2E5C8A' },
          width: { size: 25, type: WidthType.PERCENTAGE }
        }),
        new TableCell({
          children: [new Paragraph({ text: 'Unité', bold: true })],
          shading: { fill: '2E5C8A' },
          width: { size: 20, type: WidthType.PERCENTAGE }
        }),
        new TableCell({
          children: [new Paragraph({ text: 'Critère', bold: true })],
          shading: { fill: '2E5C8A' },
          width: { size: 35, type: WidthType.PERCENTAGE }
        })
      ]
    })
  ];
  
  // Ajouter les évaluations par semaine
  sortedWeeks.forEach(semaine => {
    const evals = evalsByWeek[semaine];
    evals.forEach((eval, index) => {
      tableRows.push(
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph(index === 0 ? semaine : '')],
              verticalAlign: 'center'
            }),
            new TableCell({
              children: [new Paragraph(eval.matiere || '')],
              verticalAlign: 'center'
            }),
            new TableCell({
              children: [new Paragraph(eval.unite || '')],
              verticalAlign: 'center'
            }),
            new TableCell({
              children: [new Paragraph(eval.critere || '')],
              verticalAlign: 'center'
            })
          ]
        })
      );
    });
  });
  
  const table = new Table({
    rows: tableRows,
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
      left: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
      right: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
      insideVertical: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' }
    }
  });
  
  children.push(table);
  
  // Pied de page
  children.push(
    new Paragraph({
      text: '',
      spacing: { before: 400 }
    }),
    new Paragraph({
      text: `Total: ${evaluations.length} évaluation(s)`,
      italics: true,
      alignment: AlignmentType.RIGHT
    }),
    new Paragraph({
      text: `Généré le ${new Date().toLocaleDateString('fr-FR')}`,
      italics: true,
      alignment: AlignmentType.RIGHT,
      spacing: { before: 100 }
    })
  );
  
  return new Document({
    sections: [{
      properties: {},
      children: children
    }]
  });
}

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
