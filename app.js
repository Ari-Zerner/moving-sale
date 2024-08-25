let siteContent = null;
let currentLanguage = 'en';

const staticTranslations = {
    en: {
        contactViaWhatsApp: 'Contact via WhatsApp',
        languageToggle: 'Español',
        price: 'Price',
        siteName: 'Moving Sale',
        priceNote: 'All prices are in Mexican pesos and negotiable.'
    },
    es: {
        contactViaWhatsApp: 'Contactar por WhatsApp',
        languageToggle: 'English',
        price: 'Precio',
        siteName: 'Venta por Mudanza',
        priceNote: 'Todos los precios están en pesos mexicanos y son negociables.'
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
        
        const images = await getImagesFromDirectory(item.imageDir);
        const imagesHtml = images.length > 0
            ? images.map(img => `<img src="${img}" alt="${item.name[currentLanguage]}">`).join('')
            : '<p>No images available</p>';

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
}

async function getImagesFromDirectory(dirName) {
    try {
        const response = await fetch(`content/${dirName}/`);
        if (!response.ok) return [];
        
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const links = Array.from(doc.querySelectorAll('a'));
        
        return links
            .filter(link => /\.(jpg|jpeg|png|gif)$/i.test(link.href))
            .map(link => `content/${dirName}/${link.href.split('/').pop()}`);
    } catch (error) {
        console.error(`Error reading image directory '${dirName}':`, error);
        return [];
    }
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
