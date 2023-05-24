const { readFile } = require("fs");
const api = require("./api.js");
const files = require("./files.js");
const http = require('http');

http.createServer(function(request, response) {
    const url = request.url.split("/");
    url.filter((elem) => {
        elem != "..";
        }
        );
    if (url[1]=="api"){
        api.manage(request, response);
    }
    else{
        files.manage(request,response);
    }

}).listen(8000);