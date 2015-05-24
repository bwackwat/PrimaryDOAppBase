var static = require('node-static');
var util = require("util");

var PUBLIC = "./public";

var fs = require('fs');	
var appsAsDirs;
fs.readdir(PUBLIC, function(err, files)
{
	appsAsDirs = files;
});

var public = new static.Server(PUBLIC);

function serveStaticIndex(response)
{
	response.write("<html>");
	response.write("<head>");
	response.write("<title>Static Index</title>");
	response.write("<link rel='shortcut icon' type='image/x-icon' href='icons/favicon.ico'/>");
	response.write("</head>");
	response.write("<body>");
	response.write("<h1>You stumbled upon a nice, simple, static index.</h1>");
	if(typeof appsAsDirs === 'undefined')
	{
		response.write("<h2>You are also faster than the server.</h2>");
		response.write("<h3>Nothing has loaded yet, punk.</h3>");
	}else
	{
		for(var appDir in appsAsDirs)
		{
			response.write("<a href=http://www.bwackwat.com/" + appsAsDirs[appDir] + "><h2>" + appsAsDirs[appDir] + "</h2></a>");	
		}
	}
	response.write("</body>");
	response.write("</html>");
}

require('http').createServer(function(request, response)
{
	request.addListener('end', function()
	{
		public.serve(request, response, function(err, result)
		{
			/*fs.writeFile("lastRequest.txt", util.inspect(request), function(err)
			{
				if(err)
				{
					throw err;
				}
			});*/
			if(err)
			{
				response.setHeader("Status", 200);

				serveStaticIndex(response);

				response.end();
			}
		});
	}).resume();
}).listen(80);

console.log("Static web file server for " + PUBLIC + " is open on port 80.");