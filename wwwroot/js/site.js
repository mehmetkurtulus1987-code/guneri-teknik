// --- GENEL AYARLAR & GÜVENLİK ---
// Sağ tık menüsünü engelle (Tüm sayfa için)
document.addEventListener('contextmenu', event => event.preventDefault());

// Klavye kısayollarını engelle (Ctrl+C, Ctrl+U, F12 vb.)
document.onkeydown = function (e) {
    if (e.ctrlKey &&
        (e.keyCode === 67 || // Ctrl+C
            e.keyCode === 86 || // Ctrl+V
            e.keyCode === 85 || // Ctrl+U
            e.keyCode === 83)) { // Ctrl+S
        return false;
    }
    if (e.keyCode === 123) { // F12
        return false;
    }
};

// --- İNDEKS / KVKK MODAL ---
const modal = document.getElementById("kvkkModal");

function openKvkk() {
    if (modal) {
        modal.showModal();
        document.body.style.overflow = "hidden";
    }
}

function closeKvkk() {
    if (modal) {
        modal.close();
        document.body.style.overflow = "auto";
    }
}

if (modal) {
    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeKvkk();
        }
    });
}

// --- YEDEK PARÇA FONKSİYONLARI ---

// 1. Kategori Filtreleme
function filterCategory(category) {
    let buttons = document.getElementsByClassName('filter-btn');
    for (let btn of buttons) {
        btn.classList.remove('active');
    }
    if (event && event.currentTarget) event.currentTarget.classList.add('active');

    let items = document.getElementsByClassName('part-item');
    for (let i = 0; i < items.length; i++) {
        let itemCategory = items[i].getAttribute('data-category');
        if (category === 'all' || itemCategory === category) {
            items[i].style.display = "block";
            items[i].style.animation = "fadeIn 0.4s ease";
        } else {
            items[i].style.display = "none";
        }
    }
    updateCategoryVisibility();
}

// 2. Arama ve Temizleme
function searchParts() {
    let inputElement = document.getElementById('partSearch');
    let clearBtn = document.getElementById('clearSearch');
    if (!inputElement) return;

    let input = inputElement.value.toLocaleLowerCase('tr-TR');
    let items = document.getElementsByClassName('part-item');

    if (clearBtn) {
        clearBtn.style.display = (input.length > 0) ? "block" : "none";
    }

    for (let i = 0; i < items.length; i++) {
        let title = items[i].getElementsByTagName('h3')[0].innerText.toLocaleLowerCase('tr-TR');
        let brands = items[i].getElementsByClassName('compatible-brands')[0].innerText.toLocaleLowerCase('tr-TR');

        if (title.includes(input) || brands.includes(input)) {
            items[i].style.display = "block";
        } else {
            items[i].style.display = "none";
        }
    }
    updateCategoryVisibility();
}

function clearInput() {
    let inputElement = document.getElementById('partSearch');
    if (inputElement) {
        inputElement.value = "";
        searchParts();
        inputElement.focus();
    }
}

function updateCategoryVisibility() {
    let categories = document.getElementsByClassName('part-category');
    for (let i = 0; i < categories.length; i++) {
        let itemsInSection = categories[i].getElementsByClassName('part-item');
        let hasVisibleItem = false;

        for (let j = 0; j < itemsInSection.length; j++) {
            if (itemsInSection[j].style.display !== "none") {
                hasVisibleItem = true;
                break;
            }
        }
        categories[i].style.display = hasVisibleItem ? "block" : "none";
    }
}

// --- İLETİŞİM SAYFASI MANTIĞI ---

function toggleFields() {
    const service = document.getElementById('serviceSelect').value;
    const warranty = document.getElementById('warrantySelect').value;
    const brand = document.getElementById('brandSelect').value;
    const brandSelectElement = document.getElementById('brandSelect');
    const otherOption = document.getElementById('otherBrandOption');

    const warrantyGroup = document.getElementById('warrantyGroup');
    const brandGroup = document.getElementById('brandGroup');
    const manualBrandGroup = document.getElementById('manualBrandGroup');
    const warrantyAlert = document.getElementById('warrantyAlert');
    const submitBtn = document.getElementById('submitBtn');

    const markalar = {
        "Maktek": "0850 441 42 00",
        "Sanica": "0850 460 66 88",
        "Ariston": "444 92 31",
        "Hexel": "0850 346 29 29"
    };

    if (warrantyGroup) warrantyGroup.style.display = 'none';
    if (brandGroup) brandGroup.style.display = 'none';
    if (manualBrandGroup) manualBrandGroup.style.display = 'none';
    if (warrantyAlert) warrantyAlert.style.display = 'none';
    if (submitBtn) submitBtn.style.display = 'block';

    if (service === 'servis') {
        if (brandGroup) brandGroup.style.display = 'block';
        if (warrantyGroup) warrantyGroup.style.display = 'block';
        if (otherOption) otherOption.style.display = 'none';

        if (brand === 'Diger') brandSelectElement.value = "";

        if (warranty === 'evet' && brand !== "" && brand !== "Diger") {
            const numara = markalar[brand] || "marka çağrı merkezini";
            document.getElementById('alertMessage').innerHTML = `<b>${brand}</b> yetkili servisiyiz ancak yasal garanti süreci gereği önce çağrı merkezinden kayıt açtırmanız gerekmektedir.`;
            document.getElementById('callCenterBtn').href = "tel:" + numara.replace(/\s/g, '');
            if (warrantyAlert) warrantyAlert.style.display = 'block';
            if (submitBtn) submitBtn.style.display = 'none';
        }
    }
    else if (service === 'bakim') {
        if (brandGroup) brandGroup.style.display = 'block';
        if (otherOption) otherOption.style.display = 'block';
        if (brand === 'Diger' && manualBrandGroup) {
            manualBrandGroup.style.display = 'block';
        }
    }
}

// --- DOMContentLoaded (SAYFA YÜKLENDİĞİNDE) ---

document.addEventListener('DOMContentLoaded', () => {
    // 1. Event Dinleyicileri (İletişim)
    const wSelect = document.getElementById('warrantySelect');
    const bSelect = document.getElementById('brandSelect');
    const sSelect = document.getElementById('serviceSelect');
    const cForm = document.getElementById('contactForm');

    if (wSelect) wSelect.addEventListener('change', toggleFields);
    if (bSelect) bSelect.addEventListener('change', toggleFields);
    if (sSelect) sSelect.addEventListener('change', toggleFields);

    // 2. Form Gönderimi
    if (cForm) {
        cForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const name = document.getElementById('nameInput').value;
            const phone = document.getElementById('phoneInput').value;
            const service = document.getElementById('serviceSelect').value;
            const warranty = document.getElementById('warrantySelect').value;
            const message = document.getElementById('messageInput').value;
            let brandVal = document.getElementById('brandSelect').value;
            let finalBrand = brandVal;

            if (brandVal === "Diger") {
                const manualVal = document.getElementById('manualBrandInput').value;
                finalBrand = manualVal ? "Diğer (" + manualVal + ")" : "Diğer (Belirtilmedi)";
            } else if (!brandVal) {
                finalBrand = "Belirtilmedi";
            }

            if (!phone.startsWith('0') || phone.length !== 11) {
                alert("Lütfen numaranızı başında '0' olacak şekilde 11 hane olarak giriniz.");
                return;
            }

            const whatsappNo = "905060357883";
            const metin = `*Güneri Teknik Web Talebi*%0A` +
                `*Müşteri:* ${name}%0A` +
                `*Tel:* ${phone}%0A` +
                `*Cihaz/Marka:* ${finalBrand}%0A` +
                `*Hizmet:* ${service}%0A` +
                `*Mesaj:* ${message}`;

            alert("Talebiniz başarıyla alınmıştır. Detayları iletmek üzere WhatsApp'a yönlendiriliyorsunuz.");
            window.open(`https://wa.me/${whatsappNo}?text=${metin}`, '_blank');
        });
    }

    // 3. WhatsApp Fiyat Al (Yedek Parça)
    const orderButtons = document.querySelectorAll('.order-btn');
    const whatsappPriceNo = "905376183344";
    orderButtons.forEach(btn => {
        btn.addEventListener('click', function (e) {
            const partName = this.parentElement.querySelector('h3').innerText;
            const message = encodeURIComponent(`Merhaba, *${partName}* yedek parçası hakkında fiyat alabilir miyim?`);
            this.href = `https://wa.me/${whatsappPriceNo}?text=${message}`;
        });
    });

    // 4. Görsel Büyütme (Lightbox)
    const images = document.querySelectorAll('.part-img img');
    const lightbox = document.getElementById('imageModal');
    const lightboxImg = document.getElementById('imgFull');
    const captionText = document.getElementById('caption');

    event.stopPropagation()
});
