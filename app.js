let siteContent = null;
let currentLanguage = 'en';

const staticTranslations = {
    en: {
        contactViaWhatsApp: 'Contact via WhatsApp',
        languageToggle: 'Español',
        price: 'Price',
        siteName: 'Moving Sale',
        priceNote: 'All prices are in Mexican pesos and negotiable.',
        noImagesAvailable: 'No images available'
    },
    es: {
        contactViaWhatsApp: 'Contactar por WhatsApp',
        languageToggle: 'English',
        price: 'Precio',
        siteName: 'Venta por Mudanza',
        priceNote: 'Todos los precios están en pesos mexicanos y son negociables.',
        noImagesAvailable: 'No hay imágenes disponibles'
    }
};

marked.use({ breaks: true });

async function loadContent() {
    const response = await fetch('content/items.json');
    siteContent = await response.json();
    await renderItems();
    updateSiteTitle();
    updateWhatsAppButton();
}

async function renderItems() {
    const container = document.getElementById('items-container');
    container.innerHTML = '';
    
    const priceLabel = staticTranslations[currentLanguage].price;
    
    for (const item of siteContent.items) {
        const itemElement = document.createElement('div');
        itemElement.className = 'item';
        
        const imagesHtml = item.imageDir
            ? `<div class="item-images" data-image-dir="${item.imageDir}"></div>`
            : `<p>${staticTranslations[currentLanguage].noImagesAvailable}</p>`;

        const descriptionHtml = marked.parse(item.description[currentLanguage]);

        itemElement.innerHTML = `
            <h2>${item.name[currentLanguage]}</h2>
            <div class="item-description"></div>
            <p>${priceLabel}: $${item.price}</p>
            ${imagesHtml}
        `;
        
        const descriptionElement = itemElement.querySelector('.item-description');
        descriptionElement.innerHTML = descriptionHtml;

        container.appendChild(itemElement);
    }

    // Load images after rendering items
    loadImages();
}

async function loadImages() {
    const imageDivs = document.querySelectorAll('.item-images');
    for (const div of imageDivs) {
        const imageDir = div.dataset.imageDir;
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
        const scrollContainer = document.createElement('div');
        scrollContainer.className = 'image-scroll-container';
        div.appendChild(scrollContainer);

        const imagePromises = [];

        for (let i = 1; i <= 10; i++) {
            for (const ext of imageExtensions) {
                const img = document.createElement('img');
                img.src = `content/${imageDir}/${i}.${ext}`;
                img.alt = imageDir;
                
                const imagePromise = new Promise((resolve) => {
                    img.onload = () => resolve(img);
                    img.onerror = () => resolve(null);
                });
                
                imagePromises.push(imagePromise);
            }
        }

        const loadedImages = await Promise.all(imagePromises);
        const validImages = loadedImages.filter(img => img !== null);
        
        validImages.sort((a, b) => {
            const aNum = parseInt(a.src.match(/(\d+)\.[^.]+$/)[1]);
            const bNum = parseInt(b.src.match(/(\d+)\.[^.]+$/)[1]);
            return aNum - bNum;
        });

        validImages.forEach(img => {
            scrollContainer.appendChild(img);
            img.addEventListener('click', () => expandImage(img.src));
        });
    }
}

function expandImage(src) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <img src="${src}" alt="Expanded image">
        </div>
    `;
    
    const img = modal.querySelector('img');
    img.onload = function() {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const imageAspectRatio = this.naturalWidth / this.naturalHeight;
        const viewportAspectRatio = viewportWidth / viewportHeight;

        if (imageAspectRatio > viewportAspectRatio) {
            // Image is wider than viewport
            this.style.width = '90vw';
            this.style.height = 'auto';
        } else {
            // Image is taller than viewport
            this.style.height = '90vh';
            this.style.width = 'auto';
        }
    };

    modal.addEventListener('click', () => modal.remove());
    document.body.appendChild(modal);
}

function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'es' : 'en';
    document.getElementById('language-toggle').textContent = staticTranslations[currentLanguage].languageToggle;
    updateSiteTitle();
    updateWhatsAppButton();
    renderItems();
}

function updateSiteTitle() {
    document.getElementById('site-title').textContent = staticTranslations[currentLanguage].siteName;
    document.getElementById('price-note').textContent = staticTranslations[currentLanguage].priceNote;
}

function updateWhatsAppButton() {
    const whatsappButton = document.getElementById('whatsapp-button');
    whatsappButton.href = `https://wa.me/12679837027`;
    whatsappButton.textContent = staticTranslations[currentLanguage].contactViaWhatsApp;
}

document.getElementById('language-toggle').addEventListener('click', toggleLanguage);

loadContent();
