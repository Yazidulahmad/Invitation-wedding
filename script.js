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

// Firebase Configuration (Ganti dengan config Anda)
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-project.firebaseapp.com",
    databaseURL: "https://your-project.firebaseio.com",
    projectId: "your-project",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id"
};

// Initialize Firebase (jika menggunakan Firebase)
// firebase.initializeApp(firebaseConfig);

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
        
        // Sembunyikan nama tamu setelah membuka undangan
        $('#guest-name').fadeOut(500);
    });
    
    // Bottom Navigation
    $('.nav-tab').click(function(e) {
        e.preventDefault();
        var target = $(this).attr('href');
        
        $('html, body').animate({
            scrollTop: $(target).offset().top
        }, 500);
        
        // Update active tab
        $('.nav-tab').removeClass('active');
        $(this).addClass('active');
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
    
    // Simpan komentar ke localStorage (sementara, ganti dengan Firebase nanti)
    function saveCommentToStorage(comment) {
        var comments = JSON.parse(localStorage.getItem('weddingComments')) || [];
        comments.unshift(comment);
        localStorage.setItem('weddingComments', JSON.stringify(comments));
        return comments;
    }
    
    // Ambil komentar dari localStorage
    function getCommentsFromStorage() {
        return JSON.parse(localStorage.getItem('weddingComments')) || [];
    }
    
    // Tampilkan komentar
    function displayComments() {
        var comments = getCommentsFromStorage();
        var commentsContainer = $('#comments-container');
        commentsContainer.empty();
        
        comments.forEach(function(comment) {
            var commentHtml = `
                <div class="comment-item" data-aos="fade-up">
                    <div class="comment-header">
                        <span class="comment-name">${comment.name}</span>
                        <span class="comment-date">${comment.date}</span>
                    </div>
                    <p>${comment.message}</p>
                </div>
            `;
            commentsContainer.append(commentHtml);
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
        
        // Simpan komentar
        var comment = {
            name: name,
            message: message,
            date: new Date().toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        };
        
        // Simpan ke localStorage (sementara)
        saveCommentToStorage(comment);
        
        // Tampilkan komentar
        displayComments();
        
        // Reset form
        $('#comment-name').val('');
        $('#comment-message').val('');
        
        // Tampilkan pesan sukses tanpa popup
        var successHtml = `
            <div class="success-message show">
                <i class="fas fa-check-circle"></i> Ucapan Anda telah terkirim
            </div>
        `;
        $('.comment-form').after(successHtml);
        
        // Sembunyikan pesan setelah 3 detik
        setTimeout(function() {
            $('.success-message').remove();
        }, 3000);
    });
    
    // Deteksi scroll untuk mengaktifkan navigasi
    $(window).scroll(function() {
        var scrollPosition = $(window).scrollTop();
        
        $('.section').each(function() {
            var sectionId = $(this).attr('id');
            var sectionTop = $(this).offset().top - 100;
            var sectionBottom = sectionTop + $(this).outerHeight();
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                $('.nav-tab').removeClass('active');
                $('.nav-tab[href="#' + sectionId + '"]').addClass('active');
            }
        });
    });
    
    // Inisialisasi komentar contoh jika belum ada
    if (getCommentsFromStorage().length === 0) {
        var sampleComments = [
            {
                name: "Keluarga Supriyadi",
                message: "Semoga pernikahan kalian diberkahi Allah SWT dan menjadi keluarga yang sakinah, mawaddah, wa rahmah.",
                date: "15 November 2025, 10:30"
            },
            {
                name: "Sahabat Hartini",
                message: "Selamat menempuh hidup baru! Semoga kalian selalu bahagia dan kompak selamanya.",
                date: "14 November 2025, 16:45"
            }
        ];
        
        sampleComments.forEach(function(comment) {
            saveCommentToStorage(comment);
        });
    }
    
    // Tampilkan komentar saat halaman dimuat
    displayComments();
    
    // Fungsi untuk integrasi Firebase (akan digunakan nanti)
    function initializeFirebase() {
        // Kode inisialisasi Firebase akan ditambahkan di sini
        // ketika Anda sudah membuat project Firebase
        console.log('Firebase akan diinisialisasi di sini');
    }
    
    // Panggil fungsi inisialisasi Firebase
    // initializeFirebase();
});
