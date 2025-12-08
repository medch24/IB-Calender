// ═══════════════════════════════════════════════════════════════
// CALENDRIER DES ÉVALUATIONS KIS - JAVASCRIPT
// ═══════════════════════════════════════════════════════════════

const API_URL = '/api/evaluations';

// Configuration matières
const MATIERES = [
    'Français LL',
    'Anglais AL',
    'Mathématiques',
    'Sciences',
    'IS',
    'Arts',
    'Design'
];

// Configuration semaines (39 semaines)
const SEMAINES = [
    { id: 'S1', label: 'Semaine 1', dates: '31 août - 6 sept', type: 'normale' },
    { id: 'S2', label: 'Semaine 2', dates: '7 - 13 sept', type: 'normale' },
    { id: 'S3', label: 'Semaine 3', dates: '14 - 20 sept', type: 'normale' },
    { id: 'S4', label: 'Semaine 4', dates: '21 - 27 sept', type: 'orientation' },
    { id: 'S5', label: 'Semaine 5', dates: '28 sept - 4 oct', type: 'normale' },
    { id: 'S6', label: 'Semaine 6', dates: '5 - 11 oct', type: 'normale' },
    { id: 'S7', label: 'Semaine 7', dates: '12 - 18 oct', type: 'normale' },
    { id: 'S8', label: 'Semaine 8', dates: '19 - 25 oct', type: 'vacances' },
    { id: 'S9', label: 'Semaine 9', dates: '26 oct - 1 nov', type: 'vacances' },
    { id: 'S10', label: 'Semaine 10', dates: '2 - 8 nov', type: 'normale' },
    { id: 'S11', label: 'Semaine 11', dates: '9 - 15 nov', type: 'normale' },
    { id: 'S12', label: 'Semaine 12', dates: '16 - 22 nov', type: 'normale' },
    { id: 'S13', label: 'Semaine 13', dates: '23 - 29 nov', type: 'normale' },
    { id: 'S14', label: 'Semaine 14', dates: '30 nov - 6 déc', type: 'examens' },
    { id: 'S15', label: 'Semaine 15', dates: '7 - 13 déc', type: 'examens' },
    { id: 'S16', label: 'Semaine 16', dates: '14 - 20 déc', type: 'normale' },
    { id: 'S17', label: 'Semaine 17', dates: '21 - 27 déc', type: 'vacances' },
    { id: 'S18', label: 'Semaine 18', dates: '28 déc - 3 jan', type: 'vacances' },
    { id: 'S19', label: 'Semaine 19', dates: '4 - 10 jan', type: 'normale' },
    { id: 'S20', label: 'Semaine 20', dates: '11 - 17 jan', type: 'normale' },
    { id: 'S21', label: 'Semaine 21', dates: '18 - 24 jan', type: 'normale' },
    { id: 'S22', label: 'Semaine 22', dates: '25 - 31 jan', type: 'normale' },
    { id: 'S23', label: 'Semaine 23', dates: '1 - 7 fév', type: 'normale' },
    { id: 'S24', label: 'Semaine 24', dates: '8 - 14 fév', type: 'normale' },
    { id: 'S25', label: 'Semaine 25', dates: '15 - 21 fév', type: 'vacances' },
    { id: 'S26', label: 'Semaine 26', dates: '22 - 28 fév', type: 'vacances' },
    { id: 'S27', label: 'Semaine 27', dates: '1 - 7 mars', type: 'normale' },
    { id: 'S28', label: 'Semaine 28', dates: '8 - 14 mars', type: 'normale' },
    { id: 'S29', label: 'Semaine 29', dates: '15 - 21 mars', type: 'normale' },
    { id: 'S30', label: 'Semaine 30', dates: '22 - 28 mars', type: 'examens' },
    { id: 'S31', label: 'Semaine 31', dates: '29 mars - 4 avr', type: 'examens' },
    { id: 'S32', label: 'Semaine 32', dates: '5 - 11 avr', type: 'vacances' },
    { id: 'S33', label: 'Semaine 33', dates: '12 - 18 avr', type: 'vacances' },
    { id: 'S34', label: 'Semaine 34', dates: '19 - 25 avr', type: 'normale' },
    { id: 'S35', label: 'Semaine 35', dates: '26 avr - 2 mai', type: 'normale' },
    { id: 'S36', label: 'Semaine 36', dates: '3 - 9 mai', type: 'normale' },
    { id: 'S37', label: 'Semaine 37', dates: '10 - 16 mai', type: 'normale' },
    { id: 'S38', label: 'Semaine 38', dates: '17 - 23 mai', type: 'examens' },
    { id: 'S39', label: 'Semaine 39', dates: '24 mai - 21 juin', type: 'examens' }
];

// Variables globales
let classeActuelle = '';
let matiereActive = 'Français LL';
let evaluations = [];

// ═══════════════════════════════════════════════════════════════
// INITIALISATION
// ═══════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initialisation Calendrier KIS');
    
    // Écouteurs d'événements
    document.getElementById('classeSelect').addEventListener('change', onClasseChange);
    document.getElementById('exportBtn').addEventListener('click', () => {
        if (!classeActuelle) {
            showToast('Veuillez sélectionner une classe', 'warning');
            return;
        }
        document.getElementById('modalExport').style.display = 'flex';
    });
    
    // Tabs matières
    document.querySelectorAll('.subject-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.subject-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            matiereActive = tab.getAttribute('data-matiere');
            renderCalendrier();
        });
    });
    
    // Formulaire ajout
    document.getElementById('evalForm').addEventListener('submit', onSubmitEvaluation);
    document.getElementById('annulerBtn').addEventListener('click', () => {
        document.getElementById('formAjout').style.display = 'none';
    });
    
    // Modal export
    document.getElementById('fermerModal').addEventListener('click', () => {
        document.getElementById('modalExport').style.display = 'none';
    });
    document.getElementById('exportZIP').addEventListener('click', exportZIP);
    document.getElementById('exportMatiere').addEventListener('click', exportMatiere);
    document.getElementById('exportComplet').addEventListener('click', exportComplet);
    
    console.log('✅ Initialisation terminée');
});

// ═══════════════════════════════════════════════════════════════
// GESTION CLASSE
// ═══════════════════════════════════════════════════════════════

function onClasseChange(e) {
    classeActuelle = e.target.value;
    console.log('📌 Classe sélectionnée:', classeActuelle);
    
    if (classeActuelle) {
        loadEvaluations();
    } else {
        evaluations = [];
        renderCalendrier();
    }
}

// ═══════════════════════════════════════════════════════════════
// API - CHARGER ÉVALUATIONS
// ═══════════════════════════════════════════════════════════════

async function loadEvaluations() {
    try {
        console.log(`📥 Chargement évaluations pour ${classeActuelle}...`);
        
        const response = await fetch(`${API_URL}?classe=${classeActuelle}`);
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP ${response.status}`);
        }
        
        evaluations = await response.json();
        console.log(`✅ ${evaluations.length} évaluation(s) chargée(s)`);
        
        renderCalendrier();
        showToast(`${evaluations.length} évaluation(s) chargée(s)`, 'success');
    } catch (error) {
        console.error('❌ Erreur chargement:', error);
        showToast('Erreur lors du chargement des évaluations', 'error');
        evaluations = [];
        renderCalendrier();
    }
}

// ═══════════════════════════════════════════════════════════════
// API - AJOUTER ÉVALUATION
// ═══════════════════════════════════════════════════════════════

async function onSubmitEvaluation(e) {
    e.preventDefault();
    
    const semaine = document.getElementById('semaineInput').value;
    const matiere = document.getElementById('matiereInput').value;
    const unite = document.getElementById('uniteInput').value.trim();
    const critere = document.getElementById('critereInput').value.trim();
    
    if (!unite || !critere) {
        showToast('Veuillez remplir tous les champs', 'warning');
        return;
    }
    
    try {
        console.log(`📤 Ajout évaluation: ${classeActuelle} - ${semaine} - ${matiere}`);
        
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                classe: classeActuelle,
                semaine,
                matiere,
                unite,
                critere
            })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || `Erreur HTTP ${response.status}`);
        }
        
        const newEval = await response.json();
        console.log('✅ Évaluation ajoutée:', newEval._id);
        
        evaluations.push(newEval);
        renderCalendrier();
        
        document.getElementById('formAjout').style.display = 'none';
        document.getElementById('evalForm').reset();
        
        showToast('Évaluation ajoutée avec succès !', 'success');
    } catch (error) {
        console.error('❌ Erreur ajout:', error);
        showToast('Erreur lors de l\'ajout: ' + error.message, 'error');
    }
}

// ═══════════════════════════════════════════════════════════════
// API - SUPPRIMER ÉVALUATION
// ═══════════════════════════════════════════════════════════════

async function deleteEvaluation(id) {
    if (!confirm('Supprimer cette évaluation ?')) return;
    
    try {
        console.log(`🗑️  Suppression évaluation: ${id}`);
        
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || `Erreur HTTP ${response.status}`);
        }
        
        console.log('✅ Évaluation supprimée');
        
        evaluations = evaluations.filter(e => e._id !== id);
        renderCalendrier();
        
        showToast('Évaluation supprimée', 'success');
    } catch (error) {
        console.error('❌ Erreur suppression:', error);
        showToast('Erreur lors de la suppression: ' + error.message, 'error');
    }
}

// ═══════════════════════════════════════════════════════════════
// RENDU CALENDRIER
// ═══════════════════════════════════════════════════════════════

function renderCalendrier() {
    const container = document.getElementById('calendrier');
    
    if (!classeActuelle) {
        container.innerHTML = '<div class="empty-message">Veuillez sélectionner une classe</div>';
        return;
    }
    
    // Filtrer par matière active
    const evalsFiltered = evaluations.filter(e => e.matiere === matiereActive);
    
    let html = '';
    
    SEMAINES.forEach(semaine => {
        const evalsForWeek = evalsFiltered.filter(e => e.semaine === semaine.id);
        
        html += `
            <div class="week-card ${semaine.type}">
                <div class="week-header">
                    <div>
                        <div class="week-title">${semaine.label}</div>
                        <div class="week-dates">${semaine.dates}</div>
                    </div>
                    ${semaine.type === 'normale' || semaine.type === 'orientation' ? 
                        `<button class="btn-add" onclick="openFormAjout('${semaine.id}', '${matiereActive}')">+</button>` : 
                        ''}
                </div>
                <div class="evaluations-list">
                    ${evalsForWeek.length > 0 ? 
                        evalsForWeek.map(e => `
                            <div class="evaluation-item">
                                <div class="evaluation-info">
                                    <div class="evaluation-unite">${e.unite}</div>
                                    <div class="evaluation-critere">Critère: ${e.critere}</div>
                                </div>
                                <button class="btn-delete" onclick="deleteEvaluation('${e._id}')">✕</button>
                            </div>
                        `).join('') : 
                        ''}
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// ═══════════════════════════════════════════════════════════════
// FORMULAIRE AJOUT
// ═══════════════════════════════════════════════════════════════

function openFormAjout(semaine, matiere) {
    const semaineObj = SEMAINES.find(s => s.id === semaine);
    
    document.getElementById('semaineInput').value = semaine;
    document.getElementById('matiereInput').value = matiere;
    document.getElementById('semaineDisplay').value = `${semaineObj.label} (${semaineObj.dates})`;
    document.getElementById('matiereDisplay').value = matiere;
    document.getElementById('uniteInput').value = '';
    document.getElementById('critereInput').value = '';
    
    document.getElementById('formAjout').style.display = 'flex';
    document.getElementById('uniteInput').focus();
}

// ═══════════════════════════════════════════════════════════════
// EXPORT WORD (simplifié)
// ═══════════════════════════════════════════════════════════════

async function exportMatiere() {
    if (!classeActuelle) {
        showToast('Sélectionnez une classe', 'warning');
        return;
    }
    
    const evalsMatiere = evaluations.filter(e => e.matiere === matiereActive);
    
    if (evalsMatiere.length === 0) {
        showToast('Aucune évaluation pour cette matière', 'warning');
        return;
    }
    
    await generateWordDoc(matiereActive, evalsMatiere);
    document.getElementById('modalExport').style.display = 'none';
}

async function exportComplet() {
    if (!classeActuelle) {
        showToast('Sélectionnez une classe', 'warning');
        return;
    }
    
    if (evaluations.length === 0) {
        showToast('Aucune évaluation à exporter', 'warning');
        return;
    }
    
    await generateWordDoc('TOUTES MATIÈRES', evaluations);
    document.getElementById('modalExport').style.display = 'none';
}

async function exportZIP() {
    if (!classeActuelle) {
        showToast('Sélectionnez une classe', 'warning');
        return;
    }
    
    showToast('Export ZIP : Génération en cours...', 'success');
    
    // Pour chaque matière, générer un document
    for (const matiere of MATIERES) {
        const evalsMatiere = evaluations.filter(e => e.matiere === matiere);
        if (evalsMatiere.length > 0) {
            await generateWordDoc(matiere, evalsMatiere);
            // Petit délai pour permettre les téléchargements multiples
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }
    
    document.getElementById('modalExport').style.display = 'none';
    showToast('Tous les documents ont été générés !', 'success');
}

async function generateWordDoc(titre, evals) {
    try {
        console.log(`📄 Génération Word : ${titre} (${evals.length} évaluations)`);
        
        showToast('Génération du document Word...', 'success');
        
        const response = await fetch('/api/export', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                classe: classeActuelle,
                matiere: titre,
                evaluations: evals
            })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erreur génération');
        }
        
        // Télécharger le fichier
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Calendrier_${classeActuelle}_${titre.replace(/\s/g, '_')}_${Date.now()}.docx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        console.log(`✅ Document Word téléchargé`);
        showToast(`Document ${titre} exporté !`, 'success');
        
    } catch (error) {
        console.error('❌ Erreur export Word:', error);
        showToast('Erreur lors de l\'export: ' + error.message, 'error');
    }
}

// ═══════════════════════════════════════════════════════════════
// NOTIFICATIONS TOAST
// ═══════════════════════════════════════════════════════════════

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
