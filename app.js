let siteContent = null;
let currentLanguage = 'en';

const staticTranslations = {
    en: {
        contactViaWhatsApp: 'Contact via WhatsApp',
        languageToggle: 'Español',
        price: 'Price',
        siteName: 'Moving Sale'
    },
    es: {
        contactViaWhatsApp: 'Contactar por WhatsApp',
        languageToggle: 'English',
        price: 'Precio',
        siteName: 'Venta por Mudanza'
    }
};

async function loadContent() {
    const response = await fetch('content/items.json');
    siteContent = await response.json();
    renderItems();
    updateSiteTitle();
    updateWhatsAppButton();
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
}

function updateWhatsAppButton() {
    const whatsappButton = document.getElementById('whatsapp-button');
    whatsappButton.href = `https://wa.me/12679837027`;
    whatsappButton.textContent = staticTranslations[currentLanguage].contactViaWhatsApp;
}

function renderItems() {
    const container = document.getElementById('items-container');
    container.innerHTML = '';
    
    const priceLabel = staticTranslations[currentLanguage].price;
    
    siteContent.items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'item';
        itemElement.innerHTML = `
            <h2>${item.name[currentLanguage]}</h2>
            <p>${item.description[currentLanguage]}</p>
            <p>${priceLabel}: $${item.price}</p>
            ${item.images.map(img => `<img src="content/${img}" alt="${item.name[currentLanguage]}">`).join('')}
        `;
        container.appendChild(itemElement);
    });
}

document.getElementById('language-toggle').addEventListener('click', toggleLanguage);

loadContent();
