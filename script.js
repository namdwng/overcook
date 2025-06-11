document.addEventListener('DOMContentLoaded', () => {
    const modeToggle = document.querySelector('.mode-toggle');
    const modeIcon = document.querySelector('.mode-icon');
    const navLinks = document.querySelectorAll('nav ul li a');
    const menuIcon = document.querySelector('.menu-icon');
    const navList = document.querySelector('.nav-list');
    const pageButtons = document.querySelectorAll('.page-btn');
    const recipeCards = document.querySelectorAll('.recipe-card');
    const searchInput = document.querySelector('.search-box input');
    const searchButton = document.querySelector('.search-box button');
    const recipeSection = document.querySelector('.recipe-section');
    const categoryFilter = document.querySelector('#category-filter');
    const errorForm = document.querySelector('#error-form');
    const recipeForm = document.querySelector('#recipe-form');
    const favoriteButtons = document.querySelectorAll('.favorite-btn');
    const stars = document.querySelectorAll('.star');
    const ratingMessage = document.querySelector('#rating-message');
    const backToTopBtn = document.querySelector('.back-to-top');

    // Theme handling
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        modeIcon.src = 'lm.png';
        modeIcon.alt = 'Chế độ sáng';
    } else {
        modeIcon.src = 'dm.png';
        modeIcon.alt = 'Chế độ tối';
    }

    modeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            modeIcon.src = 'lm.png';
            modeIcon.alt = 'Chế độ sáng';
            localStorage.setItem('theme', 'dark');
        } else {
            modeIcon.src = 'dm.png';
            modeIcon.alt = 'Chế độ tối';
            localStorage.setItem('theme', 'light');
        }
    });

    // Navigation handling
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    menuIcon.addEventListener('click', () => {
        navList.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navList.classList.remove('active');
            }
        });
    });

    // Pagination and filtering
    function showPage(pageNumber, filteredCards) {
        const startIndex = (pageNumber - 1) * 10;
        const endIndex = startIndex + 10;
        filteredCards.forEach((card, index) => {
            card.style.display = (index >= startIndex && index < endIndex) ? 'block' : 'none';
        });
        pageButtons.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-page') == pageNumber);
        });
    }

    function updateRecipeDisplay() {
        const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
        const category = categoryFilter ? categoryFilter.value : 'all';
        let filteredCards = Array.from(recipeCards);

        if (query) {
            filteredCards = filteredCards.filter(card => {
                const title = card.querySelector('h2').textContent.toLowerCase();
                return title.includes(query);
            });
        }

        if (category !== 'all') {
            filteredCards = filteredCards.filter(card => {
                return card.getAttribute('data-category') === category;
            });
        }

        recipeSection.style.display = 'grid';
        recipeSection.style.gridTemplateColumns = 'repeat(auto-fit, minmax(300px, 1fr))';
        recipeSection.style.justifyContent = 'center';
        recipeSection.style.gap = '10px';
        recipeCards.forEach(card => {
            card.style.width = 'auto';
            card.style.maxWidth = '360px';
            card.style.display = 'none';
        });

        if (filteredCards.length > 0) {
            if (query || category !== 'all') {
                pageButtons.forEach(btn => btn.style.display = 'none');
                filteredCards.forEach(card => {
                    card.style.display = 'block';
                    card.classList.remove('page-1', 'page-2');
                });
            } else {
                pageButtons.forEach(btn => btn.style.display = 'inline-block');
                filteredCards.forEach((card, index) => {
                    const page = Math.floor(index / 10) + 1;
                    card.classList.add(`page-${page}`);
                });
                showPage(1, filteredCards);
            }
        }
    }

    recipeCards.forEach((card, index) => {
        const page = Math.floor(index / 10) + 1;
        card.classList.add(`page-${page}`);
    });
    showPage(1, recipeCards);

    pageButtons.forEach(button => {
        button.addEventListener('click', () => {
            const pageNumber = parseInt(button.getAttribute('data-page'));
            const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
            const category = categoryFilter ? categoryFilter.value : 'all';
            let filteredCards = Array.from(recipeCards);

            if (query) {
                filteredCards = filteredCards.filter(card => {
                    const title = card.querySelector('h2').textContent.toLowerCase();
                    return title.includes(query);
                });
            }

            if (category !== 'all') {
                filteredCards = filteredCards.filter(card => {
                    return card.getAttribute('data-category') === category;
                });
            }

            if (!query && category === 'all') {
                showPage(pageNumber, filteredCards);
                pageButtons.forEach(btn => btn.style.display = 'inline-block');
            }
        });
    });

    if (searchButton && searchInput) {
        searchButton.addEventListener('click', updateRecipeDisplay);
        searchInput.addEventListener('input', updateRecipeDisplay);
    }
    if (categoryFilter) {
        categoryFilter.addEventListener('change', updateRecipeDisplay);
    }

    // Form handling
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function handleFormSubmit(form, messageElementId) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const messageElement = document.querySelector(`#${messageElementId}`);
            const inputs = form.querySelectorAll('input, textarea');
            let hasError = false;

            inputs.forEach(input => {
                if (!input.value.trim()) {
                    hasError = true;
                    messageElement.textContent = 'Vui lòng điền đầy đủ các trường bắt buộc.';
                    messageElement.className = 'form-message error';
                } else if (input.type === 'email' && !validateEmail(input.value)) {
                    hasError = true;
                    messageElement.textContent = 'Vui lòng nhập email hợp lệ.';
                    messageElement.className = 'form-message error';
                }
            });

            if (!hasError) {
                messageElement.textContent = 'Gửi thành công! Cảm ơn bạn đã liên hệ.';
                messageElement.className = 'form-message success';
                form.reset();
                setTimeout(() => {
                    messageElement.textContent = '';
                    messageElement.className = 'form-message';
                }, 3000);
            }
        });
    }

    if (errorForm) handleFormSubmit(errorForm, 'error-form-message');
    if (recipeForm) handleFormSubmit(recipeForm, 'recipe-form-message');

    // Favorite functionality
    favoriteButtons.forEach(btn => {
        const recipeTitle = btn.closest('.recipe-card').querySelector('h2').textContent;
        if (localStorage.getItem('favorites')?.includes(recipeTitle)) {
            btn.classList.add('active');
        }
        btn.addEventListener('click', () => {
            let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
            if (favorites.includes(recipeTitle)) {
                favorites = favorites.filter(fav => fav !== recipeTitle);
                btn.classList.remove('active');
            } else {
                favorites.push(recipeTitle);
                btn.classList.add('active');
            }
            localStorage.setItem('favorites', JSON.stringify(favorites));
        });
    });

    // Rating functionality
    if (stars.length > 0) {
        const recipeTitle = document.querySelector('.recipe-content h1').textContent;
        const savedRating = localStorage.getItem(`rating-${recipeTitle}`);
        if (savedRating) {
            stars.forEach(s => {
                s.style.color = s.getAttribute('data-value') <= savedRating ? '#FFD700' : '#ccc';
            });
            ratingMessage.textContent = `Bạn đã đánh giá ${savedRating} sao!`;
        }
        stars.forEach(star => {
            star.addEventListener('click', () => {
                const value = star.getAttribute('data-value');
                stars.forEach(s => {
                    s.style.color = s.getAttribute('data-value') <= value ? '#FFD700' : '#ccc';
                });
                ratingMessage.textContent = `Bạn đã đánh giá ${value} sao!`;
                localStorage.setItem(`rating-${recipeTitle}`, value);
            });
        });
    }

    // Back to Top
    if (backToTopBtn) {
        backToTopBtn.style.display = 'none';
        backToTopBtn.style.position = 'fixed';
        backToTopBtn.style.bottom = '20px';
        backToTopBtn.style.right = '20px';
        backToTopBtn.style.padding = '10px';
        backToTopBtn.style.borderRadius = '50%';
        backToTopBtn.style.background = 'var(--button-bg)';
        backToTopBtn.style.color = 'var(--button-text)';
        backToTopBtn.style.border = 'none';
        backToTopBtn.style.cursor = 'pointer';
        window.addEventListener('scroll', () => {
            backToTopBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
        });
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});