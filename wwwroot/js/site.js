/* ============================================================
   GÜNERİ TEKNİK - TÜMÜ BİR ARADA (2026)
   ============================================================ */
// --- 1. GÜVENLİK AYARLARI (Kopyalama Engelleme) ---
document.addEventListener('contextmenu', event => event.preventDefault());
document.onkeydown = function (e) {
    if (e.ctrlKey && [67, 86, 85, 83].includes(e.keyCode)) return false;
    if (e.keyCode === 123) return false;
};
// --- 2. DİNAMİK ALANLARI GÖSTER/GİZLE ---
function toggleFields() {
    const serviceSelect = document.getElementById('serviceSelect');
    const brandSelect = document.getElementById('brandSelect');
    const warrantySelect = document.getElementById('warrantySelect');
    const manualBrandGroup = document.getElementById('manualBrandGroup');
    const submitBtn = document.querySelector('.btn-submit');

    if (!serviceSelect || !brandSelect) return;

    const service = serviceSelect.value;
    const brand = brandSelect.value;
    const warranty = warrantySelect ? warrantySelect.value : "";

    // --- DİĞER SEÇENEĞİ KONTROLÜ ---
    let otherOption = brandSelect.querySelector('option[value="Diger"]');
    if (!otherOption) {
        otherOption = document.createElement('option');
        otherOption.value = "Diger";
        otherOption.text = "Diğer";
        brandSelect.add(otherOption);
    }

    const markalar = {
        "Maktek": "0850 441 42 00", "Sanica": "0850 460 66 88",
        "Ariston": "444 92 31", "Hexel": "0850 346 29 29", "Dizayn": "0850 290 3434"
    };

    let alertBox = document.getElementById('warrantyAlert');
    if (!alertBox) {
        alertBox = document.createElement('div');
        alertBox.id = 'warrantyAlert';
        alertBox.style.cssText = "background:#fff3cd; color:#856404; padding:18px; border-radius:10px; margin:20px 0; border:2px solid #ffeeba; font-weight:500; text-align:center;";
        const messageInput = document.querySelector('textarea');
        messageInput.parentNode.insertBefore(alertBox, messageInput);
    }

    // Varsayılan Gizlemeler
    alertBox.style.display = 'none';
    submitBtn.style.display = 'block';
    if (manualBrandGroup) manualBrandGroup.style.display = 'none';

    if (service === 'servis') {
        otherOption.style.display = 'none'; // Teknik serviste "Diğer" yasak
        if (brand === 'Diger') brandSelect.value = "";

        brandSelect.style.display = 'block';
        warrantySelect.style.display = 'block';

        if (warranty === 'evet' && brand && brand !== "") {
            const numara = markalar[brand] || "yetkili merkezi";
            alertBox.innerHTML = `⚠️ <strong>DİKKAT:</strong> ${brand} cihazınızın garantisi devam ediyorsa önce <strong>${numara}</strong> hattını aramalısınız.`;
            alertBox.style.display = 'block';
            submitBtn.style.display = 'none';
        }
    }
    else if (service === 'bakim') {
        otherOption.style.display = 'block';
        brandSelect.style.display = 'block';
        warrantySelect.style.display = 'none';

        // EĞER "DİĞER" SEÇİLİYSE MANUEL GİRİŞİ GÖSTER
        if (brand === 'Diger' && manualBrandGroup) {
            manualBrandGroup.style.display = 'block';
        }
    }
    else {
        brandSelect.style.display = 'none';
        warrantySelect.style.display = 'none';
    }
}

// --- 3. SAYFA YÜKLENDİĞİNDE TETİKLENENLER ---
document.addEventListener('DOMContentLoaded', () => {

    const cForm = document.getElementById('contactForm');

    if (cForm) {
        // Yeni HTML'de ID olmadığı için TYPE ve sıralamaya göre yakalıyoruz
        const nameInput = cForm.querySelector('input[type="text"]');
        const phoneInput = cForm.querySelector('input[type="tel"]');
        const serviceSelect = document.getElementById('serviceSelect');
        const brandSelect = document.getElementById('brandSelect');
        const warrantySelect = document.getElementById('warrantySelect');
        const messageInput = cForm.querySelector('textarea');

        // --- TELEFON KISITLAMASI (HARF YAZILMASINI ENGELLER) ---
        if (phoneInput) {
            phoneInput.addEventListener('input', function () {
                // Rakam olmayan her şeyi anında siler
                this.value = this.value.replace(/[^0-9]/g, '');
                // 11 haneden fazlasını kestirir
                if (this.value.length > 11) this.value = this.value.slice(0, 11);
            });
        }

        // --- FORM GÖNDERME ---
        cForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = nameInput.value.trim();
            const phone = phoneInput.value.trim();
            const service = serviceSelect.value;
            const brand = (brandSelect && brandSelect.style.display !== 'none') ? brandSelect.value : "Belirtilmedi";
            const message = messageInput.value.trim();

            if (!phone.startsWith('0') || phone.length !== 11) {
                alert("Lütfen 11 haneli ve 0 ile başlayan telefon numaranızı giriniz.");
                return;
            }

            // Google Sheets'e Kayıt (Arka Plan)
            const scriptURL = 'https://script.google.com/macros/s/AKfycbwTcZuAo3VF1PZozQr2MTA9jwD2r_4PpjwulnWX4wz1vlMEW57qZZZkB9o5gtiP0kOpMQ/exec';
            const formData = new FormData();
            formData.append('name', name);
            formData.append('phone', phone);
            formData.append('service', service);
            formData.append('brand', brand);
            formData.append('message', message);

            fetch(scriptURL, { method: 'POST', body: formData }).catch(err => console.log(err));

            // WhatsApp Yönlendirme
            const wpMetin = `*Güneri Teknik Web Talebi*%0A*Müşteri:* ${name}%0A*Tel:* ${phone}%0A*Hizmet:* ${service}%0A*Cihaz:* ${brand}%0A*Mesaj:* ${message}`;
            window.open(`https://wa.me/905376183344?text=${wpMetin}`, '_blank');

            // Başarı Mesajı
            alert("Talebiniz alınmıştır. WhatsApp üzerinden de iletiliyor...");
            cForm.reset();
            toggleFields();
        });
    }

    // Yedek Parça sayfasındaysak verileri çek
    if (document.querySelector('.parts-grid')) {
        yedekParcalariYukle();
    }
});

// --- 4. YEDEK PARÇA YÜKLEME FONKSİYONU ---
const sheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTIuvoE6Mdx-csDbY7ECBAadzc2d4R9SB3NFdcZy0CVoRP5LuhYl-ogCpGnPtXvnnSBi6_9FNTZQ-mA/pub?gid=0&single=true&output=csv';

async function yedekParcalariYukle() {
    try {
        const response = await fetch(sheetURL);
        const data = await response.text();
        const rows = data.split(/\r?\n/).filter(row => row.trim() !== "").slice(1);
        const grids = document.querySelectorAll('.parts-grid');
        grids.forEach(g => g.innerHTML = '');

        rows.forEach((row) => {
            const cols = row.split(/[;,]/);
            if (cols.length < 7) return;

            const [isim, marka, klasor, kategoriID, fiyat, stok, resimAdi] = cols.map(c => c.trim().replace(/"/g, ''));
            const temizID = kategoriID.toLowerCase().replace(/\s/g, '');
            const targetGrid = document.querySelector(`#cat-${temizID} .parts-grid`);

            if (targetGrid) {                
                const resimYolu = (klasor && klasor !== "") ? `../img/YedekParca/${klasor}/${resimAdi}` : `../img/YedekParca/${resimAdi}`;

                const isAvailable = stok.toLowerCase() === 'var';
                targetGrid.innerHTML += `
                <div class="product-card" data-name="${isim.toLowerCase()}" data-brand="${marka.toLowerCase()}">
                    <div class="product-image-container">
                        <button type="button" class="img-zoom-btn" onclick="openLightbox('${resimYolu}')" aria-label="${isim} resmini büyüt">
                <img src="${resimYolu}" alt="${isim}" class="product-img" onerror="this.src='../img/placeholder.jpg'">
                         </button>
                    </div>
                    <div class="product-info">
                        <div class="brand-badge">${marka}</div>
                        <h3 class="product-title">${isim}</h3>
                        <div class="product-meta">
                            <span class="stock-status ${isAvailable ? 'in-stock' : 'out-stock'}">
                                <strong>Stok Durumu:</strong> <i class="fas ${isAvailable ? 'fa-check-circle' : 'fa-times-circle'}"></i> ${stok.toUpperCase()}
                            </span>
                        </div>
                        <div class="price-action-row">
                            <span class="price-text">${fiyat}</span>
                            <button class="whatsapp-btn" onclick="window.open('https://wa.me/905376183344?text=${encodeURIComponent(isim)} hakkında bilgi almak istiyorum', '_blank')">
                                <i class="fab fa-whatsapp"></i> Fiyat Al
                            </button>
                        </div>
                    </div>
                </div>`;
            }
        });
    } catch (e) { console.error(e); }
}

// --- ARAMA FONKSİYONU (X Butonu Düzeltildi) ---
function searchParts() {
    const input = document.getElementById('partSearch');
    const clearBtn = document.getElementById('clearSearch');
    const noResults = document.getElementById('noResults');
    const filter = input.value.toLowerCase();

    // Tüm ürün kartlarını al
    const cards = document.querySelectorAll('.product-card');
    // Tüm kategori bölümlerini al (HTML'de kategori div'lerine 'part-category' sınıfı verdiğini varsayıyorum)
    const sections = document.querySelectorAll('.part-category');

    let totalVisibleCount = 0;

    // X butonu kontrolü
    if (clearBtn) {
        clearBtn.style.display = input.value.length > 0 ? "flex" : "none";
    }

    // Her kategoriyi kendi içinde tara
    sections.forEach(section => {
        const sectionCards = section.querySelectorAll('.product-card');
        let sectionVisibleCount = 0;

        sectionCards.forEach(card => {
            const name = card.getAttribute('data-name') || "";
            const brand = card.getAttribute('data-brand') || "";

            if (name.includes(filter) || brand.includes(filter)) {
                card.style.display = "flex";
                sectionVisibleCount++;
                totalVisibleCount++;
            } else {
                card.style.display = "none";
            }
        });

        // Eğer kategoride hiç görünür ürün yoksa, başlığıyla beraber kategoriyi gizle
        if (sectionVisibleCount === 0 && filter.length > 0) {
            section.style.display = "none";
        } else {
            section.style.display = "block";
        }
    });

    // "Bulunamadı" uyarısını göster/gizle
    if (noResults) {
        if (totalVisibleCount === 0 && filter.length > 0) {
            noResults.style.display = "block";
        } else {
            noResults.style.display = "none";
        }
    }
}
function clearInput() {
    const input = document.getElementById('partSearch');
    const clearBtn = document.getElementById('clearSearch');

    input.value = ""; // Kutuyu temizle
    clearBtn.style.display = "none"; // X butonunu gizle
    searchParts(); // Listeyi tekrar eski haline getir (hepsini göster)
    input.focus(); // İmleci tekrar kutuya odakla
}

// --- FİLTRELEME FONKSİYONU ---
function filterCategory(catId) {
    const sections = document.querySelectorAll('.part-category');
    const buttons = document.querySelectorAll('.filter-btn');

    // Buton aktiflik durumunu değiştir
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    sections.forEach(section => {
        if (catId === 'all') {
            section.style.display = "block";
        } else {
            if (section.id === `cat-${catId}`) {
                section.style.display = "block";
            } else {
                section.style.display = "none";
            }
        }
    });
}
// MOBIL MENÜ TOGGLE
document.addEventListener('DOMContentLoaded', function () {
    const toggle = document.querySelector('.mobile-toggle');
    const menu = document.querySelector('.nav-menu');

    if (toggle && menu) {
        toggle.onclick = function () {
            menu.classList.toggle('active');

            // İkonu değiştir (Üç çizgi -> Çarpı)
            const icon = toggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        };

        // Menü dışına tıklandığında otomatik kapatma
        document.addEventListener('click', (e) => {
            if (!menu.contains(e.target) && !toggleBtn.contains(e.target)) {
                menu.classList.remove('active');
                const icon = toggleBtn.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                }
            }
        });
    }
});
        //BLOG SAYFASI İÇİN DETAYLARI GÖSTER/GİZLE
function toggleDetails(id, btn) {
    const details = document.getElementById(id);
    
    
    if (details.style.display === "block") {
        details.style.display = "none";
        btn.textContent = "Detayları Gör ↓";
    } else {
        details.style.display = "block";
        btn.textContent = "Kapat ↑";
    }
}
document.addEventListener('DOMContentLoaded', function () {
    const whatsappButtons = document.querySelectorAll('.price-btn');
    const phoneNumber = "905376183344";

    whatsappButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();

            // Butonun içindeki data-product değerini al
            const productName = this.getAttribute('data-product');

            // Mesajı oluştur
            const message = `Merhaba, ${productName} hakkında fiyat almak istiyorum.`;

            // WhatsApp linkini oluştur ve yönlendir
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

            window.open(whatsappUrl, '_blank');
        });
    });
});
function openLightbox(src) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('fullImage');
    const wrapper = document.getElementById('modalWrapper');

    if (modal && modalImg) {
        modal.style.display = "flex";
        modalImg.src = src;

        // ESC tuşu ile kapatma desteği
        document.addEventListener('keydown', handleEsc);

        // Boşluğa tıklayınca kapatma (HTML içinde onclick yazmadan)
        wrapper.onclick = function () {
            closeLightbox();
        };
    }
}
function closeLightbox() {
    const modal = document.getElementById('imageModal');
    if (modal) {
        modal.style.display = "none";
        document.removeEventListener('keydown', handleEsc);
    }
}

function handleEsc(e) {
    if (e.key === "Escape") closeLightbox();
}