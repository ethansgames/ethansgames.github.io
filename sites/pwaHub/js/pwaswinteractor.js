/*const updatebanner = document.getElementById("ub");
const updatebutton = document.getElementById("fast-forward-update");

updatebutton.addEventListener('click',() => {
    navigator.serviceWorker.getRegistration().then(reg => {
        if (reg.waiting) {
            reg.waiting.postMessage("UPDATE_NOW");
        }
    })
})*/
const registerSW = async () => {
    if ("serviceWorker" in navigator) {
        try {
            const registration = await navigator.serviceWorker.register("/sw.js", {
                scope: "/",
            });
        } catch {}
    }
}
console.time("regsw");
registerSW();
console.timeEnd("regsw");