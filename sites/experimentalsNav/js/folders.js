const folders = document.querySelectorAll(".folder-wrap");

folders.forEach(folder => {
  const papers = [...folder.querySelectorAll(".paper")];

  function layout() {
    const n = papers.length;

    papers.forEach((paper, i) => {
      const t = n === 1 ? 0 : i / (n - 1);
      const angle = -70 + t * 140;
      const r = 180 + Math.abs(angle) * 1.1;

      paper.style.setProperty("--tx", (Math.sin(angle * Math.PI / 180) * r).toFixed(1) + "px");
      paper.style.setProperty("--ty", (-Math.cos(angle * Math.PI / 180) * (180 + Math.abs(angle) * 0.6)).toFixed(1) + "px");
      paper.style.setProperty("--rot", (angle / 3).toFixed(1) + "deg");
    });
  }

  layout();

  folder.addEventListener("click", e => {
    if (e.target.closest("a")) return;

    folders.forEach(f => {
      if (f !== folder) f.classList.remove("open");
    });

    folder.classList.toggle("open");
  });
});

/* URL auto-open logic goes OUTSIDE the loop */
const params = new URLSearchParams(location.search);

if (params.get("open") === "siegeprotectors") {
  const folder = document.getElementById("siegeprotectors-folder");

  if (folder) {
    folders.forEach(f => f.classList.remove("open"));
    folder.classList.add("open");
    folder.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}