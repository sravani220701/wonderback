const http = require("http");
const path = require("path");
const fs = require("fs");
const {MongoClient} = require('mongodb');


const MONGO_URI ="mongodb+srv://sravanimummaneni:mummanenisravani@cluster0.m0ksz.mongodb.net/wonders?retryWrites=true&w=majority&appName=Cluster0";
const mongo_client_connection = new MongoClient(MONGO_URI);


const server = http.createServer((req, res) =>{
    console.log(req.url);
    if(req.url ==='/'){ // home page

        fs.readFile(path.join(__dirname,'../public','index.html'),(err,content)=>{

        if (err) throw err ;
        res.writeHead(200, {'Content-Type': 'text/html'})
        res.end(content)
         })
    }  
    else if (req.url === '/api') {
        const headers =
        {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
            "Content-Type": 'application/json'
        };
        (async(req,res)=>{
            try
            {
                // connect to the MongoDB cluster
                await mongo_client_connection.connect();
                const wonders_collection = mongo_client_connection.db("wonders").collection(wonders);
                
                const cursor = wonders_collection.find({});
                const results = await cursor.toArray();
                const js = (JSON.stringify(results));
                res.writeHead(200, headers);
                res.end(js);
                console.log(js);
            }catch (err) {
                console.error(err);
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end('server failed to handle the request');
              } finally {
                await mongo_client_connection.close();
              }
        })(req,res);
     }
    else{
        res.end("<h1> 404 Nothing is here </h1>")
    }

});

const PORT= process.env.PORT || 1617;

// port, callback
server.listen(PORT,()=> console.log(`Great our server is running on port ${PORT} `));

