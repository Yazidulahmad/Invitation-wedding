// Inisialisasi AOS
AOS.init({
    duration: 800,
    once: true,
    offset: 50,
    delay: 100
});

// Variabel global
let currentGuestName = '';
let database;
let commentsRef;

// Tunggu Firebase siap
function initializeFirebase() {
    return new Promise((resolve, reject) => {
        const checkFirebase = () => {
            if (window.firebaseDatabase && window.firebaseRef) {
                database = window.firebaseDatabase;
                commentsRef = window.firebaseRef(database, 'comments');
                resolve();
            } else {
                setTimeout(checkFirebase, 100);
            }
        };
        checkFirebase();
        
        // Timeout after 5 seconds
        setTimeout(() => {
            if (!database) {
                reject(new Error('Firebase initialization timeout'));
            }
        }, 5000);
    });
}

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
        showSuccessMessage('Gagal menyalin nomor rekening');
    });
}

// Cegah scroll ke cover
function preventCoverScroll() {
    $(window).off('scroll.coverPrevention');
    
    $(window).on('scroll.coverPrevention', function() {
        const coverSection = document.getElementById('cover');
        if (coverSection.classList.contains('hidden')) {
            const coverRect = coverSection.getBoundingClientRect();
            if (coverRect.top < 0 && coverRect.bottom > 0) {
                window.scrollTo(0, document.getElementById('pembuka').offsetTop);
            }
        }
    });
}

// Format tanggal untuk komentar
function formatCommentDate(timestamp) {
    const date = new Date(timestamp);
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('id-ID', options);
}

// Simpan komentar ke Firebase
function saveCommentToFirebase(comment) {
    return window.firebasePush(commentsRef, comment);
}

// Tampilkan komentar dari Firebase
function displayCommentsFromFirebase() {
    const commentsQuery = window.firebaseQuery(commentsRef, window.firebaseOrderByChild('timestamp'));
    const limitedQuery = window.firebaseQuery(commentsQuery, window.firebaseLimitToLast(50));
    
    window.firebaseOnValue(limitedQuery, (snapshot) => {
        const comments = [];
        snapshot.forEach((childSnapshot) => {
            const comment = childSnapshot.val();
            comment.id = childSnapshot.key;
            comments.push(comment);
        });
        
        // Urutkan dari yang terbaru
        comments.sort((a, b) => b.timestamp - a.timestamp);
        displayComments(comments);
    }, (error) => {
        console.error('Error loading comments:', error);
        $('#comments-container').html(`
            <div class="comment-item">
                <p style="text-align: center; color: #777; font-style: italic;">
                    Gagal memuat ucapan. Silakan refresh halaman.
                </p>
            </div>
        `);
    });
}

// Tampilkan komentar di UI
function displayComments(comments) {
    const commentsContainer = $('#comments-container');
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
    
    comments.forEach(function(comment, index) {
        const commentHtml = `
            <div class="comment-item" data-aos="fade-up" data-aos-delay="${index * 100}">
                <div class="comment-header">
                    <span class="comment-name">${comment.name}</span>
                    <span class="comment-date">${formatCommentDate(comment.timestamp)}</span>
                </div>
                <p>${comment.message}</p>
            </div>
        `;
        commentsContainer.append(commentHtml);
    });
}

// Fungsi untuk membuat SVG frame
function createSVGFrame(sectionId) {
    const svgNS = "http://www.w3.org/2000/svg";
    const svgElement = document.getElementById(`${sectionId}-svg-layer`);
    
    if (!svgElement) return;
    
    // Kosongkan SVG sebelumnya
    while (svgElement.firstChild) {
        svgElement.removeChild(svgElement.firstChild);
    }
    
    // Buat pattern bunga/ornamen untuk background
    const defs = document.createElementNS(svgNS, "defs");
    
    // Pattern untuk background
    const pattern = document.createElementNS(svgNS, "pattern");
    pattern.setAttribute("id", `pattern-${sectionId}`);
    pattern.setAttribute("patternUnits", "userSpaceOnUse");
    pattern.setAttribute("width", "100");
    pattern.setAttribute("height", "100");
    
    // Grup untuk pattern
    const g = document.createElementNS(svgNS, "g");
    g.setAttribute("fill", "none");
    g.setAttribute("stroke", "#d4af37");
    g.setAttribute("stroke-width", "1");
    g.setAttribute("opacity", "0.3");
    
    // Buat desain pattern berdasarkan section
    let patternContent = '';
    
    switch(sectionId) {
        case 'cover':
            patternContent = `
                <path d="M20,50 Q50,20 80,50 T140,50" />
                <circle cx="50" cy="50" r="10" fill="#d4af37" opacity="0.2"/>
                <circle cx="90" cy="50" r="8" fill="#d4af37" opacity="0.2"/>
            `;
            break;
        case 'pembuka':
            patternContent = `
                <path d="M30,30 L70,70 M70,30 L30,70" />
                <circle cx="50" cy="50" r="20" />
                <path d="M20,50 Q50,80 80,50" />
            `;
            break;
        case 'pengantin':
            patternContent = `
                <path d="M30,50 Q50,30 70,50 Q50,70 30,50 Z" />
                <path d="M40,40 L60,60 M60,40 L40,60" />
                <circle cx="30" cy="70" r="5" />
                <circle cx="70" cy="70" r="5" />
            `;
            break;
        case 'acara':
            patternContent = `
                <rect x="30" y="30" width="40" height="40" rx="5"/>
                <circle cx="50" cy="50" r="15"/>
                <path d="M50,35 L50,65 M35,50 L65,50"/>
                <path d="M20,20 Q50,10 80,20" opacity="0.5"/>
            `;
            break;
        case 'penutup':
            patternContent = `
                <path d="M20,50 Q50,20 80,50 T140,50" opacity="0.5"/>
                <path d="M50,20 Q80,50 50,80 T20,50" opacity="0.5"/>
                <circle cx="50" cy="50" r="25" fill="none"/>
                <path d="M35,35 L65,65 M65,35 L35,65"/>
            `;
            break;
        case 'amplop':
            patternContent = `
                <rect x="25" y="25" width="50" height="50" rx="3"/>
                <path d="M25,25 L50,10 L75,25" />
                <circle cx="50" cy="40" r="8"/>
                <path d="M35,60 L65,60" />
            `;
            break;
        case 'ucapan':
            patternContent = `
                <path d="M30,40 Q50,20 70,40 T110,40" />
                <path d="M40,60 Q50,70 60,60" />
                <circle cx="50" cy="50" r="15" fill="none"/>
                <path d="M35,45 L45,55 M55,45 L65,55" />
            `;
            break;
        default:
            patternContent = `
                <circle cx="50" cy="50" r="20" fill="none"/>
                <path d="M30,30 L70,70 M70,30 L30,70"/>
            `;
    }
    
    g.innerHTML = patternContent;
    pattern.appendChild(g);
    defs.appendChild(pattern);
    
    // Buat frame utama
    const frame = document.createElementNS(svgNS, "g");
    
    // Tambahkan pattern background
    const bgRect = document.createElementNS(svgNS, "rect");
    bgRect.setAttribute("x", "0");
    bgRect.setAttribute("y", "0");
    bgRect.setAttribute("width", "100%");
    bgRect.setAttribute("height", "100%");
    bgRect.setAttribute("fill", `url(#pattern-${sectionId})`);
    bgRect.setAttribute("opacity", "0.1");
    
    // Tambahkan border dekoratif
    const borderPaths = [
        `M5,5 Q10,0 15,5 T25,5`,
        `M${window.innerWidth-5},5 Q${window.innerWidth},10 ${window.innerWidth-5},15`,
        `M5,${window.innerHeight-5} Q0,${window.innerHeight-10} 5,${window.innerHeight-15}`,
        `M${window.innerWidth-5},${window.innerHeight-5} Q${window.innerWidth},${window.innerHeight-10} ${window.innerWidth-5},${window.innerHeight-15}`
    ];
    
    frame.appendChild(bgRect);
    
    // Tambahkan border corners
    const cornerSize = 30;
    const corners = [
        {x: 0, y: 0, transform: ''},
        {x: '100%', y: 0, transform: 'rotate(90)'},
        {x: 0, y: '100%', transform: 'rotate(-90)'},
        {x: '100%', y: '100%', transform: 'rotate(180)'}
    ];
    
    corners.forEach(corner => {
        const cornerGroup = document.createElementNS(svgNS, "g");
        cornerGroup.setAttribute("transform", `translate(${corner.x}, ${corner.y}) ${corner.transform}`);
        
        const cornerPath = document.createElementNS(svgNS, "path");
        cornerPath.setAttribute("d", "M0,0 L20,0 Q30,0 30,10 L30,30");
        cornerPath.setAttribute("stroke", "#d4af37");
        cornerPath.setAttribute("stroke-width", "2");
        cornerPath.setAttribute("fill", "none");
        cornerPath.setAttribute("opacity", "0.5");
        
        cornerGroup.appendChild(cornerPath);
        frame.appendChild(cornerGroup);
    });
    
    // Tambahkan elemen dekoratif floating
    for (let i = 0; i < 5; i++) {
        const size = Math.random() * 20 + 10;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const opacity = Math.random() * 0.3 + 0.1;
        
        const decor = document.createElementNS(svgNS, "circle");
        decor.setAttribute("cx", `${x}%`);
        decor.setAttribute("cy", `${y}%`);
        decor.setAttribute("r", size);
        decor.setAttribute("fill", "none");
        decor.setAttribute("stroke", "#d4af37");
        decor.setAttribute("stroke-width", "1");
        decor.setAttribute("opacity", opacity);
        
        frame.appendChild(decor);
    }
    
    svgElement.appendChild(defs);
    svgElement.appendChild(frame);
}

// Fungsi untuk mengatur background SVG
function setSVGBackground(sectionId) {
    const bgElement = document.getElementById(`${sectionId}-svg-bg`);
    if (!bgElement) return;
    
    // Gunakan gradient background berdasarkan section
    let gradient = '';
    
    switch(sectionId) {
        case 'cover':
            gradient = 'linear-gradient(135deg, rgba(0,0,0,0.3), rgba(139,115,85,0.2))';
            break;
        case 'pembuka':
            gradient = 'linear-gradient(45deg, rgba(212,175,55,0.05), rgba(248,244,233,0.1))';
            break;
        case 'pengantin':
            gradient = 'linear-gradient(135deg, rgba(212,175,55,0.03), rgba(193,154,107,0.05))';
            break;
        case 'acara':
            gradient = 'linear-gradient(45deg, rgba(139,115,85,0.03), rgba(212,175,55,0.05))';
            break;
        case 'penutup':
            gradient = 'linear-gradient(135deg, rgba(248,244,233,0.1), rgba(212,175,55,0.03))';
            break;
        case 'amplop':
            gradient = 'linear-gradient(45deg, rgba(193,154,107,0.03), rgba(139,115,85,0.05))';
            break;
        case 'ucapan':
            gradient = 'linear-gradient(135deg, rgba(212,175,55,0.03), rgba(248,244,233,0.1))';
            break;
        default:
            gradient = 'linear-gradient(45deg, rgba(212,175,55,0.02), rgba(193,154,107,0.03))';
    }
    
    bgElement.style.background = gradient;
}

// Fungsi untuk menginisialisasi semua SVG
function initializeAllSVGs() {
    const sections = ['cover', 'pembuka', 'pengantin', 'acara', 'penutup', 'amplop', 'ucapan'];
    
    sections.forEach(sectionId => {
        createSVGFrame(sectionId);
        setSVGBackground(sectionId);
    });
    
    // Atur interval untuk animasi SVG
    setInterval(() => {
        animateSVGElements();
    }, 3000);
}

// Fungsi untuk animasi elemen SVG
function animateSVGElements() {
    const svgLayers = document.querySelectorAll('.svg-layer');
    
    svgLayers.forEach((svg, index) => {
        const circles = svg.querySelectorAll('circle');
        const paths = svg.querySelectorAll('path');
        
        // Animasikan circles
        circles.forEach((circle, i) => {
            const currentR = parseFloat(circle.getAttribute('r'));
            const newR = currentR + (Math.random() * 2 - 1);
            const currentOpacity = parseFloat(circle.getAttribute('opacity') || '0.2');
            const newOpacity = Math.max(0.1, Math.min(0.4, currentOpacity + (Math.random() * 0.1 - 0.05)));
            
            circle.style.transition = 'all 2s ease';
            circle.setAttribute('r', Math.max(5, Math.min(30, newR)));
            circle.setAttribute('opacity', newOpacity);
        });
        
        // Animasikan paths
        paths.forEach((path, i) => {
            const currentOpacity = parseFloat(path.getAttribute('opacity') || '0.3');
            const newOpacity = Math.max(0.2, Math.min(0.5, currentOpacity + (Math.random() * 0.1 - 0.05)));
            
            path.style.transition = 'opacity 2s ease';
            path.setAttribute('opacity', newOpacity);
        });
    });
}

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
    
    // Update AOS delay berdasarkan waktu countdown
    updateAOSDelays(distance);
}

// Update AOS delays berdasarkan countdown
function updateAOSDelays(distance) {
    const timeFactor = Math.max(0, Math.min(1, distance / (1000 * 60 * 60 * 24 * 30))); // 30 hari maksimal
    
    // Sesuaikan delay berdasarkan waktu menuju acara
    const baseDelay = 100;
    const additionalDelay = Math.floor((1 - timeFactor) * 200); // Maksimal 200ms tambahan
    
    // Update semua elemen dengan data-aos
    document.querySelectorAll('[data-aos]').forEach(el => {
        const currentDelay = parseInt(el.getAttribute('data-aos-delay') || '0');
        if (currentDelay > 0) {
            el.setAttribute('data-aos-delay', currentDelay + additionalDelay);
        }
    });
}

// Set nama tamu dari URL
$(document).ready(function() {
    // Initialize Firebase first
    initializeFirebase().then(() => {
        console.log('Firebase initialized successfully');
        
        // Set nama tamu
        currentGuestName = getUrlParameter('to');
        if (currentGuestName) {
            $('#guest-name').text('Kepada Yth. ' + currentGuestName);
        }
        
        // Tampilkan komentar
        displayCommentsFromFirebase();
        
    }).catch(error => {
        console.error('Firebase initialization failed:', error);
        $('#comments-container').html(`
            <div class="comment-item">
                <p style="text-align: center; color: #777; font-style: italic;">
                    Mode offline. Ucapan tidak dapat dimuat.
                </p>
            </div>
        `);
    });
    
    // Inisialisasi SVG
    initializeAllSVGs();
    
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
        // Sembunyikan cover section
        $('#cover').addClass('hidden');
        
        // Scroll ke section pembuka
        $('html, body').animate({
            scrollTop: $('#pembuka').offset().top
        }, 1000);
        
        // Sembunyikan nama tamu setelah membuka undangan
        $('#guest-name').fadeOut(500);
        
        // Tampilkan bottom navigation setelah membuka undangan
        setTimeout(() => {
            $('#bottom-nav').fadeIn(300);
        }, 1000);
        
        // Aktifkan pencegahan scroll ke cover
        preventCoverScroll();
        
        // Set status bahwa undangan sudah dibuka
        sessionStorage.setItem('undanganDibuka', 'true');
        
        // Trigger resize untuk update SVG
        setTimeout(() => {
            initializeAllSVGs();
        }, 500);
    });
    
    // Cek jika undangan sudah dibuka sebelumnya
    if (sessionStorage.getItem('undanganDibuka') === 'true') {
        $('#cover').addClass('hidden');
        $('#bottom-nav').show();
        preventCoverScroll();
    }
    
    // Bottom Navigation
    $('.nav-tab').click(function(e) {
        e.preventDefault();
        var target = $(this).attr('href');
        
        // Cegah navigasi ke cover jika sudah dibuka
        if (target === '#cover' && sessionStorage.getItem('undanganDibuka') === 'true') {
            return;
        }
        
        $('html, body').animate({
            scrollTop: $(target).offset().top
        }, 500);
        
        // Update active tab
        $('.nav-tab').removeClass('active');
        $(this).addClass('active');
        
        // Animasi SVG saat berpindah section
        setTimeout(() => {
            const sectionId = target.replace('#', '');
            createSVGFrame(sectionId);
        }, 300);
    });
    
    // Update countdown setiap detik
    setInterval(updateCountdown, 1000);
    updateCountdown();
    
    // Simpan ke kalender untuk semua acara
    $('#save-all-events').click(function() {
        var startDateAkad = '20251221T090000';
        var endDateAkad = '20251221T100000';
        var startDateResepsi = '20251221T110000';
        var endDateResepsi = '20251221T140000';
        var title = 'Pernikahan Hartini & Ahmad Yazidul Jihad';
        var location = 'Kediaman Mempelai Wanita & Gedung Serba Guna';
        var details = 'Akad Nikah: 09:00 WIB\nResepsi: 11:00-14:00 WIB\n\nAcara pernikahan Hartini & Ahmad Yazidul Jihad';
        
        var googleCalendarUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + 
            encodeURIComponent(title) + '&dates=' + startDateAkad + '/' + endDateResepsi + 
            '&details=' + encodeURIComponent(details) + '&location=' + encodeURIComponent(location);
        
        window.open(googleCalendarUrl, '_blank');
        showSuccessMessage('Semua acara ditambahkan ke kalender');
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
    
    // Kirim ucapan
    $('#submit-comment').click(function() {
        var message = $('#comment-message').val().trim();
        
        if (!message) {
            showSuccessMessage('Harap isi pesan Anda');
            return;
        }
        
        if (message.length < 3) {
            showSuccessMessage('Pesan terlalu pendek');
            return;
        }
        
        // Gunakan nama tamu dari URL, atau default jika tidak ada
        var name = currentGuestName || 'Tamu Undangan';
        
        // Simpan komentar
        var comment = {
            name: name,
            message: message,
            timestamp: Date.now()
        };
        
        // Simpan ke Firebase
        saveCommentToFirebase(comment)
            .then(() => {
                // Reset form
                $('#comment-message').val('');
                
                // Tampilkan pesan sukses
                showSuccessMessage('Ucapan Anda telah terkirim');
                
                // Animasi pada form
                $('.comment-form').css({
                    'transform': 'scale(0.95)'
                }).animate({
                    'transform': 'scale(1)'
                }, 300);
            })
            .catch((error) => {
                console.error('Error saving comment:', error);
                showSuccessMessage('Gagal mengirim ucapan. Coba lagi.');
            });
    });
    
    // Deteksi scroll untuk mengaktifkan navigasi
    $(window).scroll(function() {
        var scrollPosition = $(window).scrollTop();
        var windowHeight = $(window).height();
        
        // Sembunyikan bottom nav di cover section (hanya jika cover belum dibuka)
        if (scrollPosition < windowHeight * 0.8 && !sessionStorage.getItem('undanganDibuka')) {
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
                
                // Animasi SVG saat scroll
                const svgLayer = document.getElementById(`${sectionId}-svg-layer`);
                if (svgLayer) {
                    const scrollPercent = (scrollPosition - sectionTop) / (sectionBottom - sectionTop);
                    svgLayer.style.opacity = 0.1 + (scrollPercent * 0.1);
                }
            }
        });
    });
    
    // Sembunyikan bottom nav di awal (saat di cover dan belum dibuka)
    if (!sessionStorage.getItem('undanganDibuka')) {
        $('#bottom-nav').hide();
    }
    
    // Handle resize untuk SVG
    let resizeTimeout;
    $(window).resize(function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            initializeAllSVGs();
        }, 250);
    });
    
    // Inisialisasi AOS dengan delay yang disesuaikan
    setTimeout(() => {
        AOS.refresh();
    }, 1000);
});
