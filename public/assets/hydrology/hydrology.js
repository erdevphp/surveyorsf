window.onload = () => {
    let counter = 1;

    let main = document.getElementById('main');
    let calculer = document.getElementById('calculer');
    let dataPluvio = document.getElementById('dataPluvio');
    let addInputs = document.getElementById('addInputs');
    let deleteInputs = document.getElementById('deleteInputs');

    addInputsInDOM(dataPluvio, counter, 'calcul col-12');
    counter++;

    addInputs.addEventListener('click', function() { 
        addInputsInDOM(dataPluvio, counter, 'calcul col-12');
        counter++;
        realTimePrevisualisation(document.getElementById('readonly'));
    });

    deleteInputs.addEventListener('click', function() { 
        if (counter > 2) {
            removeInputsInDOM(dataPluvio);
            counter--;
        } 
    });

    realTimePrevisualisation(document.getElementById('readonly'));

    calculer.addEventListener('submit', function(e) { calculHydrologic(e, counter) });
}

function calculHydrologic(e, counter) {
    e.preventDefault();
    let result = document.getElementById('result');
    result != null ? result.remove() : null ;

    const pmcolumn = operationOnColumn('2', '+', counter);
    console.log(pmcolumn)

    // $(main).append(resultOfCalcul('12', '13', '14', '23'))
    return false;
}

function addInputsInDOM(grandParentElement, counter, specificCSSClass) {
    // On remplace l'id du tr précédent par un nouveau id
    if( counter > 1) {
        document.querySelector('tr#lasttr').setAttribute('id', 'entry'+(counter-1));
    }
    // On crée un nouveau élément tr et ajoute l'id lasttr
    const tr = document.createElement('tr')
    tr.setAttribute('id', 'lasttr');

    let autofocus = (counter === 1) ? 'autofocus' : '';

    // On boucle pour avoir les 12 colonnes souhaitées
    for (let column = 1; column <= 12; column++) {
        
        // On ajoute à la fin du tr chaque td et un input
        tr.innerHTML += `<td><input type="text" ${autofocus} class="line${counter} column${column} ${specificCSSClass}"></td>`;
    }
    // On affiche le tout dans le tbody
    grandParentElement.appendChild(tr);
}

function removeInputsInDOM(grandParentElement) {
    let lasttr = document.querySelector('tr#lasttr'); // On sélectionne l'élément tr d'id lasttr cad le dernier élément de l'élémen tbody
    lasttr.remove(); // On supprime l'élément

    lasttr = grandParentElement.lastElementChild; // On récupère maintenant le nouveau dernier élément
    lasttr.setAttribute('id', 'lasttr'); // On lui affecte l'id lasttr pour pouvoir le supprimer en cas de suppression
}

/*
* Cette fonction permet de lier en temps réel deux inputs
* inputs correspondent au inputs dont on peut écrire dessus
* previsualisation désigne l'élément qui prend en charge la valeur des inputs
*/
function realTimePrevisualisation(previsualisation) {
    const inputs = document.querySelectorAll('input.calcul');
    // On boucle sur les inputs afin de gérer des événements(click, input, ...) sur chaque input
    inputs.forEach(function(input) {
        // gestion de click sur chaque input de class calcul
        $(input).on('click', function(){
            const lastclick = document.querySelector('#lastclick');
            if (lastclick != undefined) {
                lastclick.removeAttribute('id');
                lastclick.setAttribute('class', this.getAttribute('class'))
            }
            // On affecte la valeur de l'input readonly à celle de l'input calcul pour prévisualiser
            previsualisation.value = this.value;
            this.setAttribute('id', 'lastclick');
        })
        // gestion de l'événement input qui va modifier en temps réél la prévisualisation
        $(input).on('input', function(){
            if (/[a-zA-Z*--$+=/\\&@é" ²'(è_çàù;:!?)]+/.test(this.value)) {
                this.value = ''
            }
            // Affection de la valeur de l'input calcul sur le readonly pour le temps réél
            previsualisation.value = this.value;
            
        });
        $(previsualisation).on('click', function(){
            const lastclick = document.querySelector('#lastclick');
            lastclick.setAttribute('class', lastclick.getAttribute('class') + ' lastclick')
        }) 
        $(previsualisation).on('input', function() {
            const lastclick = document.querySelector('#lastclick');
            lastclick.setAttribute('class', lastclick.getAttribute('class') + ' lastclick')
            lastclick.value = previsualisation.value
        })
        $(input).on('focus', function() {
            const lastclick = document.querySelector('#lastclick');
            if (lastclick != undefined) {
                lastclick.removeAttribute('id');
                lastclick.setAttribute('class', this.getAttribute('class'))
            }
            this.setAttribute('id', 'lastclick');
        })
    })
}


function operationOnColumn(indexColumn, operator, counter) {
    let inputs = document.querySelectorAll('.column'+indexColumn);
    if (inputs != undefined) {
        let donneeACalculer = new Array();
        inputs.forEach(function (input) {
            element = input.value;
            if (element === "" || isNaN(parseFloat(element))) {
                return "Vérifier votre données pluviométriques";
            } else { // En cas de validation, on push les données sur le tableau
                donneeACalculer.push(parseFloat(input.value));
            }
        });
        if (donneeACalculer.length === --counter) { // On calcule l'opération souhaitées si la ligne est complète
            return donneeACalculer.reduce((a, b) => {
                return eval(a + operator + b);
            });
        }
        return "Vérifier votre données pluviométriques";
    }
}

function operationOnLine(indexLine, operator, numberMounth) {
    let inputs = document.querySelectorAll('.line'+indexLine);
    if (inputs != undefined) {
        let donneeACalculer = new Array();
        inputs.forEach(function (input) {
            element = input.value;
            if (element === "" || isNaN(parseFloat(element))) {
                return "Vérifier votre données pluviométriques";
            } else { // En cas de validation, on push les données sur le tableau
                donneeACalculer.push(parseFloat(input.value));
            }
        });
        if (donneeACalculer.length === numberMounth) { // On calcule l'opération souhaitées si la ligne est complète
            return donneeACalculer.reduce((a, b) => {
                return eval(a + operator + b);
            });
        }
        return "Vérifier votre données pluviométriques";
    }
}

function resultOfCalcul(pluvioMoyenneMensuelle, canvasPluvioMoyenneMensuelle, pluvioMoyenneInterannuelle, canvasHauteurPluie) {
    return `<div class="container" id="result">
    <section id="pluvioMoyenneMensuelle">
        <h3 class="h5">1. Calcul de la pluviométrie moyenne mensuelle</h3>
        <p>
            A partir du tableau 1 ci-dessus en usant de la formule ci-après, on peut calculer la pluviométrie moyenne mensuelle :
            <div class="text-center">
                <img src="assets/img/formule/PMmenuelle.png" alt="Pluviométrie moyenne mensuelle" width="100">
            </div>
            <div class="small">
                <ul>
                    <li><img src="assets/img/symbole/PMBar.png" alt="𝑃𝑚" height="20" width="20"> est la pluviométrie moyenne mensuelle en [mm] ;</li>
                    <li>𝑃𝑚𝑖 est la pluviométrie mensuelle du mois concerné en mm, ou 𝑖 représente les
                        années d’observation ;</li>
                    <li>𝑁 est le nombre d’année d’observation</li>
                </ul>
            </div>
        </p>
        <p>
            <div class="mb-2">
                On obtient la <strong>pluviométrie moyenne mensuelle</strong> representé par le tableau suivant :
            </div>
            <table class="table-dark small">
                <caption class="text-center text-info" align="top">Tableau 2 : Pluviométrie moyenne mensuelle en [mm]</caption>
                <thead class="text-primary">
                    <tr class="text-center">
                        <th>Jan</th>
                        <th>Feb</th>
                        <th>Mars</th>
                        <th>April</th>
                        <th>May</th>
                        <th>June</th>
                        <th>July</th>
                        <th>Aug</th>
                        <th>Sep</th>
                        <th>Oct</th>
                        <th>Nov</th>
                        <th>Dec</th>
                    </tr>
                </thead>
                <tbody id="pluviomoyennemensuelle">${pluvioMoyenneMensuelle}</tbody>
            </table>
            <div class="my-2">La pluviométrie moyenne mensuelle est illustré par la figure ci-dessous : </div>
            <div class="text-center" id="canvas">
                ${canvasPluvioMoyenneMensuelle}
            </div>
        </p>
    </section>
    <section id="pluvioMoyenneInterannuelle">
        <h3 class="h5">2. Calcul de la pluviométrie interannuelle</h3>
        <p>
            La pluviométrie moyenne interannuelle est la moyenne arithmétique des pluies annuelles de N années d’observation 
            et est donnée par la formule suivante :
            <div class="text-center">
                <img src="assets/img/formule/PMinterannuelle.png" alt="Pluviométrie moyenne interannuelle" width="150">
            </div>
            <div class="small d-flex justify-content-center">
                <ul class="text-left">
                    <li><img src="assets/img/symbole/PBar.png" alt="𝑃" height="20"> est la pluviométrie moyenne interannuelle en [mm] ;</li>
                    <li>𝑃𝑎 est la pluviométrie annuelle de l’année ou 𝑎 représente l’année en question ;</li>
                    <li>𝑁 est le nombre d’année d’observation.</li>
                </ul>
            </div>
            <div id="pmInterannuelle">
                Ainsi, après application numérique, on obtient une pluviométrie moyenne interannuelle <img src="assets/img/symbole/PBar.png" alt="𝑃" height="20"> = ${pluvioMoyenneInterannuelle}
            </div>
        </p>
    </section>
    <section id="repartitionMoyenneHauteurPluie">
        <h3 class="h5">3. Calcul de la répartition moyenne mensuelle des hauteurs des pluies Pm%</h3>
        <p>
            La répartition moyenne mensuelle des hauteurs des pluies est donnée par le quotient de la pluviométrie moyenne mensuelle
            sur la pluviométrie moyenne interannuelle multiplié par cent. 
            <div class="">
                On appliquant la formule Pm% = (<img src="assets/img/symbole/PMBar.png" alt="𝑃𝑚" height="20" width="20"> /  <img src="assets/img/symbole/PBar.png" alt="𝑃" height="20">) * 100, 
                on obtient la graphique suivante :  
                ${canvasHauteurPluie}
            </div>
        </p>
    </section>
</div>`
}

function errorOfCalcul() {
    return `<div class="d-none" id="error">
        <h3>Oppssss, ERREUR DE DONNEE</h3>
        <hr>
        <p>
            Vérifier votre donnée pluviométrique en suivant les instructions suivantes : 
            <div class="d-flex justify-content-center">
                <ul class="text-left">
                    <li>Un champ vide;</li>
                    <li>Un champ contenant du texte.</li>
                </ul>
            </div>
        </p>
    </div>`
}


