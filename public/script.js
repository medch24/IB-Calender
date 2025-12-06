// ===== CONFIGURATION GLOBALE =====
const API_BASE = '/api/evaluations';

// ===== ÉTAT DE L'APPLICATION =====
const appState = {
  currentView: 'all',
  currentClass: 'PEI1',
  matieres: ['Français LL', 'Anglais AL', 'Mathématiques', 'Sciences', 'IS', 'Arts', 'Design'],
  evaluations: [],
  weeks: [
    { id: 'S2', title: 'Semaine 2', date: 'Sep. 07 – Sep. 11', type: 'eval' },
    { id: 'S3', title: 'Semaine 3', date: 'Sep. 14 – Sep. 18', type: 'eval' },
    { id: 'S4', title: 'Semaine 4', date: 'Sep. 21 – Sep. 25', type: 'eval' },
    { id: 'S5', title: 'Semaine 5', date: 'Sep. 28 – Oct. 02', type: 'eval' },
    { id: 'S6', title: 'Semaine 6', date: 'Oct. 05 – Oct. 09', type: 'eval' },
    { id: 'S7', title: 'Semaine 7', date: 'Oct. 12 – Oct. 16', type: 'eval' },
    { id: 'S8', title: 'Semaine 8', date: 'Oct. 19 – Oct. 23', type: 'eval' },
    { id: 'S9', title: 'Semaine 9', date: 'Oct. 26 – Oct. 30', type: 'eval' },
    { id: 'S10', title: 'Semaine 10', date: 'Nov. 02 – Nov. 06', type: 'eval' },
    { id: 'S11', title: 'Semaine 11', date: 'Nov. 09 – Nov. 13', type: 'eval' },
    { id: 'S12', title: 'Semaine 12', date: 'Nov. 16 – Nov. 20', type: 'eval' },
    { id: 'S13', title: 'Semaine 13', date: 'Nov. 30 – Dec. 4', type: 'eval' },
    { id: 'S14', title: 'Semaine 14', date: 'Dec. 7 – Dec. 11', type: 'eval' },
    { id: 'S15', title: 'Semaine 15', date: 'Dec. 14 – Dec. 18', type: 'eval' },
    { id: 'S19', title: 'Semaine 19', date: 'Jan. 18 – Jan. 22', type: 'eval' },
    { id: 'S20', title: 'Semaine 20', date: 'Jan. 25 – Jan. 29', type: 'eval' },
    { id: 'S21', title: 'Semaine 21', date: 'Fev. 01 – Fev. 05', type: 'eval' },
    { id: 'S22', title: 'Semaine 22', date: 'Fev. 08 – Fev. 12', type: 'eval' },
    { id: 'S23', title: 'Semaine 23', date: 'Fev. 15 – Fev. 19', type: 'eval' },
    { id: 'S24', title: 'Semaine 24', date: 'Fev. 22 – Fev. 26', type: 'eval' },
    { id: 'S25', title: 'Semaine 25', date: 'Mars 01 – Mars 05', type: 'eval' },
    { id: 'S26', title: 'Semaine 26', date: 'Mars 29 – Avril 02', type: 'eval' },
    { id: 'S27', title: 'Semaine 27', date: 'Avril 05 – Avril 09', type: 'eval' },
    { id: 'S29', title: 'Semaine 29', date: 'April 19 – April 23', type: 'eval' },
    { id: 'S30', title: 'Semaine 30', date: 'April 26 – April 30', type: 'eval' },
    { id: 'S31', title: 'Semaine 31', date: 'Mai 03 – Mai 07', type: 'eval' },
    { id: 'S32', title: 'Semaine 32', date: 'Mai 10 – May 14', type: 'eval' }
  ]
};

// ===== UTILITAIRES =====
function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, s => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[s]));
}

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

// ===== AFFICHAGE DES STATISTIQUES =====
function updateStats() {
  const statsBar = document.getElementById('statsBar');
  if (!statsBar) return;

  const total = appState.evaluations.length;
  const byMatiere = {};
  
  appState.matieres.forEach(mat => {
    byMatiere[mat] = appState.evaluations.filter(e => e.matiere === mat).length;
  });

  let html = `
    <div class="stat-card">
      <div class="stat-number">${total}</div>
      <div class="stat-label">📊 Total</div>
    </div>
  `;
  
  appState.matieres.forEach(mat => {
    html += `
      <div class="stat-card">
        <div class="stat-number">${byMatiere[mat]}</div>
        <div class="stat-label">${getMatiereEmoji(mat)} ${mat}</div>
      </div>
    `;
  });

  statsBar.innerHTML = html;
}

// ===== GÉNÉRATION DU CALENDRIER =====
function renderCalendar() {
  const grid = document.getElementById('calendarGrid');
  if (!grid) return;

  const currentView = appState.currentView;
  const filteredWeeks = appState.weeks;
  
  grid.innerHTML = '';
  
  filteredWeeks.forEach(week => {
    const weekCard = document.createElement('div');
    weekCard.className = 'week-card';
    weekCard.id = week.id;
    
    let evaluations = appState.evaluations.filter(e => e.semaine === week.id);
    
    // Filtrer par matière si nécessaire
    if (currentView !== 'all') {
      evaluations = evaluations.filter(e => e.matiere === currentView);
    }
    
    let evaluationsHTML = '';
    evaluations.forEach(eval => {
      evaluationsHTML += `
        <div class="evaluation-chip ${getMatiereClass(eval.matiere)}" data-id="${eval._id}">
          <div class="evaluation-content">
            <div class="evaluation-matiere">${getMatiereEmoji(eval.matiere)} ${escapeHtml(eval.matiere)}</div>
            <div class="evaluation-detail">📑 ${escapeHtml(eval.unite)}</div>
            <div class="evaluation-detail">⭐ Critère ${escapeHtml(eval.critere)}</div>
          </div>
          <button class="delete-btn" data-id="${eval._id}" title="Supprimer">✖</button>
        </div>
      `;
    });
    
    // Afficher le formulaire seulement en mode vue générale ou pour la matière sélectionnée
    let formHTML = '';
    if (currentView === 'all') {
      formHTML = `
        <div class="add-form">
          <div class="form-title">✏️ Ajouter une évaluation</div>
          <form onsubmit="addEvaluation(event, '${week.id}')">
            <div class="form-group">
              <label>📖 Matière</label>
              <select name="matiere" required>
                <option value="">-- Choisir --</option>
                ${appState.matieres.map(m => `<option value="${m}">${m}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label>📑 Unité / Thème</label>
              <input name="unite" type="text" placeholder="Nom de l'unité" required/>
            </div>
            <div class="form-group">
              <label>⭐ Critère</label>
              <select name="critere" required>
                <option value="">Choisir</option>
                <option>A</option>
                <option>B</option>
                <option>C</option>
                <option>D</option>
              </select>
            </div>
            <button type="submit" class="btn-submit">💾 Enregistrer</button>
          </form>
        </div>
      `;
    } else {
      // Formulaire pré-rempli avec la matière
      formHTML = `
        <div class="add-form">
          <div class="form-title">✏️ Ajouter ${getMatiereEmoji(currentView)} ${currentView}</div>
          <form onsubmit="addEvaluation(event, '${week.id}')">
            <input type="hidden" name="matiere" value="${currentView}" />
            <div class="form-group">
              <label>📑 Unité / Thème</label>
              <input name="unite" type="text" placeholder="Nom de l'unité" required/>
            </div>
            <div class="form-group">
              <label>⭐ Critère</label>
              <select name="critere" required>
                <option value="">Choisir</option>
                <option>A</option>
                <option>B</option>
                <option>C</option>
                <option>D</option>
              </select>
            </div>
            <button type="submit" class="btn-submit">💾 Enregistrer</button>
          </form>
        </div>
      `;
    }
    
    weekCard.innerHTML = `
      <div class="week-header">
        <div>
          <div class="week-title">📅 ${week.title}</div>
          <div class="week-date">${week.date}</div>
        </div>
      </div>
      <div class="evaluations-list">
        ${evaluationsHTML}
      </div>
      ${formHTML}
    `;
    
    grid.appendChild(weekCard);
  });
}

// ===== CHARGEMENT DES ÉVALUATIONS =====
async function loadEvaluations(classe) {
  try {
    const response = await fetch(`${API_BASE}?classe=${classe}`);
    if (!response.ok) {
      throw new Error('Erreur de chargement');
    }
    const evaluations = await response.json();
    appState.evaluations = evaluations;
    
    renderCalendar();
    updateStats();
    
  } catch (error) {
    console.error('Erreur:', error);
    showNotification('❌ Erreur de chargement des évaluations', 'error');
  }
}

// ===== AJOUTER UNE ÉVALUATION =====
async function addEvaluation(e, weekId) {
  e.preventDefault();
  const form = e.target;
  const classe = appState.currentClass;

  const data = {
    classe: classe,
    semaine: weekId,
    matiere: form.elements.namedItem('matiere')?.value?.trim(),
    unite: form.elements.namedItem('unite')?.value?.trim(),
    critere: form.elements.namedItem('critere')?.value?.trim()
  };

  if (!data.matiere || !data.unite || !data.critere) {
    showNotification('⚠️ Veuillez remplir tous les champs', 'warning');
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

    form.reset();
    renderCalendar();
    updateStats();
    showNotification('✅ Évaluation enregistrée!', 'success');

  } catch (error) {
    console.error('Erreur:', error);
    showNotification('❌ Échec de l\'enregistrement', 'error');
  }
}

// ===== SUPPRIMER UNE ÉVALUATION =====
document.addEventListener('click', async (ev) => {
  const btn = ev.target.closest('.delete-btn');
  if (!btn) return;
  
  if (!confirm('Supprimer cette évaluation ?')) return;

  const evalId = btn.dataset.id;
  if (!evalId) return;

  try {
    const response = await fetch(`${API_BASE}/${evalId}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Erreur suppression');
    }

    const chip = btn.closest('.evaluation-chip');
    if (chip) {
      chip.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => {
        appState.evaluations = appState.evaluations.filter(e => e._id !== evalId);
        renderCalendar();
        updateStats();
      }, 300);
    }

    showNotification('✅ Évaluation supprimée', 'success');

  } catch (error) {
    console.error('Erreur:', error);
    showNotification('❌ Échec de la suppression', 'error');
  }
});

// ===== GÉNÉRATION DE DOCUMENTS WORD =====
function generateWordHTML(evaluations, title, classe) {
  const semaines = {};
  evaluations.forEach(eval => {
    if (!semaines[eval.semaine]) semaines[eval.semaine] = [];
    semaines[eval.semaine].push(eval);
  });

  let html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 30px; line-height: 1.6; }
    .header { text-align: center; border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
    .header h1 { color: #2563eb; margin: 0; font-size: 28px; }
    .header p { color: #475569; margin: 5px 0; }
    .week { margin: 25px 0; border: 2px solid #e2e8f0; border-radius: 12px; padding: 20px; page-break-inside: avoid; }
    .week h2 { background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%); color: white; padding: 12px; border-radius: 8px; margin: 0 0 15px 0; font-size: 18px; }
    .eval { background: #f8fafc; padding: 15px; margin: 12px 0; border-left: 4px solid #10b981; border-radius: 8px; }
    .eval strong { color: #047857; font-size: 14px; }
    .eval p { margin: 5px 0; color: #0f172a; }
  </style>
</head>
<body>
  <div class="header">
    <h1>📅 ${title}</h1>
    <p><strong>Classe:</strong> ${classe} | <strong>Année:</strong> 2025-2026</p>
    <p>Kawthar International School (KIS)</p>
  </div>`;

  Object.keys(semaines).sort().forEach(sem => {
    const weekInfo = appState.weeks.find(w => w.id === sem);
    const weekTitle = weekInfo ? `${weekInfo.title} (${weekInfo.date})` : sem;
    
    html += `<div class="week"><h2>📍 ${weekTitle}</h2>`;
    semaines[sem].forEach(e => {
      html += `<div class="eval">
        <p><strong>${getMatiereEmoji(e.matiere)} Matière:</strong> ${escapeHtml(e.matiere)}</p>
        <p><strong>📑 Unité/Thème:</strong> ${escapeHtml(e.unite)}</p>
        <p><strong>⭐ Critère:</strong> ${escapeHtml(e.critere)}</p>
      </div>`;
    });
    html += '</div>';
  });

  html += '</body></html>';
  return html;
}

function downloadFile(content, filename) {
  const blob = new Blob([content], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

async function generateZipExport() {
  if (!appState.evaluations.length) {
    showNotification('⚠️ Aucune évaluation à exporter', 'warning');
    return;
  }

  const zip = new JSZip();
  const classe = appState.currentClass;
  
  appState.matieres.forEach(matiere => {
    const matiereEvals = appState.evaluations.filter(e => e.matiere === matiere);
    if (matiereEvals.length > 0) {
      const content = generateWordHTML(
        matiereEvals,
        `Calendrier ${matiere}`,
        classe
      );
      const filename = `${classe}_${matiere.replace(/\s+/g, '_')}.html`;
      zip.file(filename, content);
    }
  });

  try {
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Calendrier_${classe}_Toutes_Matieres_${new Date().getFullYear()}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showNotification('📦 ZIP généré avec succès!', 'success');
  } catch (error) {
    console.error('Erreur:', error);
    showNotification('❌ Erreur lors de la génération du ZIP', 'error');
  }
}

function generateCurrentMatiereExport() {
  const currentView = appState.currentView;
  
  if (currentView === 'all') {
    showNotification('⚠️ Sélectionnez une matière dans les onglets', 'warning');
    return;
  }

  const matiereEvals = appState.evaluations.filter(e => e.matiere === currentView);
  
  if (!matiereEvals.length) {
    showNotification('⚠️ Aucune évaluation pour cette matière', 'warning');
    return;
  }

  const content = generateWordHTML(
    matiereEvals,
    `Calendrier ${currentView}`,
    appState.currentClass
  );
  
  const filename = `Calendrier_${appState.currentClass}_${currentView.replace(/\s+/g, '_')}_${new Date().getFullYear()}.html`;
  downloadFile(content, filename);
  
  showNotification('📄 Document généré avec succès!', 'success');
}

function generateSingleExport() {
  if (!appState.evaluations.length) {
    showNotification('⚠️ Aucune évaluation à exporter', 'warning');
    return;
  }

  const content = generateWordHTML(
    appState.evaluations,
    'Calendrier Complet - Toutes Matières',
    appState.currentClass
  );
  
  const filename = `Calendrier_${appState.currentClass}_Complet_${new Date().getFullYear()}.html`;
  downloadFile(content, filename);
  
  showNotification('📋 Document complet généré!', 'success');
}

// ===== GESTION DE LA MODAL =====
function openExportModal() {
  const modal = document.getElementById('exportModal');
  if (modal) {
    modal.classList.add('active');
  }
}

function closeExportModal() {
  const modal = document.getElementById('exportModal');
  if (modal) {
    modal.classList.remove('active');
  }
}

// ===== SYSTÈME DE NOTIFICATIONS =====
function showNotification(message, type = 'info') {
  const notif = document.createElement('div');
  notif.className = `notification ${type}`;
  notif.textContent = message;
  
  document.body.appendChild(notif);
  setTimeout(() => notif.remove(), 3000);
}

// ===== GESTION DES ONGLETS =====
document.addEventListener('click', (e) => {
  const tab = e.target.closest('.tab-btn');
  if (!tab) return;

  const view = tab.dataset.view;
  appState.currentView = view;

  document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
  tab.classList.add('active');

  renderCalendar();
});

// ===== GESTION DES OPTIONS D'EXPORT =====
document.addEventListener('click', (e) => {
  const option = e.target.closest('.export-option');
  if (!option) return;

  const type = option.dataset.type;
  
  closeExportModal();
  
  if (type === 'all') {
    generateZipExport();
  } else if (type === 'current') {
    generateCurrentMatiereExport();
  } else if (type === 'single') {
    generateSingleExport();
  }
});

// ===== INITIALISATION =====
document.addEventListener('DOMContentLoaded', () => {
  const classeSelect = document.getElementById('classe');
  const btnGenerateWord = document.getElementById('btnGenerateWord');
  const modalClose = document.getElementById('modalClose');
  const modal = document.getElementById('exportModal');

  // Chargement initial
  const initialClasse = classeSelect.value;
  appState.currentClass = initialClasse;
  loadEvaluations(initialClasse);

  // Changement de classe
  classeSelect.addEventListener('change', () => {
    const nouvelleClasse = classeSelect.value;
    appState.currentClass = nouvelleClasse;
    loadEvaluations(nouvelleClasse);
  });

  // Bouton Export
  btnGenerateWord.addEventListener('click', openExportModal);
  
  // Fermeture modal
  modalClose.addEventListener('click', closeExportModal);
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeExportModal();
    }
  });
});

// ===== EXPOSITION GLOBALE =====
window.addEvaluation = addEvaluation;
