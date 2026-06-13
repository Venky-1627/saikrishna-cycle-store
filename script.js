const supabaseUrl = 'https://antvfvlzmuotlfmlkysm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFudHZmdmx6bXVvdGxmbWxreXNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzMTIzNTMsImV4cCI6MjA5Njg4ODM1M30.GxjrLJ1iKPZ7IHH1_iDlwD79ByfVFRvoHdorkEr0lIA';

// Initialize Supabase safely. If the CDN fails or is blocked, this prevents the whole script from crashing.
let supabase = null;
try {
    if (window.supabase) {
        supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
    }
} catch (e) {
    console.error("Failed to initialize Supabase. Running in offline/fallback mode.", e);
}

async function initApp() {
    // --- Data Management (Supabase Backend) ---
    const DEFAULT_BIKES = [
        {
            id: 1,
            name: "Aero Speedster 500",
            prices: { '14"': 1299, '16"': 1499, '20"': 1699 },
            description: "Ultra-lightweight carbon frame designed for competitive road racing and maximum aerodynamics.",
            image: "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?q=80&w=800&auto=format&fit=crop",
            inStock: true
        },
        {
            id: 2,
            name: "Urban Commuter X",
            prices: { '14"': 899, '16"': 999, '20"': 1099 },
            description: "Sleek city bike with an upright riding position, integrated lights, and puncture-resistant tires.",
            image: "https://images.unsplash.com/photo-1576435728678-68dd0f08ce13?q=80&w=800&auto=format&fit=crop",
            inStock: true
        },
        {
            id: 3,
            name: "Gravel Explorer",
            prices: { '14"': 1099, '16"': 1199, '20"': 1399 },
            description: "Take the road less traveled. Features wide tires, disc brakes, and a durable alloy frame.",
            image: "https://images.unsplash.com/photo-1511994298241-608e28f14fde?q=80&w=800&auto=format&fit=crop",
            inStock: true
        }
    ];

    async function getBikes() {
        if (!supabase) {
            console.warn("Supabase is disconnected. Using default fallback data.");
            return DEFAULT_BIKES;
        }

        try {
            const { data, error } = await supabase.from('bikes').select('*').order('id', { ascending: false });
            if (error) {
                console.error("Error fetching bikes:", error);
                return DEFAULT_BIKES;
            }
            
            // Seed database if empty
            if (!data || data.length === 0) {
                console.log("Seeding default bikes to Supabase...");
                for (const b of DEFAULT_BIKES) {
                    await supabase.from('bikes').insert([{
                        name: b.name,
                        prices: b.prices,
                        description: b.description,
                        image: b.image,
                        inStock: b.inStock
                    }]);
                }
                const { data: newData } = await supabase.from('bikes').select('*').order('id', { ascending: false });
                return newData && newData.length > 0 ? newData : DEFAULT_BIKES;
            }
            return data;
        } catch (err) {
            console.error("Network or Supabase error during fetch:", err);
            return DEFAULT_BIKES; // fallback to default so UI doesn't break
        }
    }

    // --- Authentication Logic (`admin.html`) ---
    const loginOverlay = document.getElementById('login-overlay');
    const adminDashboard = document.getElementById('admin-dashboard');
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');

    if (loginOverlay && adminDashboard) {
        // Check current session safely
        let currentSession = null;
        if (supabase) {
            try {
                const { data } = await supabase.auth.getSession();
                currentSession = data?.session;
            } catch (err) {
                console.warn("Could not retrieve session (local file restrictions):", err);
            }
        }

        if (currentSession) {
            loginOverlay.style.display = 'none';
            adminDashboard.style.display = 'block';
            await renderAdminList();
        }

        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const rawUsername = document.getElementById('login-email').value.trim();
                const password = document.getElementById('login-password').value.trim(); // Trim spaces!
                if (loginError) loginError.style.display = 'none';
                
                // Allow the user to type just "SAI" or "Laxman" or "SAI@admin.com" (case-insensitive)
                let lowerUser = rawUsername.toLowerCase();
                const email = lowerUser.includes('@') ? lowerUser : `${lowerUser}@admin.com`;
                
                if (lowerUser.endsWith('@admin.com')) {
                    lowerUser = lowerUser.replace('@admin.com', '');
                }

                // Try Supabase Auth first
                let authError = null;
                if (supabase) {
                    try {
                        const { error } = await supabase.auth.signInWithPassword({
                            email: email,
                            password: password,
                        });
                        authError = error;
                    } catch (err) {
                        console.warn("Supabase Auth exception:", err);
                        authError = err; // Force it to hit the fallback
                    }
                } else {
                    authError = new Error("Cannot reach Supabase. Checking offline credentials.");
                }

                if (authError) {
                    // Hardcoded Fallback (in case Supabase Auth failed due to local files or missing setup)
                    if ((lowerUser === 'sai' && password === 'Sai@6844') || 
                        (lowerUser === 'laxman' && password === 'Laxman@9126')) {
                        console.log("Supabase Auth failed, but hardcoded credentials matched. Bypassing...");
                        loginOverlay.style.display = 'none';
                        adminDashboard.style.display = 'block';
                        await renderAdminList();
                    } else {
                        const errorMsg = authError.message || "Network/Local Storage Error";
                        alert("Login Failed: " + errorMsg + "\n\n(Check your credentials or Supabase setup)");
                        if (loginError) {
                            loginError.innerText = errorMsg;
                            loginError.style.display = 'block';
                        }
                    }
                } else {
                    // Supabase Auth Succeeded
                    loginOverlay.style.display = 'none';
                    adminDashboard.style.display = 'block';
                    await renderAdminList();
                }
            });
        }
    }

    // --- Store Page Logic (`index.html`) ---
    const mainProductGrid = document.getElementById('main-product-grid');
    
    if (mainProductGrid) {
        const bikes = await getBikes();
        
        bikes.forEach(bike => {
            const sizes = Object.keys(bike.prices || {});
            const firstSize = sizes[0] || 'Default';
            const firstPrice = bike.prices ? bike.prices[firstSize] : 0;

            const sizeBtnsHTML = sizes.map((size, index) => 
                `<button class="size-btn ${index === 0 ? 'active' : ''}" data-price="${bike.prices[size]}">${size}</button>`
            ).join('');

            const cardHTML = `
                <div class="product-card">
                    <div class="img-wrapper">
                        <img src="${bike.image}" alt="${bike.name}">
                    </div>
                    <div class="product-info">
                        <div class="product-title-price">
                            <h3>${bike.name}</h3>
                            <span class="price" id="price-display-${bike.id}">₹${firstPrice}</span>
                        </div>
                        <p class="desc">${bike.description}</p>
                        
                        <div class="size-selector">
                            <span>Frame Size:</span>
                            <div class="sizes" data-bike-id="${bike.id}">
                                ${sizeBtnsHTML}
                            </div>
                        </div>
                    </div>
                    ${bike.inStock === false ? `<div class="out-of-stock-badge">Out of Stock</div>` : ''}
                </div>
            `;
            mainProductGrid.insertAdjacentHTML('beforeend', cardHTML);
        });

        initStoreInteractions();
    }

    function initStoreInteractions() {
        // Size Selection Logic & Dynamic Pricing
        document.querySelectorAll('.sizes').forEach(container => {
            const bikeId = container.getAttribute('data-bike-id');
            const priceDisplay = document.getElementById(`price-display-${bikeId}`);
            const buttons = container.querySelectorAll('.size-btn');
            
            buttons.forEach(btn => {
                btn.addEventListener('click', () => {
                    // Update active button
                    buttons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    
                    // Update price dynamically
                    const newPrice = btn.getAttribute('data-price');
                    if (priceDisplay) priceDisplay.innerText = `₹${newPrice}`;
                });
            });
        });
    }

    // --- Admin Dashboard Logic (`admin.html`) ---
    const adminProductList = document.getElementById('admin-product-list');
    const adminModal = document.getElementById('admin-modal');
    const btnOpenAdd = document.getElementById('btn-open-add');
    const btnCloseModal = document.getElementById('btn-close-modal');
    const adminForm = document.getElementById('add-cycle-form');
    
    // Form Inputs
    const idInput = document.getElementById('cycle-id');
    const nameInput = document.getElementById('cycle-name');
    const descInput = document.getElementById('cycle-desc');
    const imageInput = document.getElementById('cycle-image');
    const imagePreview = document.getElementById('image-preview');
    const uploadPlaceholder = document.getElementById('upload-placeholder');
    const modalTitle = document.getElementById('modal-title');
    const imgHint = document.getElementById('img-hint');
    const sizeToggles = document.querySelectorAll('.size-toggle');
    const statusInput = document.getElementById('cycle-status');
    
    let currentBase64Image = "";
    // Store bikes in memory for easy modal population
    let loadedAdminBikes = [];

    if (adminProductList) {
        // Admin list is rendered after login
        
        // Handle Size Toggle Checkboxes to enable/disable specific price inputs
        sizeToggles.forEach(toggle => {
            toggle.addEventListener('change', (e) => {
                const sizeVal = e.target.value.replace('"', '');
                const priceInput = document.getElementById(`price-${sizeVal}`);
                if (priceInput) {
                    if (e.target.checked) {
                        priceInput.disabled = false;
                        priceInput.required = true;
                    } else {
                        priceInput.disabled = true;
                        priceInput.required = false;
                        priceInput.value = '';
                    }
                }
            });
        });

        // Open Add Modal
        if (btnOpenAdd) btnOpenAdd.addEventListener('click', () => openModal());

        // Close Modal
        if (btnCloseModal) btnCloseModal.addEventListener('click', () => closeModal());

        // Handle Image Preview
        if (imageInput) {
            imageInput.addEventListener('change', function() {
                const file = this.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        currentBase64Image = e.target.result;
                        imagePreview.src = currentBase64Image;
                        imagePreview.style.display = 'block';
                        uploadPlaceholder.style.display = 'none';
                    }
                    reader.readAsDataURL(file);
                }
            });
        }

        // Handle Form Submit (Add or Edit)
        if (adminForm) {
            adminForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const prices = {};
                let hasSizes = false;

                sizeToggles.forEach(toggle => {
                    if (toggle.checked) {
                        hasSizes = true;
                        const sizeVal = toggle.value;
                        const cleanSizeVal = sizeVal.replace('"', '');
                        const priceVal = document.getElementById(`price-${cleanSizeVal}`).value;
                        prices[sizeVal] = parseFloat(priceVal);
                    }
                });

                if (!hasSizes) return alert("Please select at least one size and enter its price.");

                const editId = idInput.value;
                const inStock = statusInput.value === 'true';

                // Disable submit button to prevent double submits
                const submitBtn = adminForm.querySelector('button[type="submit"]');
                const originalText = submitBtn ? submitBtn.innerText : "Save Product";
                if (submitBtn) {
                    submitBtn.innerText = "Saving...";
                    submitBtn.disabled = true;
                }

                try {
                    if (editId) {
                        // Edit Existing in Supabase
                        const updateData = {
                            name: nameInput.value,
                            prices: prices,
                            description: descInput.value,
                            inStock: inStock
                        };
                        if (currentBase64Image) {
                            updateData.image = currentBase64Image;
                        }

                        if (supabase) {
                            await supabase.from('bikes').update(updateData).eq('id', editId);
                        } else {
                            console.warn("Offline mode: Database update skipped.");
                        }
                    } else {
                        // Add New to Supabase
                        if (!currentBase64Image) {
                            if (submitBtn) {
                                submitBtn.innerText = originalText;
                                submitBtn.disabled = false;
                            }
                            return alert("Please upload an image.");
                        }
                        
                        if (supabase) {
                            await supabase.from('bikes').insert([{
                                name: nameInput.value,
                                prices: prices,
                                description: descInput.value,
                                image: currentBase64Image,
                                inStock: inStock
                            }]);
                        } else {
                            console.warn("Offline mode: Database insert skipped.");
                        }
                    }
                } catch (err) {
                    console.error("Failed to save to database:", err);
                    alert("Failed to save to cloud database. Please check your internet connection.");
                }

                if (submitBtn) {
                    submitBtn.innerText = originalText;
                    submitBtn.disabled = false;
                }

                closeModal();
                await renderAdminList();
            });
        }
    }

    async function renderAdminList() {
        if (!adminProductList) return;
        adminProductList.innerHTML = '<p>Loading database...</p>';
        loadedAdminBikes = await getBikes();
        adminProductList.innerHTML = '';

        loadedAdminBikes.forEach(bike => {
            const sizes = Object.keys(bike.prices || {});
            const displayPrice = sizes.length > 1 ? `From ₹${bike.prices[sizes[0]]}` : (sizes.length === 1 ? `₹${bike.prices[sizes[0]]}` : 'No price');

            const stockBadge = bike.inStock === false ? `<span style="color: #ef4444; font-size: 0.8rem; font-weight: 600; padding: 2px 8px; background: #fee2e2; border-radius: 12px; margin-left: 10px;">Out of Stock</span>` : '';

            const itemHTML = `
                <div class="admin-list-item">
                    <div class="admin-list-info">
                        <img src="${bike.image}" class="admin-list-img" alt="${bike.name}">
                        <div class="admin-list-details">
                            <h4>${bike.name} ${stockBadge}</h4>
                            <p>${displayPrice}</p>
                        </div>
                    </div>
                    <button class="btn-edit" data-id="${bike.id}">Edit</button>
                </div>
            `;
            adminProductList.insertAdjacentHTML('beforeend', itemHTML);
        });

        // Attach Edit Listeners
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                openModal(id);
            });
        });
    }

    function openModal(editId = null) {
        if (!adminModal) return;
        if (adminForm) adminForm.reset();
        currentBase64Image = "";
        if (imagePreview) {
            imagePreview.style.display = 'none';
            imagePreview.src = "";
        }
        if (uploadPlaceholder) uploadPlaceholder.style.display = 'block';
        if (imgHint) imgHint.style.display = 'none';
        
        // Disable all price inputs initially
        document.querySelectorAll('.size-price-input').forEach(input => {
            input.disabled = true;
            input.required = false;
        });
        
        if (editId) {
            // Edit Mode Setup
            if (modalTitle) modalTitle.innerText = "Edit Bicycle";
            const bike = loadedAdminBikes.find(b => b.id && b.id.toString() === editId);
            if(bike) {
                if (idInput) idInput.value = bike.id;
                if (nameInput) nameInput.value = bike.name;
                if (descInput) descInput.value = bike.description;
                if (statusInput) statusInput.value = bike.inStock !== false ? 'true' : 'false';
                
                // Show current image preview
                if (imagePreview) {
                    imagePreview.src = bike.image;
                    imagePreview.style.display = 'block';
                }
                if (uploadPlaceholder) uploadPlaceholder.style.display = 'none';
                if (imgHint) imgHint.style.display = 'block';
                
                // Check sizes and fill prices
                Object.keys(bike.prices || {}).forEach(size => {
                    const cleanSizeVal = size.replace('"', '');
                    const cb = document.querySelector(`input[name="sizes"][value='${size}']`);
                    const priceInput = document.getElementById(`price-${cleanSizeVal}`);
                    if(cb && priceInput) {
                        cb.checked = true;
                        priceInput.disabled = false;
                        priceInput.required = true;
                        priceInput.value = bike.prices[size];
                    }
                });
            }
        } else {
            // Add Mode Setup
            if (modalTitle) modalTitle.innerText = "Add New Bicycle";
            if (idInput) idInput.value = "";
            if (statusInput) statusInput.value = 'true';
        }
        
        adminModal.style.display = 'flex';
    }

    function closeModal() {
        if (adminModal) adminModal.style.display = 'none';
    }
}

// Make absolutely sure the script executes, even if it was loaded asynchronously
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
