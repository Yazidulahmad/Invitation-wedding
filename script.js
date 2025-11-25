// Inisialisasi AOS
AOS.init({
    duration: 800,
    once: true,
    offset: 50
});

// Inisialisasi Lightbox
lightbox.option({
    'resizeDuration': 200,
    'wrapAround': true,
    'imageFadeDuration': 300,
    'positionFromTop': 50
});

// Firebase Configuration (Ganti dengan config Anda nanti)
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-project.firebaseapp.com",
    databaseURL: "https://your-project.firebaseio.com",
    projectId: "your-project",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id"
};

// Initialize Firebase (akan di-uncomment ketika sudah siap)
// firebase.initializeApp(firebaseConfig);

// Fungsi untuk mengambil parameter dari URL
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Tampilkan pesan sukses
function showSuccessMessage(message) {
    const successEl = document.getElementById('success-message');
    const successText = document.getElementById('success-text');
    
    successText.textContent = message;
    successEl.classList.add('show');
    
    setTimeout(() => {
        successEl.classList.remove('show');
    }, 3000);
}

// Salin teks ke clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showSuccessMessage('Nomor rekening berhasil disalin');
    }).catch(err => {
        console.error('Gagal menyalin teks: ', err);
    });
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
        
        // Tampilkan bottom navigation setelah membuka undangan
        setTimeout(() => {
            $('#bottom-nav').fadeIn(300);
        }, 1000);
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
    
    // Simpan ke kalender - TANPA KONFIRMASI
    $('#save-akad').click(function() {
        var startDate = '20251221T090000';
        var endDate = '20251221T100000';
        var title = 'Akad Nikah Hartini & Ahmad Yazidul Jihad';
        var location = 'Kediaman Mempelai Wanita';
        var details = 'Akad Nikah Hartini & Ahmad Yazidul Jihad';
        
        var googleCalendarUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + 
            encodeURIComponent(title) + '&dates=' + startDate + '/' + endDate + 
            '&details=' + encodeURIComponent(details) + '&location=' + encodeURIComponent(location);
        
        window.open(googleCalendarUrl, '_blank');
        showSuccessMessage('Acara akad nikah ditambahkan ke kalender');
    });
    
    $('#save-resepsi').click(function() {
        var startDate = '20251221T110000';
        var endDate = '20251221T140000';
        var title = 'Resepsi Pernikahan Hartini & Ahmad Yazidul Jihad';
        var location = 'Gedung Serba Guna';
        var details = 'Resepsi Pernikahan Hartini & Ahmad Yazidul Jihad';
        
        var googleCalendarUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + 
            encodeURIComponent(title) + '&dates=' + startDate + '/' + endDate + 
            '&details=' + encodeURIComponent(details) + '&location=' + encodeURIComponent(location);
        
        window.open(googleCalendarUrl, '_blank');
        showSuccessMessage('Acara resepsi ditambahkan ke kalender');
    });
    
    // Buka Google Maps
    $('#open-map').click(function() {
        window.open('https://maps.app.goo.gl/PzdmwVSJc67DmowM7?g_st=ipc', '_blank');
        showSuccessMessage('Membuka lokasi di Google Maps');
    });
    
    // Salin nomor rekening
    $('.btn-copy').click(function() {
        var accountNumber = $(this).data('account');
        copyToClipboard(accountNumber);
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
        
        if (comments.length === 0) {
            commentsContainer.html(`
                <div class="comment-item" data-aos="fade-up">
                    <p style="text-align: center; color: #777; font-style: italic;">
                        Belum ada ucapan. Jadilah yang pertama mengucapkan selamat!
                    </p>
                </div>
            `);
            return;
        }
        
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
            showSuccessMessage('Harap isi nama dan pesan Anda');
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
        
        // Tampilkan pesan sukses
        showSuccessMessage('Ucapan Anda telah terkirim');
    });
    
    // Deteksi scroll untuk mengaktifkan navigasi
    $(window).scroll(function() {
        var scrollPosition = $(window).scrollTop();
        var windowHeight = $(window).height();
        
        // Sembunyikan bottom nav di cover section
        if (scrollPosition < windowHeight * 0.8) {
            $('#bottom-nav').fadeOut(300);
        } else {
            $('#bottom-nav').fadeIn(300);
        }
        
        $('.section').each(function() {
            var sectionId = $(this).attr('id');
            var sectionTop = $(this).offset().top - 100;
            var sectionBottom = sectionTop + $(this).outerHeight();
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom && sectionId !== 'cover') {
                $('.nav-tab').removeClass('active');
                $(`.nav-tab[href="#${sectionId}"]`).addClass('active');
            }
        });
    });
    
    // Tampilkan komentar saat halaman dimuat
    displayComments();
    
    // Sembunyikan bottom nav di awal (saat di cover)
    $('#bottom-nav').hide();
});
