// Mes variables
var erreurs = 0; //nombres d'erreurs 
var mot = "";   //mot a découvrir
var motActuel=[];  //Mot en cours (avec des lettres cacher)
const penduOrdre = ["#base" , "#barreVerti","#barreHori","#barreCote","#corde","#tete","#corps","#brasDroit","#brasGauche","#jambeDroite","#jambeGauche"]; //ordre dans laqurl il faut affiché le pendu
let enJeu = false;  //variable qui nous emepche de jouer si il n'y a pas de mot
let lettreUtilise=[];  //lettre déjà utilisé (on a pas le droit de les reprendre)



//------- Tout les event listner (il ne sont pas dans newGame sinon il se lancerais plusieurs fois)------------------

document.getElementById("boutton").addEventListener("click",newGame);
for (let i = 0 ; i <=25 ; i++){
    document.querySelector("#"+String.fromCharCode(65+i)).addEventListener("click",() => gameplay(String.fromCharCode(65+i)));
}
document.addEventListener('keyup', (event) => {
        console.log(event.key.toUpperCase());
        gameplay(event.key.toUpperCase());
})
document.querySelector("#resetbtn").addEventListener("click",newGame);

// --------------- Fin EventListener -----------------------------------------

async function newGame(){
    //------------- Remettre tout a 0 -------------

    document.querySelector(".modal-wrapper").style.display = "none"; //cacher les pages de fin
    document.querySelector(".modal-wrapper-lose").style.display = "none";

    lettreUtilise=[];
    mot = "";
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
    document.querySelector("#clavier").style.display="grid";
    document.querySelector("#reset").style.display="block";

    // -------------------------------------------

    // -------- Mot généré avec le serveur --------
    rep = await serve();
    mot = rep.toUpperCase();
    console.log(mot);
    enJeu=true; //Commencer à jouer quand quand le mot est affiché
    
    motActuel.push(mot.charAt(0));
    var i =1;
    while (i<mot.length-1){
        motActuel.push("_");
        i++;
    }
    motActuel.push(mot.charAt(mot.length-1));
    document.querySelector("#mot").textContent = "Mot à découvrir : "+motActuel.join("");

}



function gameplay(lettre){
    // Si on est pas en Jeu (mot en train de charger ou dans un page de fin) rien ne se passe
    if (enJeu){
        if (lettreUtilise.includes(lettre)){ //Affiche une page "lettre déjà utilisée" ,attend d'avoir appuyé sur "Compris" pour continuer
            enJeu=false;  
            document.querySelector(".modal-wrapper-used").style.display = "block";
            document.querySelector("#ok").addEventListener("click",function(){
                document.querySelector(".modal-wrapper-used").style.display = "none";
                enJeu=true;
            });
        }
        else if (mot.includes(lettre)){ //Le mot contient la lettre sélectionner
            for(let i =1 ; i<mot.length-1;i++){
                if (mot[i]==lettre){
                    motActuel[i]=lettre;
                    document.querySelector("#mot").textContent = "Mot à découvrir : "+motActuel.join(""); //on actualise le mot avec la lettre affiché
                    if (!motActuel.includes("_")){ // Jeu fini proposition de rejouer
                        document.querySelector(".modal-wrapper").style.display = "block";
                        document.querySelector(".yes").addEventListener("click",newGame);
                        document.querySelector(".no").addEventListener("click",function(){
                            document.querySelector(".modal-wrapper").style.display = "none";
                            enJeu=false;
                        });
                        
                    }
                }
            }
            document.querySelector("#"+lettre).classList.add("bon") ; //affiché en vert
        }
        else{
            if (erreurs >= penduOrdre.length){ //fin du jeu, perdu
                document.querySelector(".modal-wrapper-lose").style.display = "block";
                document.querySelector("#lastmsg").textContent = "Vous avez perdu, le mot que vous cherchiez est "+mot;
                document.querySelector(".yes-lose").addEventListener("click",newGame);
                document.querySelector(".no-lose").addEventListener("click",function(){
                    document.querySelector(".modal-wrapper-lose").style.display = "none";
                    enJeu=false;
                    });
            }
            else{ //lettre fausse
                document.querySelector("#"+lettre).classList.add("mauvais") ;  
                document.querySelector("#"+lettre).style.color = "rgb(54, 54, 54)";
                document.querySelector(penduOrdre[erreurs]).style.display = "block";
                document.querySelector(penduOrdre[erreurs]).style.stroke = "white";
                erreurs++;
            }

        }
        lettreUtilise.push(lettre);
    }
}


function serve(){ //appelle au server pour obtenir un mot
    return fetch("http://localhost:8000/api/getWord")
    .then(async function(response) {
        if (response.ok){
            const rep = await response.text();
            console.log(rep);
            return rep;
        }
        else{
            return serve();
        }
    })
}
