$(function(){
    // On crée un compteur pour la gestion des classes html
    let nb = 1;

    // On récupère l'élément parent tbody qui va contenir tout les tr
    const tbody = document.querySelector('tbody');

    // On récupère l'input de hidden pour identifier le compteur 
    let datacounter = document.querySelector('input#counter');

    // On récupère l'élément form d'id calculer pour soumettre et calculer le formulaire
    const calculer = document.querySelector('form#calculer');

    const resultat = document.querySelector('div#resultat')
    const result = document.querySelector('tbody#result')


    /* 
    * DEBUT Gestion de click sur le lien de type button et class 'add'
    * Elle permet d'ajout un nouveau élément tr et de l'affiche à la fin du tbody
    */
    $('.add').click(function(){
        /*
        * DEBUT CREATION D'UN NOUVEAU ELEMENT tr qui va contenir des td et des inuput de type text
        */
        // On cherche l'élément tr d'id lasttr et on modifie cette attribut id
        let lasttr = document.querySelector('#lasttr')
        lasttr.setAttribute('id', 'tr'+nb)

        // Création d'un nouveau élément tr qui va être la nouvelle ligne
        const tr = document.createElement('tr');

        // On donne un id pour pouvoir le supprimer en cas de suppression
        tr.setAttribute('id', 'lasttr')

        // On boucle afin d'avoir les 12 colonnes souhaitées
        for (let i = 1; i <= 12; i++) {
            // On crée l'element td du tableau
            const td = document.createElement('td')

            // On crée l'élement input de type 'text' qui va etre ajouté dans le td
            const tdInput = document.createElement('input');
            tdInput.setAttribute('type', 'text');
            tdInput.setAttribute('value', '');
            tdInput.setAttribute('name', 'col'+i);

            // On associe l'input récemment crée à une classe afin de faire des calculs
            tdInput.setAttribute('class', 'ligne'+(nb+1)+' calcul w-100 small'+' col'+i)

            // On ajout l'élément enfant input à l'élément parent td
            td.appendChild(tdInput)

            // On ajout l'élément enfant td à l'élément parent tr
            tr.appendChild(td)
        }
        // On affiche l'élément tr créé avec un effet de fadein de JQuery
        $(tbody).append(tr).fadeIn('slow');
        /*
        * FIN CREATION D'UN NOUVEAU ELEMENT tr qui va contenir des td et des inuput de type text
        */

        /* 
        * DEBUT GESTION de l'input readonly 
        * Cette ligne de code permet de prévisualiser une donnée tapées sur un input
        */
        manageReadOnly();
        /* 
        * FIN GESTION de l'input readonly 
        * Cette ligne de code permet de prévisualiser une donnée tapées sur un input
        */
        
        // On incrémente le compteur pour avoir des lignes différentes à chaque fois
        nb++;

        datacounter.setAttribute('data-counter', nb);
    });
    /* 
    * FIN Gestion de click sur le lien de type button et class 'add'
    */

    /* 
    * DEBUT Gestion de click sur le lien de type button et class 'del'
    * Elle permet de supprimer la derniere tr de l'élément tbody
    */
    // Ecoute du click sur le lien de type button de class del
    $('.del').click(function(){
        
        let verifyLigneNotNull = false;
        let ligne = document.querySelectorAll('.ligne'+nb);
        ligne = Array.from(ligne)
        if (nb > 1) {
            for (let i = 0; i < ligne.length; i++) {
                // On récupère la valeur de chaque input
                const element1 = ligne[i].value;
                // On fait un petit validation (n'est pas vide)
                // On assure que les données entrées sont des nombres
                if (element1 != "") {
                    verifyLigneNotNull = true;
                }
            }
        }
        if (verifyLigneNotNull === true) {
            if(confirm("Des données peuvent être perdues!!\nVoulez vous quand meme supprimer la ligne numéro "+nb)) verifyLigneNotNull = false;
        }
        if (verifyLigneNotNull === false) {
            // On récupère l'élément input d'id readonly qui à la propriété readonly
            const inputreadonly = document.querySelector("input#readonly")
            inputreadonly.value = ''
            // On autorise la suppression des tr s'il en a au moins 2
            if (nb>1) { 
                // On sélectionne l'élément tr d'id lasttr cad le dernier élément de l'élémen tbody
                let lasttr = document.querySelector('#lasttr');

                // On supprime l'élément
                lasttr.remove();

                // On récupère maintenant le nouveau dernier élément
                lasttr = tbody.lastElementChild;

                // On lui affecte l'id lasttr pour pouvoir le supprimer en cas de suppression
                lasttr.setAttribute('id', 'lasttr');
                
                // On décrémente le compteur à chaque fois pour avoir la continuité de ligne et de savoir si le compteur est révenu à 1
                nb--;

                datacounter.setAttribute('data-counter', nb);
            }
        }
    });
    /* 
    * FIN Gestion de click sur le lien de type button et class 'del'
    */


    /* 
    * DEBUT Gestion de l'input readonly quand on clique pas le boutton add
    */
    manageReadOnly();
    /* 
    * FIN Gestion de l'input readonly quand on clique pas le boutton add
    */


    /* 
    * DEBUT Gestion de soumission du formulaire
    */
    calculer.addEventListener('submit', function(e) {
        // On empeche le comportement par défaut des formulaires à la soumission
        e.preventDefault();

        // On supprime toutes les données calculées précédemment s'il en a
        const oldResult = document.querySelector('tr#supprimer');
        const removeCanvas = document.querySelector('canvas.canvas');
        const removePmi = document.querySelector('span#pmi');
        if (oldResult != null && removeCanvas != null && removePmi) {
            oldResult.remove();
            removeCanvas.remove();
            removePmi.remove();
        }

        // On récupère l'élément input d'id readonly qui à la propriété readonly et on le vide
        const inputreadonly = document.querySelector("input#readonly")
        inputreadonly.value = ''
        
        // On récupère le compteur pour déterminer le nombre de ligne existant
        const counter = datacounter.getAttribute('data-counter')

        // Désigne la pluviométrie moyenne mensuelle
        let pm = new Array();
        // On récupère les 12 colonnes de manière dynamique
        for (let i = 1; i <= 12; i++) {
            let col = document.querySelectorAll('input.col'+i);
            col = Array.from(col); 
            pm.push(calculCol(col, i, counter))
        }

        // On assure que toutes les valeurs sont bien des nombres
        pmvalide = pm.find(function (value) {
            if (value === 'code404') {
                return value;
            }
        })
        // Si les données sont valides, alors on affiche le résultat
        if (pmvalide === undefined) {
            const divResultat = document.querySelector('div#resultat');
            $(divResultat).fadeIn('slow')

            const divError = document.querySelector('div#error')
            $(divError).hide()

            // On calcule la répartition moyenne mensuelle de la hauteur des pluies en %
            let repartitionPm = new Array();

            // Pluviométrie interannuelle
            let pa;

            for (let i = 0; i < pm.length; i++) {
                let element = pm[i];
                pa = pm.reduce((a, b) => {
                    return a + b;
                });
                repartitionPm.push((element*100)/pa);
            }

            // On affiche la pluviométrie interannuelle dans un div
            const divPmInterannuelle = document.querySelector('div#pmInterannuelle')
            $(divPmInterannuelle).append("<span id='pmi'>"+ pa +' [mm]</span>');


            resultat.setAttribute('class', 'alert')

            // Création d'un nouveau élément tr qui va être la nouvelle ligne
            const tr = document.createElement('tr');
            tr.setAttribute('id', 'supprimer')

            // On boucle afin d'avoir les 12 colonnes souhaitées
            for (let i = 1; i <= 12; i++) {
                // On crée l'element td du tableau
                const td = document.createElement('td')

                // On crée l'élement input de type 'text' qui va etre ajouté dans le td
                const tdInput = document.createElement('input');
                tdInput.setAttribute('type', 'text');
                tdInput.setAttribute('readonly', 'readonly');

                // On associe l'input récemment crée à une classe afin de faire des calculs
                tdInput.setAttribute('class', 'ligne'+(nb+1)+' calcul w-100 text-primary '+' col'+i)
                tdInput.setAttribute('value', pm[(i-1)])

                // On ajout l'élément enfant input à l'élément parent td
                td.appendChild(tdInput)

                // On ajout l'élément enfant td à l'élément parent tr
                tr.appendChild(td)
            }
            result.appendChild(tr)

            manageReadOnly();

            /* 
            * DEBUT Gestion de chart.js 
            */
            // Création d'un canvas Pluviométrie moyenne mensuelle
            const barCanvas = document.createElement('canvas');
            barCanvas.setAttribute('class', 'canvas');
            barCanvas.setAttribute('aria-label', 'chart');
            barCanvas.setAttribute('role', 'img');

            const divCanvas = document.querySelector('div#canvas')
            divCanvas.appendChild(barCanvas);
            
            const data = {
                labels: ['Jan', 'Feb', 'March', 'April', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Pluviométrie moyenne mensuelle en [mm]',
                    data: pm,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(255, 205, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(201, 203, 207, 0.2)'
                    ],
                    borderColor: [
                        'rgb(255, 99, 132)',
                        'rgb(255, 159, 64)',
                        'rgb(255, 205, 86)',
                        'rgb(75, 192, 192)',
                        'rgb(54, 162, 235)',
                        'rgb(153, 102, 255)',
                        'rgb(201, 203, 207)'
                    ],
                    borderWidth: 1
                }]
            };
            
            const barChart = new  Chart(barCanvas, {
                type: 'bar',
                data: data,
                options: {
                    scales: {
                    y: {
                        beginAtZero: true
                    }
                    }
                },
            });
            /* 
            * FIN Gestion de chart.js 
            */
        }   
        else {
            const divResultat = document.querySelector('div#resultat')
            const divError = document.querySelector('div#error')
            divError.setAttribute('class', 'alert alert-danger text-center');
            $(divError).fadeIn('slow')
            $(divResultat).hide()

        }
    });
    /* 
    * FIN soummion du formulaire
    */
});

/* 
* FONCTION permmettant de calculer la moyenne d'une colonne
* colonne designe le tableau qui contient les input d'une colonne
* numColonne est le numéro de colonne correspondant à une ligne donnée
* counter est le nombre de ligne (tr) pour calculer la moyenne
*/
function calculCol(colonne, numColonne, counter) {
    // On crée un tableau pour stocker les données de la boucle
    let donnee = new Array();
    // On boucle sur la colonne à calculer
    for (let i = 0; i < colonne.length; i++) {
        // On récupère la valeur de chaque input
        const element1 = colonne[i].value;
        // On fait un petit validation (n'est pas vide)
        // On assure que les données entrées sont des nombres
        if (element1 === "" || isNaN(parseFloat(element1))) {
            //alert("La ligne "+(i+1)+" de la colonne "+numColonne+" est vide.\nRemplissez s'il vous plait!")
            return 'code404';
        }
        
        // En cas de validation, on push les données sur le tableau
        donnee.push(parseFloat(element1));
    }

    if (counter > 1) {
        // On calcule la somme des données (cas d'un mois)
        somme = donnee.reduce((a, b) => {
            return a + b;
        });
        
        // On retourne la moyenne
        return somme / counter;
    }
    return donnee[0];
}


function manageReadOnly() {
    /* 
    * DEBUT GESTION de l'input readonly 
    * Cette ligne de code permet de prévisualiser une donnée tapées sur un input
    */
    // On récupère tout les élément input de calcul
    const inputs = document.querySelectorAll('input.calcul')
    
    // On récupère l'élément input d'id readonly qui à la propriété readonly
    const inputreadonly = document.querySelector("input#readonly")

    // On boucle sur les inputs afin de gérer des événements(click, input, ...) sur chaque input
    inputs.forEach(function(input) {
        // gestion de click sur chaque input de class calcul
        $(input).on('click', function(){
            // On affecte la valeur de l'input readonly à celle de l'input calcul pour prévisualiser
            inputreadonly.value = input.value;
        })
        // gestion de l'événement input qui va modifier en temps réél la prévisualisation
        $(input).on('input', function(){
            // Affection de la valeur de l'input calcul sur le readonly pour le temps réél
            inputreadonly.value = input.value;
        })
    })
    /* 
    * FIN GESTION de l'input readonly 
    * Cette ligne de code permet de prévisualiser une donnée tapées sur un input
    */
}



