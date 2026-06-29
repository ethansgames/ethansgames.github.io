const updatebanner = document.getElementById("ub");
const updatebutton = document.getElementById("fast-forward-update");

updatebutton.addEventListener('click',() => {
    navigator.serviceWorker.getRegistration().then(reg => {
        if (reg.waiting) {
            reg.waiting.postMessage("UPDATE_NOW");
        }
    })
})
self.addEventListener("message",event => {
    if (event.data=="UPDATE_AVAILIBLE")
        updatebanner.hidden = false;
    if (event.data=="UPDATE_INSTALLED")
        updatebanner.hidden = true;
})
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