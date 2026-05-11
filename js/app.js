// General UI interactions

document.addEventListener('DOMContentLoaded', () => {
    // 1. Dark Mode Toggle
    const themeToggle = document.getElementById('themeToggle');
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
    
    // Check saved preference or fallback to system preference
    const currentTheme = localStorage.getItem("theme") || (prefersDarkScheme.matches ? "dark" : "light");
    
    // Apply initial theme
    if (currentTheme === "dark") {
        document.body.setAttribute("data-theme", "dark");
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        document.body.setAttribute("data-theme", "light");
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }

    themeToggle.addEventListener("click", () => {
        let theme = document.body.getAttribute("data-theme");
        
        if (theme === "dark") {
            document.body.setAttribute("data-theme", "light");
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            localStorage.setItem("theme", "light");
        } else {
            document.body.setAttribute("data-theme", "dark");
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem("theme", "dark");
        }
    });

    // 2. Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const categoryNav = document.querySelector('.category-nav');
    let menuOpen = false;

    mobileMenuBtn.addEventListener('click', () => {
        menuOpen = !menuOpen;
        if (menuOpen) {
            categoryNav.style.display = 'block';
            mobileMenuBtn.innerHTML = '<i class="fas fa-times"></i>';
        } else {
            // Restore default behavior based on css (might need media query check in a real app, 
            // but since category-nav is scrollable horizontally on mobile, it's actually always visible.
            // Let's toggle the mobile search bar instead for better UX)
        }
    });
    
    // Actually, a better mobile menu behavior is to toggle the search bar
    const mobileSearch = document.querySelector('.mobile-search');
    let searchOpen = false;
    
    mobileMenuBtn.addEventListener('click', (e) => {
        searchOpen = !searchOpen;
        if(searchOpen) {
            mobileSearch.style.display = 'block';
            mobileMenuBtn.innerHTML = '<i class="fas fa-times"></i>';
        } else {
            mobileSearch.style.display = 'none';
            mobileMenuBtn.innerHTML = '<i class="fas fa-search"></i>';
        }
    });

    // 3. Header scroll effect
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = 'var(--shadow-md)';
        } else {
            header.style.boxShadow = 'var(--shadow-sm)';
        }
    });
});

// Toast Notification System
window.showToast = function(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = 'fa-info-circle';
    if(type === 'success') icon = 'fa-check-circle';
    if(type === 'error') icon = 'fa-exclamation-circle';
    
    toast.innerHTML = `<i class="fas ${icon}"></i> <span>${message}</span>`;
    
    container.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            container.removeChild(toast);
        }, 300); // Wait for transition
    }, 3000);
};
