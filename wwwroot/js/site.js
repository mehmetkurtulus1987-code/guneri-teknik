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
function filterCategory(category) {
    let buttons = document.getElementsByClassName('filter-btn');
    for (let btn of buttons) {
        btn.classList.remove('active');
    }
    event.currentTarget.classList.add('active');

    let items = document.getElementsByClassName('part-item');
    for (let i = 0; i < items.length; i++) {
        let itemCategory = items[i].getAttribute('data-category');
        if (category === 'all' || itemCategory === category) {
            items[i].style.display = "";
            items[i].style.animation = "fadeIn 0.4s ease";
        } else {
            items[i].style.display = "none";
        }
    }
}

function searchParts() {
    let input = document.getElementById('partSearch').value.toLocaleLowerCase('tr-TR');
    let items = document.getElementsByClassName('part-item');
    let categories = document.getElementsByClassName('part-category');

    for (let i = 0; i < items.length; i++) {
        let title = items[i].getElementsByTagName('h3')[0].innerText.toLocaleLowerCase('tr-TR');
        let brands = items[i].getElementsByClassName('compatible-brands')[0].innerText.toLocaleLowerCase('tr-TR');

        if (title.includes(input) || brands.includes(input)) {
            items[i].style.display = "block";
        } else {
            items[i].style.display = "none";
        }
    }

    for (let j = 0; j < categories.length; j++) {
        let categoryItems = categories[j].getElementsByClassName('part-item');
        let hasVisibleItem = false;

        for (let k = 0; k < categoryItems.length; k++) {
            if (categoryItems[k].style.display === "block") {
                hasVisibleItem = true;
                break;
            }
        }

        if (input === "") {
            categories[j].style.display = "block";
        } else if (hasVisibleItem) {
            categories[j].style.display = "block";
        } else {
            categories[j].style.display = "none";
        }
    }
}

// İLETİŞİM SAYFASI
// 1. Servis seçildiğinde garanti ve marka alanlarını gösteren fonksiyon
function toggleFields() {
    const service = document.getElementById('serviceSelect').value;
    const warranty = document.getElementById('warrantySelect').value;
    const brand = document.getElementById('brandSelect').value;
    
    const warrantyGroup = document.getElementById('warrantyGroup');
    const brandGroup = document.getElementById('brandGroup');
    const warrantyAlert = document.getElementById('warrantyAlert');
    const submitBtn = document.getElementById('submitBtn');

    const markalar = {
        "Maktek": "444 44 44",
        "Sanica": "0850 111 22 33",
        "Ariston": "444 1 588",
        "Hexel": "0850 444 55 66"
    };

    if (service === 'servis') {
        warrantyGroup.style.display = 'block';
        brandGroup.style.display = 'block';
        
        // Garanti "Evet" ise ve marka seçilmişse uyarını göster, butonu gizle
        if (warranty === 'evet' && brand !== "") {
            const numara = markalar[brand] || "Marka Merkezi";
            document.getElementById('alertMessage').innerHTML = `<b>${brand}</b> yetkili servisiyiz ancak yasal garanti süreci gereği önce çağrı merkezinden kayıt açtırmanız gerekmektedir. Kaydınız bize ulaştığında uzman ekibimiz sizi arayacaktır.`;
            document.getElementById('callCenterBtn').href = "tel:" + numara.replace(/\s/g, '');
            
            warrantyAlert.style.display = 'block';
            submitBtn.style.display = 'none';
        } else {
            warrantyAlert.style.display = 'none';
            submitBtn.style.display = 'block';
        }
    } else {
        warrantyGroup.style.display = 'none';
        brandGroup.style.display = 'none';
        warrantyAlert.style.display = 'none';
        submitBtn.style.display = 'block';
    }
}

// Seçimler değiştikçe fonksiyonu tetikleyen dinleyicileri eklemeyi unutma
document.getElementById('warrantySelect').addEventListener('change', toggleFields);
document.getElementById('brandSelect').addEventListener('change', toggleFields);

// 2. Form Kontrol ve Gönderim Mantığı
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = document.getElementById('nameInput').value;
        const phone = document.getElementById('phoneInput').value;
        const service = document.getElementById('serviceSelect').value;
        const warranty = document.getElementById('warrantySelect').value;
        const brand = document.getElementById('brandSelect') ? document.getElementById('brandSelect').value : "Belirtilmedi";
        const message = document.getElementById('messageInput').value;

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
            const numara = markalar[brand] || "marka çağrı merkezini";
            alert(`Bilgi: ${brand} yetkili servisiyiz ancak cihazınızın garantisi devam ettiği için lütfen önce ${numara} numarasından kayıt açtırmanız gerekmektedir. Kaydınız bize ulaştığında uzman ekibimiz sizi arayacaktır. Yıllık bakım yaptırmak için telefon ya da Whatsap üzerinden direkt irtibat kurabilirsiniz.`);
            return;
        }

        const whatsappNo = "905060357883";
        const metin = `*Güneri Teknik Web Talebi*%0A` +
                      `*Müşteri:* ${name}%0A` +
                      `*Tel:* ${phone}%0A` +
                      `*Cihaz/Marka:* ${brand}%0A` +
                      `*Hizmet:* ${service}%0A` +
                      `*Mesaj:* ${message}`;

        alert("Talebiniz başarıyla alınmıştır. Detayları iletmek üzere WhatsApp'a yönlendiriliyorsunuz.");
        window.open(`https://wa.me/${whatsappNo}?text=${metin}`, '_blank');
    });
}
