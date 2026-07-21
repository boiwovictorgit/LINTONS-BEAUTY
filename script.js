// --- STATE MANAGEMENT ---
let allProducts = [];
let filteredProducts = [];
let currentCategory = 'all';

// --- DOM ELEMENTS ---
const productsGrid = document.getElementById('products-grid');
const searchInput = document.getElementById('search-input');
const navLinks = document.querySelectorAll('.nav-category');
const priceSort = document.getElementById('price-sort');
const circleCards = document.querySelectorAll('.category-circle-card');

// Modal Elements
const modal = document.getElementById('product-modal');
const closeModalBtn = document.querySelector('.close-modal');
const modalImg = document.getElementById('modal-img');
const modalTitle = document.getElementById('modal-title');
const modalBrand = document.getElementById('modal-brand');
const modalPrice = document.getElementById('modal-price');
const modalRating = document.getElementById('modal-rating');
const modalDesc = document.getElementById('modal-desc');

// --- INITIALIZE APPLICATION ---
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    setupEventListeners();
});

// --- API ACTIONS ---
async function fetchProducts() {
    try {

        const API_URL =
            window.location.hostname === "localhost"
                ? "http://localhost:3000"
                : "https://lintons-beauty.onrender.com";

        const response = await fetch(`${API_URL}/products`);

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        allProducts = await response.json();
        filteredProducts = [...allProducts];

        displayProducts(filteredProducts);

    } catch (error) {
        console.error(error);

        productsGrid.innerHTML = `
            <h2 style="text-align:center;color:red;grid-column:1/-1;">
                Failed to load products.
            </h2>
        `;
    }
}

// --- RENDER PRODUCTS ---
function displayProducts(products) {
    productsGrid.innerHTML = '';
    
    if(products.length === 0) {
        productsGrid.innerHTML = `<p style="grid-column: 1/-1; text-align:center;">No items found matching your criteria.</p>`;
        return;
    }

    products.forEach(product => {
        const card = document.createElement('div');
        card.classList.add('product-card');
        card.innerHTML = `
            <div>
                <img src="${product.image}" alt="${product.name}">
                <p class="brand">${product.brand}</p>
                <h3>${product.name}</h3>
            </div>
            <div>
                <p class="price">KES ${product.price.toLocaleString()}</p>
                <button onclick="openProductModal(${product.id})">View Details</button>
            </div>
        `;
        productsGrid.appendChild(card);
    });
}

// --- EVENT LISTENERS ---
function setupEventListeners() {
    // Search Functionality
    searchInput.addEventListener('input', filterAndSortProducts);

    // Category Filter Functionality (Navbar)
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            currentCategory = link.getAttribute('data-category');
            filterAndSortProducts();
        });
    });

    // Category Filter Functionality (Visual Circles)
    circleCards.forEach(card => {
        card.addEventListener('click', () => {
            currentCategory = card.getAttribute('data-category');
            
            // Sync active visual state on top navbar link items
            navLinks.forEach(l => {
                if (l.getAttribute('data-category') === currentCategory) {
                    l.classList.add('active');
                } else {
                    l.classList.remove('active');
                }
            });
            
            filterAndSortProducts();
            
            // Smoothly view products display container
            document.querySelector('.shop-container').scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Sorting Functionality
    priceSort.addEventListener('change', filterAndSortProducts);

    // Close Modal Events
    closeModalBtn.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });
}

// --- COMBINED FILTER & SORT LOGIC ---
function filterAndSortProducts() {
    let result = [...allProducts];

    // 1. Filter by Category
    if (currentCategory !== 'all') {
        result = result.filter(p => p.category.toLowerCase() === currentCategory.toLowerCase());
    }

    // 2. Filter by Search Query
    const query = searchInput.value.toLowerCase().trim();
    if (query !== '') {
        result = result.filter(p => 
            p.name.toLowerCase().includes(query) || 
            p.brand.toLowerCase().includes(query)
        );
    }

    // 3. Apply Sorting
    const sortValue = priceSort.value;
    if (sortValue === 'low-high') {
        result.sort((a, b) => a.price - b.price);
    } else if (sortValue === 'high-low') {
        result.sort((a, b) => b.price - a.price);
    }

    displayProducts(result);
}

// --- MODAL POPULATION ---
function openProductModal(id) {
    const product = allProducts.find(p => p.id === id);
    if (!product) return;

    modalImg.src = product.image;
    modalTitle.textContent = product.name;
    modalBrand.textContent = product.brand;
    modalPrice.textContent = `KES ${product.price.toLocaleString()}`;
    modalRating.textContent = `⭐ ${product.rating}`;
    modalDesc.textContent = product.description || "No description available.";

    modal.style.display = 'flex';
}