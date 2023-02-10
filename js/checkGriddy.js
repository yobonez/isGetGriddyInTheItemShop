var returnCode = undefined;
var getGriddyStatus = undefined;

async function getGetGriddyStatus() {
    var data = undefined;
    var response = undefined;
    
    response = await fetch("/isGetGriddyInTheItemShop", { method: "GET" });
    data = await response.json();

    returnCode = response.status;

    return data;
}

async function main() {
    const griddyContainer = document.querySelector(".griddy-container");
    const griddyStatusElement = document.querySelector(".griddy-status-text");

    getGriddyStatus = await getGetGriddyStatus();

    if(await returnCode != 200) { 
        griddyContainer.style.boxShadow = "0px 1px 10px red";

        griddyStatusElement.innerHTML = "Error, refresh the page";
        griddyStatusElement.style.color = "red";
    }

    const isGetGriddy = await getGriddyStatus["isGetGriddyInTheItemShop"];


    //const buyGriddyItem = document.querySelector(".buy-griddy-container .item");
    const buyGriddyItemDetails = document.querySelector(".buy-griddy-container .item .item-details");
    const itemName = await getGriddyStatus["devName"];
    const offerId = await getGriddyStatus["offerId"];

    const buyGriddyContainerButton = document.querySelector(".buynow");

    
    if(isGetGriddy) {
        griddyContainer.style.boxShadow = "0px 1px 20px green";
        
        griddyStatusElement.innerHTML = "(NOPE, TESTING) IT IS!!!"; //IT IS!!
        griddyStatusElement.style.color = "green";

        buyGriddyItemDetails.querySelector(".name").innerHTML = await itemName;
        buyGriddyItemDetails.querySelector(".offerid").innerHTML = await offerId;
        
        buyGriddyContainerButton.style.pointerEvents = "auto";
        buyGriddyContainerButton.style.opacity = 1;
    }
    else {
        griddyContainer.style.boxShadow = "0px 1px 20px darkred";

        griddyStatusElement.innerHTML = "NOPE";
        griddyStatusElement.style.color = "darkred";

    }
}

main();