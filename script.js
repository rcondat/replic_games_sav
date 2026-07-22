async function loadSharedFragment(targetId, fragmentPath) {
    const target = document.getElementById(targetId);

    if (!target) {
        return;
    }

    try {
        const response = await fetch(fragmentPath);

        if (!response.ok) {
            throw new Error(`Unable to load ${fragmentPath}`);
        }

        target.outerHTML = await response.text();
    } catch (error) {
        console.error(error);
    }
}

function wireMenu() {
    const menuToggle = document.querySelector(".menu-toggle");
    const mainNavigation = document.getElementById("main-navigation");

    if (!menuToggle || !mainNavigation) {
        return;
    }

    menuToggle.addEventListener("click", () => {
        const isOpen = mainNavigation.classList.toggle("open");
        menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    mainNavigation.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            mainNavigation.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
        });
    });
}

function wireSearch() {
    const searchForm = document.getElementById("search-form");
    const searchInput = document.getElementById("support-search");
    const searchFeedback = document.getElementById("search-feedback");

    if (!searchForm || !searchInput || !searchFeedback) {
        return;
    }

    searchForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const query = searchInput.value.trim();

        if (!query) {
            searchFeedback.textContent = "Saisissez un terme avant de lancer la recherche.";
            searchInput.focus();
            return;
        }

        searchFeedback.textContent = `Aucun article trouve pour « ${query} ». Vous pouvez transmettre une demande ci-dessous.`;
    });
}

function wireSupportForm() {
    const supportForm = document.getElementById("support-form");
    const fakeMessage = document.getElementById("fake-message");
    const requiredFields = ["name", "email", "subject", "message"]
        .map((id) => document.getElementById(id));

    if (!supportForm || !fakeMessage || requiredFields.some((field) => !field)) {
        return;
    }

    supportForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const isAdminBypass = requiredFields.every((field) => field.value.trim().toLowerCase() === "admin");

        if (isAdminBypass) {
            window.location.href = "logs.html";
            return;
        }

        fakeMessage.classList.add("visible");
        fakeMessage.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
}

function wireCategories() {
    const subjectInput = document.getElementById("subject");

    document.querySelectorAll(".category-card").forEach((card) => {
        card.addEventListener("click", () => {
            const category = card.dataset.category;

            if (category && subjectInput && !subjectInput.value.trim()) {
                subjectInput.value = category;
            }
        });
    });
}

function wireLoginForm() {
    const loginForm = document.getElementById("login-form");
    const loginInput = document.getElementById("login");
    const passwordInput = document.getElementById("password");
    const loginMessage = document.getElementById("login-message");

    if (!loginForm || !loginInput || !passwordInput || !loginMessage) {
        return;
    }

    const knownLogins = new Set([
        "amartin", "bbernard", "cdubois", "ddurand", "erobert", "fmoreau", "gpetit", "rlaurent",
        "tmichel", "jgarcia", "lthomas", "hroux", "nvincent", "pmuller", "qfaure", "ssimon",
        "tandre", "uboyer", "vmercier", "wblanc", "xguerin", "ylefevre", "zbonnet", "acaron",
        "bfrancois", "cnguyen", "dperrin", "ebailly", "fhenry", "gadam", "hbarbier", "ijoly",
        "jrenaud", "kschmitt", "lroyer", "mgauthier", "ncolas", "obrun", "ppicard", "qmasson",
        "rnoel", "sollivier", "tmahe", "uclement", "vmeunier", "wfernandez", "xleger", "ymallet",
        "zsanchez", "aarnaud", "bmonnier", "cjacquet", "ddenis", "epouget", "fbrunet", "gchauvin",
        "hlemaire", "isalmon", "jbertin", "kmorin", "lrey", "mloiseau", "ngirard", "opascal",
        "pdupuy", "qbert", "rdubois", "sleclerc", "tguillot", "uvaillant", "vpelletier", "wmarchand",
        "xriou", "ydumas", "zleconte", "agaillard", "bbecker", "ccoste", "ddias", "eberthelot",
        "fmiquel", "gdelattre", "hparis", "iklein", "jrobin", "kfournier", "lpages", "mprieur",
        "nchartier", "obesnard", "pgaudin", "qdevaux", "rbertaux", "smarion", "tneveu", "ugros",
        "vtorres", "wboulay", "xelie", "ymace", "zdidier", "abenoit"
    ]);

    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const login = loginInput.value.trim().toLowerCase();
        const password = passwordInput.value.trim();

        loginMessage.classList.remove("visible");

        if (login === "rdubois" && password === "ec43rtg24") {
            window.location.href = "compte-rdubois.html";
            return;
        }

        if (knownLogins.has(login) && password === "ec43rtg24") {
            loginMessage.innerHTML = "<strong>Compte temporairement suspendu.</strong>Veuillez contacter l'administrateur du site.";
            loginMessage.classList.add("visible");
            return;
        }

        loginMessage.innerHTML = "<strong>Identifiant et/ou mot de passe invalides.</strong>";
        loginMessage.classList.add("visible");
    });
}

function wireTimedVisibility(selector) {
    document.querySelectorAll(selector).forEach((element) => {
        const visibleFrom = element.dataset.visibleFrom;

        if (!visibleFrom) {
            return;
        }

        const releaseDate = new Date(visibleFrom);

        if (Number.isNaN(releaseDate.getTime())) {
            return;
        }

        if (Date.now() >= releaseDate.getTime()) {
            element.classList.remove("is-hidden");
        }
    });
}

async function init() {
    await Promise.all([
        loadSharedFragment("site-header", "header.html"),
        loadSharedFragment("site-footer", "footer.html")
    ]);

    wireMenu();
    wireSearch();
    wireSupportForm();
    wireLoginForm();
    wireTimedVisibility(".claim-banner[data-visible-from]");
    wireTimedVisibility(".timed-visibility[data-visible-from]");
    wireCategories();
}

init();
