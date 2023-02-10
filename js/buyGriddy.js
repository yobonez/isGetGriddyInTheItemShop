var buyGriddyButtonState = false;
var session = undefined;

async function requestEpicSession(authCode) {
    try {
        const response = await fetch("/requestEpicSession", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: `{"code": "${authCode}"}`,
        });
        const data = await response.json();
        return data;
    } catch (e) {
        console.log(e);
    }
}

async function requestPurchase(bearer_token, accountId, offerId, expectedTotalPrice) {
    try {
        const response = await fetch("/requestPurchase", {
            method: "POST",
            headers: { "Content-Type": "application/json" /*"Authorization": `bearer ${bearer_token}`*/},
            body: `{"bearerToken": "${bearer_token}", "accountId":"${accountId}", "offerId": "${offerId}", "expectedTotalPrice": ${expectedTotalPrice}}`
        });
        const data = await response.json();
        return data;
    } catch (e) {
        console.log(e);
    }
}

function showBuyOptions(container) {
    container.style.opacity = 0.95;
    container.style.pointerEvents = "auto";
    buyGriddyButtonState = true;
}

function hideBuyOptions(container){
    container.style.opacity = 0;
    container.style.pointerEvents = "none";
    buyGriddyButtonState = false;
}


window.addEventListener("DOMContentLoaded", (e) => {
    const buyGriddyContainer = document.querySelector(".buy-griddy-container");
    const buyGriddyContainerButton = document.querySelector(".buynow");

    const loginButton = document.querySelector(".login-button");

    const buyButton = document.querySelector(".purchase .purchasebtn");

    buyGriddyContainerButton.addEventListener('click', (e) => {
        if (!buyGriddyButtonState) { showBuyOptions(buyGriddyContainer); }
        else { hideBuyOptions(buyGriddyContainer); }
    })

    loginButton.addEventListener("click", async (e) => {
        var status = undefined;
        const sessionContainer = document.querySelector(".session .session-auth");

        const authCode = document.querySelector(".auth-code").value;
        const nickname = document.querySelector(".nickname");

        if(!document.querySelector(".login-status")) {
            const loginStatusTextNode = document.createElement("p");
            loginStatusTextNode.classList.add("login-status");
            loginStatusTextNode.innerText = "Logging in...";

            sessionContainer.appendChild(loginStatusTextNode);

            status = document.querySelector(".login-status");
        }
        else {
            status = document.querySelector(".login-status");
            status.innerHTML = "Logging in...";
        }
        

        session = await requestEpicSession(authCode);


        
        if (session.hasOwnProperty("access_token"))
        { nickname.innerHTML = session["displayName"]; status.innerHTML = "Success!" }
        else {
            status.innerHTML = "Error (check console)";
            nickname.innerHTML = "(You need to log in)";
            console.log(await session);
        }
    });

    buyButton.addEventListener("click", async (e) => {
        var purchaseResponse = undefined;

        const responseContainer = document.querySelector(".purchase .response-area textarea");

        purchaseResponse = await requestPurchase(session["access_token"], session["account_id"], getGriddyStatus["offerId"], getGriddyStatus["expectedTotalPrice"]);
    })

})