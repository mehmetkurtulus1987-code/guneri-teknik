// index sayfası
const modal = document.getElementById("kvkkModal");

function openKvkk() {
    modal.showModal();
    document.body.style.overflow = "hidden";
}

function closeKvkk() {
    modal.close();
    document.body.style.overflow = "auto";
}

if (modal) {
    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeKvkk();
        }
    });
}

// yedekparca arama fonk.
// 1. Kategori Filtreleme Fonksiyonu
function filterCategory(category) {
    let buttons = document.getElementsByClassName('filter-btn');
    for (let btn of buttons) {
        btn.classList.remove('active');
    }
    // Seçilen butona aktif sınıfını ekle
    if (event) event.currentTarget.classList.add('active');

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
    
    // Boş kalan başlıkları (section) gizle
    updateCategoryVisibility();
}

// 2. Arama Fonksiyonu
function searchParts() {
    let inputElement = document.getElementById('partSearch');
    let clearBtn = document.getElementById('clearSearch');
    let input = inputElement.value.toLocaleLowerCase('tr-TR');
    let items = document.getElementsByClassName('part-item');

    // "X" butonunun görünürlüğünü kontrol et
    if (clearBtn) {
        clearBtn.style.display = (input.length > 0) ? "block" : "none";
    }

    // Parçaları filtrele
    for (let i = 0; i < items.length; i++) {
        let title = items[i].getElementsByTagName('h3')[0].innerText.toLocaleLowerCase('tr-TR');
        let brands = items[i].getElementsByClassName('compatible-brands')[0].innerText.toLocaleLowerCase('tr-TR');

        if (title.includes(input) || brands.includes(input)) {
            items[i].style.display = "block";
        } else {
            items[i].style.display = "none";
        }
    }
    
    // Arama sonrası boş kalan başlıkları gizle
    updateCategoryVisibility();
}

// Yeni: "X" butonuna basıldığında kutuyu temizleyen fonksiyon
function clearInput() {
    let inputElement = document.getElementById('partSearch');
    inputElement.value = ""; // Yazıyı sil
    searchParts(); // Tüm parçaları tekrar göster ve kategorileri güncelle
    inputElement.focus(); // İmleci kutuda tut
}

// 3. Yardımcı Fonksiyon: Boş Kategorileri Yönetir
function updateCategoryVisibility() {
    let categories = document.getElementsByClassName('part-category');
    
    for (let i = 0; i < categories.length; i++) {
        let itemsInSection = categories[i].getElementsByClassName('part-item');
        let hasVisibleItem = false;

        // Section içindeki parçalardan herhangi biri görünüyor mu?
        for (let j = 0; j < itemsInSection.length; j++) {
            if (itemsInSection[j].style.display !== "none") {
                hasVisibleItem = true;
                break;
            }
        }

        // Görünür parça yoksa tüm section'ı (başlık dahil) gizle
        categories[i].style.display = hasVisibleItem ? "block" : "none";
    }
}

// 4. WhatsApp Fiyat Al Butonlarını Otomatikleştir
document.addEventListener('DOMContentLoaded', () => {
    const orderButtons = document.querySelectorAll('.order-btn');
    const whatsappBase = "https://wa.me/905376183344?text=";

    orderButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Eğer href sadece # ise veya wa.me içeriyorsa mesajı özelleştir
            const partName = this.parentElement.querySelector('h3').innerText;
            const message = encodeURIComponent(`Merhaba, *${partName}* yedek parçası hakkında fiyat alabilir miyim?`);
            this.href = whatsappBase + message;
        });
    });
});

// İLETİŞİM SAYFASI
// 1. Servis seçildiğinde garanti ve marka alanlarını gösteren fonksiyon
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

    // Temizlik
    if (warrantyGroup) warrantyGroup.style.display = 'none';
    if (brandGroup) brandGroup.style.display = 'none';
    if (manualBrandGroup) manualBrandGroup.style.display = 'none';
    if (warrantyAlert) warrantyAlert.style.display = 'none';
    if (submitBtn) submitBtn.style.display = 'block';

    // DURUM 1: Teknik Servis
    if (service === 'servis') {
        if (brandGroup) brandGroup.style.display = 'block';
        if (warrantyGroup) warrantyGroup.style.display = 'block';
        if (otherOption) otherOption.style.display = 'none'; // Serviste "Diğer" kapalı

        if (brand === 'Diger') brandSelectElement.value = ""; 

        if (warranty === 'evet' && brand !== "" && brand !== "Diger") {
            const numara = markalar[brand] || "marka çağrı merkezini";
            document.getElementById('alertMessage').innerHTML = `<b>${brand}</b> yetkili servisiyiz ancak yasal garanti süreci gereği önce çağrı merkezinden kayıt açtırmanız gerekmektedir.`;
            document.getElementById('callCenterBtn').href = "tel:" + numara.replace(/\s/g, '');
            if (warrantyAlert) warrantyAlert.style.display = 'block';
            if (submitBtn) submitBtn.style.display = 'none';
        }
    } 
    // DURUM 2: Yıllık Bakım
    else if (service === 'bakim') {
        if (brandGroup) brandGroup.style.display = 'block';
        if (otherOption) otherOption.style.display = 'block'; // Bakımda "Diğer" açık

        if (brand === 'Diger') {
            if (manualBrandGroup) manualBrandGroup.style.display = 'block';
        }
    }
}

// Event Dinleyicileri
window.addEventListener('DOMContentLoaded', () => {
    const wSelect = document.getElementById('warrantySelect');
    const bSelect = document.getElementById('brandSelect');
    const sSelect = document.getElementById('serviceSelect');
    const cForm = document.getElementById('contactForm');

    if (wSelect) wSelect.addEventListener('change', toggleFields);
    if (bSelect) bSelect.addEventListener('change', toggleFields);
    if (sSelect) sSelect.addEventListener('change', toggleFields);

    // 2. Form Kontrol ve Gönderim Mantığı
    if (cForm) {
        cForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('nameInput').value;
            const phone = document.getElementById('phoneInput').value;
            const service = document.getElementById('serviceSelect').value;
            const warranty = document.getElementById('warrantySelect').value;
            const message = document.getElementById('messageInput').value;
            
            // MARKA BELİRLEME (finalBrand Mantığı)
            let brandVal = document.getElementById('brandSelect').value;
            let finalBrand = brandVal;
            
            if (brandVal === "Diger") {
                const manualVal = document.getElementById('manualBrandInput').value;
                finalBrand = manualVal ? "Diğer (" + manualVal + ")" : "Diğer (Belirtilmedi)";
            } else if (!brandVal) {
                finalBrand = "Belirtilmedi";
            }

            const markalar = {
                "Maktek": "0850 441 42 00",
                "Sanica": "0850 460 66 88",
                "Ariston": "444 92 31",
                "Hexel": "0850 346 29 29"
            };

            if (!phone.startsWith('0') || phone.length !== 11) {
                alert("Lütfen numaranızı başında '0' olacak şekilde 11 hane olarak giriniz.");
                return;
            }

            if (service === 'servis' && warranty === 'evet') {
                const numara = markalar[finalBrand] || "marka çağrı merkezini";
                alert(`Bilgi: ${finalBrand} yetkili servisiyiz ancak cihazınızın garantisi devam ettiği için lütfen önce ${numara} numarasından kayıt açtırmanız gerekmektedir. Kaydınız bize ulaştığında uzman ekibimiz sizi arayacaktır. Yıllık bakım yaptırmak için telefon ya da Whatsap üzerinden direkt irtibat kurabilirsiniz.`);
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
});
