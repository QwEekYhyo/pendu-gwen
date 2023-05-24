let motsListe = [];
const fs = require("fs");

fs.readFile("lesMiserables.txt",function(error,data){
    if(error == null){
        let motsLivre = data.toString().split(/[(\r?\n),. ]/);
        for( let mot of motsLivre ){
            if(mot.length>=6&&mot.length<=8){
            let valid =true;
                for (let i = 0; i< mot.length ; i++){
                    if(mot.charCodeAt(i)<97||mot.charCodeAt(i)>122){
                        valid=false;
                    }
                }
                if (valid){
                    motsListe.push(mot);
                    //console.log("mot valide : ",mot);
                }
            }
        }
        //console.log(motsListe);
    }
});





function manageRequest(request, response) {
    const etoile = request.url.split("?")[0].split("/")[2];
    if (etoile=="getWord"){
        const random = Math.floor(Math.random()*motsListe.length);
        response.end(motsListe[random]);
        //console.log("dans getword",motsListe[random]);
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