// Script pour intégration MongoDB + Génération Word
const API_BASE = '/api/evaluations';

// Utilitaire anti-injection
function escapeHtml(str){
  if (!str) return '';
  return str.replace(/[&<>"']/g, s => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[s]));
}

// Création d'un chip d'évaluation
function createEvaluationChip(eval) {
  const div = document.createElement('div');
  div.className = 'planned';
  div.dataset.id = eval._id;
  div.innerHTML = `
    <button class="del" title="Supprimer" data-id="${eval._id}">✖</button>
    <p><strong>📖 Matière:</strong> ${escapeHtml(eval.matiere)}</p>
    <p><strong>📑 Unité:</strong> ${escapeHtml(eval.unite)}</p>
    <p><strong>⭐ Critère:</strong> ${escapeHtml(eval.critere)}</p>
  `;
  return div;
}

// Chargement des évaluations depuis MongoDB
async function loadEvaluations(classe) {
  // Supprimer toutes les évaluations affichées
  document.querySelectorAll('.planned').forEach(el => el.remove());

  try {
    const response = await fetch(`${API_BASE}?classe=${classe}`);
    if (!response.ok) {
      console.error('Erreur de chargement des évaluations');
      return;
    }
    const evaluations = await response.json();

    evaluations.forEach(eval => {
      const cardElement = document.getElementById(eval.semaine);
      if (cardElement) {
        const newChip = createEvaluationChip(eval);
        const boxForm = cardElement.querySelector('.box');
        if (boxForm) {
          cardElement.insertBefore(newChip, boxForm);
        }
      }
    });

  } catch (error) {
    console.error("Erreur lors du chargement:", error);
  }
}

// Ajout d'une évaluation avec sauvegarde MongoDB
async function addEvaluation(e, cellId) {
  e.preventDefault();
  const form = e.target;
  const classe = document.getElementById('classe').value;

  const data = {
    classe: classe,
    semaine: cellId,
    matiere: form.elements.namedItem('matiere')?.value?.trim(),
    unite: form.elements.namedItem('unite')?.value?.trim(),
    critere: form.elements.namedItem('critere')?.value?.trim()
  };

  if (!data.matiere || !data.unite || !data.critere) {
    alert('Veuillez remplir tous les champs.');
    return;
  }

  try {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Erreur serveur');
    }
    
    const newEval = await response.json();

    // Ajouter visuellement
    const cardElement = document.getElementById(cellId);
    if (cardElement) {
      const newChip = createEvaluationChip(newEval);
      const boxForm = cardElement.querySelector('.box');
      if (boxForm) {
        cardElement.insertBefore(newChip, boxForm);
      }
    }

    form.reset();
    alert('✅ Évaluation enregistrée avec succès dans MongoDB!');

  } catch (error) {
    console.error("Erreur:", error);
    alert('❌ Échec de l\'enregistrement. Vérifiez que le serveur est démarré et MongoDB est connecté.');
  }
}

// Suppression d'évaluation
document.addEventListener('click', async (ev) => {
  const btn = ev.target.closest('.del');
  if (!btn) return;
  
  if (!confirm('Supprimer cette évaluation?')) return;

  const evalId = btn.dataset.id;
  const wrap = btn.closest('.planned');
  if (!evalId || !wrap) return;

  try {
    const response = await fetch(`${API_BASE}/${evalId}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Erreur suppression');
    }

    wrap.classList.add('fade-out');
    setTimeout(() => wrap.remove(), 180);

  } catch (error) {
    console.error("Erreur:", error);
    alert('❌ Échec de la suppression.');
  }
});

// Génération du document Word
async function generateWordDocument() {
  const classe = document.getElementById('classe').value;
  
  try {
    const response = await fetch(`${API_BASE}?classe=${classe}`);
    if (!response.ok) throw new Error('Erreur');
    const evaluations = await response.json();

    if (evaluations.length === 0) {
      alert('⚠️ Aucune évaluation pour cette classe. Veuillez d\'abord enregistrer des évaluations.');
      return;
    }

    // Grouper par semaine
    const semaines = {};
    evaluations.forEach(eval => {
      if (!semaines[eval.semaine]) semaines[eval.semaine] = [];
      semaines[eval.semaine].push(eval);
    });

    // Générer le HTML pour Word
    let htmlContent = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>Calendrier - ${classe}</title><style>body{font-family:Arial;padding:20px}.header{text-align:center;border-bottom:3px solid #1a3c8e;padding-bottom:20px}.week{margin:20px 0;border:2px solid #ddd;border-radius:10px;padding:15px}.week h2{background:#1a3c8e;color:white;padding:10px;border-radius:5px}.eval{background:#e9f7ee;padding:10px;margin:10px 0;border-left:4px solid #2e7d32}</style></head><body><div class="header"><h1>Calendrier des Évaluations</h1><p>Classe: ${classe} | Année: 2025-2026</p></div>`;

    Object.keys(semaines).sort().forEach(sem => {
      htmlContent += `<div class="week"><h2>${sem.replace('S', 'Semaine ')}</h2>`;
      semaines[sem].forEach(e => {
        htmlContent += `<div class="eval"><strong>Matière:</strong> ${escapeHtml(e.matiere)}<br><strong>Unité:</strong> ${escapeHtml(e.unite)}<br><strong>Critère:</strong> ${escapeHtml(e.critere)}</div>`;
      });
      htmlContent += '</div>';
    });

    htmlContent += '</body></html>';

    // Télécharger le fichier
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Calendrier_${classe}_${new Date().getFullYear()}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert('📄 Document généré avec succès! Ouvrez-le avec Microsoft Word pour le convertir en .docx');

  } catch (error) {
    console.error("Erreur:", error);
    alert('❌ Erreur lors de la génération du document.');
  }
}

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', () => {
  const sel = document.getElementById('classe');
  const lbl = document.getElementById('lblClasse');
  const btnGenerateWord = document.getElementById('btnGenerateWord');

  // Chargement initial
  const initialClasse = sel.value;
  loadEvaluations(initialClasse);

  // Changement de classe
  sel.addEventListener('change', () => {
    const nouvelleClasse = sel.value;
    lbl.innerHTML = '<strong>🎓 Classe :</strong> ' + nouvelleClasse;
    loadEvaluations(nouvelleClasse);
  });

  // Bouton Word
  btnGenerateWord.addEventListener('click', generateWordDocument);
});

// Exposer globalement pour les formulaires inline
window.addEvaluation = addEvaluation;
