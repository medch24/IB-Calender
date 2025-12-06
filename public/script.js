// ===== CALENDRIER KIS - VERSION ULTRA-MODERNE =====
const API_BASE = '/api/evaluations';

// État de l'application
const appState = {
  currentView: 'all', // 'all' ou nom de matière
  currentClass: 'PEI1',
  matieres: ['Français LL', 'Anglais AL', 'Mathématiques', 'Sciences', 'IS', 'Arts', 'Design'],
  evaluations: []
};

// Utilitaire anti-injection
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, s => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[s]));
}

// Obtenir la classe CSS pour une matière
function getMatiereClass(matiere) {
  const classes = {
    'Français LL': 'francais',
    'Anglais AL': 'anglais',
    'Mathématiques': 'maths',
    'Sciences': 'sciences',
    'IS': 'is',
    'Arts': 'arts',
    'Design': 'design'
  };
  return classes[matiere] || '';
}

// Obtenir l'émoji pour une matière
function getMatiereEmoji(matiere) {
  const emojis = {
    'Français LL': '🇫🇷',
    'Anglais AL': '🇬🇧',
    'Mathématiques': '📐',
    'Sciences': '🔬',
    'IS': '🌍',
    'Arts': '🎨',
    'Design': '💡'
  };
  return emojis[matiere] || '📚';
}

// Créer un chip d'évaluation
function createEvaluationChip(eval) {
  const div = document.createElement('div');
  div.className = `planned ${getMatiereClass(eval.matiere)}`;
  div.dataset.id = eval._id;
  div.dataset.matiere = eval.matiere;
  div.innerHTML = `
    <button class="del" title="Supprimer" data-id="${eval._id}">✖</button>
    <p><strong>${getMatiereEmoji(eval.matiere)} ${escapeHtml(eval.matiere)}</strong></p>
    <p><strong>📑 Unité:</strong> ${escapeHtml(eval.unite)}</p>
    <p><strong>⭐ Critère:</strong> ${escapeHtml(eval.critere)}</p>
  `;
  return div;
}

// Charger les évaluations depuis MongoDB
async function loadEvaluations(classe) {
  document.querySelectorAll('.planned').forEach(el => el.remove());

  try {
    const response = await fetch(`${API_BASE}?classe=${classe}`);
    if (!response.ok) {
      console.error('Erreur de chargement des évaluations');
      return;
    }
    const evaluations = await response.json();
    appState.evaluations = evaluations;

    // Afficher selon la vue actuelle
    displayEvaluations(appState.currentView);
    updateStats();

  } catch (error) {
    console.error("Erreur lors du chargement:", error);
  }
}

// Afficher les évaluations selon le filtre
function displayEvaluations(filter = 'all') {
  document.querySelectorAll('.planned').forEach(el => el.remove());
  
  const filteredEvals = filter === 'all' 
    ? appState.evaluations 
    : appState.evaluations.filter(e => e.matiere === filter);

  filteredEvals.forEach(eval => {
    const cardElement = document.getElementById(eval.semaine);
    if (cardElement) {
      const newChip = createEvaluationChip(eval);
      const boxForm = cardElement.querySelector('.box');
      if (boxForm) {
        cardElement.insertBefore(newChip, boxForm);
      }
    }
  });

  // Masquer les formulaires si on est en vue matière spécifique
  if (filter !== 'all') {
    document.querySelectorAll('.box').forEach(box => {
      const select = box.querySelector('select[name="matiere"]');
      if (select && select.value !== filter) {
        box.style.display = 'none';
      } else {
        box.style.display = 'block';
        if (select) {
          select.value = filter;
          select.disabled = true;
        }
      }
    });
  } else {
    document.querySelectorAll('.box').forEach(box => {
      box.style.display = 'block';
      const select = box.querySelector('select[name="matiere"]');
      if (select) {
        select.disabled = false;
      }
    });
  }
}

// Mettre à jour les statistiques
function updateStats() {
  const statsContainer = document.getElementById('stats');
  if (!statsContainer) return;

  const total = appState.evaluations.length;
  const byMatiere = {};
  
  appState.matieres.forEach(mat => {
    byMatiere[mat] = appState.evaluations.filter(e => e.matiere === mat).length;
  });

  statsContainer.innerHTML = `
    <div class="stat-card">
      <div class="stat-number">${total}</div>
      <div class="stat-label">Total Évaluations</div>
    </div>
    ${appState.matieres.map(mat => `
      <div class="stat-card">
        <div class="stat-number">${byMatiere[mat]}</div>
        <div class="stat-label">${getMatiereEmoji(mat)} ${mat}</div>
      </div>
    `).join('')}
  `;
}

// Ajouter une évaluation
async function addEvaluation(e, cellId) {
  e.preventDefault();
  const form = e.target;
  const classe = appState.currentClass;

  const data = {
    classe: classe,
    semaine: cellId,
    matiere: form.elements.namedItem('matiere')?.value?.trim(),
    unite: form.elements.namedItem('unite')?.value?.trim(),
    critere: form.elements.namedItem('critere')?.value?.trim()
  };

  if (!data.matiere || !data.unite || !data.critere) {
    showNotification('⚠️ Veuillez remplir tous les champs.', 'warning');
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
    appState.evaluations.push(newEval);

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
    updateStats();
    showNotification('✅ Évaluation enregistrée dans MongoDB!', 'success');

  } catch (error) {
    console.error("Erreur:", error);
    showNotification('❌ Échec de l\'enregistrement. Vérifiez MongoDB.', 'error');
  }
}

// Supprimer une évaluation
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
    setTimeout(() => {
      wrap.remove();
      appState.evaluations = appState.evaluations.filter(e => e._id !== evalId);
      updateStats();
    }, 300);

    showNotification('✅ Évaluation supprimée', 'success');

  } catch (error) {
    console.error("Erreur:", error);
    showNotification('❌ Échec de la suppression.', 'error');
  }
});

// Générer le document Word
async function generateWordDocument() {
  const classe = appState.currentClass;
  
  try {
    if (appState.evaluations.length === 0) {
      showNotification('⚠️ Aucune évaluation pour cette classe.', 'warning');
      return;
    }

    // Grouper par semaine
    const semaines = {};
    appState.evaluations.forEach(eval => {
      if (!semaines[eval.semaine]) semaines[eval.semaine] = [];
      semaines[eval.semaine].push(eval);
    });

    // Générer le HTML pour Word
    let htmlContent = `<!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <title>Calendrier - ${classe}</title>
      <style>
        body { font-family: Arial; padding: 20px; }
        .header { text-align: center; border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
        .header h1 { color: #2563eb; margin: 0; }
        .week { margin: 20px 0; border: 2px solid #e2e8f0; border-radius: 10px; padding: 15px; page-break-inside: avoid; }
        .week h2 { background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%); color: white; padding: 10px; border-radius: 5px; margin: 0 0 15px 0; }
        .eval { background: #f8fafc; padding: 12px; margin: 10px 0; border-left: 4px solid #10b981; border-radius: 5px; }
        .eval strong { color: #047857; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>📅 Calendrier des Évaluations</h1>
        <p><strong>Classe:</strong> ${classe} | <strong>Année:</strong> 2025-2026</p>
      </div>`;

    Object.keys(semaines).sort().forEach(sem => {
      htmlContent += `<div class="week"><h2>📍 ${sem.replace('S', 'Semaine ')}</h2>`;
      semaines[sem].forEach(e => {
        htmlContent += `<div class="eval">
          <p><strong>${getMatiereEmoji(e.matiere)} Matière:</strong> ${escapeHtml(e.matiere)}</p>
          <p><strong>📑 Unité:</strong> ${escapeHtml(e.unite)}</p>
          <p><strong>⭐ Critère:</strong> ${escapeHtml(e.critere)}</p>
        </div>`;
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

    showNotification('📄 Document généré avec succès!', 'success');

  } catch (error) {
    console.error("Erreur:", error);
    showNotification('❌ Erreur lors de la génération.', 'error');
  }
}

// Système de notifications
function showNotification(message, type = 'info') {
  const notif = document.createElement('div');
  notif.className = `notification ${type}`;
  notif.textContent = message;
  notif.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    padding: 12px 20px;
    border-radius: 8px;
    font-weight: 700;
    font-size: 13px;
    z-index: 10000;
    animation: slideInRight 0.3s ease, slideOutRight 0.3s ease 2.7s;
    box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
  `;
  
  if (type === 'success') {
    notif.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
    notif.style.color = 'white';
  } else if (type === 'error') {
    notif.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
    notif.style.color = 'white';
  } else if (type === 'warning') {
    notif.style.background = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
    notif.style.color = 'white';
  }
  
  document.body.appendChild(notif);
  setTimeout(() => notif.remove(), 3000);
}

// Créer la barre d'onglets
function createTabs() {
  const tabsHTML = `
    <div class="tabs-container">
      <button class="tab active" data-view="all">📊 Vue Générale</button>
      ${appState.matieres.map(mat => `
        <button class="tab" data-view="${mat}">${getMatiereEmoji(mat)} ${mat}</button>
      `).join('')}
    </div>
  `;
  
  const infobar = document.querySelector('.infobar');
  if (infobar) {
    infobar.insertAdjacentHTML('afterend', tabsHTML);
    
    // Ajouter les statistiques
    infobar.insertAdjacentHTML('afterend', '<div class="stats" id="stats"></div>');
  }
}

// Gérer les clics sur les onglets
document.addEventListener('click', (e) => {
  const tab = e.target.closest('.tab');
  if (!tab) return;

  const view = tab.dataset.view;
  appState.currentView = view;

  // Mettre à jour l'UI des onglets
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  tab.classList.add('active');

  // Afficher les évaluations selon le filtre
  displayEvaluations(view);
});

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', () => {
  const sel = document.getElementById('classe');
  const lbl = document.getElementById('lblClasse');
  const btnGenerateWord = document.getElementById('btnGenerateWord');

  // Créer les onglets
  createTabs();

  // Chargement initial
  const initialClasse = sel.value;
  appState.currentClass = initialClasse;
  loadEvaluations(initialClasse);

  // Changement de classe
  sel.addEventListener('change', () => {
    const nouvelleClasse = sel.value;
    appState.currentClass = nouvelleClasse;
    lbl.innerHTML = '<strong>🎓 Classe :</strong> ' + nouvelleClasse;
    loadEvaluations(nouvelleClasse);
  });

  // Bouton Word
  btnGenerateWord.addEventListener('click', generateWordDocument);
});

// Exposer globalement pour les formulaires inline
window.addEvaluation = addEvaluation;
