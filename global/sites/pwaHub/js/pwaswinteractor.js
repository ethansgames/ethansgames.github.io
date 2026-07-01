const updatebanner = document.getElementById("ub");
const updatebutton = document.getElementById("fast-forward-update");
const lawgbutton = document.getElementById("loadallgames");

let UpdateReady = false;
let WaitingWorker = null;

function showUpdateBanner(worker) {
    UpdateReady = true;
    WaitingWorker = worker;
    if (updatebanner) updatebanner.hidden = false;
}

function hideUpdateBanner() {
    UpdateReady = false;
    WaitingWorker = null;
    if (updatebanner) updatebanner.hidden = true;
}

updatebutton?.addEventListener("click", () => {
    if (!UpdateReady || !WaitingWorker) return;
    WaitingWorker.postMessage("UPDATE_NOW");
});
lawgbutton?.addEventListener("click", async () => {
    if (!confirm("Are you sure you want to load all games? This may take a while depending on your connection quality.")) {
        return;
    }

    const reg = await navigator.serviceWorker.ready;

    const worker = reg.active || reg.waiting || reg.installing;

    if (!worker) {
        alert("Service worker is not ready yet.");
        return;
    }

    worker.postMessage("LOAD_ALL");
});

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js").then(reg => {
        reg.update();

        setInterval(() => {
            reg.update();
        }, 3*60*60*1000);

        if (reg.waiting) {
            showUpdateBanner(reg.waiting);
        }

        reg.addEventListener("updatefound", () => {
            const worker = reg.installing;
            if (!worker) return;

            worker.addEventListener("statechange", () => {
                if (
                    worker.state === "installed" &&
                    navigator.serviceWorker.controller
                ) {
                    showUpdateBanner(worker);
                }
            });
        });
    });

    navigator.serviceWorker.addEventListener("controllerchange", () => {
        hideUpdateBanner();
        location.reload();
    });

    navigator.serviceWorker.addEventListener("message", event => {
        if (event.data === "UPDATE_INSTALLED") {
            hideUpdateBanner();
        }
        if (event.data === "LOAD_ALL_DONE") {
            alert("All games done loading.")
        }
    });
}
