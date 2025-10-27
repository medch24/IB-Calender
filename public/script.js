// script.js (Frontend Logic - Version améliorée)

const API_BASE = '/api/evaluations';
const selClasse = document.getElementById('classe');
const lblClasse = document.getElementById('lblClasse');
const btnGenerateWord = document.getElementById('btnGenerateWord');

// Petite utilité anti-injection (affichage)
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, s => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[s]));
}

// Fonction pour créer le DOM d'une évaluation enregistrée
function createEvaluationChip(eval) {
    const div = document.createElement('div');
    div.className = 'planned';
    div.dataset.id = eval._id; // Stocke l'ID MongoDB pour la suppression
    div.innerHTML = `
        <button class="del" title="Supprimer" data-id="${eval._id}">✖</button>
        <p><strong>Matière:</strong> ${escapeHtml(eval.matiere)}</p>
        <p><strong>Unité:</strong> ${escapeHtml(eval.unite)}</p>
        <p><strong>Critère:</strong> ${escapeHtml(eval.critere)}</p>
    `;
    return div;
}

// 1. Charger les évaluations depuis l'API pour la classe sélectionnée
async function loadEvaluations(classe) {
    // 1. Nettoyer les évaluations existantes dans le DOM
    document.querySelectorAll('.planned').forEach(el => el.remove());

    // 2. Récupérer les données
    try {
        const response = await fetch(`${API_BASE}?classe=${classe}`);
        if (!response.ok) throw new Error('Erreur de chargement des données');
        const evaluations = await response.json();

        // 3. Insérer dans le DOM
        evaluations.forEach(eval => {
            const cardElement = document.getElementById(eval.semaine);
            if (cardElement) {
                const newChip = createEvaluationChip(eval);
                const btnAdd = cardElement.querySelector('.btn-add-eval');
                // Insérer le nouveau chip APRÈS le titre mais AVANT le bouton
                if (btnAdd) {
                    btnAdd.parentNode.insertBefore(newChip, btnAdd);
                } else {
                    const boxForm = cardElement.querySelector('.box');
                    if (boxForm) {
                        cardElement.insertBefore(newChip, boxForm);
                    }
                }
            }
        });

    } catch (error) {
        console.error("Erreur de récupération des évaluations:", error);
        alert('Erreur lors du chargement des évaluations. Voir console.');
    }
}

// 2. Fonction pour gérer l'ajout d'une évaluation (appelée par onsubmit dans HTML)
async function addEvaluation(e, cellId) {
    e.preventDefault();
    const form = e.target;
    const classe = selClasse.value;
    const semaine = cellId;

    const data = {
        classe: classe,
        semaine: semaine,
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

        if (!response.ok) throw new Error('Erreur côté serveur lors de l\'ajout.');
        const newEval = await response.json();

        // Ajout au DOM
        const cardElement = document.getElementById(semaine);
        const newChip = createEvaluationChip(newEval);
        const btnAdd = cardElement.querySelector('.btn-add-eval');
        if (btnAdd) {
            btnAdd.parentNode.insertBefore(newChip, btnAdd);
        }

        // Reset et cache le formulaire
        form.reset();
        const box = form.closest('.box');
        if (box) {
            box.style.display = 'none';
            if (btnAdd) {
                btnAdd.textContent = '+ Ajouter une évaluation';
                btnAdd.classList.remove('active');
            }
        }
        alert('Évaluation enregistrée avec succès!');

    } catch (error) {
        console.error("Erreur lors de l'ajout de l'évaluation:", error);
        alert('Échec de l\'enregistrement. Erreur réseau ou serveur.');
    }
}

// 3. Gestion de la suppression (Délégation d'événement)
document.addEventListener('click', async (ev) => {
    const btn = ev.target.closest('.del');
    if (!btn) return;
    
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette évaluation?')) return;

    const evalId = btn.dataset.id;
    const wrap = btn.closest('.planned');
    if (!evalId || !wrap) return;

    try {
        const response = await fetch(`${API_BASE}/${evalId}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Erreur lors de la suppression.');

        // Animation de sortie puis remove du DOM
        wrap.classList.add('fade-out');
        setTimeout(() => wrap.remove(), 180);

    } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        alert('Échec de la suppression. Erreur réseau ou serveur.');
    }
});

// 4. Gestion des boutons "Ajouter une évaluation"
document.addEventListener('click', (ev) => {
    const btn = ev.target.closest('.btn-add-eval');
    if (!btn) return;

    const card = btn.closest('.card');
    const box = card.querySelector('.box');
    
    if (box) {
        const isVisible = box.style.display !== 'none';
        if (isVisible) {
            box.style.display = 'none';
            btn.textContent = '+ Ajouter une évaluation';
            btn.classList.remove('active');
        } else {
            box.style.display = 'block';
            btn.textContent = '− Masquer le formulaire';
            btn.classList.add('active');
        }
    }
});

// 5. Génération Word avec HTML stylé (client-side)
async function generateWordDocument() {
    const classe = selClasse.value;
    
    try {
        // Récupérer toutes les évaluations de la classe
        const response = await fetch(`${API_BASE}?classe=${classe}`);
        if (!response.ok) throw new Error('Erreur de chargement des données');
        const evaluations = await response.json();

        if (evaluations.length === 0) {
            alert('Aucune évaluation trouvée pour cette classe.');
            return;
        }

        // Grouper par semaine
        const semaines = {};
        evaluations.forEach(eval => {
            if (!semaines[eval.semaine]) {
                semaines[eval.semaine] = [];
            }
            semaines[eval.semaine].push(eval);
        });

        // Créer le contenu HTML professionnel
        let htmlContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Calendrier des Évaluations - ${classe} - Année 2025-2026</title>
    <style>
        @page { margin: 2cm; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6;
            color: #333;
        }
        .header {
            text-align: center;
            padding: 20px 0;
            border-bottom: 4px solid #1a3c8e;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #1a3c8e;
            margin: 0;
            font-size: 28px;
            font-weight: 800;
        }
        .header p {
            margin: 5px 0;
            color: #666;
            font-size: 14px;
        }
        .week-section {
            page-break-inside: avoid;
            margin-bottom: 25px;
            border: 2px solid #d8dce6;
            border-radius: 12px;
            overflow: hidden;
        }
        .week-header {
            background: linear-gradient(135deg, #1a3c8e 0%, #2563a8 100%);
            color: white;
            padding: 15px 20px;
            font-weight: 700;
            font-size: 18px;
        }
        .eval-item {
            padding: 15px 20px;
            border-bottom: 1px solid #e9ecef;
            background: #f8f9fa;
        }
        .eval-item:last-child {
            border-bottom: none;
        }
        .eval-item:nth-child(even) {
            background: #ffffff;
        }
        .eval-label {
            font-weight: 700;
            color: #1a3c8e;
            display: inline-block;
            min-width: 120px;
        }
        .eval-value {
            color: #444;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #d8dce6;
            text-align: center;
            color: #666;
            font-size: 12px;
        }
        .summary {
            background: #ffe0c2;
            padding: 15px 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            border-left: 6px solid #ff9f40;
        }
        .summary strong {
            color: #5b3200;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>📅 Calendrier des Évaluations</h1>
        <p><strong>Classe:</strong> ${classe} | <strong>Année scolaire:</strong> 2025-2026</p>
        <p><strong>École:</strong> Kawthar International School (KIS)</p>
    </div>

    <div class="summary">
        <strong>Résumé:</strong> ${evaluations.length} évaluation(s) planifiée(s) sur ${Object.keys(semaines).length} semaine(s)
    </div>
`;

        // Ajouter chaque semaine avec ses évaluations
        const semainesOrdered = Object.keys(semaines).sort((a, b) => {
            const numA = parseInt(a.replace('S', ''));
            const numB = parseInt(b.replace('S', ''));
            return numA - numB;
        });

        semainesOrdered.forEach(semaine => {
            const evals = semaines[semaine];
            htmlContent += `
    <div class="week-section">
        <div class="week-header">${semaine.replace('S', 'Semaine ')}</div>
`;
            evals.forEach(eval => {
                htmlContent += `
        <div class="eval-item">
            <div><span class="eval-label">Matière:</span> <span class="eval-value">${escapeHtml(eval.matiere)}</span></div>
            <div><span class="eval-label">Unité/Thème:</span> <span class="eval-value">${escapeHtml(eval.unite)}</span></div>
            <div><span class="eval-label">Critère:</span> <span class="eval-value">${escapeHtml(eval.critere)}</span></div>
        </div>
`;
            });
            htmlContent += `
    </div>
`;
        });

        htmlContent += `
    <div class="footer">
        <p>Document généré le ${new Date().toLocaleDateString('fr-FR', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })}</p>
        <p>Kawthar International School (KIS) - Programme d'Éducation Intermédiaire (PEI) & Programme du Diplôme (DP)</p>
    </div>
</body>
</html>
`;

        // Créer un blob et télécharger
        const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Calendrier_Evaluations_${classe}_${new Date().getFullYear()}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        alert(`Document Word généré avec succès!\n\nClasse: ${classe}\nÉvaluations: ${evaluations.length}\n\nVous pouvez ouvrir ce fichier HTML avec Microsoft Word pour le convertir en .docx`);

    } catch (error) {
        console.error("Erreur lors de la génération du document:", error);
        alert('Erreur lors de la génération du document Word. Voir console.');
    }
}

// 6. Initialisation et gestion du changement de classe
document.addEventListener('DOMContentLoaded', () => {
    // MAJ du libellé de classe et chargement des données
    const initialClasse = selClasse.value;
    lblClasse.innerHTML = `<strong>Classe :</strong> ${initialClasse}`;
    loadEvaluations(initialClasse);
    
    // Événement de changement de classe
    selClasse.addEventListener('change', (e) => {
        const nouvelleClasse = e.target.value;
        lblClasse.innerHTML = `<strong>Classe :</strong> ${nouvelleClasse}`;
        
        // Masquer tous les formulaires ouverts
        document.querySelectorAll('.box').forEach(box => {
            box.style.display = 'none';
        });
        document.querySelectorAll('.btn-add-eval').forEach(btn => {
            btn.textContent = '+ Ajouter une évaluation';
            btn.classList.remove('active');
        });
        
        loadEvaluations(nouvelleClasse); // Recharger les données pour la nouvelle classe
    });

    // Événement du bouton Générer Word
    btnGenerateWord.addEventListener('click', generateWordDocument);
});

// Exposer addEvaluation globalement pour les formulaires HTML
window.addEvaluation = addEvaluation;
