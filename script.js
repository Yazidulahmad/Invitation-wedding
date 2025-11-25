// Inisialisasi AOS
AOS.init({
    duration: 1000,
    once: true
});

// Inisialisasi Lightbox
lightbox.option({
    'resizeDuration': 200,
    'wrapAround': true,
    'imageFadeDuration': 300
});

// Fungsi untuk mengambil parameter dari URL
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Set nama tamu dari URL
$(document).ready(function() {
    var guestName = getUrlParameter('to');
    if (guestName) {
        $('#guest-name').text('Kepada Yth. ' + guestName);
    }
    
    // Musik otomatis
    var audio = document.getElementById('wedding-music');
    var musicIcon = document.getElementById('music-icon');
    var musicToggle = document.getElementById('music-toggle');
    
    // Fungsi untuk memutar musik
    function playMusic() {
        audio.play().then(function() {
            musicIcon.classList.remove('fa-play');
            musicIcon.classList.add('fa-pause');
        }).catch(function(error) {
            console.log('Autoplay prevented:', error);
        });
    }
    
    // Coba putar musik saat halaman dimuat
    playMusic();
    
    // Toggle musik
    musicToggle.addEventListener('click', function() {
        if (audio.paused) {
            audio.play();
            musicIcon.classList.remove('fa-play');
            musicIcon.classList.add('fa-pause');
        } else {
            audio.pause();
            musicIcon.classList.remove('fa-pause');
            musicIcon.classList.add('fa-play');
        }
    });
    
    // Tombol buka undangan
    $('#open-invitation').click(function() {
        $('html, body').animate({
            scrollTop: $('#pembuka').offset().top
        }, 1000);
    });
    
    // Navigasi
    $('#nav-toggle').click(function() {
        $('#nav-menu').toggleClass('active');
    });
    
    // Tutup menu navigasi saat item diklik
    $('.nav-item').click(function() {
        $('#nav-menu').removeClass('active');
    });
    
    // Hitung mundur
    function updateCountdown() {
        var weddingDate = new Date('December 21, 2025 09:00:00').getTime();
        var now = new Date().getTime();
        var distance = weddingDate - now;
        
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        $('#days').text(days.toString().padStart(2, '0'));
        $('#hours').text(hours.toString().padStart(2, '0'));
        $('#minutes').text(minutes.toString().padStart(2, '0'));
        $('#seconds').text(seconds.toString().padStart(2, '0'));
    }
    
    setInterval(updateCountdown, 1000);
    updateCountdown();
    
    // Simpan ke kalender
    $('#save-akad').click(function() {
        Swal.fire({
            title: 'Simpan Acara Akad Nikah',
            text: 'Apakah Anda ingin menyimpan acara ini ke kalender?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, Simpan',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                // Kode untuk menyimpan ke Google Calendar
                var startDate = '20251221T090000';
                var endDate = '20251221T100000';
                var title = 'Akad Nikah Hartini & Ahmad Yazidul Jihad';
                var location = 'Kediaman Mempelai Wanita';
                var details = 'Akad Nikah Hartini & Ahmad Yazidul Jihad';
                
                var googleCalendarUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + 
                    encodeURIComponent(title) + '&dates=' + startDate + '/' + endDate + 
                    '&details=' + encodeURIComponent(details) + '&location=' + encodeURIComponent(location);
                
                window.open(googleCalendarUrl, '_blank');
            }
        });
    });
    
    $('#save-resepsi').click(function() {
        Swal.fire({
            title: 'Simpan Acara Resepsi',
            text: 'Apakah Anda ingin menyimpan acara ini ke kalender?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, Simpan',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                // Kode untuk menyimpan ke Google Calendar
                var startDate = '20251221T110000';
                var endDate = '20251221T140000';
                var title = 'Resepsi Pernikahan Hartini & Ahmad Yazidul Jihad';
                var location = 'Gedung Serba Guna';
                var details = 'Resepsi Pernikahan Hartini & Ahmad Yazidul Jihad';
                
                var googleCalendarUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + 
                    encodeURIComponent(title) + '&dates=' + startDate + '/' + endDate + 
                    '&details=' + encodeURIComponent(details) + '&location=' + encodeURIComponent(location);
                
                window.open(googleCalendarUrl, '_blank');
            }
        });
    });
    
    // Buka Google Maps
    $('#open-map').click(function() {
        window.open('https://maps.app.goo.gl/PzdmwVSJc67DmowM7?g_st=ipc', '_blank');
    });
    
    // Inisialisasi peta (placeholder)
    function initMap() {
        // Karena API key diperlukan, kita akan menggunakan placeholder
        // Dalam implementasi nyata, ganti YOUR_API_KEY dengan API key Google Maps Anda
        var mapOptions = {
            center: { lat: -6.2088, lng: 106.8456 }, // Koordinat Jakarta
            zoom: 15
        };
        var map = new google.maps.Map(document.getElementById('map'), mapOptions);
        
        var marker = new google.maps.Marker({
            position: { lat: -6.2088, lng: 106.8456 },
            map: map,
            title: 'Lokasi Resepsi'
        });
    }
    
    // Kirim ucapan
    $('#submit-comment').click(function() {
        var name = $('#comment-name').val();
        var message = $('#comment-message').val();
        
        if (!name || !message) {
            Swal.fire({
                title: 'Perhatian',
                text: 'Harap isi nama dan pesan Anda',
                icon: 'warning',
                confirmButtonText: 'Baik'
            });
            return;
        }
        
        // Simpan komentar (dalam implementasi nyata, kirim ke server)
        var comment = {
            name: name,
            message: message,
            date: new Date().toLocaleDateString('id-ID')
        };
        
        // Tambahkan komentar ke daftar
        var commentHtml = `
            <div class="comment-item" data-aos="fade-up">
                <div class="comment-header">
                    <span class="comment-name">${comment.name}</span>
                    <span class="comment-date">${comment.date}</span>
                </div>
                <p>${comment.message}</p>
            </div>
        `;
        
        $('#comments-container').prepend(commentHtml);
        
        // Reset form
        $('#comment-name').val('');
        $('#comment-message').val('');
        
        Swal.fire({
            title: 'Terima Kasih',
            text: 'Ucapan Anda telah terkirim',
            icon: 'success',
            confirmButtonText: 'Baik'
        });
    });
    
    // Smooth scroll untuk navigasi
    $('a[href*="#"]').on('click', function(e) {
        e.preventDefault();
        
        $('html, body').animate({
            scrollTop: $($(this).attr('href')).offset().top
        }, 500, 'linear');
    });
});
