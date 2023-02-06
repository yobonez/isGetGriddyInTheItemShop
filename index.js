
import express, { response } from "express";
const app = express();
//import http from "http";
const PORT = 2137;
import fetch from "node-fetch";

const epicAuthorization = process.argv[2];
if (!epicAuthorization)
{
    console.log("You should pass epic auth token")
    process.exit(-1)
}

var epicSession = undefined;

var lastResponse = JSON;
var cooldown = false;
//var itemShopContents = undefined;
//var canRequestItemShop = true;

async function epicAuth(auth)
{
    try {
        const response = await fetch("https://account-public-service-prod.ol.epicgames.com/account/api/oauth/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": "Basic ZWM2ODRiOGM2ODdmNDc5ZmFkZWEzY2IyYWQ4M2Y1YzY6ZTFmMzFjMjExZjI4NDEzMTg2MjYyZDM3YTEzZmM4NGQ="
            },
            body: `grant_type=authorization_code&code=${auth}`
        });
        const data = await response.json();
        epicSession = data;
    } catch (e) {
        epicSession = e;
    }

    //next();
}

async function refreshToken()
{
    if(!epicSession.hasOwnProperty("refresh_token")) { console.log("Token no longer valid"); process.exit(-1) }

    try {
        const response = await fetch("https://account-public-service-prod.ol.epicgames.com/account/api/oauth/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": "Basic ZWM2ODRiOGM2ODdmNDc5ZmFkZWEzY2IyYWQ4M2Y1YzY6ZTFmMzFjMjExZjI4NDEzMTg2MjYyZDM3YTEzZmM4NGQ="
            },
            body: `grant_type=refresh_token&refresh_token=${epicSession["refresh_token"]}`
        });
        const data = await response.json();
        epicSession = data;
    } catch(e) {
        epicSession = e;
    }
}

const getFortniteShopContents = async function(req,res,next)
{
    if(!epicSession.hasOwnProperty("access_token")) { console.log("There was an error authenticating epic games account"); process.exit(-1) }
    if(cooldown) { next(); }

    try {
        const response = await fetch("https://fortnite-public-service-prod11.ol.epicgames.com/fortnite/api/storefront/v2/catalog", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + epicSession["access_token"]
            }
        });
        const data = await response.json();
        req.shopContents = data;
    } catch(e) {
        req.shopContents = e;
    }

    next();
}

await epicAuth(epicAuthorization);
setInterval(async () => { await refreshToken(epicSession["refresh_token"]) } , 3000000);
setInterval(() => {cooldown = false;}, 300000);

app.use(express.json())
//app.use(getFortniteShopContents)

app.use(express.static('html'))
app.use(express.static('css'))
app.use(express.static('js'))

app.get('/'), (req,res) => {
	res.sendFile('index.html');
//	res.sendFile('styles.css');
//	res.sendFile('checkGriddy.js');
}

app.get('/styles.css'), (req,res) => {
	res.sendFile('styles.css');
}

app.get('/checkGriddy.js'), (req, res) => {
	res.sendFile('checkGriddy.js');
}

app.get('/isGetGriddyInTheItemShop', getFortniteShopContents, (req, res) => {
    if(cooldown)
    { res.send(lastResponse); }
    else {
        for(const storefront of req.shopContents['storefronts'])
        {
            for(const item of storefront['catalogEntries']) {
                if(item['devName'].toLowerCase().includes('lunch break') 
                && !item['devName'].includes(",")) // avoid bundles
                { req.response = {"isGetGriddyInTheItemShop": true, 
                                  "devName": item['devName'],
                                  "offerId": item['offerId'],
                                  "storefrontName": storefront['name'],
                                  "finalPrice": item['prices'][0]['finalPrice']};
                                  lastResponse = req.response;
                                  cooldown = true;
                                  break; }
                else { 
                    req.response = {"isGetGriddyInTheItemShop": false};
                    lastResponse = req.response;
                    cooldown = true;
                }
            }
            if (req.response['isGetGriddyInTheItemShop'] == true) { break; }
        }
        res.send(req.response);
    }
})

app.listen(PORT, async () => {
    console.log(`listening on ${PORT}`)
    console.log("Token: " + await epicSession['access_token']);
})

//const httpServer = http.Server(app);

//httpServer.listen(PORT, function() {
//	console.log("HTTP & Express Server listening on " + PORT);
//})
