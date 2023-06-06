let motsListe = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]];
const fs = require("fs");

fs.readFile("lesMiserables.txt",function(error,data){
    if(error == null){
        let motsLivre = data.toString().split(/[(\r?\n),. ]/);
        for( let mot of motsLivre ){
            for ( let n =1; n<=15 ; n++){
                if(mot.length==n){
                    let valid =true;
                    for (let i = 0; i< mot.length ; i++){
                        if(mot.charCodeAt(i)<97||mot.charCodeAt(i)>122){
                            valid=false;
                        }
                    }
                    if (valid){
                        motsListe[n].push(mot);
                        //Mot valid
                    }
                }
            }
        }
    }
});


var nberreurs = 0; //nombres d'nberreurs 
var mot = "";   //mot a découvrir
var motEnCours=[];  //Mot en cours (avec des lettres cacher)
let lettreDejaUtilise=[];
let victoire = false;
let defaite =false;
let lettreMauvaise = false; // la lettre est pas valide (on l'a déjà utilisé)
let lettreDansLeMot = false;



function manageRequest(request, response) {
    const etoile = request.url.split("?")[0].split("/")[2];
    //const minLetters = request.url.split("?")[1].split("&")[0].split("=")[1];
    //const maxLetters = request.url.split("?")[1].split("&")[1].split("=")[1];
    
    const parametres = request.url.split("?")[1].split("&");
    for(const argument of parametres){
        argumentCoupe = argument.split("=");
        // On regarde chaque argument et on attribut les variables à leur valeur
        if (argumentCoupe[0]=="minLetters"){
            minLetters=parseInt(argumentCoupe[1]);
        }
        else if (argumentCoupe[0]=="maxLetters"){
            maxLetters=parseInt(argumentCoupe[1]);
        }
    }
    
    //console.log(minLetters,maxLetters);
    let listeFinale = [];

    if (minLetters>maxLetters){
        response.end("Veuillez prendre un maxLetters>minLetters");
    }
    else{
        for (let i=minLetters ; i<=maxLetters ; i++){
            listeFinale = listeFinale.concat(motsListe[i]);
        }
        //console.log(listeFinale);
    }
    
    if (etoile=="getWord"){
        const random = Math.floor(Math.random()*listeFinale.length);
        response.end(listeFinale[random]);
        //console.log("dans getword",motsListe[random]);
        
    }
    else if (etoile=="newGame"){
        const random = Math.floor(Math.random()*listeFinale.length);
        response.end(listeFinale[random].length+"");  // Renvoie la taille du mot a l'indice choisi au hasard
        mot=listeFinale[random].toUpperCase(); // Met le mot choisi au hasard en majuscule

        // ------- remettre tout à 0 ------------
        nberreurs =0;
        motEnCours=[];  //Mot en cours (avec des lettres cacher)
        lettreDejaUtilise=[];
        victoire = false;
        defaite =false;
        lettreMauvaise = false; // la lettre est pas valide (on l'a déjà utilisé)
        lettreDansLeMot = false;
        
        // mettre mot affiché avec les bons tirés 
        var i =0;
        while (i<listeFinale[random].length){
            motEnCours.push("_");
            i++;
        }

        // --- fin remise à 0 ------

    }

    else if(etoile=="testLetter"){
        lettreDansLeMot = false;  // <== c'est une lettre présente dans le mot (initialisé à non)
        lettreMauvaise = false;  // <== c'est une lettre que l'on a déjà cliqué (initialisé à non)
        const parametres = request.url.split("?")[1];
        argumentCoupe = parametres.split("=");
        if (argumentCoupe[0]=="letter"){
            lettre=argumentCoupe[1];  //on recupère la lettre 
        }
        if(!lettreDejaUtilise.includes(lettre)){  // on a pas déjà utilisé la lettre
            //console.log("le mot :",mot,"la lettre cliqué : ",lettre);
            if (mot.includes(lettre)){ //Le mot contient la lettre sélectionner
                lettreDansLeMot = true;
                for(let i =0 ; i<mot.length;i++){
                    if (mot[i]==lettre){
                        motEnCours[i]=lettre;
                        if (!motEnCours.includes("_")){ // cas de victoire
                            victoire=true;
                        }
                    }
                }
            }
            else if (nberreurs >= 10){ //perdu
                defaite=true;
                motEnCours=mot;
            }
            else{ // mauvaise lettre
                nberreurs++;
            }
            lettreDejaUtilise.push(lettre); 
            
        }
        else{
            lettreMauvaise = true;
        }

        
        let dico = {motActuel : motEnCours, lettreUtilise : lettreMauvaise , lettreBien: lettreDansLeMot , gagner : victoire , perdu : defaite};
        response.end(JSON.stringify(dico));

    }



    else{
        fs.readFile("404.html",function(error,data){
            if (!error){
                response.setHeader("Content-type","text/html");
                response.end(data);
                //console.log("dans 404");
            }
        });
    }

    
}

exports.manage = manageRequest; 