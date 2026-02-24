// --- 1. GENEL GÜVENLİK AYARLARI ---
document.addEventListener('contextmenu', event => event.preventDefault());
document.onkeydown = function (e) {
    if (e.ctrlKey && [67, 86, 85, 83].includes(e.keyCode)) return false;
    if (e.keyCode === 123) return false;
};

// --- 2. KVKK MODAL ---
const modal = document.getElementById("kvkkModal");
function openKvkk() { if (modal) { modal.showModal(); document.body.style.overflow = "hidden"; } }
function closeKvkk() { if (modal) { modal.close(); document.body.style.overflow = "auto"; } }
if (modal) { modal.addEventListener("click", (e) => { if (e.target === modal) closeKvkk(); }); }

// --- 3. YEDEK PARÇA FİLTRELEME VE ARAMA ---
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

// --- 4. İLETİŞİM SAYFASI MANTIĞI (MARKA / GARANTİ SEÇİMİ) ---
function toggleFields() {
    const service = document.getElementById('serviceSelect')?.value;
    const warranty = document.getElementById('warrantySelect')?.value;
    const brand = document.getElementById('brandSelect')?.value;
    const brandSelectElement = document.getElementById('brandSelect');

    const warrantyGroup = document.getElementById('warrantyGroup');
    const brandGroup = document.getElementById('brandGroup');
    const manualBrandGroup = document.getElementById('manualBrandGroup');
    const warrantyAlert = document.getElementById('warrantyAlert');
    const submitBtn = document.getElementById('submitBtn');
    const otherOption = document.getElementById('otherBrandOption');

    const markalar = { "Maktek": "0850 441 42 00", "Sanica": "0850 460 66 88", "Ariston": "444 92 31", "Hexel": "0850 346 29 29" };

    if (warrantyGroup) warrantyGroup.style.display = 'none';
    if (brandGroup) brandGroup.style.display = 'none';
    if (manualBrandGroup) manualBrandGroup.style.display = 'none';
    if (warrantyAlert) warrantyAlert.style.display = 'none';
    if (submitBtn) submitBtn.style.display = 'block';

    if (service === 'servis') {
        if (brandGroup) brandGroup.style.display = 'block';
        if (warrantyGroup) warrantyGroup.style.display = 'block';
        if (brand === 'Diger') brandSelectElement.value = "";
        if (warranty === 'evet' && brand && brand !== "Diger") {
            const numara = markalar[brand] || "çağrı merkezini";
            document.getElementById('alertMessage').innerHTML = `<b>${brand}</b> yetkili servisiyiz ancak yasal garanti süreci gereği önce çağrı merkezinden kayıt açtırmanız gerekmektedir.`;
            document.getElementById('callCenterBtn').href = "tel:" + numara.replace(/\s/g, '');
            if (warrantyAlert) warrantyAlert.style.display = 'block';
            if (submitBtn) submitBtn.style.display = 'none';
        }
    } else if (service === 'bakim') {
        if (brandGroup) brandGroup.style.display = 'block';
        if (brand === 'Diger' && manualBrandGroup) manualBrandGroup.style.display = 'block';
    }
}

// --- 5. LIGHTBOX (GÖRSEL BÜYÜTME) ---
function openLightbox(src, title) {
    const lb = document.getElementById('imageModal');
    const lbImg = document.getElementById('imgFull');
    const lbCap = document.getElementById('caption');
    if (lb && lbImg) {
        const scrollY = window.scrollY;
        lb.style.display = "flex";
        lbImg.src = src;
        if (lbCap) lbCap.innerText = title;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';
    }
}

function closeLightbox() {
    const lb = document.getElementById('imageModal');
    if (lb) {
        const scrollY = document.body.style.top;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
        lb.style.display = "none";
    }
}

// --- 6. SAYFA YÜKLENDİĞİNDE ÇALIŞACAKLAR ---
document.addEventListener('DOMContentLoaded', () => {
    // İletişim Formu Dinleyicileri
    ['warrantySelect', 'brandSelect', 'serviceSelect'].forEach(id => {
        document.getElementById(id)?.addEventListener('change', toggleFields);
    });

    // Form Gönderimi (WhatsApp)
    const cForm = document.getElementById('contactForm');
    if (cForm) {
        cForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const phone = document.getElementById('phoneInput').value;
            if (!phone.startsWith('0') || phone.length !== 11) { alert("Numaranızı 0 ile başlayan 11 hane olarak giriniz."); return; }
            const metin = `*Güneri Teknik Web Talebi*%0A*Müşteri:* ${document.getElementById('nameInput').value}%0A*Tel:* ${phone}%0A*Cihaz:* ${document.getElementById('brandSelect').value}%0A*Hizmet:* ${document.getElementById('serviceSelect').value}%0A*Mesaj:* ${document.getElementById('messageInput').value}`;
            window.open(`https://wa.me/905060357883?text=${metin}`, '_blank');
        });
    }

    // Yedek Parça Butonları & Lightbox
    document.querySelectorAll('.order-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const partName = this.parentElement.querySelector('h3').innerText;
            this.href = `https://wa.me/905376183344?text=${encodeURIComponent('Merhaba, *' + partName + '* için fiyat alabilir miyim?')}`;
        });
    });

    document.querySelectorAll('.part-img img').forEach(img => {
        img.addEventListener('click', function(e) {
            e.stopPropagation();
            const title = this.closest('.part-item').querySelector('h3').innerText;
            openLightbox(this.src, title);
        });
    });

    document.addEventListener('keydown', (e) => { if (e.key === "Escape") closeLightbox(); });
});
