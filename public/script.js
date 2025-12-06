// ========== CONFIGURATION ==========
const API_URL = '/api/evaluations';
const MATIERES = ['Français LL', 'Anglais AL', 'Mathématiques', 'Sciences', 'IS', 'Arts', 'Design'];

const WEEKS_DATA = [
  { id: 'S1', title: 'Semaine 1', date: 'Août 31 – Sep. 04', type: 'orientation' },
  { id: 'S2', title: 'Semaine 2', date: 'Sep. 07 – 11', type: 'eval' },
  { id: 'S3', title: 'Semaine 3', date: 'Sep. 14 – 18', type: 'eval' },
  { id: 'S4', title: 'Semaine 4', date: 'Sep. 21 – 25', type: 'eval' },
  { id: 'S5', title: 'Semaine 5', date: 'Sep. 28 – Oct. 02', type: 'eval' },
  { id: 'S6', title: 'Semaine 6', date: 'Oct. 05 – 09', type: 'eval' },
  { id: 'S7', title: 'Semaine 7', date: 'Oct. 12 – 16', type: 'eval' },
  { id: 'S8', title: 'Semaine 8', date: 'Oct. 19 – 23', type: 'eval' },
  { id: 'S9', title: 'Semaine 9', date: 'Oct. 26 – 30', type: 'eval' },
  { id: 'S10', title: 'Semaine 10', date: 'Nov. 02 – 06', type: 'eval' },
  { id: 'S11', title: 'Semaine 11', date: 'Nov. 09 – 13', type: 'eval' },
  { id: 'S12', title: 'Semaine 12', date: 'Nov. 16 – 20', type: 'eval' },
  { id: 'S12b', title: 'Semaine 13', date: 'Nov. 23 – 27', type: 'vacation' },
  { id: 'S13', title: 'Semaine 14', date: 'Nov. 30 – Dec. 04', type: 'eval' },
  { id: 'S14', title: 'Semaine 15', date: 'Dec. 07 – 11', type: 'eval' },
  { id: 'S15', title: 'Semaine 16', date: 'Dec. 14 – 18', type: 'eval' },
  { id: 'S16', title: 'Semaine 17', date: 'Dec. 21 – 25', type: 'exam' },
  { id: 'S17', title: 'Semaine 18', date: 'Dec. 28 – Jan. 01', type: 'exam' },
  { id: 'S18', title: 'Semaine 19', date: 'Jan. 04 – 08', type: 'exam' },
  { id: 'S18b', title: 'Vacances', date: 'Jan. 11 – 15', type: 'vacation' },
  { id: 'S19', title: 'Semaine 20', date: 'Jan. 18 – 22', type: 'eval' },
  { id: 'S20', title: 'Semaine 21', date: 'Jan. 25 – 29', type: 'eval' },
  { id: 'S21', title: 'Semaine 22', date: 'Fev. 01 – 05', type: 'eval' },
  { id: 'S22', title: 'Semaine 23', date: 'Fev. 08 – 12', type: 'eval' },
  { id: 'S23', title: 'Semaine 24', date: 'Fev. 15 – 19', type: 'eval' },
  { id: 'S24', title: 'Semaine 25', date: 'Fev. 22 – 26', type: 'eval' },
  { id: 'S25', title: 'Semaine 26', date: 'Mars 01 – 05', type: 'eval' },
  { id: 'S25b', title: 'Eid', date: 'Mars 08 – 12', type: 'vacation' },
  { id: 'S25c', title: 'Eid', date: 'Mars 15 – 19', type: 'vacation' },
  { id: 'S25d', title: 'Eid', date: 'Mars 22 – 26', type: 'vacation' },
  { id: 'S26', title: 'Semaine 27', date: 'Mars 29 – Avril 02', type: 'eval' },
  { id: 'S27', title: 'Semaine 28', date: 'Avril 05 – 09', type: 'eval' },
  { id: 'S28', title: 'Évaluations', date: 'Avril 12 – 16', type: 'orientation' },
  { id: 'S29', title: 'Semaine 29', date: 'Avril 19 – 23', type: 'eval' },
  { id: 'S30', title: 'Semaine 30', date: 'Avril 26 – 30', type: 'eval' },
  { id: 'S31', title: 'Semaine 31', date: 'Mai 03 – 07', type: 'eval' },
  { id: 'S32', title: 'Semaine 32', date: 'Mai 10 – 14', type: 'eval' },
  { id: 'S32b', title: 'Eid Adha', date: 'Mai 17 – 21', type: 'vacation' },
  { id: 'S32c', title: 'Eid Adha', date: 'Mai 24 – 28', type: 'vacation' },
  { id: 'S32d', title: 'Eid Adha', date: 'Mai 31 – Juin 04', type: 'vacation' },
  { id: 'S33', title: 'Examen Final', date: 'Juin 07 – 11', type: 'exam' },
  { id: 'S34', title: 'Examen Final', date: 'Juin 14 – 18', type: 'exam' }
];

// État global
let appState = {
  classe: 'PEI1',
  currentFilter: 'all',
  evaluations: []
};

// ========== UTILITAIRES ==========
const escape = (str) => String(str || '').replace(/[&<>"']/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[c]));

const getMatiereClass = (mat) => {
  const map = {
    'Français LL': 'francais',
    'Anglais AL': 'anglais',
    'Mathématiques': 'maths',
    'Sciences': 'sciences',
    'IS': 'is',
    'Arts': 'arts',
    'Design': 'design'
  };
  return map[mat] || '';
};

const getMatiereEmoji = (mat) => {
  const map = {
    'Français LL': '🇫🇷',
    'Anglais AL': '🇬🇧',
    'Mathématiques': '📐',
    'Sciences': '🔬',
    'IS': '🌍',
    'Arts': '🎨',
    'Design': '💡'
  };
  return map[mat] || '📚';
};

// ========== NOTIFICATIONS ==========
function showNotification(message, type = 'success') {
  const notif = document.createElement('div');
  notif.className = `notification notif-${type}`;
  notif.textContent = message;
  document.body.appendChild(notif);
  setTimeout(() => notif.remove(), 3000);
}

// ========== STATISTIQUES ==========
function updateStats() {
  const container = document.getElementById('statsContainer');
  if (!container) return;
  
  const total = appState.evaluations.length;
  const counts = {};
  MATIERES.forEach(m => counts[m] = 0);
  appState.evaluations.forEach(e => counts[e.matiere] = (counts[e.matiere] || 0) + 1);
  
  let html = `
    <div class="stat-box">
      <div class="stat-value">${total}</div>
      <div class="stat-label">📊 Total</div>
    </div>
  `;
  
  MATIERES.forEach(mat => {
    html += `
      <div class="stat-box">
        <div class="stat-value">${counts[mat]}</div>
        <div class="stat-label">${getMatiereEmoji(mat)} ${mat}</div>
      </div>
    `;
  });
  
  container.innerHTML = html;
}

// ========== GÉNÉRATION TABLEAU ==========
function renderCalendar() {
  const table = document.getElementById('calendarTable');
  if (!table) return;
  
  const filtered = appState.currentFilter === 'all' 
    ? appState.evaluations 
    : appState.evaluations.filter(e => e.matiere === appState.currentFilter);
  
  // Grouper par blocs de 4 semaines
  const blocks = [];
  for (let i = 0; i < WEEKS_DATA.length; i += 4) {
    blocks.push(WEEKS_DATA.slice(i, i + 4));
  }
  
  let html = '';
  
  blocks.forEach((block, blockIdx) => {
    // Header
    html += '<thead><tr>';
    html += '<th style="width: 150px;">Mois</th>';
    block.forEach(week => {
      html += `<th>${week.title}</th>`;
    });
    html += '</tr></thead>';
    
    // Dates
    html += '<thead><tr>';
    html += '<th>Dates</th>';
    block.forEach(week => {
      html += `<th style="font-size: 0.75rem; font-weight: 600;">${week.date}</th>`;
    });
    html += '</tr></thead>';
    
    // Body
    html += '<tbody><tr>';
    html += `<td style="background: linear-gradient(135deg, #fed7aa, #fdba74); font-weight: 800; color: #92400e; text-align: center;">Bloc ${blockIdx + 1}</td>`;
    
    block.forEach(week => {
      if (week.type === 'orientation') {
        html += `<td class="cell-orientation">${week.title}</td>`;
      } else if (week.type === 'vacation') {
        html += `<td class="cell-vacation">🏖️ ${week.title}</td>`;
      } else if (week.type === 'exam') {
        html += `<td class="cell-exam">📝 ${week.title}</td>`;
      } else {
        const weekEvals = filtered.filter(e => e.semaine === week.id);
        
        let evalsHTML = '';
        weekEvals.forEach(ev => {
          evalsHTML += `
            <div class="eval-item eval-${getMatiereClass(ev.matiere)}">
              <div class="eval-matiere">${getMatiereEmoji(ev.matiere)} ${escape(ev.matiere)}</div>
              <div class="eval-detail">📑 ${escape(ev.unite)}</div>
              <div class="eval-detail">⭐ Critère ${escape(ev.critere)}</div>
              <button class="btn-delete" onclick="handleDelete('${ev._id}')">×</button>
            </div>
          `;
        });
        
        let formHTML = '';
        if (appState.currentFilter === 'all') {
          formHTML = `
            <div class="add-form">
              <div class="form-title">✏️ Ajouter</div>
              <form onsubmit="handleAdd(event, '${week.id}')">
                <div class="form-row">
                  <label>📖 Matière</label>
                  <select name="matiere" required>
                    <option value="">-- Choisir --</option>
                    ${MATIERES.map(m => `<option value="${m}">${m}</option>`).join('')}
                  </select>
                </div>
                <div class="form-row">
                  <label>📑 Unité</label>
                  <input name="unite" required placeholder="Nom de l'unité"/>
                </div>
                <div class="form-row">
                  <label>⭐ Critère</label>
                  <select name="critere" required>
                    <option value="">Choisir</option>
                    <option>A</option><option>B</option><option>C</option><option>D</option>
                  </select>
                </div>
                <button type="submit" class="btn-submit">💾 Enregistrer</button>
              </form>
            </div>
          `;
        } else {
          formHTML = `
            <div class="add-form">
              <div class="form-title">✏️ ${getMatiereEmoji(appState.currentFilter)} ${appState.currentFilter}</div>
              <form onsubmit="handleAdd(event, '${week.id}')">
                <input type="hidden" name="matiere" value="${appState.currentFilter}"/>
                <div class="form-row">
                  <label>📑 Unité</label>
                  <input name="unite" required placeholder="Nom de l'unité"/>
                </div>
                <div class="form-row">
                  <label>⭐ Critère</label>
                  <select name="critere" required>
                    <option value="">Choisir</option>
                    <option>A</option><option>B</option><option>C</option><option>D</option>
                  </select>
                </div>
                <button type="submit" class="btn-submit">💾 Enregistrer</button>
              </form>
            </div>
          `;
        }
        
        html += `
          <td>
            <div class="week-card">
              <div class="week-header">
                <div class="week-title">📅 ${week.title}</div>
                <div class="week-date">${week.date}</div>
              </div>
              <div class="evaluations-list">${evalsHTML}</div>
              ${formHTML}
            </div>
          </td>
        `;
      }
    });
    
    html += '</tr></tbody>';
  });
  
  table.innerHTML = html;
}

// ========== CHARGEMENT ÉVALUATIONS ==========
async function loadEvaluations(classe) {
  try {
    const res = await fetch(`${API_URL}?classe=${classe}`);
    if (!res.ok) throw new Error('Erreur chargement');
    appState.evaluations = await res.json();
    renderCalendar();
    updateStats();
  } catch (err) {
    console.error(err);
    showNotification('❌ Erreur de chargement', 'error');
  }
}

// ========== AJOUTER ÉVALUATION ==========
async function handleAdd(e, weekId) {
  e.preventDefault();
  const form = e.target;
  
  const data = {
    classe: appState.classe,
    semaine: weekId,
    matiere: form.matiere.value.trim(),
    unite: form.unite.value.trim(),
    critere: form.critere.value.trim()
  };
  
  if (!data.matiere || !data.unite || !data.critere) {
    showNotification('⚠️ Tous les champs requis', 'warning');
    return;
  }
  
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!res.ok) throw new Error('Erreur');
    
    const newEval = await res.json();
    appState.evaluations.push(newEval);
    form.reset();
    renderCalendar();
    updateStats();
    showNotification('✅ Évaluation enregistrée!', 'success');
  } catch (err) {
    console.error(err);
    showNotification('❌ Échec enregistrement', 'error');
  }
}

// ========== SUPPRIMER ÉVALUATION ==========
async function handleDelete(id) {
  if (!confirm('Supprimer cette évaluation ?')) return;
  
  try {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Erreur');
    
    appState.evaluations = appState.evaluations.filter(e => e._id !== id);
    renderCalendar();
    updateStats();
    showNotification('✅ Évaluation supprimée', 'success');
  } catch (err) {
    console.error(err);
    showNotification('❌ Échec suppression', 'error');
  }
}

// ========== GÉNÉRATION WORD ==========
function generateWordHTML(evals, title) {
  const grouped = {};
  evals.forEach(e => {
    if (!grouped[e.semaine]) grouped[e.semaine] = [];
    grouped[e.semaine].push(e);
  });
  
  let html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    body { font-family: Arial; padding: 30px; line-height: 1.6; }
    .header { text-align: center; border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
    h1 { color: #2563eb; font-size: 28px; margin: 0; }
    .info { color: #64748b; margin: 8px 0; }
    .week { margin: 20px 0; border: 2px solid #e2e8f0; border-radius: 10px; padding: 15px; }
    .week h2 { background: linear-gradient(135deg, #2563eb, #1e40af); color: white; padding: 10px; border-radius: 8px; margin: 0 0 12px; }
    .eval { background: #f8fafc; padding: 12px; margin: 10px 0; border-left: 4px solid #10b981; border-radius: 6px; }
    .eval p { margin: 4px 0; }
    strong { color: #047857; }
  </style>
</head>
<body>
  <div class="header">
    <h1>📅 ${title}</h1>
    <p class="info"><strong>Classe:</strong> ${appState.classe} | <strong>Année:</strong> 2025-2026</p>
    <p class="info">Kawthar International School (KIS)</p>
  </div>`;
  
  Object.keys(grouped).sort().forEach(wid => {
    const week = WEEKS_DATA.find(w => w.id === wid);
    const weekTitle = week ? `${week.title} (${week.date})` : wid;
    
    html += `<div class="week"><h2>📍 ${weekTitle}</h2>`;
    grouped[wid].forEach(e => {
      html += `<div class="eval">
        <p><strong>${getMatiereEmoji(e.matiere)} Matière:</strong> ${escape(e.matiere)}</p>
        <p><strong>📑 Unité:</strong> ${escape(e.unite)}</p>
        <p><strong>⭐ Critère:</strong> ${escape(e.critere)}</p>
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
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function exportZIP() {
  if (!appState.evaluations.length) {
    showNotification('⚠️ Aucune évaluation à exporter', 'warning');
    return;
  }
  
  const zip = new JSZip();
  
  MATIERES.forEach(mat => {
    const evals = appState.evaluations.filter(e => e.matiere === mat);
    if (evals.length) {
      const content = generateWordHTML(evals, `Calendrier ${mat}`);
      zip.file(`${appState.classe}_${mat.replace(/\s+/g, '_')}.html`, content);
    }
  });
  
  try {
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Calendrier_${appState.classe}_ZIP.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification('📦 ZIP généré avec succès!', 'success');
  } catch (err) {
    console.error(err);
    showNotification('❌ Erreur génération ZIP', 'error');
  }
}

function exportMatiere() {
  if (appState.currentFilter === 'all') {
    showNotification('⚠️ Sélectionnez une matière dans les onglets', 'warning');
    return;
  }
  
  const evals = appState.evaluations.filter(e => e.matiere === appState.currentFilter);
  if (!evals.length) {
    showNotification('⚠️ Aucune évaluation pour cette matière', 'warning');
    return;
  }
  
  const content = generateWordHTML(evals, `Calendrier ${appState.currentFilter}`);
  downloadFile(content, `${appState.classe}_${appState.currentFilter.replace(/\s+/g, '_')}.html`);
  showNotification('📄 Document généré!', 'success');
}

function exportComplet() {
  if (!appState.evaluations.length) {
    showNotification('⚠️ Aucune évaluation à exporter', 'warning');
    return;
  }
  
  const content = generateWordHTML(appState.evaluations, 'Calendrier Complet');
  downloadFile(content, `${appState.classe}_Complet.html`);
  showNotification('📋 Document complet généré!', 'success');
}

// ========== INITIALISATION ==========
document.addEventListener('DOMContentLoaded', () => {
  const selectClasse = document.getElementById('selectClasse');
  const btnExport = document.getElementById('btnExport');
  const modal = document.getElementById('modalExport');
  const btnCloseModal = document.getElementById('btnCloseModal');
  
  // Charger initial
  loadEvaluations(appState.classe);
  
  // Changement classe
  selectClasse.addEventListener('change', () => {
    appState.classe = selectClasse.value;
    loadEvaluations(appState.classe);
  });
  
  // Tabs
  document.querySelectorAll('.tab-item').forEach(tab => {
    tab.addEventListener('click', () => {
      const filter = tab.dataset.filter;
      appState.currentFilter = filter;
      document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderCalendar();
    });
  });
  
  // Modal
  btnExport.addEventListener('click', () => modal.classList.add('show'));
  btnCloseModal.addEventListener('click', () => modal.classList.remove('show'));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('show');
  });
  
  // Export options
  document.querySelectorAll('.export-option').forEach(opt => {
    opt.addEventListener('click', () => {
      modal.classList.remove('show');
      const type = opt.dataset.type;
      if (type === 'zip') exportZIP();
      else if (type === 'matiere') exportMatiere();
      else if (type === 'complet') exportComplet();
    });
  });
});

// Exposition globale
window.handleAdd = handleAdd;
window.handleDelete = handleDelete;
