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

    if (!supportForm || !fakeMessage) {
        return;
    }

    supportForm.addEventListener("submit", (event) => {
        event.preventDefault();
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

async function init() {
    await Promise.all([
        loadSharedFragment("site-header", "header.html"),
        loadSharedFragment("site-footer", "footer.html")
    ]);

    wireMenu();
    wireSearch();
    wireSupportForm();
    wireCategories();
}

init();
