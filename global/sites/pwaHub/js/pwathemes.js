const header=document.getElementById("hdr");
const links=document.getElementById("links");
const herotitle=document.getElementById("ht");
const footer=document.getElementById("footer");
const gtspan=document.getElementById("titleGameSpan");
const logo=document.getElementById("lg");
const linkbuttons = document.querySelectorAll('.link-button');
const experimentalbutton = document.getElementById("xplb");
const body = document.querySelectorAll("body");
const ftlicense = document.getElementById("ftgamelicense");
const ftdisclaimer = document.getElementById("ftdisclaimer");
const nextThemeButton = document.getElementById("nextThemeButton");
const pwatheme = document.querySelector('meta[name="theme-color"]');
const loadallgamesbtn = document.getElementById("loadallgames");

const themes = [
    {
        border: "#9dff00",
        fill: "#003b63",
        headerlnkbg:"rgba(0, 85, 138, 1)",
        httextShadow:"5px 5px #001b33, 0 0 15px #00eaff",
        gtspancolor:"yellow",
        logotextShadow:"3px 3px #18005c",
        lbGradient:"linear-gradient( #006eff, #00ff62)",
        lbBorder:"4px solid #faf500",
        lbTextColor:"#00304f",
        exbBorder:"4px solid #2b2b2b",
        bgGradient:"linear-gradient(rgba(0, 20, 40, 0.75), rgba(0, 20, 40, 0.9)), repeating-linear-gradient( 45deg, #072b4f 0px, #072b4f 40px, #0a3766 40px, #0a3766 80px )",
        htcolor:"#fff",
        logocolor:"#fff",
        footercolor:"#fff",
        ftlinkcolor:"rgb(173, 252, 255)",
        name:"Geometry Theme"
    },
    {
        border:"red",
        fill:"rgba(16, 16, 16, 0.82)",
        headerlnkbg:"rgb(28, 28, 28)",
        httextShadow:"5px 5px #000000, 0 0 15px #ffb8b8",
        gtspancolor:"red",
        logotextShadow:"3px 3px #000000",
        lbGradient:"linear-gradient(rgb(49, 49, 49), rgba(33, 33, 33, 0.82))",
        lbBorder:"4px solid red",
        lbTextColor:"white",
        exbBorder:"4px solid #750000",
        bgGradient:"linear-gradient(rgba(33, 33, 33, 0.75), rgba(33, 33, 33, 0.9)), repeating-linear-gradient( 45deg, #202020 0px, #202020 40px, #151515 40px, #151515 80px )",
        htcolor:"#fff",
        logocolor:"#fff",
        footercolor:"#ffffff",
        ftlinkcolor:"rgb(255, 0, 0)",
        name:"Black/Red Theme"
    },
    {
        border:"rgb(13, 13, 13)",
        fill:"rgba(16, 16, 16, 0.82)",
        headerlnkbg:"rgb(28, 28, 28)",
        httextShadow:"5px 5px #000000, 0 0 15px #454545",
        gtspancolor:"rgb(255, 255, 255)",
        logotextShadow:"3px 3px #000000",
        lbGradient:"linear-gradient(rgb(49, 49, 49), rgba(33, 33, 33, 0.82))",
        lbBorder:"4px solid rgb(13, 13, 13)",
        lbTextColor:"white",
        exbBorder:"4px solid #000000",
        bgGradient:"linear-gradient(rgba(33, 33, 33, 0.75), rgba(33, 33, 33, 0.9)), repeating-linear-gradient( 45deg, #505050 0px, #505050 40px, #373737 40px, #373737 80px )",
        htcolor:"#fff",
        logocolor:"#fff",
        footercolor:"#fff",
        ftlinkcolor:"rgb(173, 252, 255)",
        name:"Dark Mode"
    },
    {
        border:"rgb(178, 178, 178)",
        fill:"rgba(234, 234, 234, 0.82)",
        headerlnkbg:"rgb(255, 255, 255)",
        httextShadow:"5px 5px #c8c8c8, 0 0 15px #ffffff",
        gtspancolor:"rgb(255, 242, 0)",
        logotextShadow:"3px 3px #c8c8c8",
        lbGradient:"linear-gradient(rgb(240, 240, 240), rgba(226, 226, 226, 0.82))",
        lbBorder:"4px solid rgb(212, 212, 212)",
        lbTextColor:"#6e6e6e",
        exbBorder:"4px solid #b9b9b9",
        bgGradient:"linear-gradient(rgba(255, 255, 255, 0.75), rgba(255, 255, 255, 0.9)), repeating-linear-gradient( 45deg, #f6f6f6 0px, #f6f6f6 40px, #eaeaea 40px, #eaeaea 80px )",
        htcolor:"#6e6e6e",
        logocolor:"#6e6e6e",
        footercolor:"#6e6e6e",
        ftlinkcolor:"#26a8ff",
        name:"Lite Mode"
    }
];

let themeIndex = Number(localStorage.getItem("pwathemenum") ?? 0);

updatetheme(themeIndex);

nextThemeButton.addEventListener("click", nextTheme);

function nextTheme() {
    themeIndex = (themeIndex + 1) % themes.length;

    localStorage.setItem("pwathemenum", themeIndex);

    updatetheme(themeIndex);
}

function updatetheme(themeIndex) {
    header.style.borderBottom = "4px solid " + themes[themeIndex].border;
    footer.style.borderTop = "4px solid " + themes[themeIndex].border;
    links.style.border = "4px solid " + themes[themeIndex].border;

    header.style.background = themes[themeIndex].headerlnkbg;
    links.style.background = themes[themeIndex].headerlnkbg;
    footer.style.background = themes[themeIndex].fill;
    body[0].style.background = themes[themeIndex].bgGradient;

    linkbuttons.forEach(element => {
        element.style.background = themes[themeIndex].lbGradient;
        element.style.border = themes[themeIndex].lbBorder;
        element.style.color = themes[themeIndex].lbTextColor;
    });

    ftdisclaimer.style.color = themes[themeIndex].ftlinkcolor;
    ftlicense.style.color = themes[themeIndex].ftlinkcolor;

    experimentalbutton.style.border = themes[themeIndex].exbBorder;

    herotitle.style.color = themes[themeIndex].htcolor;
    herotitle.style.textShadow = themes[themeIndex].httextShadow;

    gtspan.style.color = themes[themeIndex].gtspancolor;

    logo.style.textShadow = themes[themeIndex].logotextShadow;
    logo.style.color = themes[themeIndex].logocolor;

    footer.style.color = themes[themeIndex].footercolor;

    pwatheme.setAttribute("content",themes[themeIndex].fill);

    //footer buttons
    
    nextThemeButton.textContent = themes[themeIndex].name;
    nextThemeButton.style.background = themes[themeIndex].lbGradient;
    nextThemeButton.style.color = themes[themeIndex].logocolor;
    nextThemeButton.style.border = "4px solid " + themes[themeIndex].border;

    loadallgamesbtn.style.background = themes[themeIndex].lbGradient;
    loadallgamesbtn.style.color = themes[themeIndex].logocolor;
    loadallgamesbtn.style.border = "4px solid " + themes[themeIndex].border;
}