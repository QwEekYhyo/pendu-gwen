const liste = ["AMELIE","ETIENNE","CAMILLE"];
var erreurs = 0;
var mot = "";
var motActuel=[];
const penduOrdre = ["#base" , "#barreVerti","#barreHori","#corde","#tete","#corps","#brasDroit","#brasGauche","#jambeDroite","#jambeGauche"];

document.getElementById("boutton").addEventListener("click",newGame);

function newGame(){
    //Remettre tout a 0 
    document.querySelector(".modal-wrapper").style.display = "none"
    mot = "";
    motActuel=[];
    erreurs = 0;
    //document.querySelector(".pendu").style.display = "none";
    for (let part of penduOrdre){
        document.querySelector(part).style.display="none";
    }

    for (let i = 0 ; i <=25 ; i++){
        document.querySelector("#"+String.fromCharCode(65+i)).classList.remove("bon");
        document.querySelector("#"+String.fromCharCode(65+i)).classList.remove("mauvais");
    }
    //document.querySelector(".lettre").classList.remove(".bon");
    //document.querySelector(".lettre").classList.remove(".mauvais");
    // Fin de la remise à 0


    let idList = ["pendu","centre","lettres"];
    for(let id of idList) {
        document.getElementById(id).classList.remove("notDisplayed")
    } 
    document.getElementById("boutton").style.display="none";
    document.querySelector("#lettres").style.display="grid";

    mot = liste[Math.floor(Math.random()*liste.length)];
    motActuel.push(mot.charAt(0));
    var i =1;
    while (i<mot.length-1){
        motActuel.push("_");
        i++;
    }
    motActuel.push(mot.charAt(mot.length-1));
    document.querySelector("#mot").textContent = "Mot à découvrir : "+motActuel.join("");

    document.querySelector(".lettre").style.color = "black";
}
for (let i = 0 ; i <=25 ; i++){
    document.querySelector("#"+String.fromCharCode(65+i)).addEventListener("click",() => gameplay(String.fromCharCode(65+i)));
}

document.addEventListener('keyup', (event) => {
        console.log(event.key.toUpperCase());
        gameplay(event.key.toUpperCase());
})

function gameplay(lettre){
    console.log(lettre); 
    if (mot.includes(lettre)){
        for(let i =1 ; i<mot.length-1;i++){
            if (mot[i]==lettre){
                console.log("dans le if")
                motActuel[i]=lettre;
                document.querySelector("#mot").textContent = "Mot à découvrir : "+motActuel.join("");
                if (!motActuel.includes("_")){
                    //alert("Congratulation, you have found the word !");
                    document.querySelector(".modal-wrapper").style.display = "block";
                    document.querySelector(".yes").addEventListener("click",newGame);
                    document.querySelector(".no").addEventListener("click",() => document.querySelector(".modal-wrapper").style.display = "none");
                }
            }
        }
        document.querySelector("#"+lettre).classList.add("bon") ;
    }
    else{
        if (erreurs >= penduOrdre.length){
            alert("LOSER");  //FAIRE UNE PAGE POUR REJOUER
        }
        else{
            document.querySelector("#"+lettre).classList.add("mauvais") ;   //Faire une truc beau de lettre fausse
            document.querySelector(penduOrdre[erreurs]).style.display = "block";
            erreurs++;
        }

    }
    
}


