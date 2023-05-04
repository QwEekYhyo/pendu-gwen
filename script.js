const liste = ["AMELIE","ETIENNE","CAMILLE"];
var erreurs = 0;
var mot = "";
var motActuel=[];
const penduOrdre = ["#base" , "#barreVerti","#barreHori","#barreCote","#corde","#tete","#corps","#brasDroit","#brasGauche","#jambeDroite","#jambeGauche"];
let enJeu = true;
let lettreUtilise=[];

document.getElementById("boutton").addEventListener("click",newGame);

async function newGame(){
    //Remettre tout a 0 
    document.querySelector(".modal-wrapper").style.display = "none";
    document.querySelector(".modal-wrapper-lose").style.display = "none";

    for (let i = 0 ; i <=25 ; i++){
        document.querySelector("#"+String.fromCharCode(65+i)).style.color = "white";
    }

    lettreUtilise=[];
    mot = "";
    //motActuel=["A","t","t","e","n","d","e","z"," ","v","o","t","r","e"," ","p","r","o","c","h","a","i","n"," ","m","o","t"];
    motActuel = [];

    document.querySelector("#mot").textContent = "Veuillez patientez svp";
    //document.querySelector("#mot").textContent = motActuel.join("");
    erreurs = 0;
    enJeu = true;
    /*for (let part of penduOrdre){
        document.querySelector(part).style.display="none";
    }*/

    for (let i = 0 ; i <=25 ; i++){
        document.querySelector("#"+String.fromCharCode(65+i)).classList.remove("bon");
        document.querySelector("#"+String.fromCharCode(65+i)).classList.remove("mauvais");
    }

    // Fin de la remise à 0

    //rep = await serve();
    //mot = rep.toUpperCase();
    //console.log(mot);
    

    let idList = ["pendu","centre","lettres","reset"];
    for(let id of idList) {
        document.getElementById(id).classList.remove("notDisplayed")
    } 
    document.getElementById("boutton").style.display="none";
    document.querySelector("#clavier").style.display="grid";
    document.querySelector("#reset").style.display="block";

    //mot = liste[Math.floor(Math.random()*liste.length)];
    
    rep = await serve();
    mot = rep.toUpperCase();
    console.log(mot);
    
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

document.querySelector("#resetbtn").addEventListener("click",newGame);

function gameplay(lettre){
    
    console.log(lettreUtilise); 
    console.log(lettreUtilise.includes(lettre));
    if (enJeu){
        if (lettreUtilise.includes(lettre)){
            enJeu=false;
            document.querySelector(".modal-wrapper-used").style.display = "block";
            document.querySelector("#ok").addEventListener("click",function(){
                document.querySelector(".modal-wrapper-used").style.display = "none";
                enJeu=true;
            });
        }
        else if (mot.includes(lettre)){
            for(let i =1 ; i<mot.length-1;i++){
                if (mot[i]==lettre){
                    motActuel[i]=lettre;
                    document.querySelector("#mot").textContent = "Mot à découvrir : "+motActuel.join("");
                    if (!motActuel.includes("_")){
                        //alert("Congratulation, you have found the word !");
                        document.querySelector(".modal-wrapper").style.display = "block";
                        document.querySelector(".yes").addEventListener("click",newGame);
                        document.querySelector(".no").addEventListener("click",function(){
                            document.querySelector(".modal-wrapper").style.display = "none";
                            enJeu=false;
                        });
                        
                    }
                }
            }
            document.querySelector("#"+lettre).classList.add("bon") ;
        }
        else{
            if (erreurs >= penduOrdre.length){
                document.querySelector(".modal-wrapper-lose").style.display = "block";
                document.querySelector("#lastmsg").textContent = "Vous avez perdu, le mot que vous cherchiez est "+mot;
                document.querySelector(".yes-lose").addEventListener("click",newGame);
                document.querySelector(".no-lose").addEventListener("click",function(){
                    document.querySelector(".modal-wrapper-lose").style.display = "none";
                    enJeu=false;
                    });
            }
            else{
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


function serve(){
    return fetch("http://15.237.156.219/getWord")
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
