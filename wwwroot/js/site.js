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

// --- 4. İLETİŞİM SAYFASI MANTIĞI (GÜNCELLENMİŞ: SERVİS/BAKIM VE iOS UYUMLU) ---
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
    
    let otherOption = brandSelect.querySelector('option[value="Diger"]');
    const markalar = { "Maktek": "0850 441 42 00", "Sanica": "0850 460 66 88", "Ariston": "444 92 31", "Hexel": "0850 346 29 29" };

    if (warrantyGroup) warrantyGroup.style.display = 'none';
    if (brandGroup) brandGroup.style.display = 'none';
    if (manualBrandGroup) manualBrandGroup.style.display = 'none';
    if (warrantyAlert) warrantyAlert.style.display = 'none';
    if (submitBtn) submitBtn.style.display = 'block';

    if (service === 'servis') {
        if (otherOption) otherOption.remove(); 
        if (brandGroup) brandGroup.style.display = 'block';
        if (warrantyGroup) warrantyGroup.style.display = 'block';
        if (brand === 'Diger') brandSelect.value = "";

        if (warranty === 'evet' && brand && brand !== "Diger") {
            const numara = markalar[brand] || "çağrı merkezini";
            const alertMsg = document.getElementById('alertMessage');
            if (alertMsg) alertMsg.innerHTML = `<b>${brand}</b> yetkili servisiyiz ancak yasal garanti süreci gereği önce çağrı merkezinden kayıt açtırmanız gerekmektedir.`;
            const callBtn = document.getElementById('callCenterBtn');
            if (callBtn) callBtn.href = "tel:" + numara.replace(/\s/g, '');
            if (warrantyAlert) warrantyAlert.style.display = 'block';
            if (submitBtn) submitBtn.style.display = 'none';
        }
    } 
    else if (service === 'bakim') {
        if (!otherOption) {
            const newOption = document.createElement('option');
            newOption.value = "Diger";
            newOption.text = "Diğer";
            brandSelect.add(newOption);
        }
        if (brandGroup) brandGroup.style.display = 'block';
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
    ['serviceSelect', 'brandSelect', 'warrantySelect'].forEach(id => {
        document.getElementById(id)?.addEventListener('change', toggleFields);
    });

    const cForm = document.getElementById('contactForm');
    if (cForm) {
        cForm.addEventListener('submit', function (e) {
            e.preventDefault();
            
            // Verileri Al
            const name = document.getElementById('nameInput').value;
            const phone = document.getElementById('phoneInput').value;
            const service = document.getElementById('serviceSelect').value;
            const message = document.getElementById('messageInput').value;
            let selectedBrand = document.getElementById('brandSelect').value;
            
            if (selectedBrand === "Diger") {
                selectedBrand = document.getElementById('manualBrandInput')?.value || "Diğer";
            }

            // Numara Kontrolü
            if (!phone.startsWith('0') || phone.length !== 11) { 
                alert("Numaranızı 0 ile başlayan 11 hane olarak giriniz."); 
                return; 
            }

            // 1. GOOGLE SHEETS KAYDI (EXCEL)
            // Kopyaladığın URL'yi aşağıdaki tırnakların içine yapıştır
            const scriptURL = 'https://script.google.com/macros/s/AKfycbwTcZuAo3VF1PZozQr2MTA9jwD2r_4PpjwulnWX4wz1vlMEW57qZZZkB9o5gtiP0kOpMQ/exec'; 
            
            const formData = new FormData();
            formData.append('name', name);
            formData.append('phone', phone);
            formData.append('service', service);
            formData.append('brand', selectedBrand);
            formData.append('message', message);

            fetch(scriptURL, { method: 'POST', body: formData })
                .then(res => console.log('Excel kaydı başarılı!'))
                .catch(err => console.error('Excel hatası:', err));

            // 2. WHATSAPP GÖNDERİMİ
            const metin = `*Güneri Teknik Web Talebi*%0A*Müşteri:* ${name}%0A*Tel:* ${phone}%0A*Cihaz:* ${selectedBrand}%0A*Hizmet:* ${service}%0A*Mesaj:* ${message}`;
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

    document.addEventListener('keydown', (e) => { if (e.key === "Escape") closeLightbox(); });
});
