"use strict";

document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       ЕЛЕМЕНТИ
       ========================================= */

    const searchInput =
        document.getElementById("searchInput");

    const searchButton =
        document.getElementById("searchButton");

    const sortSelect =
        document.getElementById("sortSelect");

    const productGrid =
        document.querySelector(".catalog-grid");

    const productsCount =
        document.querySelector(".products-count");

    const products =
        Array.from(
            document.querySelectorAll(
                ".catalog-product-card"
            )
        );

    const categoryLinks =
        document.querySelectorAll(
            ".category-link"
        );

    const minPriceInput =
        document.querySelector(
            '.price-inputs input[placeholder="від"]'
        );

    const maxPriceInput =
        document.querySelector(
            '.price-inputs input[placeholder="до"]'
        );

    const filterButton =
        document.querySelector(".filter-button");

    const ratingCheckboxes =
        document.querySelectorAll(
            'input[name="rating"]'
        );


    /* =========================================
       СТАН КАТАЛОГУ
       ========================================= */

    let currentCategory = "all";

    let currentSearch = "";

    let minPrice = 0;

    let maxPrice = Infinity;

    let minimumRating = 0;

    let currentSort = "popular";

    const urlParams = new URLSearchParams(window.location.search);
    const initialSearch = (urlParams.get("q") || "").trim().toLowerCase();
    const initialCategory = urlParams.get("category") || "all";

    if (searchInput) {
        searchInput.value = initialSearch;
    }

    currentSearch = initialSearch;

    if (categoryLinks.length) {
        const validCategory = Array.from(categoryLinks).some(
            (link) => (link.dataset.category || "all") === initialCategory
        );

        if (validCategory) {
            currentCategory = initialCategory;
        }

        categoryLinks.forEach((link) => {
            const isActive = (link.dataset.category || "all") === currentCategory;
            link.classList.toggle("active", isActive);
        });
    }


    /* =========================================
       ПІДГОТОВКА ДАНИХ ТОВАРІВ
       ========================================= */

    function normalizeProductData() {

        products.forEach((product) => {

            const title =
                product.dataset.name ||
                product.querySelector("h2")?.textContent?.trim() ||
                "";

            if (!product.dataset.name) {
                product.dataset.name = title;
            }

            if (!product.dataset.category) {
                const categoryName = title.toLowerCase();

                if (
                    categoryName.includes("миска") ||
                    categoryName.includes("дошка") ||
                    categoryName.includes("таріл") ||
                    categoryName.includes("чаш") ||
                    categoryName.includes("завар") ||
                    categoryName.includes("піднос")
                ) {
                    product.dataset.category = "kitchen";
                }

                else if (
                    categoryName.includes("полиц") ||
                    categoryName.includes("стіл") ||
                    categoryName.includes("лав") ||
                    categoryName.includes("шафа")
                ) {
                    product.dataset.category = "furniture";
                }

                else if (
                    categoryName.includes("набір") ||
                    categoryName.includes("подар") ||
                    categoryName.includes("сувен")
                ) {
                    product.dataset.category = "gifts";
                }

                else if (
                    categoryName.includes("органайз") ||
                    categoryName.includes("декор") ||
                    categoryName.includes("рам") ||
                    categoryName.includes("ваз")
                ) {
                    product.dataset.category = "decor";
                }

                else {
                    product.dataset.category = "home";
                }
            }

            if (!product.dataset.price) {
                const priceText =
                    product.querySelector("strong")?.textContent?.replace(/[^\d]/g, "") || "0";

                product.dataset.price = String(Number(priceText) || 0);
            }

            if (!product.dataset.rating) {
                const ratingText =
                    product.querySelector(".product-rating")?.textContent?.trim() || "";

                const ratingMatch = ratingText.match(/(\d+(?:[.,]\d+)?)/);
                const ratingValue = ratingMatch ? Number(ratingMatch[1].replace(",", ".")) : 0;

                product.dataset.rating = String(ratingValue || 0);
            }

            if (!product.dataset.popular) {
                const reviewsText =
                    product.querySelector(".product-rating span")?.textContent?.match(/\d+/)?.[0] || "0";

                product.dataset.popular = reviewsText;
            }

            if (!product.dataset.new) {
                product.dataset.new = "0";

                const badge =
                    product.querySelector(".product-badge")?.textContent?.trim().toLowerCase() || "";

                if (badge.includes("нов")) {
                    product.dataset.new = "1";
                }
            }
        });
    }

    normalizeProductData();


    /* =========================================
       ПІДРАХУНОК КАТЕГОРІЙ
       ========================================= */

    function updateCategoryCounts() {

        const countByCategory = {
            all: products.length,
            home: 0,
            kitchen: 0,
            decor: 0,
            furniture: 0,
            gifts: 0,
            other: 0
        };

        products.forEach((product) => {

            const category = product.dataset.category || "other";
            countByCategory[category] = (countByCategory[category] || 0) + 1;

        });

        categoryLinks.forEach((link) => {

            const key = link.dataset.category || "all";
            const count = countByCategory[key] ?? 0;
            const countNode = link.querySelector(".category-count");

            if (countNode) {
                countNode.textContent = String(count);
            }

        });

    }


    /* =========================================
       СОРТУВАННЯ ТОВАРІВ
       ========================================= */

    function sortProducts(items) {

        const sorted = [...items];

        if (currentSort === "cheap") {
            sorted.sort((a, b) => Number(a.dataset.price) - Number(b.dataset.price));
        }

        else if (currentSort === "expensive") {
            sorted.sort((a, b) => Number(b.dataset.price) - Number(a.dataset.price));
        }

        else if (currentSort === "popular") {
            sorted.sort((a, b) => Number(b.dataset.popular) - Number(a.dataset.popular));
        }

        else if (currentSort === "new") {
            sorted.sort((a, b) => Number(b.dataset.new) - Number(a.dataset.new));
        }

        return sorted;

    }


    /* =========================================
       ОТРИМАННЯ ВІДФІЛЬТРОВАНИХ ТОВАРІВ
       ========================================= */

    function getFilteredProducts() {

        return products.filter((product) => {

            const name =
                (
                    product.dataset.name || ""
                ).toLowerCase();

            const category =
                product.dataset.category || "";

            const price =
                Number(
                    product.dataset.price || 0
                );

            const rating =
                Number(
                    product.dataset.rating || 0
                );


            /* Пошук */

            const matchesSearch =
                name.includes(currentSearch);


            /* Категорія */

            const matchesCategory =
                currentCategory === "all" ||
                category === currentCategory;


            /* Ціна */

            const matchesPrice =
                price >= minPrice &&
                price <= maxPrice;


            /* Рейтинг */

            const matchesRating =
                rating >= minimumRating;


            return (
                matchesSearch &&
                matchesCategory &&
                matchesPrice &&
                matchesRating
            );

        });

    }


    /* =========================================
       ПОКАЗ ТОВАРІВ
       ========================================= */

    function renderProducts() {

        const filteredProducts =
            sortProducts(getFilteredProducts());

        products.forEach((product) => {
            product.style.display = "none";
        });

        filteredProducts.forEach((product) => {
            product.style.display = "";
            productGrid.appendChild(product);
        });

        productsCount.textContent =
            `${filteredProducts.length} ${
                getProductWord(filteredProducts.length)
            }`;

    }


    /* =========================================
       ПРАВИЛЬНЕ ВІДОБРАЖЕННЯ "ТОВАР/ТОВАРИ"
       ========================================= */

    function getProductWord(number) {

        if (
            number % 10 === 1 &&
            number % 100 !== 11
        ) {
            return "товар";
        }

        if (
            [2, 3, 4].includes(
                number % 10
            ) &&
            ![12, 13, 14].includes(
                number % 100
            )
        ) {
            return "товари";
        }

        return "товарів";
    }


    /* =========================================
       ПОШУК
       ========================================= */

    function performSearch() {

        currentSearch =
            searchInput.value
                .trim()
                .toLowerCase();

        renderProducts();

    }


    searchButton.addEventListener(
        "click",
        performSearch
    );


    searchInput.addEventListener(
        "input",
        performSearch
    );


    searchInput.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "Enter") {

                performSearch();

            }

        }
    );


    /* =========================================
       КАТЕГОРІЇ
       ========================================= */

    categoryLinks.forEach(
        (link) => {

            link.addEventListener(
                "click",
                (event) => {

                    event.preventDefault();

                    currentCategory =
                        link.dataset.category;

                    categoryLinks.forEach(
                        (item) => {
                            item.classList.remove("active");
                        }
                    );

                    link.classList.add("active");

                    renderProducts();

                }
            );

        }
    );


    /* =========================================
       СОРТУВАННЯ
       ========================================= */

    sortSelect.addEventListener(
        "change",
        () => {

            currentSort = sortSelect.value;
            renderProducts();

        }
    );


    /* =========================================
       ФІЛЬТР ЦІНИ
       ========================================= */

    filterButton.addEventListener(
        "click",
        () => {

            const min =
                Number(
                    minPriceInput.value
                );

            const max =
                Number(
                    maxPriceInput.value
                );


            minPrice =
                Number.isFinite(min)
                    ? min
                    : 0;


            maxPrice =
                Number.isFinite(max) &&
                max > 0
                    ? max
                    : Infinity;


            if (
                maxPrice !== Infinity &&
                maxPrice < minPrice
            ) {

                alert(
                    "Максимальна ціна не може бути меншою за мінімальну."
                );

                return;

            }


            renderProducts();

        }
    );


    /* =========================================
       ФІЛЬТР РЕЙТИНГУ
       ========================================= */

    ratingCheckboxes.forEach(
        (checkbox) => {

            checkbox.addEventListener(
                "change",
                () => {

                    const checked =
                        Array.from(
                            ratingCheckboxes
                        ).filter(
                            (item) =>
                                item.checked
                        );


                    if (checked.length === 0) {

                        minimumRating = 0;

                    }

                    else {

                        const ratings =
                            checked.map(
                                (item) => {

                                    const stars =
                                        item.nextElementSibling;

                                    if (
                                        stars &&
                                        stars.textContent
                                            .includes("★★★★★")
                                    ) {
                                        return 5;
                                    }

                                    return 4;

                                }
                            );


                        minimumRating =
                            Math.min(...ratings);

                    }


                    renderProducts();

                }
            );

        }
    );


    /* =========================================
       ОБРАНЕ
       ========================================= */

    const favoriteButtons =
        document.querySelectorAll(
            ".favorite-button"
        );


    favoriteButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    button.classList.toggle(
                        "favorite-active"
                    );


                    if (
                        button.classList.contains(
                            "favorite-active"
                        )
                    ) {

                        button.textContent = "♥";

                    }

                    else {

                        button.textContent = "♡";

                    }

                }
            );

        }
    );


    /* =========================================
       ПЕРШИЙ ЗАПУСК
       ========================================= */

    updateCategoryCounts();
    renderProducts();

});