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
            getFilteredProducts();


        /* Спочатку ховаємо всі товари */

        products.forEach((product) => {

            product.style.display = "none";

        });


        /* Показуємо потрібні */

        filteredProducts.forEach((product) => {

            product.style.display = "";

            productGrid.appendChild(product);

        });


        /* Кількість */

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


                    /* Активний пункт */

                    categoryLinks.forEach(
                        (item) => {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    link.classList.add(
                        "active"
                    );


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

            const value =
                sortSelect.value;


            const sortedProducts =
                [...products];


            if (value === "cheap") {

                sortedProducts.sort(
                    (a, b) =>
                        Number(b.dataset.price) -
                        Number(a.dataset.price)
                );

                /*
                    Після цього сортуємо
                    від дешевого до дорогого.
                */
                sortedProducts.sort(
                    (a, b) =>
                        Number(a.dataset.price) -
                        Number(b.dataset.price)
                );

            }


            else if (value === "expensive") {

                sortedProducts.sort(
                    (a, b) =>
                        Number(b.dataset.price) -
                        Number(a.dataset.price)
                );

            }


            else if (value === "popular") {

                sortedProducts.sort(
                    (a, b) =>
                        Number(b.dataset.popular) -
                        Number(a.dataset.popular)
                );

            }


            else if (value === "new") {

                sortedProducts.sort(
                    (a, b) =>
                        Number(b.dataset.new) -
                        Number(a.dataset.new)
                );

            }


            /* Перебудовуємо DOM */

            sortedProducts.forEach(
                (product) => {

                    productGrid.appendChild(
                        product
                    );

                }
            );


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


            /* Якщо максимум менший */

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

                        /*
                         * Перший checkbox = 5 зірок
                         * Другий = 4 і вище.
                         */

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

    renderProducts();

});