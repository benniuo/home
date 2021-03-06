var fs = require('fs'),
    path = require('path'),
    http = require('http');

var MIME = {
    '.css': 'text/css',
    '.js': 'application/javascript'
};

function combineFiles(pathnames, callback){
	var output = [];

	(function next(i,len){

		if(i<len){

			fs.readFile(pathnames[i],function(err,data){
				if(err){
					callback(err);
				}else{
					output.push(data);
					next(i+1,len);
				}
			});
		} else{
			callback(null,Buffer.concat(output));
		}
	}(0,pathnames.length));
}



function main(argv){

	


	// if(argv){
	// 	var config = JSON.parse(fs.readFileSync(argv[0], 'utf-8'));

	// } else{
		var config = {};
	// }


	var root = config.root || '.',
	port  = config.port || 8000;

	http.createServer(function(request,response){
		
		
		var urlInfo = parseURL(root,request.url);

		combineFiles(urlInfo.pathnames,function(err,data){

			if(err){
				response.writeHead(404);
				response.end(err.message);
			} else{
				response.writeHead(200,{
					'Content-Type' : urlInfo.mime
				});
				response.end(data);
			}
		});
	}).listen(port);


}

//deal with the url

function parseURL(root,url){
	var base, pathnames, parts;
	if(url.indexOf("??")=== -1){

		url = url.replace("/","/??");
	}

	parts = url.split("??");
	console.log(parts);

	base = parts[0];

	pathnames = parts[1].split(',').map(function(value){
		return path.join(root,base,value);
	});
	
	return{
		mime: MIME[path.extname(pathnames[0])] || 'text/plain',
    	pathnames: pathnames
	};	

}



main(process.argv.slice(2));

