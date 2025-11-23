// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Inisialisasi variabel dan elemen
    console.log("Undangan Pernikahan Digital Dimuat");
    
    // Ambil nama tamu dari URL
    const urlParams = new URLSearchParams(window.location.search);
    const guestNameFromUrl = urlParams.get('to');
    const guestNameElement = document.getElementById('guestName');
    
    if (guestNameFromUrl) {
        guestNameElement.textContent = `Kepada Yth: ${guestNameFromUrl}`;
        // Set nama tamu di field komentar
        const commentNameInput = document.getElementById('commentName');
        if (commentNameInput) {
            commentNameInput.value = guestNameFromUrl;
        }
    }
    
    // Elemen musik
    const backgroundMusic = document.getElementById('backgroundMusic');
    const musicToggle = document.getElementById('musicToggle');
    let isMusicPlaying = false;
    
    // Tombol buka undangan
    const openInvitationBtn = document.getElementById('openInvitation');
    
    // Navigasi underbar
    const underbarItems = document.querySelectorAll('.underbar-item');
    const underbar = document.querySelector('.underbar');
    const musicControl = document.querySelector('.music-control');
    
    // Hitung mundur
    const weddingDate = new Date('December 21, 2025 09:00:00').getTime();
    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    
    // Form komentar
    const commentForm = document.getElementById('commentForm');
    const commentsList = document.getElementById('commentsList');
    
    // Fungsi untuk memutar musik
    function playMusic() {
        if (backgroundMusic) {
            backgroundMusic.volume = 0.3;
            const playPromise = backgroundMusic.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    isMusicPlaying = true;
                    if (musicToggle) {
                        musicToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
                        musicToggle.style.background = 'var(--secondary)';
                    }
                }).catch(error => {
                    console.log("Autoplay prevented:", error);
                    // Tampilkan pesan untuk interaksi pengguna
                    if (musicToggle) {
                        musicToggle.innerHTML = '<i class="fas fa-play"></i>';
                        musicToggle.title = "Klik untuk memutar musik";
                    }
                });
            }
        }
    }
    
    // Fungsi untuk menghentikan musik
    function pauseMusic() {
        if (backgroundMusic) {
            backgroundMusic.pause();
            isMusicPlaying = false;
            if (musicToggle) {
                musicToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
                musicToggle.style.background = 'var(--primary)';
            }
        }
    }
    
    // Fungsi untuk membuka undangan (pindah dari cover ke single page)
    function openInvitation() {
        const cover = document.getElementById('cover');
        const mainContent = document.getElementById('main-content');
        
        if (cover && mainContent) {
            cover.classList.add('hidden');
            setTimeout(() => {
                cover.style.display = 'none';
                mainContent.classList.add('active');
                underbar.classList.add('active');
                musicControl.classList.add('active');
                playMusic();
                
                // Scroll ke bagian pembuka
                const openingSection = document.getElementById('opening');
                if (openingSection) {
                    openingSection.scrollIntoView({ behavior: 'smooth' });
                }
            }, 800);
        }
    }
    
    // Event listener untuk tombol buka undangan
    if (openInvitationBtn) {
        openInvitationBtn.addEventListener('click', openInvitation);
    }
    
    // Event listener untuk underbar navigasi
    underbarItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetSectionId = this.getAttribute('data-target');
            const targetSection = document.getElementById(targetSectionId);
            
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
                
                // Update underbar aktif
                underbarItems.forEach(item => {
                    item.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });
    
    // Event listener untuk tombol musik
    if (musicToggle) {
        musicToggle.addEventListener('click', function() {
            if (isMusicPlaying) {
                pauseMusic();
            } else {
                playMusic();
            }
        });
    }
    
    // Fungsi untuk mengupdate underbar aktif berdasarkan scroll
    function updateActiveUnderbar() {
        const sections = document.querySelectorAll('.content-section');
        const scrollPos = window.scrollY + 100; // Offset untuk underbar
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                // Hapus active dari semua underbar items
                underbarItems.forEach(item => {
                    item.classList.remove('active');
                });
                
                // Tambahkan active ke underbar item yang sesuai
                const activeUnderbarItem = document.querySelector(`.underbar-item[data-target="${sectionId}"]`);
                if (activeUnderbarItem) {
                    activeUnderbarItem.classList.add('active');
                }
            }
        });
    }
    
    // Event listener untuk scroll
    window.addEventListener('scroll', updateActiveUnderbar);
    
    // Fungsi hitung mundur
    function updateCountdown() {
        const now = new Date().getTime();
        const timeLeft = weddingDate - now;
        
        if (timeLeft > 0) {
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            
            if (daysElement) daysElement.textContent = days.toString().padStart(2, '0');
            if (hoursElement) hoursElement.textContent = hours.toString().padStart(2, '0');
            if (minutesElement) minutesElement.textContent = minutes.toString().padStart(2, '0');
            if (secondsElement) secondsElement.textContent = seconds.toString().padStart(2, '0');
        } else {
            if (daysElement) daysElement.textContent = '00';
            if (hoursElement) hoursElement.textContent = '00';
            if (minutesElement) minutesElement.textContent = '00';
            if (secondsElement) secondsElement.textContent = '00';
            
            // Tampilkan pesan khusus jika acara sudah berlangsung
            const countdownText = document.querySelector('.countdown-text');
            if (countdownText) {
                countdownText.textContent = 'Acara Pernikahan Telah Berlangsung';
            }
        }
    }
    
    // Update hitung mundur setiap detik
    setInterval(updateCountdown, 1000);
    updateCountdown(); // Panggil sekali saat halaman dimuat
    
    // Fungsi untuk menambahkan komentar
    function addComment(name, message) {
        const commentItem = document.createElement('div');
        commentItem.className = 'comment-item';
        
        const now = new Date();
        const dateString = now.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        
        const timeString = now.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        commentItem.innerHTML = `
            <div class="comment-header">
                <span class="comment-name">${escapeHtml(name)}</span>
                <span class="comment-date">${dateString} ${timeString}</span>
            </div>
            <div class="comment-message">${escapeHtml(message)}</div>
        `;
        
        if (commentsList) {
            // Hapus placeholder jika ada
            const placeholder = commentsList.querySelector('.comment-placeholder');
            if (placeholder) {
                commentsList.removeChild(placeholder);
            }
            
            commentsList.prepend(commentItem);
        }
    }
    
    // Fungsi untuk menghindari XSS
    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
    
    // Event listener untuk form komentar
    if (commentForm) {
        commentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nameInput = document.getElementById('commentName');
            const messageInput = document.getElementById('commentMessage');
            
            const name = nameInput ? nameInput.value.trim() : '';
            const message = messageInput ? messageInput.value.trim() : '';
            
            if (name && message) {
                addComment(name, message);
                
                // Reset form, tetapi jangan reset nama jika dari URL
                if (messageInput) messageInput.value = '';
                // Nama tidak direset agar tamu bisa mengirim ucapan lagi dengan nama yang sama
                
                // Simpan komentar ke localStorage
                const comments = JSON.parse(localStorage.getItem('weddingComments') || '[]');
                comments.unshift({
                    name: name,
                    message: message,
                    date: new Date().toISOString()
                });
                localStorage.setItem('weddingComments', JSON.stringify(comments));
                
                // Tampilkan pesan sukses
                showNotification('Ucapan Anda telah terkirim! Terima kasih atas doa dan restunya.');
            } else {
                showNotification('Harap isi nama dan ucapan Anda sebelum mengirim.');
            }
        });
    }
    
    // Fungsi untuk menampilkan notifikasi
    function showNotification(message) {
        // Buat elemen notifikasi
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--secondary);
            color: white;
            padding: 0.8rem 1.2rem;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 1000;
            max-width: 280px;
            animation: slideIn 0.3s ease;
            font-size: 0.9rem;
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Hapus notifikasi setelah 3 detik
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    // Tambahkan CSS untuk animasi notifikasi
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // Muat komentar dari localStorage saat halaman dimuat
    function loadComments() {
        if (!commentsList) return;
        
        const comments = JSON.parse(localStorage.getItem('weddingComments') || '[]');
        
        // Kosongkan daftar komentar terlebih dahulu
        commentsList.innerHTML = '';
        
        if (comments.length === 0) {
            commentsList.innerHTML = `
                <div class="comment-placeholder">
                    <i class="fas fa-comments"></i>
                    <p>Belum ada ucapan. Jadilah yang pertama memberikan ucapan!</p>
                </div>
            `;
            return;
        }
        
        comments.forEach(comment => {
            const commentItem = document.createElement('div');
            commentItem.className = 'comment-item';
            
            const date = new Date(comment.date);
            const dateString = date.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
            
            const timeString = date.toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit'
            });
            
            commentItem.innerHTML = `
                <div class="comment-header">
                    <span class="comment-name">${escapeHtml(comment.name)}</span>
                    <span class="comment-date">${dateString} ${timeString}</span>
                </div>
                <div class="comment-message">${escapeHtml(comment.message)}</div>
            `;
            
            commentsList.appendChild(commentItem);
        });
    }
    
    // Panggil fungsi untuk memuat komentar
    loadComments();
    
    // Efek animasi saat halaman dimuat
    setTimeout(() => {
        const coverContainer = document.querySelector('.cover-container');
        if (coverContainer) {
            coverContainer.style.opacity = '1';
            coverContainer.style.transform = 'translateY(0)';
        }
    }, 300);
    
    // Tambahkan event listener untuk touch events pada perangkat mobile
    document.addEventListener('touchstart', function() {}, {passive: true});
    
    // Handler untuk error musik
    if (backgroundMusic) {
        backgroundMusic.addEventListener('error', function(e) {
            console.error("Error loading audio:", e);
            if (musicToggle) {
                musicToggle.style.display = 'none';
            }
        });
    }
    
    console.log("Aplikasi undangan berhasil diinisialisasi");
});
