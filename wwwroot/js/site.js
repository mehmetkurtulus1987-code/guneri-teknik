// --- 1. GENEL AYARLAR & GÜVENLİK ---
// Sağ tık ve klavye engellemeleri
document.addEventListener('contextmenu', event => event.preventDefault());
document.onkeydown = function (e) {
    if (e.ctrlKey && [67, 86, 85, 83].includes(e.keyCode)) return false; // C, V, U, S
    if (e.keyCode === 123) return false; // F12
};

// --- 2. MODAL & KVKK ---
const modal = document.getElementById("kvkkModal");
function openKvkk() { if (modal) { modal.showModal(); document.body.style.overflow = "hidden"; } }
function closeKvkk() { if (modal) { modal.close(); document.body.style.overflow = "auto"; } }

if (modal) {
    modal.addEventListener("click", (e) => { if (e.target === modal) closeKvkk(); });
}

// --- 3. YEDEK PARÇA FONKSİYONLARI ---

// Kategori Filtreleme
function filterCategory(category) {
    let buttons = document.getElementsByClassName('filter-btn');
    for (let btn of buttons) btn.classList.remove('active');
    if (window.event && window.event.currentTarget) window.event.currentTarget.classList.add('active');

    let items = document.getElementsByClassName('part-item');
    for (let i = 0; i < items.length; i++) {
        let itemCat = items[i].getAttribute('data-category');
        items[i].style.display = (category === 'all' || itemCat === category) ? "block" : "none";
    }
    updateCategoryVisibility();
}

// Arama & Temizleme
function searchParts() {
    let inputEl = document.getElementById('partSearch');
    let clearBtn = document.getElementById('clearSearch');
    if (!inputEl) return;

    let input = inputEl.value.toLocaleLowerCase('tr-TR');
    let items = document.getElementsByClassName('part-item');

    if (clearBtn) clearBtn.style.display = (input.length > 0) ? "block" : "none";

    for (let i = 0; i < items.length; i++) {
        let title = items[i].querySelector('h3').innerText.toLocaleLowerCase('tr-TR');
        let brands = items[i].querySelector('.compatible-brands').innerText.toLocaleLowerCase('tr-TR');
        items[i].style.display = (title.includes(input) || brands.includes(input)) ? "block" : "none";
    }
    updateCategoryVisibility();
}

function clearInput() {
    let inputEl = document.getElementById('partSearch');
    if (inputEl) { inputEl.value = ""; searchParts(); inputEl.focus(); }
}

function updateCategoryVisibility() {
    let categories = document.getElementsByClassName('part-category');
    for (let cat of categories) {
        let visibleItems = Array.from(cat.getElementsByClassName('part-item')).some(item => item.style.display !== "none");
        cat.style.display = visibleItems ? "block" : "none";
    }
}

// --- 4. LIGHTBOX (GÖRSEL BÜYÜTME) ---
function openLightbox(src, title) {
    const lb = document.getElementById('imageModal');
    const lbImg = document.getElementById('imgFull');
    const lbCap = document.getElementById('caption');
    
    if (lb && lbImg) {
        // Mevcut kaydırma pozisyonunu sabitleyelim
        const scrollY = window.scrollY;
        
        lb.style.display = "flex";
        lbImg.src = src;
        if (lbCap) lbCap.innerText = title;
        
        // Sayfanın arkada hareket etmesini ve zıplamasını engelle
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';
    }
}

function closeLightbox() {
    const lb = document.getElementById('imageModal');
    if (lb) {
        // Sabitlenen pozisyonu geri al
        const scrollY = document.body.style.top;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
        
        lb.style.display = "none";
    }
}

// --- 5. SAYFA YÜKLENDİĞİNDE ÇALIŞACAKLAR ---
document.addEventListener('DOMContentLoaded', () => {
    // İletişim Formu Dinleyicileri
    const fields = ['warrantySelect', 'brandSelect', 'serviceSelect'];
    fields.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('change', toggleFields);
    });

    // Form Gönderimi
    const cForm = document.getElementById('contactForm');
    if (cForm) {
        cForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const name = document.getElementById('nameInput').value;
            const phone = document.getElementById('phoneInput').value;
            const service = document.getElementById('serviceSelect').value;
            const brand = document.getElementById('brandSelect').value;
            const message = document.getElementById('messageInput').value;

            if (!phone.startsWith('0') || phone.length !== 11) {
                alert("Numaranızı 0 ile başlayan 11 hane olarak giriniz."); return;
            }

            const metin = `*Güneri Teknik Web Talebi*%0A*Müşteri:* ${name}%0A*Tel:* ${phone}%0A*Cihaz:* ${brand}%0A*Hizmet:* ${service}%0A*Mesaj:* ${message}`;
            window.open(`https://wa.me/905060357883?text=${metin}`, '_blank');
        });
    }

    // WhatsApp Fiyat Al Butonları
    document.querySelectorAll('.order-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const partName = this.parentElement.querySelector('h3').innerText;
            this.href = `https://wa.me/905376183344?text=${encodeURIComponent('Merhaba, *' + partName + '* için fiyat alabilir miyim?')}`;
        });
    });

    // Resimlere Tıklama Özelliği (Lightbox)
    document.querySelectorAll('.part-img img').forEach(img => {
        img.style.cursor = "zoom-in";
        img.addEventListener('click', function(e) {
            e.stopPropagation(); // Tıklamanın arkaya geçmesini engeller
            const title = this.closest('.part-item').querySelector('h3').innerText;
            openLightbox(this.src, title);
        });
    });

    // ESC Tuşu ile Kapatma
    document.addEventListener('keydown', (e) => { if (e.key === "Escape") closeLightbox(); });
});

// İletişim Alanları Tetikleyici (DOMContentLoaded dışında olmalı)
function toggleFields() {
    // Mevcut toggleFields mantığın burada kalabilir, yukarıdaki koda entegre edildi.
    // (Önceki yazdığımız fonksiyonu buraya olduğu gibi yapıştırabilirsin)
}
