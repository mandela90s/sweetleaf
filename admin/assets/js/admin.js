// This would handle the admin functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check login (very basic for demo)
    if(localStorage.getItem('adminLoggedIn') !== 'true') {
        window.location.href = 'index.html';
    }
    
    // Load current data
    Promise.all([
        fetch('../data/site.json').then(r => r.json()),
        fetch('../data/products.json').then(r => r.json())
    ]).then(([siteData, productsData]) => {
        // Populate site editors
        document.getElementById('site-title-input').value = siteData.siteTitle;
        document.getElementById('hero-title-input').value = siteData.heroTitle;
        
        // Create product editors
        const productEditors = document.getElementById('product-editors');
        
        productsData.forEach((product, index) => {
            const editor = document.createElement('div');
            editor.className = 'product-editor mb-4 p-3 border';
            editor.innerHTML = `
                <h5>Product #${index + 1}</h5>
                <div class="mb-3">
                    <label class="form-label">Product Name</label>
                    <input type="text" class="form-control" value="${product.name}" data-field="name">
                </div>
                <div class="mb-3">
                    <label class="form-label">Price</label>
                    <input type="text" class="form-control" value="${product.price}" data-field="price">
                </div>
                <div class="mb-3">
                    <label class="form-label">Image URL</label>
                    <input type="text" class="form-control" value="${product.image}" data-field="image">
                </div>
                <div class="mb-3">
                    <label class="form-label">Description</label>
                    <textarea class="form-control" data-field="description">${product.description || ''}</textarea>
                </div>
                <button class="btn btn-danger btn-sm remove-product">Remove</button>
            `;
            productEditors.appendChild(editor);
        });
        
        // Add new product
        document.getElementById('add-product').addEventListener('click', function() {
            const editor = document.createElement('div');
            editor.className = 'product-editor mb-4 p-3 border';
            editor.innerHTML = `
                <h5>New Product</h5>
                <div class="mb-3">
                    <label class="form-label">Product Name</label>
                    <input type="text" class="form-control" data-field="name">
                </div>
                <div class="mb-3">
                    <label class="form-label">Price</label>
                    <input type="text" class="form-control" data-field="price">
                </div>
                <div class="mb-3">
                    <label class="form-label">Image URL</label>
                    <input type="text" class="form-control" data-field="image">
                </div>
                <div class="mb-3">
                    <label class="form-label">Description</label>
                    <textarea class="form-control" data-field="description"></textarea>
                </div>
                <button class="btn btn-danger btn-sm remove-product">Remove</button>
            `;
            productEditors.appendChild(editor);
        });
        
        // Remove product
        productEditors.addEventListener('click', function(e) {
            if(e.target.classList.contains('remove-product')) {
                e.target.closest('.product-editor').remove();
            }
        });
        
        // Save site data
        document.getElementById('save-site').addEventListener('click', function() {
            siteData.siteTitle = document.getElementById('site-title-input').value;
            siteData.heroTitle = document.getElementById('hero-title-input').value;
            
            fetch('../data/site.json', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(siteData)
            })
            .then(response => alert('Site content saved!'))
            .catch(error => alert('Error saving site content'));
        });
        
        // Save products
        document.getElementById('save-products').addEventListener('click', function() {
            const editors = document.querySelectorAll('.product-editor');
            const newProducts = [];
            
            editors.forEach(editor => {
                const product = {
                    name: editor.querySelector('[data-field="name"]').value,
                    price: editor.querySelector('[data-field="price"]').value,
                    image: editor.querySelector('[data-field="image"]').value,
                    description: editor.querySelector('[data-field="description"]').value
                };
                newProducts.push(product);
            });
            
            fetch('../data/products.json', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newProducts)
            })
            .then(response => alert('Products saved!'))
            .catch(error => alert('Error saving products'));
        });
    });
});
