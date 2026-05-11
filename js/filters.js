// Exposed initialization function called from products.js
window.initFilters = function(products) {
    generateCategories(products);
    setupEventListeners(products);
};

function generateCategories(products) {
    // Extract unique categories
    const categories = new Set();
    products.forEach(p => categories.add(p.category));
    
    const categoryList = document.getElementById('categoryList');
    
    // categoryList already has 'All'
    
    categories.forEach(cat => {
        // Add to Header Nav
        const li = document.createElement('li');
        li.innerHTML = `<button class="category-btn" data-category="${cat}">${cat}</button>`;
        categoryList.appendChild(li);
    });
}

function setupEventListeners(products) {
    // 1. Category Nav Clicks
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Update active state
            categoryButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            const selectedCategory = e.target.getAttribute('data-category');
            
            filterProducts(products, selectedCategory, document.getElementById('searchInput').value);
        });
    });



    // 3. Search Input (Desktop)
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value;
        const currentCategory = document.querySelector('.category-btn.active').getAttribute('data-category');
        filterProducts(products, currentCategory, query);
    });
    
    // 4. Search Input (Mobile)
    const mobileSearchInput = document.getElementById('mobileSearchInput');
    mobileSearchInput.addEventListener('input', (e) => {
        const query = e.target.value;
        // Sync with desktop search input
        searchInput.value = query;
        const currentCategory = document.querySelector('.category-btn.active').getAttribute('data-category');
        filterProducts(products, currentCategory, query);
    });
}

function filterProducts(products, category, searchQuery) {
    let filtered = products;

    // Filter by Category
    if (category && category !== 'All') {
        filtered = filtered.filter(p => p.category === category);
    }

    // Filter by Search Query
    if (searchQuery && searchQuery.trim() !== '') {
        const lowerQuery = searchQuery.toLowerCase().trim();
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(lowerQuery) || 
            p.category.toLowerCase().includes(lowerQuery) ||
            p.description.toLowerCase().includes(lowerQuery)
        );
    }

    // Use global render function from products.js
    if (window.renderProducts) {
        window.renderProducts(filtered);
    }
}
