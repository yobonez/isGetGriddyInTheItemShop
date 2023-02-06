const tokenHintTrigger = document.querySelector(".code-hint");
const tokenHint = document.querySelector(".hint-container");

tokenHintTrigger.addEventListener("mouseenter", (e) => {
    tokenHint.style.opacity = 1;
})

tokenHintTrigger.addEventListener("mouseleave", (e) => {
    tokenHint.style.opacity = 0;
})