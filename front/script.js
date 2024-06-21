// Mes variables
var erreurs = 0; //nombres d'erreurs 
var motActuel=[];  //Mot en cours (avec des lettres cacher)
const penduOrdre = ["#base" , "#barreVerti","#barreHori","#barreCote","#corde","#tete","#corps","#brasDroit","#brasGauche","#jambeDroite","#jambeGauche"]; //ordre dans laqurl il faut affiché le pendu
let enJeu = false;  //variable qui nous emepche de jouer si il n'y a pas de mot
let level = "Facile";  // Le niveau que le joueur à sélectionner (initialement à facile)



//------- Tout les event listner (il ne sont pas dans newGame sinon il se lancerais plusieurs fois)------------------
select = document.getElementById("niveauDifficultes");
select.addEventListener('change', function () {
    level = select.value;
})

document.getElementById("boutton").addEventListener("click",() => {
    this.newGame();
});


for (let i = 0 ; i <=25 ; i++){
    document.querySelector("#"+String.fromCharCode(65+i)).addEventListener("click",() => gameplay(String.fromCharCode(65+i)));
}
document.addEventListener('keyup', (event) => {
        console.log(event.key.toUpperCase());
        console.log(event.key.toUpperCase().charCodeAt(0));
        if (event.key.toUpperCase().charCodeAt(0)>=65&&event.key.toUpperCase().charCodeAt(0)<=90){
            gameplay(event.key.toUpperCase());
        }
})
document.querySelector("#resetbtn").addEventListener("click",newGame);

// --------------- Fin EventListener -----------------------------------------

async function newGame(){
    //------------- Remettre tout a 0 -------------

    document.querySelector(".modal-wrapper").style.display = "none"; //cacher les pages de fin
    document.querySelector(".modal-wrapper-lose").style.display = "none";

    motActuel = [];
    enJeu = false; //attendre que le mot soit affiché avant de pouvoir jouer
    document.querySelector("#mot").textContent = "Veuillez patientez svp";  //message en attendant le mot
    erreurs = 0;   
    for (let part of penduOrdre){
        document.querySelector(part).style.stroke="grey";
    } //Remettre tout le pendu en gris

    for (let i = 0 ; i <=25 ; i++){
        document.querySelector("#"+String.fromCharCode(65+i)).classList.remove("bon");
        document.querySelector("#"+String.fromCharCode(65+i)).classList.remove("mauvais");
        document.querySelector("#"+String.fromCharCode(65+i)).style.color = "white";
    } //Remettre les lettres à leurs état initial

    // ------------ Fin de la remise à 0 -------------

    // --------- Affiché la page de jeu -----------

    let idList = ["pendu","centre","lettres","reset"];
    for(let id of idList) {
        document.getElementById(id).classList.remove("notDisplayed")
    } 
    document.getElementById("boutton").style.display="none";
    document.getElementById("difficulty").style.display="none";
    document.getElementById("msgLevel").innerHTML = "Niveau de difficulté : "+level ;
    document.querySelector("#clavier").style.display="grid";
    document.querySelector("#reset").style.display="block";

    // -------------------------------------------

    // -------- Mot généré avec le serveur --------
    rep = await serve();  // lance api/newGame
    enJeu=true; //Commencer à jouer quand quand le mot est affiché 
    
    var i =0;
    while (i<rep){
        motActuel.push("_");
        i++;
    } // Le bon nombre de _ s'affiche en fonction du mot qu'on doit deviner
    document.querySelector("#mot").textContent = "Mot à découvrir : "+motActuel.join("");

}



async function gameplay(lettre){
    rep = await serveTesterLettre(lettre);
    dico = JSON.parse(rep);

    if (enJeu){
        if (dico['lettreUtilise']){ //Affiche une page "lettre déjà utilisée" ,attend d'avoir appuyé sur "Compris" pour continuer
            enJeu=false;  
            document.querySelector(".modal-wrapper-used").style.display = "block";
            document.querySelector("#ok").addEventListener("click",function(){
                document.querySelector(".modal-wrapper-used").style.display = "none";
                enJeu=true;
            });
        }
        else if (dico['lettreBien']){ //Le mot contient la lettre sélectionner
            document.querySelector("#mot").textContent = "Mot à découvrir : "+dico['motActuel'].join(""); //on actualise le mot avec la lettre affiché
            document.querySelector("#"+lettre).classList.add("bon") ; //affiché en vert
            if(dico['gagner']){
                 // Jeu fini proposition de rejouer
                 document.querySelector(".modal-wrapper").style.display = "block";
                 document.querySelector(".yes").addEventListener("click",newGame);
                 document.querySelector(".no").addEventListener("click",function(){
                     document.querySelector(".modal-wrapper").style.display = "none";
                     enJeu=false;
                 });
            }
        }
        else{ //lettre fausse
            document.querySelector("#"+lettre).classList.add("mauvais") ;  
            document.querySelector("#"+lettre).style.color = "rgb(54, 54, 54)";
            document.querySelector(penduOrdre[erreurs]).style.display = "block";
            document.querySelector(penduOrdre[erreurs]).style.stroke = "white";
            erreurs++;
            if (dico['perdu']){ //fin du jeu, perdu 
                document.querySelector(".modal-wrapper-lose").style.display = "block";
                document.querySelector("#lastmsg").textContent = "Vous avez perdu, le mot que vous cherchiez est "+dico['motActuel'];
                document.querySelector(".yes-lose").addEventListener("click",newGame);
                document.querySelector(".no-lose").addEventListener("click",function(){
                    document.querySelector(".modal-wrapper-lose").style.display = "none";
                    enJeu=false;
                    });
            }
        }
    }
}


function serve(){ //appelle au server pour lancer une nouvelle partie
    return fetch("http://localhost:8000/api/newGame?level="+level)
    .then(async function(response) {
        if (response.ok){
            const rep = await response.text();
            return rep;
        }
        else{
            return serve();
        }
    })
}

function serveTesterLettre(lettre){ //appelle au server pour tester une lettre
    return fetch("http://localhost:8000/api/testLetter?letter="+lettre)
    .then(async function(response) {
        if (response.ok){
            const rep = await response.text();
            return rep;
        }
        else{
            return serveTesterLettre();
        }
    })
}
