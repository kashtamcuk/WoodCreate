const menuButton = document.getElementById("menuButton");
const closeMenu = document.getElementById("closeMenu");
const sideMenu = document.getElementById("sideMenu");
const menuOverlay = document.getElementById("menuOverlay");
const themeToggle = document.getElementById("themeToggle");


// =========================================
// ТЕМА
// =========================================

function applyTheme(theme) {

    const isDark = theme === "dark";

    document.body.classList.toggle("dark-theme", isDark);

    if (themeToggle) {
        themeToggle.textContent = isDark
            ? "☀️ Світла тема"
            : "🌙 Чорна тема";
    }

    localStorage.setItem("woodcraft-theme", theme);
}


const savedTheme = localStorage.getItem("woodcraft-theme") || "light";
applyTheme(savedTheme);

if (themeToggle) {
    themeToggle.addEventListener("click", (event) => {
        event.preventDefault();

        const nextTheme = document.body.classList.contains("dark-theme")
            ? "light"
            : "dark";

        applyTheme(nextTheme);
    });
}


// =========================================
// ВІДКРИТТЯ МЕНЮ
// =========================================

menuButton.addEventListener("click", () => {

    sideMenu.classList.add("open");
    menuOverlay.classList.add("active");

    document.body.style.overflow = "hidden";
});


// =========================================
// ЗАКРИТТЯ МЕНЮ
// =========================================

function closeSideMenu() {

    sideMenu.classList.remove("open");
    menuOverlay.classList.remove("active");

    document.body.style.overflow = "";
}


// Кнопка X
closeMenu.addEventListener("click", closeSideMenu);


// Клік по затемненню
menuOverlay.addEventListener("click", closeSideMenu);


// =========================================
// ПОШУК
// =========================================

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");

function performSearch() {

    const searchText = searchInput.value.trim();

    if (searchText === "") {

        alert("Введіть назву товару.");

        return;
    }

    window.location.href = `catalog.html?q=${encodeURIComponent(searchText)}`;
}


// Натискання кнопки пошуку
searchButton.addEventListener("click", performSearch);


// Натискання Enter у пошуку
searchInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {

        performSearch();
    }
});