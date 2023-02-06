var returnCode = undefined;
async function getGetGriddyStatus() {
    const response = await fetch("/isGetGriddyInTheItemShop", { method: "GET" });
    const data = await response.json();

    returnCode = response.status;

    return data["isGetGriddyInTheItemShop"];
}

async function main() {
    const griddyContainer = document.querySelector(".griddy-container");
    const griddyStatusElement = document.querySelector(".griddy-status-text");
    const isGetGriddy = await getGetGriddyStatus();

    const buyControls = document.querySelector('.buy-griddy-container');
    const codeHint = document.querySelector(".code-hint sup");

    if(returnCode != 200) { 
        griddyContainer.style.boxShadow = "0px 1px 10px red";

        griddyStatusElement.innerHTML = "Error, refresh the page";
        griddyStatusElement.style.color = "red";
    }

    if(isGetGriddy) {
        griddyContainer.style.boxShadow = "0px 1px 10px green";

        griddyStatusElement.innerHTML = "AVAILABLE (testing)";
        griddyStatusElement.style.color = "green";

        buyControls.style.pointerEvents = "auto";
        buyControls.style.opacity = 1;

        // codeHint.style.opacity = 1;
        // codeHint.style.pointerEvents = "auto";
    }
    else {
        griddyContainer.style.boxShadow = "0px 1px 10px darkred";

        griddyStatusElement.innerHTML = "UNAVAILABLE";
        griddyStatusElement.style.color = "darkred";

        buyControls.style.pointerEvents = "none";
        buyControls.style.opacity = 0.4;

        // codeHint.style.opacity = 1;
        // codeHint.style.pointerEvents = "auto";
    }
}

main();