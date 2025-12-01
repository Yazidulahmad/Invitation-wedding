// ============ ORNAMEN SVG MANAGEMENT ============

// URL XML SVG dari GitHub
const SVG_XML_URL = 'https://raw.githubusercontent.com/Yazidulahmad/Invitation-wedding/94542140ac92742bc491d7cff9b6efb75a33d3bc/cover%20ornamen.svg.xml';

// Cache untuk SVG yang sudah dimuat
let svgCache = null;

// Fungsi untuk memuat SVG dari URL
async function loadSVGFromURL() {
    try {
        const response = await fetch(SVG_XML_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const svgText = await response.text();
        return svgText;
    } catch (error) {
        console.error('Error loading SVG:', error);
        // Fallback ke SVG default jika gagal
        return createFallbackSVG();
    }
}

// Fungsi untuk membuat SVG fallback
function createFallbackSVG() {
    return `
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <defs>
                <symbol id="ornamen-floral" viewBox="0 0 100 100">
                    <path d="M50,20 C60,10 75,10 85,20 C95,30 95,45 85,55 C75,65 60,65 50,55 C40,45 40,30 50,20 Z" 
                          fill="#d4af37" opacity="0.8">
                        <animate attributeName="d" dur="3s" values="
                            M50,20 C60,10 75,10 85,20 C95,30 95,45 85,55 C75,65 60,65 50,55 C40,45 40,30 50,20 Z;
                            M50,18 C62,8 78,8 87,18 C97,28 97,48 87,58 C78,68 62,68 50,58 C38,48 38,28 50,18 Z;
                            M50,20 C60,10 75,10 85,20 C95,30 95,45 85,55 C75,65 60,65 50,55 C40,45 40,30 50,20 Z
                        " repeatCount="indefinite"/>
                    </path>
                    <circle cx="50" cy="37" r="8" fill="#c19a6b" opacity="0.7">
                        <animate attributeName="r" values="8;10;8" dur="2s" repeatCount="indefinite"/>
                    </circle>
                </symbol>
                
                <symbol id="ornamen-border" viewBox="0 0 200 20">
                    <path d="M0,10 L200,10" stroke="#d4af37" stroke-width="2" stroke-dasharray="10,5">
                        <animate attributeName="stroke-dashoffset" from="0" to="15" dur="1s" repeatCount="indefinite"/>
                    </path>
                </symbol>
                
                <symbol id="ornamen-heart" viewBox="0 0 100 100">
                    <path d="M50,30 C60,20 75,20 85,30 C95,40 95,55 85,65 L50,90 L15,65 C5,55 5,40 15,30 C25,20 40,20 50,30 Z" 
                          fill="#ff6b6b" opacity="0.8">
                        <animate attributeName="d" dur="1.5s" values="
                            M50,30 C60,20 75,20 85,30 C95,40 95,55 85,65 L50,90 L15,65 C5,55 5,40 15,30 C25,20 40,20 50,30 Z;
                            M50,28 C62,18 78,18 87,28 C97,38 97,58 87,68 L50,95 L13,68 C3,58 3,38 13,28 C22,18 38,18 50,28 Z;
                            M50,30 C60,20 75,20 85,30 C95,40 95,55 85,65 L50,90 L15,65 C5,55 5,40 15,30 C25,20 40,20 50,30 Z
                        " repeatCount="indefinite"/>
                    </path>
                </symbol>
            </defs>
        </svg>
    `;
}

// Fungsi untuk mengekstrak simbol dari SVG XML
function extractSymbolsFromSVG(svgText) {
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
    const symbols = svgDoc.querySelectorAll('symbol');
    
    if (symbols.length === 0) {
        console.warn('No symbols found in SVG, using fallback');
        const fallbackDoc = parser.parseFromString(createFallbackSVG(), 'image/svg+xml');
        return fallbackDoc.querySelectorAll('symbol');
    }
    
    return symbols;
}

// Fungsi untuk mengisi SVG definitions
async function populateSVGDefinitions() {
    const svgContainer = document.getElementById('svg-definitions');
    if (!svgContainer) {
        console.error('SVG definitions container not found');
        return;
    }
    
    // Load SVG dari URL
    const svgText = await loadSVGFromURL();
    const symbols = extractSymbolsFromSVG(svgText);
    
    // Tambahkan simbol ke container
    symbols.forEach(symbol => {
        svgContainer.appendChild(symbol.cloneNode(true));
    });
    
    console.log(`Loaded ${symbols.length} SVG symbols`);
    return symbols;
}

// Fungsi untuk mengisi ornamen dengan SVG
function populateOrnamentsWithSVG() {
    // Mapping elemen ornamen dengan simbol SVG
    const ornamentMappings = [
        // Cover ornaments
        { element: 'cover-ornament-tl', symbol: 'ornamen-floral' },
        { element: 'cover-ornament-tr', symbol: 'ornamen-floral' },
        { element: 'cover-ornament-bl', symbol: 'ornamen-floral' },
        { element: 'cover-ornament-br', symbol: 'ornamen-floral' },
        { element: 'cover-top-ornament', symbol: 'ornamen-border' },
        { element: 'cover-bottom-ornament', symbol: 'ornamen-border' },
        { element: 'name-ornament', symbol: 'ornamen-border' },
        { element: 'date-ornament', symbol: 'ornamen-border' },
        { element: 'button-ornament', symbol: 'ornamen-border' },
        
        // Section ornaments
        { element: 'pembuka-top-ornament', symbol: 'ornamen-border' },
        { element: 'pembuka-bottom-ornament', symbol: 'ornamen-border' },
        { element: 'verse-ornament', symbol: 'ornamen-border' },
        { element: 'couple-name-ornament', symbol: 'ornamen-border' },
        { element: 'text-bottom-ornament', symbol: 'ornamen-border' },
        
        // Pengantin ornaments
        { element: 'pengantin-top-ornament', symbol: 'ornamen-border' },
        { element: 'pengantin-bottom-ornament', symbol: 'ornamen-border' },
        { element: 'pengantin-title-ornament', symbol: 'ornamen-border' },
        { element: 'card-frame-1', symbol: 'ornamen-floral' },
        { element: 'card-frame-2', symbol: 'ornamen-floral' },
        { element: 'photo-ornament-1', symbol: 'ornamen-floral' },
        { element: 'photo-ornament-2', symbol: 'ornamen-floral' },
        { element: 'card-bottom-1', symbol: 'ornamen-border' },
        { element: 'card-bottom-2', symbol: 'ornamen-border' },
        
        // Acara ornaments
        { element: 'acara-top-ornament', symbol: 'ornamen-border' },
        { element: 'acara-bottom-ornament', symbol: 'ornamen-border' },
        { element: 'acara-title-ornament', symbol: 'ornamen-border' },
        { element: 'event-frame-1', symbol: 'ornamen-floral' },
        { element: 'event-frame-2', symbol: 'ornamen-floral' },
        { element: 'event-frame-3', symbol: 'ornamen-floral' },
        { element: 'event-icon-1', symbol: 'ornamen-floral' },
        { element: 'event-icon-2', symbol: 'ornamen-floral' },
        { element: 'event-icon-3', symbol: 'ornamen-floral' },
        { element: 'event-bottom-1', symbol: 'ornamen-border' },
        { element: 'event-bottom-2', symbol: 'ornamen-border' },
        { element: 'event-bottom-3', symbol: 'ornamen-border' },
        
        // Galeri ornaments
        { element: 'galeri-top-ornament', symbol: 'ornamen-border' },
        { element: 'galeri-bottom-ornament', symbol: 'ornamen-border' },
        { element: 'galeri-title-ornament', symbol: 'ornamen-border' },
        { element: 'gallery-frame-1', symbol: 'ornamen-floral' },
        { element: 'gallery-frame-2', symbol: 'ornamen-floral' },
        { element: 'gallery-frame-3', symbol: 'ornamen-floral' },
        { element: 'gallery-frame-4', symbol: 'ornamen-floral' },
        
        // Hitung mundur ornaments
        { element: 'mundur-top-ornament', symbol: 'ornamen-border' },
        { element: 'mundur-bottom-ornament', symbol: 'ornamen-border' },
        { element: 'mundur-title-ornament', symbol: 'ornamen-border' },
        { element: 'countdown-ornament-1', symbol: 'ornamen-heart' },
        { element: 'countdown-ornament-2', symbol: 'ornamen-heart' },
        { element: 'countdown-ornament-3', symbol: 'ornamen-heart' },
        { element: 'countdown-ornament-4', symbol: 'ornamen-heart' },
        { element: 'message-ornament', symbol: 'ornamen-border' },
        
        // Penutup ornaments
        { element: 'penutup-top-ornament', symbol: 'ornamen-border' },
        { element: 'penutup-bottom-ornament', symbol: 'ornamen-border' },
        { element: 'penutup-title-ornament', symbol: 'ornamen-border' },
        { element: 'closing-ornament-1', symbol: 'ornamen-border' },
        { element: 'arabic-ornament', symbol: 'ornamen-border' },
        { element: 'closing-ornament-2', symbol: 'ornamen-border' },
        { element: 'signature-ornament', symbol: 'ornamen-border' },
        
        // Amplop ornaments
        { element: 'amplop-top-ornament', symbol: 'ornamen-border' },
        { element: 'amplop-bottom-ornament', symbol: 'ornamen-border' },
        { element: 'amplop-title-ornament', symbol: 'ornamen-border' },
        { element: 'bank-frame-1', symbol: 'ornamen-floral' },
        { element: 'bank-frame-2', symbol: 'ornamen-floral' },
        { element: 'bank-frame-3', symbol: 'ornamen-floral' },
        { element: 'bank-icon-ornament-1', symbol: 'ornamen-floral' },
        { element: 'bank-icon-ornament-2', symbol: 'ornamen-floral' },
        { element: 'bank-icon-ornament-3', symbol: 'ornamen-floral' },
        { element: 'bank-bottom-1', symbol: 'ornamen-border' },
        { element: 'bank-bottom-2', symbol: 'ornamen-border' },
        { element: 'bank-bottom-3', symbol: 'ornamen-border' },
        
        // Ucapan ornaments
        { element: 'ucapan-top-ornament', symbol: 'ornamen-border' },
        { element: 'ucapan-bottom-ornament', symbol: 'ornamen-border' },
        { element: 'ucapan-title-ornament', symbol: 'ornamen-border' },
        { element: 'form-frame', symbol: 'ornamen-floral' },
        { element: 'form-bottom', symbol: 'ornamen-border' },
        
        // Music ornament
        { element: 'music-ornament', symbol: 'ornamen-floral' }
    ];
    
    // Isi setiap elemen ornamen dengan SVG
    ornamentMappings.forEach(mapping => {
        const element = document.getElementById(mapping.element);
        if (element && !element.querySelector('svg')) {
            const svgNS = 'http://www.w3.org/2000/svg';
            const svg = document.createElementNS(svgNS, 'svg');
            svg.setAttribute('class', 'ornamen-svg');
            svg.setAttribute('viewBox', '0 0 100 100');
            svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
            
            const use = document.createElementNS(svgNS, 'use');
            use.setAttributeNS('http://www.w3.org/1999/xlink', 'href', `#${mapping.symbol}`);
            
            svg.appendChild(use);
            element.appendChild(svg);
        }
    });
}

// Fungsi untuk membuat floating particles
function createFloatingParticles() {
    const container = document.getElementById('floating-particles');
    if (!container) return;
    
    // Bersihkan existing particles
    container.innerHTML = '';
    
    // Buat 20 particles
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random properties
        const size = Math.random() * 4 + 2;
        const left = Math.random() * 100;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 10;
        
        // Set styles
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${left}%`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;
        
        // Random color from theme
        const colors = ['#d4af37', '#c19a6b', '#f9e076', '#ffffff'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        particle.style.backgroundColor = color;
        
        container.appendChild(particle);
    }
}

// Fungsi untuk mengatur animasi ornamen berdasarkan scroll
function setupOrnamentScrollAnimations() {
    const ornaments = document.querySelectorAll('.svg-ornament, .cover-ornament, .section-ornament, .title-ornament');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Aktifkan animasi
                entry.target.style.animationPlayState = 'running';
                entry.target.style.opacity = '0.8';
                
                // Trigger efek khusus untuk beberapa ornamen
                if (entry.target.classList.contains('cover-ornament')) {
                    entry.target.style.transform = 'translateY(0) rotate(0deg)';
                }
            } else {
                // Nonaktifkan animasi untuk optimasi
                entry.target.style.animationPlayState = 'paused';
                entry.target.style.opacity = '0.4';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    ornaments.forEach(ornament => {
        observer.observe(ornament);
    });
}

// Fungsi untuk mengatur efek hover pada cards
function setupCardHoverEffects() {
    const cards = document.querySelectorAll('.couple-card, .event-card, .bank-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const frame = card.querySelector('.card-ornament.frame');
            if (frame) {
                frame.style.opacity = '0.9';
                frame.style.transform = 'scale(1.02)';
            }
            
            const photo = card.querySelector('.photo-ornament');
            if (photo) {
                photo.style.transform = 'rotate(15deg) scale(1.1)';
            }
            
            const icon = card.querySelector('.icon-ornament, .bank-icon-ornament');
            if (icon) {
                icon.style.transform = 'scale(1.2)';
                icon.style.opacity = '0.9';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const frame = card.querySelector('.card-ornament.frame');
            if (frame) {
                frame.style.opacity = '0';
                frame.style.transform = 'scale(1)';
            }
            
            const photo = card.querySelector('.photo-ornament');
            if (photo) {
                photo.style.transform = 'rotate(0) scale(1)';
            }
            
            const icon = card.querySelector('.icon-ornament, .bank-icon-ornament');
            if (icon) {
                icon.style.transform = 'scale(1)';
                icon.style.opacity = '0.6';
            }
        });
    });
}

// Fungsi untuk mengatur efek gallery hover
function setupGalleryHoverEffects() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const frame = item.querySelector('.gallery-frame-ornament');
            if (frame) {
                frame.style.opacity = '1';
                frame.style.borderImageSlice = '1';
            }
        });
        
        item.addEventListener('mouseleave', () => {
            const frame = item.querySelector('.gallery-frame-ornament');
            if (frame) {
                frame.style.opacity = '0';
            }
        });
    });
}

// Fungsi untuk mengatur animasi countdown ornaments
function setupCountdownOrnamentAnimations() {
    let lastSeconds = null;
    
    function updateCountdownOrnaments() {
        const seconds = parseInt(document.getElementById('seconds').textContent);
        
        if (seconds !== lastSeconds) {
            const ornaments = document.querySelectorAll('.countdown-ornament');
            ornaments.forEach(ornament => {
                ornament.style.animation = 'none';
                setTimeout(() => {
                    ornament.style.animation = 'pulse 2s ease-in-out infinite';
                }, 10);
            });
            
            lastSeconds = seconds;
        }
    }
    
    // Check setiap 100ms
    setInterval(updateCountdownOrnaments, 100);
}

// Fungsi untuk mengatur animasi music ornament
function setupMusicOrnamentAnimation() {
    const musicToggle = document.getElementById('music-toggle');
    const musicOrnament = document.querySelector('.music-ornament');
    
    if (!musicToggle || !musicOrnament) return;
    
    let isPlaying = false;
    
    musicToggle.addEventListener('click', () => {
        isPlaying = !isPlaying;
        
        if (isPlaying) {
            musicOrnament.style.animation = 'rotate 10s linear infinite';
            musicOrnament.style.opacity = '0.9';
        } else {
            musicOrnament.style.animation = 'rotate 20s linear infinite';
            musicOrnament.style.opacity = '0.6';
        }
    });
}

// Fungsi untuk inisialisasi semua ornamen
async function initializeOrnaments() {
    try {
        console.log('Initializing SVG ornaments...');
        
        // Populate SVG definitions
        await populateSVGDefinitions();
        
        // Beri waktu untuk SVG definitions dimuat
        setTimeout(() => {
            // Populate ornaments dengan SVG
            populateOrnamentsWithSVG();
            
            // Buat floating particles
            createFloatingParticles();
            
            // Setup scroll animations
            setupOrnamentScrollAnimations();
            
            // Setup hover effects
            setupCardHoverEffects();
            setupGalleryHoverEffects();
            
            // Setup countdown ornament animations
            setupCountdownOrnamentAnimations();
            
            // Setup music ornament animation
            setupMusicOrnamentAnimation();
            
            console.log('SVG ornaments initialized successfully');
        }, 500);
    } catch (error) {
        console.error('Error initializing ornaments:', error);
    }
}

// ============ KODE ASLI ============

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
    
    // Initialize ornaments
    initializeOrnaments();
    
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
        // Animasikan ornamen cover sebelum menyembunyikan
        const coverOrnaments = document.querySelectorAll('.cover-ornament');
        coverOrnaments.forEach(ornament => {
            ornament.style.transition = 'all 0.8s ease';
            ornament.style.opacity = '0';
            ornament.style.transform = 'scale(0.5) rotate(45deg)';
        });
        
        // Sembunyikan cover section setelah animasi
        setTimeout(() => {
            $('#cover').addClass('hidden');
        }, 500);
        
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
        
        // Refresh AOS setelah membuka undangan
        setTimeout(() => {
            AOS.refresh();
        }, 500);
    });
    
    // Cek jika undangan sudah dibuka sebelumnya
    if (sessionStorage.getItem('undanganDibuka') === 'true') {
        $('#cover').addClass('hidden');
        $('#bottom-nav').show();
        preventCoverScroll();
        
        // Initialize ornaments setelah cover disembunyikan
        setTimeout(() => {
            initializeOrnaments();
        }, 100);
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
        
        // Animasikan ornamen bank
        const bankCard = $(this).closest('.bank-card');
        const bankIconOrnament = bankCard.find('.bank-icon-ornament');
        if (bankIconOrnament.length) {
            bankIconOrnament.css({
                'transform': 'scale(1.3) rotate(15deg)',
                'transition': 'transform 0.3s ease'
            });
            
            setTimeout(() => {
                bankIconOrnament.css({
                    'transform': 'scale(1) rotate(0)'
                });
            }, 300);
        }
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
                
                // Animasikan form ornament
                const formFrame = $('.form-ornament.frame');
                if (formFrame.length) {
                    formFrame.css({
                        'border-image': 'linear-gradient(45deg, #4CAF50, #8BC34A) 1',
                        'opacity': '0.8'
                    });
                    
                    setTimeout(() => {
                        formFrame.css({
                            'border-image': 'linear-gradient(45deg, var(--primary), var(--secondary)) 1',
                            'opacity': '0.5'
                        });
                    }, 1000);
                }
                
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
    
    // Refresh particles pada resize
    $(window).resize(function() {
        createFloatingParticles();
    });
});
