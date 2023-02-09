var hintContainer = document.querySelector(".hint-container");
var isHintPinned = false;

function displayHint(hintTextElement, contents) {
    hintContainer.style.opacity = 1;
    hintTextElement.innerHTML = contents;
}

function hideHint()
{
    hintContainer.style.opacity = 0;
}

window.addEventListener("DOMContentLoaded", (e) => {
    const loginHintContents = `- Login to your Epic Games account with the browser you're currently using
- Open this <a href="https://www.epicgames.com/id/api/redirect?clientId=ec684b8c687f479fadea3cb2ad83f5c6&responseType=code" target="_blank">link</a> containing auth code to your Epic Games account
- Copy "authorizationCode" contents (without quotes)
- Paste them into Auth code textbox on this site, click Log In
- If operation succeeds, your game nickname will appear below. 

IMPORTANT - Access token is stored only in your browser (in javascript variable). 
When you're logged in, refreshing the page will reset the session.`

    const loginHint = document.querySelector(".login-hint");
    const nameCheckHint = document.querySelector(".name-check-hint");
    const nameHint = document.querySelector(".name-hint");
    const offerHint = document.querySelector(".offer-hint");

    const hintTextElem = document.querySelector(".hint-text");
    

    loginHint.addEventListener("mouseenter", (e) => {
        displayHint(hintTextElem, loginHintContents);
    })
    loginHint.addEventListener("mouseleave", (e) => {
        if (isHintPinned) { return; }
        hideHint();
    })
    loginHint.addEventListener("click", (e) => {
        if (isHintPinned) { hideHint();  isHintPinned = false; }
        else { displayHint(hintTextElem, loginHintContents); isHintPinned = true;}
    })

    nameCheckHint.addEventListener("mouseenter", (e) => {
        displayHint(hintTextElem, `<img id=\"itemname\" src=\"/itemname.png\"> 
Based on this, actual item name should be like: 
\"[VIRTUAL]1 x Get Griddy for 500 MtxCurrency\"`);
    })
    nameCheckHint.addEventListener("mouseleave", (e) => {
        hideHint();
    })

    nameHint.addEventListener("mouseenter", (e) => {
        displayHint(hintTextElem, "<img id=\"itemhint\" src=\"/itemhint.png\">");
    })
    nameHint.addEventListener("mouseleave", (e) => {
        hideHint();
    })

    offerHint.addEventListener("mouseenter", (e) => {
        displayHint(hintTextElem, `When your purchase goes through, you can verify if the response contains that item offerId with Ctrl+F or something. If it doesn't, that would indicate that request has failed. (no V-Bucks would be charged)`);
    })
    offerHint.addEventListener("mouseleave", (e) => {
        hideHint();
    })
})
    