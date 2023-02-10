
import express, { response } from "express";
import fetch from "node-fetch";

const app = express();
//import http from "http";
const PORT = 2137;

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
        return data;
    } catch (e) {
        console.log(e);
    }

    //next();
}

async function refreshToken(refToken)
{
    if(!await epicSession.hasOwnProperty("refresh_token")) { console.log("Token no longer valid"); console.log("What is wrong???\n" + epicSession); return; }
    else { console.log("Token refreshed."); }

    try {
        const response = await fetch("https://account-public-service-prod.ol.epicgames.com/account/api/oauth/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": "Basic ZWM2ODRiOGM2ODdmNDc5ZmFkZWEzY2IyYWQ4M2Y1YzY6ZTFmMzFjMjExZjI4NDEzMTg2MjYyZDM3YTEzZmM4NGQ="
            },
            body: `grant_type=refresh_token&refresh_token=${refToken}`
        });
        const data = await response.json();
        return data;
    } catch(e) {
        console.log(e);
    }
}

async function requestEpicPurchase(bearer, accId, offId, expTotalPrice){
    try {
        const response = await fetch(`https://fortnite-public-service-prod11.ol.epicgames.com/fortnite/api/game/v2/profile/${accId}/client/PurchaseCatalogEntry?profileId=common_core`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `bearer ${bearer}`,
            },
            body: `{"offerId": "${offId}","purchaseQuantity": 1,"currency": "MtxCurrency","currencySubType":"","expectedTotalPrice": ${expTotalPrice},"gameContext": ""}`
        });
        const data = await response.json();
        return data;
    } catch (e) {
        console.log(e);
    }
}

const getFortniteShopContents = async function(req,res,next)
{
    if(!epicSession.hasOwnProperty("access_token")) { console.log("There was an error authenticating epic games account\n"); console.log(epicSession); /*process.exit(-1)*/ }
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

epicSession = await epicAuth(epicAuthorization);
setInterval(async () => { await refreshToken(epicSession["refresh_token"]) } , 900000);
setInterval(() => {cooldown = false;}, 600000);

app.use(express.json())
//app.use(getFortniteShopContents)

app.use(express.static('html'))
app.use(express.static('css'))
app.use(express.static('js'))
app.use(express.static('img'))

app.get('/'), (req,res) => {
	res.sendFile('index.html');
}

// /css section
app.get('/styles.css'), (req,res) => {
	res.sendFile('styles.css');
}

app.get('/buy.css'), (req, res) => {
    res.sendFile('buy.css');
}

app.get('/hint.css'), (req, res) => {
    res.sendFile('hint.css');
}
// end of /css section

// /js section
app.get('/checkGriddy.js'), (req, res) => {
	res.sendFile('checkGriddy.js');
}

app.get('/buyGriddy.js'), (req, res) => {
    res.sendFile('buyGriddy.js');
}
// end of /js section

// /img section
app.get('/griddy.png'), (req, res) => {
	res.sendFile('griddy.png');
}

app.get('/transaction.png'), (req, res) => {
	res.sendFile('transaction.png');
}

app.get('/meowgriddy.gif'), (req, res) => {
	res.sendFile('meowgriddy.gif');
}

app.get('/itemname.png'), (req, res) => {
	res.sendFile('itemname.png');
}

app.get('/itemhint.png'), (req, res) => {
	res.sendFile('itemhint.png');
}
// end of /img section

app.get('/isGetGriddyInTheItemShop', getFortniteShopContents, async (req, res) => {
    if(cooldown)
    { res.send(lastResponse); }
    else {
        const shopContents = await req.shopContents;
        console.log(await shopContents);

        for(const storefront of shopContents['storefronts'])
        {
            for(const item of storefront['catalogEntries']) {
                if (
                    item['devName'].toLowerCase().includes('fusion! hah!!') 
                    &&
                    !item['devName'].includes(",") // avoid bundles
                ) 
                { 
                    req.response = {"isGetGriddyInTheItemShop": true, 
                                    "devName": item['devName'],
                                    "offerId": item['offerId'],
                                    "storefrontName": storefront['name'],
                                    "finalPrice": item['prices'][0]['finalPrice']};
                                    lastResponse = req.response;
                                    cooldown = true;
                                    break; 
                }
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

app.post('/requestEpicSession', async (req, res) => {
    let authorizationCode = req.body.code;
    const session = await epicAuth(authorizationCode);

    res.send(session);
})

app.post('/requestPurchase', async (req, res) => {
    let bearerToken = req.body.bearerToken;
    let accountId = req.body.accountId;
    let offerId = req.body.offerId;
    let expectedTotalPrice = req.body.expectedTotalPrice;

    const response = await requestEpicPurchase(bearerToken, accountId, offerId, expectedTotalPrice);

    res.send(response);
})

app.listen(PORT, async () => {
    console.log(`listening on ${PORT}`)
    console.log("Token: " + await epicSession['access_token']);
    console.log("Refresh token " + await epicSession['refresh_token']);
})

//const httpServer = http.Server(app);

//httpServer.listen(PORT, function() {
//	console.log("HTTP & Express Server listening on " + PORT);
//})
