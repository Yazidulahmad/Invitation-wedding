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
    
    comments.forEach(function(comment) {
        const commentHtml = `
            <div class="comment-item" data-aos="fade-up">
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

// Optimasi Canva Background
function optimizeCanvaBackground() {
    const canvaIframe = document.querySelector('.canva-container iframe');
    if (!canvaIframe) return;
    
    // Set iframe attributes for better performance
    canvaIframe.setAttribute('loading', 'lazy');
    canvaIframe.setAttribute('importance', 'low');
    
    // Adjust for mobile
    if (window.innerWidth < 768) {
        canvaIframe.style.filter = 'brightness(0.35) saturate(1.1)';
    }
}

// Initialize Canva background
function initCanvaBackground() {
    const canvaBackground = document.getElementById('canva-background');
    if (!canvaBackground) return;
    
    // Preload canva background
    canvaBackground.style.opacity = '0';
    setTimeout(() => {
        canvaBackground.style.transition = 'opacity 1s ease';
        canvaBackground.style.opacity = '1';
    }, 500);
    
    // Optimize for performance
    optimizeCanvaBackground();
    
    // Listen for iframe load
    const canvaIframe = document.querySelector('.canva-container iframe');
    if (canvaIframe) {
        canvaIframe.addEventListener('load', () => {
            console.log('Canva background loaded successfully');
            canvaBackground.classList.add('loaded');
        });
    }
}

// Set nama tamu dari URL
$(document).ready(function() {
    // Initialize Canva background
    initCanvaBackground();
    
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
    
    // Musik otomatis
    var audio = document.getElementById('wedding-music');
    var musicIcon = document.getElementById('music-icon');
    var musicToggle = document.getElementById('music-toggle');
    
    // Fungsi untuk memutar musik
    function playMusic() {
        // Add slight delay for better UX
        setTimeout(() => {
            audio.play().then(function() {
                musicIcon.classList.remove('fa-play');
                musicIcon.classList.add('fa-pause');
                console.log('Musik berhasil diputar');
            }).catch(function(error) {
                console.log('Autoplay prevented:', error);
                // Show play button for manual start
                musicIcon.classList.remove('fa-pause');
                musicIcon.classList.add('fa-play');
            });
        }, 1000);
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
        
        // Fade out Canva background
        const canvaBackground = document.getElementById('canva-background');
        if (canvaBackground) {
            canvaBackground.style.opacity = '0';
            setTimeout(() => {
                canvaBackground.style.display = 'none';
            }, 800);
        }
        
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
        
        // Hide Canva credit
        const canvaCredit = document.querySelector('.canva-credit');
        if (canvaCredit) {
            canvaCredit.style.display = 'none';
        }
    });
    
    // Cek jika undangan sudah dibuka sebelumnya
    if (sessionStorage.getItem('undanganDibuka') === 'true') {
        $('#cover').addClass('hidden');
        $('#bottom-nav').show();
        preventCoverScroll();
        
        // Hide Canva background and credit
        const canvaBackground = document.getElementById('canva-background');
        if (canvaBackground) {
            canvaBackground.style.display = 'none';
        }
        
        const canvaCredit = document.querySelector('.canva-credit');
        if (canvaCredit) {
            canvaCredit.style.display = 'none';
        }
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
            }
        });
    });
    
    // Sembunyikan bottom nav di awal (saat di cover dan belum dibuka)
    if (!sessionStorage.getItem('undanganDibuka')) {
        $('#bottom-nav').hide();
    }
    
    // Handle window resize for Canva background
    let resizeTimer;
    $(window).resize(function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            optimizeCanvaBackground();
        }, 250);
    });
});

// Export fungsi untuk Canva optimizations
window.optimizeCanvaBackground = optimizeCanvaBackground;
// SVG Decorations Management System for Other Sections
class SVGDecorations {
    constructor() {
        this.decorationsLoaded = false;
        this.svgBasePath = 'decorations/'; // Path folder untuk file SVG
        this.init();
    }

    init() {
        this.loadSVGDecorations();
        this.initializeSectionObserver();
        this.setupResizeHandler();
    }

    // Konfigurasi dekorasi untuk setiap section (tanpa cover)
    getSectionConfig() {
        return {
            'pembuka': {
                files: [
                    'pembuka-corner-top.svg',
                    'pembuka-corner-bottom.svg'
                ],
                positions: ['corner-top-left', 'corner-bottom-right']
            },
            'detail-pengantin': {
                files: [
                    'pengantin-heart-left.svg',
                    'pengantin-heart-right.svg',
                    'pengantin-ring.svg'
                ],
                positions: ['heart-left', 'heart-right', 'ring-bottom']
            },
            'detail-acara': {
                files: [
                    'acara-border-top.svg',
                    'acara-border-bottom.svg',
                    'acara-calendar.svg'
                ],
                positions: ['border-top', 'border-bottom', 'calendar-icon']
            },
            'galeri': {
                files: [
                    'galeri-frame-1.svg',
                    'galeri-frame-2.svg',
                    'galeri-frame-3.svg',
                    'galeri-frame-4.svg',
                    'galeri-photo.svg'
                ],
                positions: ['frame-corner', 'frame-corner', 'frame-corner', 'frame-corner', 'photo-icon']
            },
            'hitung-mundur': {
                files: [
                    'mundur-clock.svg',
                    'mundur-sandglass.svg'
                ],
                positions: ['clock-decoration', 'sandglass']
            },
            'penutup': {
                files: [
                    'penutup-floral-left.svg',
                    'penutup-floral-right.svg',
                    'penutup-hands.svg'
                ],
                positions: ['floral-left', 'floral-right', 'hands-icon']
            },
            'amplop-digital': {
                files: [
                    'amplop-envelope-top.svg',
                    'amplop-envelope-bottom.svg',
                    'amplop-money.svg'
                ],
                positions: ['envelope-top', 'envelope-bottom', 'money-icon']
            },
            'ucapan': {
                files: [
                    'ucapan-message-left.svg',
                    'ucapan-message-right.svg',
                    'ucapan-pen.svg'
                ],
                positions: ['message-left', 'message-right', 'pen-icon']
            }
        };
    }

    // Load SVG decorations from separate files
    async loadSVGDecorations() {
        const container = document.getElementById('svg-decorations');
        if (!container) return;
        
        const sectionConfig = this.getSectionConfig();

        try {
            for (const [sectionId, config] of Object.entries(sectionConfig)) {
                // Create decoration container for this section
                const decorationDiv = document.createElement('div');
                decorationDiv.className = `svg-decoration ${sectionId.replace('-', '')}-decoration`;
                decorationDiv.setAttribute('data-section', sectionId);

                // Load each SVG file for this section
                for (let i = 0; i < config.files.length; i++) {
                    const fileName = config.files[i];
                    const positionClass = config.positions[i];
                    
                    try {
                        // Load SVG file
                        const response = await fetch(`${this.svgBasePath}${fileName}`);
                        if (!response.ok) {
                            console.warn(`SVG file not found: ${fileName}, using fallback`);
                            await this.createFallbackSVG(decorationDiv, sectionId, positionClass);
                            continue;
                        }
                        
                        const svgContent = await response.text();
                        const svgWrapper = document.createElement('div');
                        svgWrapper.className = `decoration-svg ${positionClass}`;
                        svgWrapper.innerHTML = svgContent;
                        
                        // Optimize SVG for performance
                        this.optimizeSVG(svgWrapper);
                        
                        decorationDiv.appendChild(svgWrapper);
                    } catch (error) {
                        console.error(`Error loading SVG ${fileName}:`, error);
                        await this.createFallbackSVG(decorationDiv, sectionId, positionClass);
                    }
                }

                container.appendChild(decorationDiv);
            }

            this.decorationsLoaded = true;
            console.log('SVG decorations loaded successfully');
            
            // Initialize animations after loading
            this.initializeAnimations();
            
        } catch (error) {
            console.error('Error loading SVG decorations:', error);
            this.createAllFallbackDecorations(container);
        }
    }

    // Create fallback SVG if file not found
    createFallbackSVG(container, sectionId, positionClass) {
        return new Promise((resolve) => {
            const svg = document.createElement('div');
            svg.className = `decoration-svg ${positionClass} fallback`;
            
            // Create simple fallback SVG based on section
            let svgContent = '';
            switch(sectionId) {
                case 'detail-pengantin':
                    svgContent = this.createHeartFallback(positionClass);
                    break;
                case 'galeri':
                    svgContent = this.createFrameFallback(positionClass);
                    break;
                default:
                    svgContent = this.createSimpleFallback(positionClass);
            }
            
            svg.innerHTML = svgContent;
            container.appendChild(svg);
            resolve();
        });
    }

    // Fallback SVG creators
    createHeartFallback(positionClass) {
        const opacity = positionClass.includes('left') ? '0.7' : '0.6';
        return `
            <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                <path d="M20,50 C15,40 10,35 20,25 C30,15 40,25 50,35 C60,25 70,15 80,25 C90,35 85,40 80,50 C70,60 50,75 50,75 C50,75 30,60 20,50" 
                      fill="none" stroke="#c19a6b" stroke-width="0.5" stroke-opacity="${opacity}"/>
            </svg>
        `;
    }

    createFrameFallback(positionClass) {
        return `
            <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                <path d="M10,10 L30,10 L10,30 Z" fill="none" stroke="#8b7355" stroke-width="0.7" stroke-opacity="0.5"/>
            </svg>
        `;
    }

    createSimpleFallback(positionClass) {
        return `
            <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#d4af37" stroke-width="0.5" stroke-opacity="0.3"/>
                <circle cx="50" cy="50" r="20" fill="none" stroke="#d4af37" stroke-width="0.3" stroke-opacity="0.2"/>
            </svg>
        `;
    }

    // Create all fallback decorations if loading fails
    createAllFallbackDecorations(container) {
        const sectionConfig = this.getSectionConfig();
        
        for (const [sectionId, config] of Object.entries(sectionConfig)) {
            const decorationDiv = document.createElement('div');
            decorationDiv.className = `svg-decoration ${sectionId.replace('-', '')}-decoration`;
            decorationDiv.setAttribute('data-section', sectionId);

            config.positions.forEach((positionClass, index) => {
                this.createFallbackSVG(decorationDiv, sectionId, positionClass);
            });

            container.appendChild(decorationDiv);
        }
        
        this.decorationsLoaded = true;
        console.log('Fallback SVG decorations created');
    }

    // Optimize SVG for better performance
    optimizeSVG(svgWrapper) {
        const svg = svgWrapper.querySelector('svg');
        if (!svg) return;

        // Set attributes for optimization
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        svg.setAttribute('shape-rendering', 'geometricPrecision');
        
        // Remove unnecessary metadata
        const metadata = svg.querySelector('metadata');
        if (metadata) metadata.remove();
        
        // Optimize paths
        const paths = svg.querySelectorAll('path');
        paths.forEach(path => {
            path.setAttribute('vector-effect', 'non-scaling-stroke');
        });
    }

    // Initialize animations
    initializeAnimations() {
        // Add animation classes based on section
        const animations = {
            'pembuka': 'fadeIn',
            'detail-pengantin': 'float',
            'detail-acara': 'fadeIn',
            'galeri': 'fadeIn',
            'hitung-mundur': 'pulse',
            'penutup': 'fadeIn',
            'amplop-digital': 'fadeIn',
            'ucapan': 'pulse'
        };

        Object.entries(animations).forEach(([section, animation]) => {
            const decoration = document.querySelector(`.svg-decoration[data-section="${section}"]`);
            if (decoration) {
                decoration.querySelectorAll('.decoration-svg').forEach(svg => {
                    svg.style.animationName = animation;
                    svg.style.animationDuration = section === 'detail-pengantin' ? '4s' : '3s';
                    svg.style.animationIterationCount = 'infinite';
                    svg.style.animationTimingFunction = 'ease-in-out';
                });
            }
        });
    }

    // Initialize Intersection Observer for section detection
    initializeSectionObserver() {
        const sections = document.querySelectorAll('.section');
        const decorations = document.querySelectorAll('.svg-decoration');

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.3
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    
                    // Skip cover section
                    if (sectionId === 'cover') return;
                    
                    // Hide all decorations
                    decorations.forEach(decoration => {
                        decoration.classList.remove('active');
                    });
                    
                    // Show decoration for current section
                    const currentDecoration = document.querySelector(`.svg-decoration[data-section="${sectionId}"]`);
                    if (currentDecoration) {
                        currentDecoration.classList.add('active');
                        
                        // Add transition delay for each SVG element
                        const svgElements = currentDecoration.querySelectorAll('.decoration-svg');
                        svgElements.forEach((svg, index) => {
                            svg.style.transitionDelay = `${index * 0.1}s`;
                        });
                    }
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            if (section.id !== 'cover') {
                sectionObserver.observe(section);
            }
        });
    }

    // Setup resize handler for responsive adjustments
    setupResizeHandler() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.adjustDecorationsForScreenSize();
            }, 250);
        });

        // Initial adjustment
        this.adjustDecorationsForScreenSize();
    }

    // Adjust decorations based on screen size
    adjustDecorationsForScreenSize() {
        const screenWidth = window.innerWidth;
        const decorations = document.querySelectorAll('.decoration-svg');

        decorations.forEach(decoration => {
            if (screenWidth < 480) {
                // Hide some decorations on small screens
                const classes = decoration.className;
                if (classes.includes('frame-corner') || 
                    classes.includes('message-left') || 
                    classes.includes('message-right') ||
                    classes.includes('calendar-icon') ||
                    classes.includes('money-icon')) {
                    decoration.style.display = 'none';
                } else {
                    decoration.style.display = 'block';
                }
                
                // Scale down decorations
                decoration.style.transform = 'scale(0.8)';
            } else if (screenWidth < 768) {
                // Medium screens
                decoration.style.transform = 'scale(0.9)';
                decoration.style.display = 'block';
            } else {
                // Large screens
                decoration.style.transform = 'scale(1)';
                decoration.style.display = 'block';
            }
        });
    }

    // Manual method to show/hide decorations
    showDecoration(sectionId) {
        const decoration = document.querySelector(`.svg-decoration[data-section="${sectionId}"]`);
        if (decoration) {
            decoration.classList.add('active');
        }
    }

    hideDecoration(sectionId) {
        const decoration = document.querySelector(`.svg-decoration[data-section="${sectionId}"]`);
        if (decoration) {
            decoration.classList.remove('active');
        }
    }

    // Add custom SVG decoration dynamically
    addCustomDecoration(sectionId, svgContent, positionClass, styles = {}) {
        const decoration = document.querySelector(`.svg-decoration[data-section="${sectionId}"]`);
        if (!decoration) return;

        const svgWrapper = document.createElement('div');
        svgWrapper.className = `decoration-svg custom ${positionClass}`;
        svgWrapper.innerHTML = svgContent;

        // Apply custom styles
        Object.entries(styles).forEach(([property, value]) => {
            svgWrapper.style[property] = value;
        });

        decoration.appendChild(svgWrapper);
    }

    // Remove all decorations
    clearDecorations() {
        const container = document.getElementById('svg-decorations');
        if (container) {
            container.innerHTML = '';
            this.decorationsLoaded = false;
        }
    }

    // Check if decorations are loaded
    areDecorationsLoaded() {
        return this.decorationsLoaded;
    }
}

// Initialize SVG Decorations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for other scripts to load
    setTimeout(() => {
        window.svgDecorations = new SVGDecorations();
    }, 1000);
});

// Export for manual control
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SVGDecorations;
}
