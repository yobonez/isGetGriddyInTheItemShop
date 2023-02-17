var getGriddyStatus = undefined;

async function getGetGriddyStatus() {
    var data = undefined;
    var response = undefined;
    
    response = await fetch("/isGetGriddyInTheItemShop", { method: "GET" });
    data = await response.json();

    return data;
}

async function main() {
    const griddyContainer = document.querySelector(".griddy-container");
    const griddyStatusElement = document.querySelector(".griddy-status-text");

    getGriddyStatus = await getGetGriddyStatus();

    const isGetGriddy = await getGriddyStatus["isGetGriddyInTheItemShop"];


    //const buyGriddyItem = document.querySelector(".buy-griddy-container .item");
    const buyGriddyItemDetails = document.querySelector(".buy-griddy-container .item .item-details");
    const itemName = await getGriddyStatus["devName"];
    const offerId = await getGriddyStatus["offerId"];

    const buyGriddyContainerButton = document.querySelector(".buynow");

    
    if(getGriddyStatus.hasOwnProperty("Error")) { 
        griddyContainer.style.boxShadow = "0px 1px 10px red";

        griddyStatusElement.innerHTML = "Error, refresh the page";
        griddyStatusElement.style.color = "red";
    }
    
    if(isGetGriddy) {
        griddyContainer.style.boxShadow = "0px 1px 20px green";
        
        griddyStatusElement.innerHTML = "GO GET IT NOW!"; //IT IS!!
        griddyStatusElement.style.color = "green";

        buyGriddyItemDetails.querySelector(".name").innerHTML = await itemName;
        buyGriddyItemDetails.querySelector(".offerid").innerHTML = await offerId;
        
        buyGriddyContainerButton.removeAttribute("disabled");
    }
    else {
        griddyContainer.style.boxShadow = "0px 1px 20px darkred";
        
        griddyStatusElement.innerHTML = "NOPE";
        griddyStatusElement.style.color = "darkred";
        buyGriddyContainerButton.setAttribute("disabled", "");

    }
    
}

main();