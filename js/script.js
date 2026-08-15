const menuButton = document.getElementById("menuButton");
const closeMenu = document.getElementById("closeMenu");
const sideMenu = document.getElementById("sideMenu");
const menuOverlay = document.getElementById("menuOverlay");


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

    alert("Пошук: " + searchText);
}


// Натискання кнопки пошуку
searchButton.addEventListener("click", performSearch);


// Натискання Enter у пошуку
searchInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {

        performSearch();
    }
});