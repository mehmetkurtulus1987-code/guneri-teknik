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

// --- 4. İLETİŞİM SAYFASI MANTIĞI (GÜNCELLENMİŞ: SERVİS/BAKIM AYRIMI) ---
function toggleFields() {
    const serviceSelect = document.getElementById('serviceSelect');
    const brandSelect = document.getElementById('brandSelect');
    const warrantySelect = document.getElementById('warrantySelect');
    
    if (!serviceSelect || !brandSelect) return;

    const service = serviceSelect.value;
    const brand = brandSelect.value;
    const warranty = warrantySelect?.value;

    const warrantyGroup = document.getElementById('warrantyGroup');
    const brandGroup = document.getElementById('brandGroup');
    const manualBrandGroup = document.getElementById('manualBrandGroup');
    const warrantyAlert = document.getElementById('warrantyAlert');
    const submitBtn = document.getElementById('submitBtn');
    
    // "Diğer" seçeneğini bul
    const otherOption = brandSelect.querySelector('option[value="Diger"]');

    const markalar = { "Maktek": "0850 441 42 00", "Sanica": "0850 460 66 88", "Ariston": "444 92 31", "Hexel": "0850 346 29 29" };

    // Başlangıç Ayarları
    if (warrantyGroup) warrantyGroup.style.display = 'none';
    if (brandGroup) brandGroup.style.display = 'none';
    if (manualBrandGroup) manualBrandGroup.style.display = 'none';
    if (warrantyAlert) warrantyAlert.style.display = 'none';
    if (submitBtn) submitBtn.style.display = 'block';

    if (service === 'servis') {
        // Teknik Servis: Diğer seçeneğini GİZLE
        if (otherOption) otherOption.style.display = 'none';
        if (brandGroup) brandGroup.style.display = 'block';
        if (warrantyGroup) warrantyGroup.style.display = 'block';
        
        // Eğer kullanıcı daha önce Diğer'i seçtiyse temizle
        if (brand === 'Diger') brandSelect.value = "";

        // Garanti Kontrolü
        if (warranty === 'evet' && brand && brand !== "Diger") {
            const numara = markalar[brand] || "çağrı merkezini";
            const alertMsg = document.getElementById('alertMessage');
            if (alertMsg) alertMsg.innerHTML = `<b>${brand}</b> yetkili servisiyiz ancak yasal garanti süreci gereği önce çağrı merkezinden kayıt açtırmanız gerekmektedir.`;
            const callBtn = document.getElementById('callCenterBtn');
            if (callBtn) callBtn.href = "tel:" + numara.replace(/\s/g, '');
            
            if (warrantyAlert) warrantyAlert.style.display = 'block';
            if (submitBtn) submitBtn.style.display = 'none';
        }
    } else if (service === 'bakim') {
        // Bakım: Diğer seçeneğini GÖSTER
        if (otherOption) otherOption.style.display = 'block';
        if (brandGroup) brandGroup.style.display = 'block';
        
        // Diğer seçildiyse manuel giriş kutusunu göster
        if (brand === 'Diger' && manualBrandGroup) {
            manualBrandGroup.style.display = 'block';
        }
    }
}

// --- 5. LIGHTBOX (GÖRSEL BÜYÜTME - MOBİL UYUMLU) ---
function openLightbox(src, title) {
    const lb = document.getElementById('imageModal');
    const lbImg = document.getElementById('imgFull');
    const lbCap = document.getElementById('caption');
    if (lb && lbImg) {
        const scrollY = window.scrollY;
        lb.style.display = "flex";
        lbImg.src = src;
        if (lbCap) lbCap.innerText = title;
        
        // Arka planın kaymasını engelle
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
    // Form Dinleyicilerini Bağla
    ['serviceSelect', 'brandSelect', 'warrantySelect'].forEach(id => {
        document.getElementById(id)?.addEventListener('change', toggleFields);
    });

    // Form Gönderimi (WhatsApp)
    const cForm = document.getElementById('contactForm');
    if (cForm) {
        cForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const phone = document.getElementById('phoneInput').value;
            if (!phone.startsWith('0') || phone.length !== 11) { 
                alert("Numaranızı 0 ile başlayan 11 hane olarak giriniz."); 
                return; 
            }
            
            let selectedBrand = document.getElementById('brandSelect').value;
            if (selectedBrand === "Diger") {
                selectedBrand = document.getElementById('manualBrandInput')?.value || "Diğer";
            }

            const metin = `*Güneri Teknik Web Talebi*%0A*Müşteri:* ${document.getElementById('nameInput').value}%0A*Tel:* ${phone}%0A*Cihaz:* ${selectedBrand}%0A*Hizmet:* ${document.getElementById('serviceSelect').value}%0A*Mesaj:* ${document.getElementById('messageInput').value}`;
            window.open(`https://wa.me/905060357883?text=${metin}`, '_blank');
        });
    }

    // Yedek Parça Sipariş Butonları
    document.querySelectorAll('.order-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const partName = this.closest('.part-item').querySelector('h3').innerText;
            const targetUrl = `https://wa.me/905376183344?text=${encodeURIComponent('Merhaba, *' + partName + '* için fiyat alabilir miyim?')}`;
            window.open(targetUrl, '_blank');
        });
    });

    // Resimlere Tıklayınca Lightbox Aç
    document.querySelectorAll('.part-img img').forEach(img => {
        img.addEventListener('click', function(e) {
            const title = this.closest('.part-item').querySelector('h3').innerText;
            openLightbox(this.src, title);
        });
    });

    // Kapatma tuşları
    document.addEventListener('keydown', (e) => { if (e.key === "Escape") closeLightbox(); });
});
