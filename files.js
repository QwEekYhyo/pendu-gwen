const pathFront = "./front";
const mimeTypes = {
    '.ico': 'image/x-icon',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.md': 'text/plain',
    'default': 'application/octet-stream'
};
const urlmodule = require("url");
const path = require("path");
const fs = require("fs");
const index = "index.html";


function manageRequest(request, response) {
    response.statusCode = 200;
    //response.end(`Thanks for calling ${request.url} FILES`);

    let pathname = pathFront + urlmodule.parse(request.url).pathname;
    console.log(request.url);
    fs.exists(pathname,function(exists){
        if(exists&&!request.url.includes("..")){
            if(fs.statSync(pathname).isDirectory()){
                pathname+="/index.html";
            }
            fs.readFile(pathname,function(error,data){
                if (error == null){
                    response.setHeader("Content-type",mimeTypes[path.parse(pathname).ext]);
                    response.end(data);
                }
                else{
                    console.log(`else`);
                    
                }
            })
            
        }
        else if(request.url.includes("..")){
            fs.readFile("security.html",function(error,data){
                if (!error){
                    response.setHeader("Content-type",mimeTypes[".html"]);
                    response.end(data);
                }
            });

        }
        else{
            fs.readFile("404.html",function(error,data){
                if (!error){
                    response.setHeader("Content-type",mimeTypes[".html"]);
                    response.end(data);
                }
            });
        }
    });


}

exports.manage = manageRequest; 