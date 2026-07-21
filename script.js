// =========================
// STATE MANAGEMENT
// =========================
let allProducts = [];
let currentCategory = "all";

// =========================
// DOM ELEMENTS
// =========================
const productsGrid = document.getElementById("products-grid");
const searchInput = document.getElementById("search-input");
const navLinks = document.querySelectorAll(".nav-category");
const priceSort = document.getElementById("price-sort");
const circleCards = document.querySelectorAll(".category-circle-card");

// Shop Now Button
const shopNowBtn = document.getElementById("shop-now-btn");

// Modal Elements
const modal = document.getElementById("product-modal");
const closeModalBtn = document.querySelector(".close-modal");
const modalImg = document.getElementById("modal-img");
const modalTitle = document.getElementById("modal-title");
const modalBrand = document.getElementById("modal-brand");
const modalPrice = document.getElementById("modal-price");
const modalRating = document.getElementById("modal-rating");
const modalDesc = document.getElementById("modal-desc");

// =========================
// INITIALIZE
// =========================
document.addEventListener("DOMContentLoaded", () => {
    fetchProducts();
    setupEventListeners();
});

// =========================
// FETCH PRODUCTS
// =========================
async function fetchProducts() {
    try {

        const API_URL =
            window.location.hostname === "localhost"
                ? "http://localhost:3000"
                : "https://lintons-beauty.onrender.com";

        const response = await fetch(`${API_URL}/products`);

        if (!response.ok) {
            throw new Error(`HTTP Error ${response.status}`);
        }

        allProducts = await response.json();

        displayProducts(allProducts);

    } catch (error) {

        console.error(error);

        productsGrid.innerHTML = `
            <h2 style="color:red;text-align:center;grid-column:1/-1;">
                Failed to load products.
            </h2>
        `;
    }
}

// =========================
// DISPLAY PRODUCTS
// =========================
function displayProducts(products) {

    productsGrid.innerHTML = "";

    if (products.length === 0) {

        productsGrid.innerHTML = `
            <p style="grid-column:1/-1;text-align:center;">
                No products found.
            </p>
        `;

        return;
    }

    products.forEach(product => {

        const card = document.createElement("div");

        card.classList.add("product-card");

        card.innerHTML = `

            <div>

                <img src="${product.image}" alt="${product.name}">

                <p class="brand">${product.brand}</p>

                <h3>${product.name}</h3>

            </div>

            <div>

                <p class="price">
                    KES ${product.price.toLocaleString()}
                </p>

                <button onclick="openProductModal(${product.id})">
                    View Details
                </button>

            </div>

        `;

        productsGrid.appendChild(card);

    });

}

// =========================
// EVENT LISTENERS
// =========================
function setupEventListeners() {

    // Search
    searchInput.addEventListener("input", filterAndSortProducts);

    // Navbar Categories
    navLinks.forEach(link => {

        link.addEventListener("click", e => {

            e.preventDefault();

            navLinks.forEach(item => item.classList.remove("active"));

            link.classList.add("active");

            currentCategory = link.dataset.category;

            filterAndSortProducts();

        });

    });

    // Circle Categories
    circleCards.forEach(card => {

        card.addEventListener("click", () => {

            currentCategory = card.dataset.category;

            navLinks.forEach(link => {

                if (link.dataset.category === currentCategory) {

                    link.classList.add("active");

                } else {

                    link.classList.remove("active");

                }

            });

            filterAndSortProducts();

            document.getElementById("products").scrollIntoView({

                behavior: "smooth"

            });

        });

    });

    // Price Sort
    priceSort.addEventListener("change", filterAndSortProducts);

    // Close Modal
    closeModalBtn.addEventListener("click", () => {

        modal.style.display = "none";

    });

    window.addEventListener("click", e => {

        if (e.target === modal) {

            modal.style.display = "none";

        }

    });

    // Shop Now Button
    if (shopNowBtn) {

        shopNowBtn.addEventListener("click", () => {

            currentCategory = "all";

            navLinks.forEach(link => {

                if (link.dataset.category === "all") {

                    link.classList.add("active");

                } else {

                    link.classList.remove("active");

                }

            });

            filterAndSortProducts();

            document.getElementById("products").scrollIntoView({

                behavior: "smooth"

            });

        });

    }

}

// =========================
// FILTER & SORT
// =========================
function filterAndSortProducts() {

    let result = [...allProducts];

    // Category

    if (currentCategory !== "all") {

        result = result.filter(product =>

            product.category.toLowerCase() === currentCategory.toLowerCase()

        );

    }

    // Search

    const query = searchInput.value.toLowerCase().trim();

    if (query !== "") {

        result = result.filter(product =>

            product.name.toLowerCase().includes(query) ||

            product.brand.toLowerCase().includes(query)

        );

    }

    // Sort

    if (priceSort.value === "low-high") {

        result.sort((a, b) => a.price - b.price);

    }

    if (priceSort.value === "high-low") {

        result.sort((a, b) => b.price - a.price);

    }

    displayProducts(result);

}

// =========================
// PRODUCT MODAL
// =========================
function openProductModal(id) {

    const product = allProducts.find(item => item.id === id);

    if (!product) return;

    modalImg.src = product.image;

    modalTitle.textContent = product.name;

    modalBrand.textContent = product.brand;

    modalPrice.textContent =
        `KES ${product.price.toLocaleString()}`;

    modalRating.textContent =
        `⭐ ${product.rating}`;

    modalDesc.textContent =
        product.description || "No description available.";

    modal.style.display = "flex";

}
// Login Modal
const loginBtn = document.getElementById("login-btn");
const loginModal = document.getElementById("loginModal");
const closeLogin = document.querySelector(".close-login");

loginBtn.addEventListener("click", () => {
    loginModal.style.display = "flex";
});

closeLogin.addEventListener("click", () => {
    loginModal.style.display = "none";
});

window.addEventListener("click", (e) => {
    if (e.target === loginModal) {
        loginModal.style.display = "none";
    }
});
// =========================
// LOGIN MODAL BUTTONS
// =========================

// Login page
const loginLink = document.getElementById("login-link");

if (loginLink) {
    loginLink.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "login.html";
    });
}

// Google Sign Up
const googleBtn = document.getElementById("google-signup");

if (googleBtn) {
    googleBtn.addEventListener("click", () => {
        window.open("https://accounts.google.com/", "_blank");
    });
}

// Facebook Sign Up
const facebookBtn = document.getElementById("facebook-signup");

if (facebookBtn) {
    facebookBtn.addEventListener("click", () => {
        window.open("https://www.facebook.com/login/", "_blank");
    });
}

// Email Sign Up
const emailBtn = document.getElementById("email-signup");

if (emailBtn) {
    emailBtn.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "signup.html";
    });
}