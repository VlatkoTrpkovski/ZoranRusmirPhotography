// ============================================
// Admin Panel Logic
// ============================================

// Toast notification
function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast show' + (isError ? ' error' : '');
    setTimeout(() => toast.className = 'toast', 3000);
}

// ============================================
// Authentication
// ============================================
const loginScreen = document.getElementById('loginScreen');
const dashboard = document.getElementById('dashboard');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');
const adminEmailSpan = document.getElementById('adminEmail');

// Listen for auth state
auth.onAuthStateChanged(user => {
    if (user) {
        loginScreen.style.display = 'none';
        dashboard.style.display = 'block';
        adminEmailSpan.textContent = user.email;
        loadGallery();
        loadBlogPosts();
    } else {
        loginScreen.style.display = 'flex';
        dashboard.style.display = 'none';
    }
});

// Login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginError.textContent = '';
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        await auth.signInWithEmailAndPassword(email, password);
    } catch (err) {
        loginError.textContent = 'Invalid email or password.';
    }
});

// Logout
logoutBtn.addEventListener('click', () => auth.signOut());

// ============================================
// Tab Navigation
// ============================================
document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        document.querySelectorAll('.admin-section').forEach(s => s.style.display = 'none');
        document.getElementById(tab.dataset.tab + 'Section').style.display = 'block';
    });
});

// ============================================
// File Preview (Drag & Drop + Click)
// ============================================
function setupFilePreview(inputId, previewId, dropZoneId) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    const dropZone = document.getElementById(dropZoneId);

    input.addEventListener('change', () => {
        if (input.files[0]) {
            preview.src = URL.createObjectURL(input.files[0]);
            preview.style.display = 'block';
        }
    });

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        if (e.dataTransfer.files[0]) {
            input.files = e.dataTransfer.files;
            preview.src = URL.createObjectURL(e.dataTransfer.files[0]);
            preview.style.display = 'block';
        }
    });
}

setupFilePreview('photoFile', 'photoPreview', 'photoDropZone');
setupFilePreview('blogCover', 'blogPreview', 'blogDropZone');

// ============================================
// Convert image file to compressed Base64
// ============================================
function compressAndConvertToBase64(file, maxWidth = 1200, quality = 0.7) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Scale down if larger than maxWidth
                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Try to keep Base64 under 900KB (leaving room for other document fields)
                const maxBytes = 900 * 1024;
                let currentQuality = quality;
                let base64 = canvas.toDataURL('image/jpeg', currentQuality);

                while (base64.length > maxBytes && currentQuality > 0.1) {
                    currentQuality -= 0.1;
                    base64 = canvas.toDataURL('image/jpeg', currentQuality);
                }

                if (base64.length > maxBytes) {
                    // Still too large — scale down further
                    const scale = 0.5;
                    canvas.width = Math.round(width * scale);
                    canvas.height = Math.round(height * scale);
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    base64 = canvas.toDataURL('image/jpeg', 0.5);
                }

                resolve(base64);
            };
            img.onerror = reject;
            img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function showProgress(progressContainerId, progressFillId, progressTextId, pct) {
    const container = document.getElementById(progressContainerId);
    const fill = document.getElementById(progressFillId);
    const text = document.getElementById(progressTextId);
    container.style.display = 'flex';
    fill.style.width = pct + '%';
    text.textContent = pct + '%';
}

function hideProgress(progressContainerId, progressFillId) {
    document.getElementById(progressContainerId).style.display = 'none';
    document.getElementById(progressFillId).style.width = '0%';
}

// ============================================
// Gallery Management
// ============================================
const photoUploadForm = document.getElementById('photoUploadForm');
const adminGalleryGrid = document.getElementById('adminGalleryGrid');

photoUploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('photoTitle').value;
    const category = document.getElementById('photoCategory').value;
    const file = document.getElementById('photoFile').files[0];

    if (!file) return showToast('Please select a photo.', true);

    try {
        showProgress('photoProgress', 'photoProgressFill', 'photoProgressText', 30);
        const imageUrl = await compressAndConvertToBase64(file);
        showProgress('photoProgress', 'photoProgressFill', 'photoProgressText', 70);

        await db.collection('gallery').add({
            title,
            category,
            imageUrl,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        hideProgress('photoProgress', 'photoProgressFill');
        showToast('Photo uploaded successfully!');
        photoUploadForm.reset();
        document.getElementById('photoPreview').style.display = 'none';
        loadGallery();
    } catch (err) {
        hideProgress('photoProgress', 'photoProgressFill');
        showToast('Upload failed: ' + err.message, true);
    }
});

async function loadGallery() {
    try {
        const snapshot = await db.collection('gallery').orderBy('createdAt', 'desc').get();

        if (snapshot.empty) {
            adminGalleryGrid.innerHTML = '<p class="empty-text">No photos yet. Upload your first photo above!</p>';
            return;
        }

        adminGalleryGrid.innerHTML = '';
        snapshot.forEach(doc => {
            const data = doc.data();
            const card = document.createElement('div');
            card.className = 'admin-photo-card';
            card.innerHTML = `
                <img src="${data.imageUrl}" alt="${data.title}" loading="lazy">
                <div class="admin-photo-info">
                    <div>
                        <strong>${data.title}</strong>
                        <span>${data.category}</span>
                    </div>
                    <button class="btn-delete" data-id="${doc.id}" data-type="gallery">Delete</button>
                </div>
            `;
            adminGalleryGrid.appendChild(card);
        });

        // Attach delete handlers
        adminGalleryGrid.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', () => deleteItem(btn.dataset.id, btn.dataset.type));
        });
    } catch (err) {
        adminGalleryGrid.innerHTML = '<p class="loading-text">Error loading photos.</p>';
    }
}

// ============================================
// Blog Management
// ============================================
const blogPostForm = document.getElementById('blogPostForm');
const adminBlogList = document.getElementById('adminBlogList');

blogPostForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('blogTitle').value;
    const content = document.getElementById('blogContent').value;
    const coverFile = document.getElementById('blogCover').files[0];

    try {
        let coverImageUrl = '';
        if (coverFile) {
            showProgress('blogProgress', 'blogProgressFill', 'blogProgressText', 30);
            coverImageUrl = await compressAndConvertToBase64(coverFile);
            showProgress('blogProgress', 'blogProgressFill', 'blogProgressText', 70);
        }

        await db.collection('posts').add({
            title,
            content,
            coverImageUrl,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        hideProgress('blogProgress', 'blogProgressFill');
        showToast('Blog post published!');
        blogPostForm.reset();
        document.getElementById('blogPreview').style.display = 'none';
        loadBlogPosts();
    } catch (err) {
        hideProgress('blogProgress', 'blogProgressFill');
        showToast('Publishing failed: ' + err.message, true);
    }
});

async function loadBlogPosts() {
    try {
        const snapshot = await db.collection('posts').orderBy('createdAt', 'desc').get();

        if (snapshot.empty) {
            adminBlogList.innerHTML = '<p class="empty-text">No blog posts yet. Create your first post above!</p>';
            return;
        }

        adminBlogList.innerHTML = '';
        snapshot.forEach(doc => {
            const data = doc.data();
            const card = document.createElement('div');
            card.className = 'admin-post-card';
            card.innerHTML = `
                <div>
                    <div class="post-date">${data.date || ''}</div>
                    <h3>${data.title}</h3>
                    <p>${data.content.substring(0, 150)}${data.content.length > 150 ? '...' : ''}</p>
                </div>
                <div class="admin-post-actions">
                    <button class="btn-delete" data-id="${doc.id}" data-type="posts">Delete</button>
                </div>
            `;
            adminBlogList.appendChild(card);
        });

        // Attach delete handlers
        adminBlogList.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', () => deleteItem(btn.dataset.id, btn.dataset.type));
        });
    } catch (err) {
        adminBlogList.innerHTML = '<p class="loading-text">Error loading posts.</p>';
    }
}

// ============================================
// Delete Item
// ============================================
async function deleteItem(id, collection) {
    if (!confirm('Are you sure you want to delete this?')) return;

    try {
        await db.collection(collection).doc(id).delete();
        showToast('Deleted successfully!');

        if (collection === 'gallery') loadGallery();
        else loadBlogPosts();
    } catch (err) {
        showToast('Delete failed: ' + err.message, true);
    }
}

