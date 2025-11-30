// ===== SISTEM DEKORASI ANIMASI =====

class WeddingDecorations {
    constructor() {
        this.decorationContainer = document.querySelector('.decorations-container');
        this.currentSection = '';
        this.decorations = [];
        this.scrollInstance = null;
        
        this.init();
    }
    
    init() {
        this.initializeSmoothScroll();
        this.createGlobalDecorations();
        this.setupSectionObserver();
    }
    
    initializeSmoothScroll() {
        // Initialize smooth scroll with Locomotive Scroll
        this.scrollInstance = new LocomotiveScroll({
            el: document.querySelector('[data-scroll-container]'),
            smooth: true,
            multiplier: 1,
            class: 'is-revealed'
        });
        
        // Update decorations on scroll
        this.scrollInstance.on('scroll', (args) => {
            this.updateDecorationsOnScroll(args);
        });
    }
    
    createGlobalDecorations() {
        // Create floating particles background
        this.createParticles(15);
        
        // Create corner floral decorations
        this.createCornerFlorals();
    }
    
    createParticles(count) {
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random properties
            const size = Math.random() * 6 + 2;
            const left = Math.random() * 100;
            const delay = Math.random() * 8;
            const duration = Math.random() * 10 + 8;
            
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${left}vw`;
            particle.style.animationDelay = `${delay}s`;
            particle.style.animationDuration = `${duration}s`;
            particle.style.background = this.getRandomGoldColor();
            
            this.decorationContainer.appendChild(particle);
            this.decorations.push(particle);
        }
    }
    
    createCornerFlorals() {
        const corners = [
            { top: '5%', left: '5%', rotation: '0deg' },
            { top: '5%', right: '5%', rotation: '90deg' },
            { bottom: '5%', left: '5%', rotation: '-90deg' },
            { bottom: '5%', right: '5%', rotation: '180deg' }
        ];
        
        corners.forEach(corner => {
            const floral = document.createElement('div');
            floral.className = 'decoration-element floral-decoration-custom large floating-element';
            floral.innerHTML = '<i class="fas fa-leaf"></i><i class="fas fa-leaf"></i><i class="fas fa-leaf"></i>';
            
            Object.keys(corner).forEach(key => {
                if (key !== 'rotation') {
                    floral.style[key] = corner[key];
                }
            });
            
            floral.style.transform = `rotate(${corner.rotation})`;
            
            this.decorationContainer.appendChild(floral);
            this.decorations.push(floral);
        });
    }
    
    setupSectionObserver() {
        const sections = document.querySelectorAll('.section');
        const observerOptions = {
            rootMargin: '-50% 0px -50% 0px',
            threshold: 0
        };
        
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.onSectionChange(entry.target.id);
                }
            });
        }, observerOptions);
        
        sections.forEach(section => {
            sectionObserver.observe(section);
        });
    }
    
    onSectionChange(sectionId) {
        this.currentSection = sectionId;
        this.clearSectionSpecificDecorations();
        this.createSectionDecorations(sectionId);
    }
    
    clearSectionSpecificDecorations() {
        // Remove only section-specific decorations
        this.decorations.forEach(decoration => {
            if (decoration.classList.contains('section-specific')) {
                decoration.remove();
            }
        });
        
        this.decorations = this.decorations.filter(dec => 
            !dec.classList.contains('section-specific')
        );
    }
    
    createSectionDecorations(sectionId) {
        switch(sectionId) {
            case 'cover':
                this.createCoverDecorations();
                break;
            case 'pembuka':
                this.createPembukaDecorations();
                break;
            case 'detail-pengantin':
                this.createPengantinDecorations();
                break;
            case 'detail-acara':
                this.createAcaraDecorations();
                break;
            case 'galeri':
                this.createGaleriDecorations();
                break;
            case 'hitung-mundur':
                this.createCountdownDecorations();
                break;
            case 'penutup':
                this.createPenutupDecorations();
                break;
            case 'amplop-digital':
                this.createAmplopDecorations();
                break;
            case 'ucapan':
                this.createUcapanDecorations();
                break;
        }
    }
    
    createCoverDecorations() {
        // Sparkles around the title
        this.createSparkles(8, '20%', '45%');
        this.createSparkles(8, '80%', '45%');
        
        // Floating hearts
        this.createFloatingHearts(5);
    }
    
    createPembukaDecorations() {
        // Quran verse decorations - floral elements around text
        const floralPositions = [
            { top: '30%', left: '10%' },
            { top: '30%', right: '10%' },
            { top: '60%', left: '15%' },
            { top: '60%', right: '15%' }
        ];
        
        floralPositions.forEach(pos => {
            const floral = this.createFloralElement(pos, 'floating-element');
            this.addDecoration(floral);
        });
    }
    
    createPengantinDecorations() {
        // Heart decorations around couple photos
        this.createHeartsAroundPhotos();
        
        // Connection line between couple
        this.createConnectionLine();
    }
    
    createAcaraDecorations() {
        // Clock and calendar animations
        this.createTimeRelatedDecorations();
        
        // Location pin animations
        this.createLocationDecorations();
    }
    
    createGaleriDecorations() {
        // Frame-like decorations around gallery
        this.createGalleryFrames();
        
        // Subtle sparkles on hover
        this.addGalleryHoverEffects();
    }
    
    createCountdownDecorations() {
        // Animated numbers and time elements
        this.createCountdownAnimations();
        
        // Progress indicators
        this.createProgressElements();
    }
    
    createPenutupDecorations() {
        // Thank you message decorations
        this.createThankYouDecorations();
    }
    
    createAmplopDecorations() {
        // Money/gift related animations
        this.createGiftAnimations();
    }
    
    createUcapanDecorations() {
        // Message bubble animations
        this.createMessageDecorations();
    }
    
    // ===== HELPER METHODS =====
    
    createSparkles(count, x, y) {
        for (let i = 0; i < count; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'decoration-element sparkle section-specific';
            
            const angle = (i / count) * Math.PI * 2;
            const radius = 50;
            const sparkleX = parseFloat(x) + Math.cos(angle) * radius;
            const sparkleY = parseFloat(y) + Math.sin(angle) * radius;
            
            sparkle.style.left = `${sparkleX}%`;
            sparkle.style.top = `${sparkleY}%`;
            sparkle.style.animationDelay = `${i * 0.2}s`;
            
            this.addDecoration(sparkle);
        }
    }
    
    createFloatingHearts(count) {
        for (let i = 0; i < count; i++) {
            const heart = document.createElement('div');
            heart.className = 'decoration-element heart-beat section-specific floating-element';
            heart.innerHTML = '<i class="fas fa-heart"></i>';
            
            heart.style.left = `${Math.random() * 80 + 10}%`;
            heart.style.top = `${Math.random() * 50 + 25}%`;
            heart.style.fontSize = `${Math.random() * 1 + 0.8}rem`;
            heart.style.animationDelay = `${Math.random() * 2}s`;
            
            this.addDecoration(heart);
        }
    }
    
    createFloralElement(position, additionalClasses = '') {
        const floral = document.createElement('div');
        floral.className = `decoration-element floral-decoration-custom section-specific ${additionalClasses}`;
        floral.innerHTML = '<i class="fas fa-leaf"></i>';
        
        Object.keys(position).forEach(key => {
            floral.style[key] = position[key];
        });
        
        return floral;
    }
    
    createHeartsAroundPhotos() {
        const heartCount = 6;
        for (let i = 0; i < heartCount; i++) {
            const heart = document.createElement('div');
            heart.className = 'decoration-element heart-beat section-specific';
            heart.innerHTML = '<i class="fas fa-heart"></i>';
            
            const angle = (i / heartCount) * Math.PI * 2;
            const radius = 100;
            heart.style.left = `calc(50% + ${Math.cos(angle) * radius}px)`;
            heart.style.top = `calc(50% + ${Math.sin(angle) * radius}px)`;
            heart.style.animationDelay = `${i * 0.3}s`;
            
            this.addDecoration(heart);
        }
    }
    
    createConnectionLine() {
        const line = document.createElement('div');
        line.className = 'decoration-element section-specific';
        line.style.cssText = `
            position: absolute;
            top: 50%;
            left: 25%;
            right: 25%;
            height: 2px;
            background: linear-gradient(90deg, transparent, var(--primary), transparent);
            opacity: 0.3;
        `;
        
        this.addDecoration(line);
    }
    
    createTimeRelatedDecorations() {
        // Create clock-like elements
        for (let i = 0; i < 4; i++) {
            const clock = document.createElement('div');
            clock.className = 'decoration-element section-specific floating-element';
            clock.innerHTML = '<i class="far fa-clock"></i>';
            clock.style.color = 'var(--primary)';
            clock.style.opacity = '0.4';
            clock.style.fontSize = '1.2rem';
            
            const positions = [
                { top: '20%', left: '10%' },
                { top: '20%', right: '10%' },
                { bottom: '20%', left: '15%' },
                { bottom: '20%', right: '15%' }
            ];
            
            Object.keys(positions[i]).forEach(key => {
                clock.style[key] = positions[i][key];
            });
            
            clock.style.animationDelay = `${i * 1}s`;
            this.addDecoration(clock);
        }
    }
    
    createLocationDecorations() {
        const locations = [
            { top: '30%', left: '20%' },
            { top: '40%', right: '25%' },
            { bottom: '35%', left: '30%' }
        ];
        
        locations.forEach((pos, index) => {
            const locationPin = document.createElement('div');
            locationPin.className = 'decoration-element section-specific heart-beat';
            locationPin.innerHTML = '<i class="fas fa-map-marker-alt"></i>';
            locationPin.style.color = 'var(--primary)';
            locationPin.style.opacity = '0.5';
            locationPin.style.fontSize = '1.5rem';
            
            Object.keys(pos).forEach(key => {
                locationPin.style[key] = pos[key];
            });
            
            locationPin.style.animationDelay = `${index * 0.5}s`;
            this.addDecoration(locationPin);
        });
    }
    
    createGalleryFrames() {
        // Create decorative frames around gallery area
        const framePositions = [
            { top: '15%', left: '5%', width: '50px', height: '50px', border: '2px solid var(--primary)' },
            { top: '15%', right: '5%', width: '50px', height: '50px', border: '2px solid var(--primary)' },
            { bottom: '15%', left: '5%', width: '50px', height: '50px', border: '2px solid var(--primary)' },
            { bottom: '15%', right: '5%', width: '50px', height: '50px', border: '2px solid var(--primary)' }
        ];
        
        framePositions.forEach(pos => {
            const frame = document.createElement('div');
            frame.className = 'decoration-element section-specific';
            frame.style.opacity = '0.3';
            frame.style.borderRadius = '10px';
            
            Object.keys(pos).forEach(key => {
                if (key !== 'border') {
                    frame.style[key] = pos[key];
                }
            });
            
            frame.style.border = pos.border;
            this.addDecoration(frame);
        });
    }
    
    addGalleryHoverEffects() {
        // Add hover effects to gallery items
        const galleryItems = document.querySelectorAll('.gallery-item');
        galleryItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                this.createHoverSparkle(item);
            });
        });
    }
    
    createHoverSparkle(element) {
        const rect = element.getBoundingClientRect();
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.position = 'absolute';
        sparkle.style.left = `${Math.random() * rect.width}px`;
        sparkle.style.top = `${Math.random() * rect.height}px`;
        sparkle.style.animation = 'sparkle 1s ease-in-out';
        
        element.appendChild(sparkle);
        
        setTimeout(() => {
            sparkle.remove();
        }, 1000);
    }
    
    createCountdownAnimations() {
        // Create pulsing circles around countdown
        const countdownItems = document.querySelectorAll('.countdown-item');
        countdownItems.forEach((item, index) => {
            const circle = document.createElement('div');
            circle.className = 'decoration-element section-specific';
            circle.style.cssText = `
                position: absolute;
                width: 80px;
                height: 80px;
                border: 2px solid var(--primary);
                border-radius: 50%;
                opacity: 0.1;
                animation: pulse 2s ease-in-out infinite;
            `;
            
            const rect = item.getBoundingClientRect();
            const containerRect = document.querySelector('.countdown-container').getBoundingClientRect();
            
            circle.style.left = `${rect.left - containerRect.left + rect.width/2 - 40}px`;
            circle.style.top = `${rect.top - containerRect.top + rect.height/2 - 40}px`;
            circle.style.animationDelay = `${index * 0.5}s`;
            
            this.addDecoration(circle);
        });
    }
    
    createThankYouDecorations() {
        // Create floating thank you elements
        const thanksElements = ['🙏', '💝', '✨', '🌸'];
        thanksElements.forEach((emoji, index) => {
            const element = document.createElement('div');
            element.className = 'decoration-element section-specific floating-element';
            element.textContent = emoji;
            element.style.fontSize = '2rem';
            element.style.opacity = '0.4';
            
            element.style.left = `${20 + index * 20}%`;
            element.style.top = `${30 + Math.random() * 40}%`;
            element.style.animationDelay = `${index * 0.7}s`;
            
            this.addDecoration(element);
        });
    }
    
    createGiftAnimations() {
        // Create floating gift icons
        for (let i = 0; i < 4; i++) {
            const gift = document.createElement('div');
            gift.className = 'decoration-element section-specific floating-element';
            gift.innerHTML = '<i class="fas fa-gift"></i>';
            gift.style.color = 'var(--primary)';
            gift.style.opacity = '0.4';
            gift.style.fontSize = '1.5rem';
            
            gift.style.left = `${15 + i * 25}%`;
            gift.style.top = `${20 + Math.random() * 60}%`;
            gift.style.animationDelay = `${i * 0.5}s`;
            
            this.addDecoration(gift);
        }
    }
    
    createMessageDecorations() {
        // Create message bubble decorations
        const bubbles = ['💬', '📝', '❤️', '🎉'];
        bubbles.forEach((bubble, index) => {
            const element = document.createElement('div');
            element.className = 'decoration-element section-specific floating-element';
            element.textContent = bubble;
            element.style.fontSize = '1.8rem';
            element.style.opacity = '0.3';
            
            element.style.left = `${10 + index * 30}%`;
            element.style.top = `${25 + Math.random() * 50}%`;
            element.style.animationDelay = `${index * 0.6}s`;
            
            this.addDecoration(element);
        });
    }
    
    addDecoration(element) {
        element.classList.add('decoration-fade-in');
        this.decorationContainer.appendChild(element);
        this.decorations.push(element);
    }
    
    getRandomGoldColor() {
        const goldColors = [
            '#d4af37', '#f9e076', '#c19a6b', '#b8860b', '#daa520'
        ];
        return goldColors[Math.floor(Math.random() * goldColors.length)];
    }
    
    updateDecorationsOnScroll(args) {
        // Parallax effect for some elements
        this.decorations.forEach((decoration, index) => {
            if (decoration.classList.contains('floating-element')) {
                const speed = 0.5;
                const yPos = args.scroll.y * speed;
                decoration.style.transform = `translateY(${yPos}px) rotate(${Math.sin(args.scroll.y * 0.01 + index) * 10}deg)`;
            }
        });
    }
}

// ===== KODE ASLI YANG SUDAH ADA =====

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
        
        // Initialize decorations system
        window.weddingDecorations = new WeddingDecorations();
        
    }).catch(error => {
        console.error('Firebase initialization failed:', error);
        $('#comments-container').html(`
            <div class="comment-item">
                <p style="text-align: center; color: #777; font-style: italic;">
                    Mode offline. Ucapan tidak dapat dimuat.
                </p>
            </div>
        `);
        
        // Still initialize decorations even if Firebase fails
        window.weddingDecorations = new WeddingDecorations();
    });
    
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
});

// ===== OPTIMASI PERFORMANCE =====

// Pause animations when not visible
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        document.body.classList.add('animations-paused');
    } else {
        document.body.classList.remove('animations-paused');
    }
});

// Add pulse animation for countdown
const pulseCSS = `
@keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 0.1; }
    50% { transform: scale(1.1); opacity: 0.2; }
}
`;

// Inject pulse CSS
const style = document.createElement('style');
style.textContent = pulseCSS;
document.head.appendChild(style);
