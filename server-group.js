import express from "express";
import https from "https";
import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { logger } from "./util/logger.js";
import Character from './character.js';
import e from "express";


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

app.post('/join/dd2', (req, res)=> {
  console.log(req.body);
  const { value } = req.body;
  console.log(`Received value: ${value}`);
  // process the value and return a response
  res.send(`You sent: ${value}`);
})

app.post('/submit', (req, res) => {
  let tank = new Character(2,"bro", "tank");
  let healer = new Character(2,"healername", "healer");
  let dd1 = new Character();
  let dd2 = new Character();
  let dd3 = new Character()
  dd3 = new Character(44,"dd3", "dd");
  
  let arrChars = []
  arrChars.push(tank);
  arrChars.push(healer);
  console.log(arrChars.find((e)=>e.role =="tank"));
  const formData = req.body;
  const data = {
      id: 12,
      server: formData.server,
      faction: formData.faction,
      activityType: formData.typ,
      name: formData.name,
      lvl: 60,
      description: formData.description,
      // chars : arrChars
      chars: {tank: tank, healer: healer, dd1:dd1, dd2:dd2, dd3:dd3}
  };
  console.log(data);
  console.log(data.chars.tank.name);
  arrActivities.push(data);
  // res.json(data);
  res.render('activities-list',{arrActivities});
});

app.get('/', (req, res) => {
  let textIntro ="some text";
  let xml = "<root><person><name>John</name></person></root>";
  // logger.info("/ " + new Date())
  let now = new Date()
  let year = now.getFullYear()
  let month = now.getMonth() + 1
  let date = now.getDate()
  let hours = now.getHours()
  let minutes = now.getMinutes()
  if (hours < 10) {
    hours = '0' + hours
  }
  if (minutes < 10) {
    minutes = '0' + minutes
  }

  let dateMonthYear = date + '.' + month + '.' + year
  let time = hours + ':' + minutes
  let fullTime = dateMonthYear + ' ' + time
  console.log(fullTime);

  res.render("index",{textIntro, xml});
});
let arrActivities = [];

app.get('/activities-list', (req, res)=>{
  let activity = {
    id: 1,
    server: "Vekrash",
    faction: "Horde",
    activityType: "Dungeon",
    name: "HDW",
    lvl: 60,
    date: new Date().toISOString()
  }
  
  res.render('activities-list', {arrActivities});
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
