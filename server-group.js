import express from "express";
import https from "https";
import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { logger } from "./util/logger.js";

const app = express();
// Replicate __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the public folder
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.json()); // for json
app.use(express.urlencoded({ extended: true })); // for form data


// Middleware
app.use("/", (req, res, next) => {
  logger.info(`Request received`)  
  next();
});

app.get('/', (req, res) => {
  let textIntro ="some text";
  let xml = "<root><person><name>John</name></person></root>";
  // logger.info("/ " + new Date())
  res.render("index",{textIntro, xml});
});

app.get('/activities-list', (req, res)=>{
  res.render('activities-list');
})

app.get('/activity-create', (req, res)=>{
  res.render('activity-create');
})

app.get('/character-create', (req, res)=>{
  res.render('character-create');
})

//#region WEBSERVER
//#region https
// const httpsServer = https.createServer({
//     key: fs.readFileSync('privateKey.key'),
//     cert: fs.readFileSync('certificate.crt'),
//   }, app);

// var privateKey  = fs.readFileSync('sslcert/privateKey.key', 'utf8');
// var certificate = fs.readFileSync('sslcert/certificate.crt', 'utf8');

// var credentials = {key: privateKey, cert: certificate};

/* const credentials = {
    key: fs.readFileSync('sslcert/privateKey.key'),
    cert: fs.readFileSync('sslcert/certificate.crt')
  };
*/
//#endregion

//set NODE_OPTIONS=--openssl-legacy-provider in cmd in VS;read magic wiki
const credentials = {
  pfx: fs.readFileSync(path.join(__dirname,'sslcert', 'STAR_researchstudio_at.pfx'))
};

const portHTTPS = process.env.PORTHTTPS || 443
const httpsServer = https.createServer(credentials, app);

// const port = process.env.PORT || 3000
// app.listen(port, ()=>{
//   console.log(`browse this url: localhost:${port}`);  
// });

//443 used: check tomcat http://localhost:8080/ 
httpsServer.listen(portHTTPS, (err) => {
  if(err){
    console.log("Error: ", err);
    console.log(new Date().toISOString()+` https server could not start on port: ${portHTTPS}`);
  }else{
    console.log(new Date().toISOString()+` https server running on port: ${portHTTPS}`);
    console.log(new Date().toISOString()+` call: https://ispacevm04.researchstudio.at/main`);
  }
});
//#endregion
