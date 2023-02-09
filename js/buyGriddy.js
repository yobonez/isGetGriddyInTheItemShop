var buyGriddyButtonState = false;

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


    buyGriddyContainerButton.addEventListener('click', (e) => {
        if (!buyGriddyButtonState) { showBuyOptions(buyGriddyContainer); }
        else { hideBuyOptions(buyGriddyContainer); }
    })

})