/* You should implement your request handler function in this file.
 * And hey! This is already getting passed to http.createServer()
 * in basic-server.js. But it won't work as is.
 * You'll have to figure out a way to export this function from
 * this file and include it in basic-server.js so that it actually works.
 * *Hint* Check out the node module documentation at http://nodejs.org/api/modules.html. */
var fs = require('fs');
var exports = module.exports = {};
exports.handleRequest = function(request, response) {
  /* the 'request' argument comes from nodes http module. It includes info about the
  request - such as what URL the browser is requesting. */

  /* Documentation for both request and response can be found at
   * http://nodemanual.org/0.8.14/nodejs_ref_guide/http.html */

  console.log("Serving request type " + request.method + " for url " + request.url);

  var statusCode = 200;
  var messages = [];
  var results = {results:[]};

  /* Without this line, this server wouldn't work. See the note
   * below about CORS. */
  var headers = exports.defaultCorsHeaders;

  headers['Content-Type'] = "text/plain";

  /* .writeHead() tells our server what HTTP status code to send back */
  // response.writeHead(statusCode, headers);

  if(request.url === '/classes/messages' && request.method === 'GET'){
    console.log('hi');
    response.writeHead(statusCode, headers);
    response.end(JSON.stringify({results:[]}));
  }
  if(request.url === '/classes/messages' && request.method === 'POST'){
    // request.url = '/classes/messages/send:'
    // package data as an array of objects called "messages"
    // with properties "username" and "message"
    console.log('hello');
    statusCode = 201;
    response.writeHead(statusCode, headers);
    request.on('data', function(data){
      messages.push(data);
      fs.writeFile('./filesystem.json', messages, function(err){
        if(err){
          console.log(err);
        }else{
          console.log("The file was saved!");
        }
      });
    });
    response.end(JSON.stringify(messages));
  }
// var fs = require('fs');
// fs.writeFile("/tmp/test", "Hey there!", function(err) {
//     if(err) {
//         console.log(err);
//     } else {
//         console.log("The file was saved!");
//     }
// });

  /* Make sure to always call response.end() - Node will not send
   * anything back to the client until you do. The string you pass to
   * response.end() will be the body of the response - i.e. what shows
   * up in the browser.*/
  // response.end("Hello, World!");
};

/* These headers will allow Cross-Origin Resource Sharing (CORS).
 * This CRUCIAL code allows this server to talk to websites that
 * are on different domains. (Your chat client is running from a url
 * like file://your/chat/client/index.html, which is considered a
 * different domain.) */
exports.defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};
