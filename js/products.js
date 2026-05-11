// State to hold all products globally
let allProducts = [];

// Fetch products from JSON
async function fetchProducts() {
    try {
        const response = await fetch('data/products.json');
        if (!response.ok) throw new Error('Failed to load products');
        
        allProducts = await response.json();
        
        // Initialize App after fetching
        renderProducts(allProducts);
        
        // Expose function for filter.js
        if(window.initFilters) {
            window.initFilters(allProducts);
        }
    } catch (error) {
        console.error('Error fetching products:', error);
        document.getElementById('productGrid').innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: var(--clr-danger); margin-bottom: 1rem;"></i>
                <h2>Failed to load products</h2>
                <p>Please ensure you are running this via a local server (e.g. Live Server or python -m http.server) and not directly from the file system to avoid CORS issues with fetch().</p>
            </div>
        `;
    }
}

// Render product grid
function renderProducts(productsToRender) {
    const grid = document.getElementById('productGrid');
    
    if (productsToRender.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 4rem;">
                <h2>No products found</h2>
                <p>Try adjusting your search or filter criteria.</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = '';
    
    productsToRender.forEach(product => {
        // Calculate discount percentage
        const discountPercentage = Math.round(((product.mrp - product.price) / product.mrp) * 100);
        
        // Format Currency
        const formatter = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0
        });

        // Setup badges
        let badgeHtml = '';
        if (product.badge) {
            badgeHtml = `<span class="product-badge ${product.badge.toLowerCase() === 'sale' ? 'sale' : ''}">${product.badge}</span>`;
        } else if (discountPercentage > 0) {
            badgeHtml = `<span class="product-badge sale">-${discountPercentage}%</span>`;
        }

        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            ${badgeHtml}
            <div class="product-image-container">
                <img src="${product.images[0]}" alt="${product.name}" class="product-image" loading="lazy">
                <div class="product-actions">
                    <button class="action-btn" onclick="openProductModal(${product.id})" aria-label="Quick View">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price-row">
                    ${product.mrp > product.price ? `<span class="mrp">${formatter.format(product.mrp)}</span>` : ''}
                    <span class="price">${formatter.format(product.price)}</span>
                    ${discountPercentage > 0 ? `<span class="discount">-${discountPercentage}%</span>` : ''}
                </div>
            </div>
        `;
        
        // Make entire card clickable for mobile (except buttons)
        card.addEventListener('click', (e) => {
            if(!e.target.closest('.action-btn')) {
                openProductModal(product.id);
            }
        });
        
        grid.appendChild(card);
    });
}

// Modal Logic
const modal = document.getElementById('productModal');
const modalBody = document.getElementById('modalBody');
const closeModalBtn = document.getElementById('closeModalBtn');

function openProductModal(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;

    const formatter = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0
    });

    const thumbnailsHtml = product.images.map((img, idx) => 
        `<img src="${img}" class="thumbnail ${idx === 0 ? 'active' : ''}" onclick="changeMainImage('${img}', this)">`
    ).join('');

    modalBody.innerHTML = `
        <div class="modal-gallery">
            <img src="${product.images[0]}" class="main-image" id="modalMainImage" alt="${product.name}">
            <div class="thumbnail-container">
                ${thumbnailsHtml}
            </div>
        </div>
        <div class="modal-info">
            <div class="product-category">${product.category}</div>
            <h2>${product.name}</h2>
            <div class="rating">
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star-half-alt"></i>
                <span>(${product.rating})</span>
            </div>
            
            <div class="price-container">
                <span class="price">${formatter.format(product.price)}</span>
                ${product.mrp > product.price ? `<span class="mrp">${formatter.format(product.mrp)}</span>` : ''}
            </div>
            
            <div class="description">
                ${product.description}
            </div>
            
            <div class="stock-status ${product.stock ? 'in-stock' : 'out-stock'}">
                <i class="fas ${product.stock ? 'fa-check-circle' : 'fa-times-circle'}"></i> 
                ${product.stock ? 'In Stock and ready to ship' : 'Out of Stock'}
            </div>
            

        </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

// Global function to change main image in modal
window.changeMainImage = function(src, thumbnailEl) {
    document.getElementById('modalMainImage').src = src;
    
    // Update active thumbnail
    document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
    thumbnailEl.classList.add('active');
};

closeModalBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
    if(e.target === modal) closeModal();
});

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Action Handlers
window.addToCart = function(id) {
    const product = allProducts.find(p => p.id === id);
    if(product) {
        showToast(`Added ${product.name} to Cart`, 'success');
        // Update badge (mock)
        const badge = document.querySelector('.badge');
        badge.innerText = parseInt(badge.innerText) + 1;
    }
}

window.addToWishlist = function(id) {
    const product = allProducts.find(p => p.id === id);
    if(product) {
        showToast(`Added ${product.name} to Wishlist`, 'info');
    }
}

// Initialize on DOM Load
document.addEventListener('DOMContentLoaded', fetchProducts);
