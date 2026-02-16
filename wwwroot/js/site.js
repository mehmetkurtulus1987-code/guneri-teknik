// index sayfası
const modal = document.getElementById("kvkkModal");

        function openKvkk() {
            // showModal() metodu dialog etiketini en üst katmanda açar
            modal.showModal();
            document.body.style.overflow = "hidden";
        }

        function closeKvkk() {
            modal.close();
            document.body.style.overflow = "auto";
        }

        // Dialog dışına tıklandığında kapatma mantığı
        modal.addEventListener("click", (event) => {
            if (event.target === modal) {
                closeKvkk();
            }
        });
//yedekparca arama fonk.
// 1. KATEGORİ FİLTRELEME FONKSİYONU
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

        // 2. YAZARAK ARAMA FONKSİYONU
        function searchParts() {
            let input = document.getElementById('partSearch').value.toLocaleLowerCase('tr-TR');
            let items = document.getElementsByClassName('part-item');
            let categories = document.getElementsByClassName('part-category');

            // 1. Adım: Tüm parçaları tek tek kontrol et
            for (let i = 0; i < items.length; i++) {
                let title = items[i].getElementsByTagName('h3')[0].innerText.toLocaleLowerCase('tr-TR');
                let brands = items[i].getElementsByClassName('compatible-brands')[0].innerText.toLocaleLowerCase('tr-TR');

                if (title.includes(input) || brands.includes(input)) {
                    items[i].style.display = "block"; // Explicit (açıkça) göster
                } else {
                    items[i].style.display = "none"; // Gizle
                }
            }

            // 2. Adım: Kategorileri kontrol et
            for (let j = 0; j < categories.length; j++) {
                let categoryItems = categories[j].getElementsByClassName('part-item');
                let hasVisibleItem = false;

                // Kategori içindeki parçalardan en az biri görünür mü?
                for (let k = 0; k < categoryItems.length; k++) {
                    if (categoryItems[k].style.display === "block") {
                        hasVisibleItem = true;
                        break;
                    }
                }

                // Giriş boşsa her şeyi göster, arama varsa sadece dolu kategorileri göster
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
// 1. Servis seçildiğinde garanti alanını gösteren fonksiyon
        function toggleWarrantyField() {
            const service = document.getElementById('serviceSelect').value;
            const warrantyGroup = document.getElementById('warrantyGroup');

            // CSS üzerinden görünürlüğü kontrol ediyoruz
            if (service === 'servis') {
                warrantyGroup.style.display = 'block';
            } else {
                warrantyGroup.style.display = 'none';
            }
        }

        // 2. Form Kontrol ve Gönderim Mantığı
        document.getElementById('contactForm').addEventListener('submit', function (e) {
            const name = document.getElementById('nameInput').value;
            const phone = document.getElementById('phoneInput').value;
            const service = document.getElementById('serviceSelect').value;
            const warranty = document.getElementById('warrantySelect').value;
            const message = document.getElementById('messageInput').value;

            // Başında 0 kontrolü
            if (!phone.startsWith('0')) {
                alert("Lütfen numaranızı başında '0' olacak şekilde 11 hane olarak giriniz.");
                e.preventDefault();
                return;
            }

            // Garantili Ürün Filtreleme Mantığı
            if (service === 'servis' && warranty === 'evet') {
                e.preventDefault(); // Formun gitmesini engelle

                alert("Bilgi: Cihazınızın garantisi devam ettiği için lütfen ürününüzün markasına ait resmi çağrı merkezinden servis talebi oluşturun. Garantili işlemlerde Ana Merkez üzerinden kayıt açtırmanız gereklidir. Anlayışınız için teşekkürler.");

                // Arka plan ön bilgisi (Log)
                console.log("--- GARANTİLİ ÜRÜN BİLDİRİMİ ---");
                console.log(`Ad Soyad: ${name}`);
                console.log(`Tel. No: ${phone}`);
                console.log(`Mesaj: ${message}`);
                console.log("Durum: Garantili ürün servis talebi için çağrı merkezine yönlendirildi.");
                console.log("--------------------------------");
            } else {
                // Standart Talep Gönderimi
                alert("Talebiniz başarıyla alınmıştır. En kısa sürede sizinle iletişime geçeceğiz.");
            }
        });
        document.addEventListener('click', function(event) {
    var menuBar = document.getElementById('menu-bar');
    var nav = document.querySelector('header');

    if (menuBar && nav && !nav.contains(event.target) && menuBar.checked) {
        menuBar.checked = false;
    }
});
