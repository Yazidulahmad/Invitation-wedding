document.addEventListener('DOMContentLoaded', function() {
    // Ambil nama tamu dari URL
    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get('to') || 'Bapak/Ibu/Saudara/i';
    document.getElementById('guestName').textContent = `Kepada Yth: ${guestName}`;
    
    // Elemen musik
    const backgroundMusic = document.getElementById('backgroundMusic');
    const musicToggle = document.getElementById('musicToggle');
    let isMusicPlaying = false;
    
    // Tombol buka undangan
    const openInvitationBtn = document.getElementById('openInvitation');
    
    // Navigasi underbar
    const underbarItems = document.querySelectorAll('.underbar-item');
    
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
        backgroundMusic.volume = 0.5;
        backgroundMusic.play().then(() => {
            isMusicPlaying = true;
            musicToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
            musicToggle.style.background = 'var(--secondary)';
        }).catch(error => {
            console.log("Autoplay prevented:", error);
            // Tampilkan pesan untuk interaksi pengguna
            musicToggle.innerHTML = '<i class="fas fa-play"></i>';
            musicToggle.title = "Klik untuk memutar musik";
        });
    }
    
    // Fungsi untuk menghentikan musik
    function pauseMusic() {
        backgroundMusic.pause();
        isMusicPlaying = false;
        musicToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
        musicToggle.style.background = 'var(--primary)';
    }
    
    // Fungsi untuk berpindah halaman
    function navigateToPage(pageId) {
        // Sembunyikan semua halaman
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Tampilkan halaman yang dipilih
        document.getElementById(pageId).classList.add('active');
        
        // Update underbar aktif
        underbarItems.forEach(item => {
            if (item.getAttribute('data-target') === pageId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        // Scroll ke atas halaman
        window.scrollTo(0, 0);
        
        // Jika berpindah dari halaman cover, pastikan musik diputar
        if (pageId !== 'cover' && !isMusicPlaying) {
            playMusic();
        }
    }
    
    // Event listener untuk tombol buka undangan
    openInvitationBtn.addEventListener('click', function() {
        navigateToPage('opening');
        playMusic();
    });
    
    // Event listener untuk underbar navigasi
    underbarItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetPage = this.getAttribute('data-target');
            navigateToPage(targetPage);
        });
    });
    
    // Event listener untuk tombol musik
    musicToggle.addEventListener('click', function() {
        if (isMusicPlaying) {
            pauseMusic();
        } else {
            playMusic();
        }
    });
    
    // Fungsi hitung mundur
    function updateCountdown() {
        const now = new Date().getTime();
        const timeLeft = weddingDate - now;
        
        if (timeLeft > 0) {
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            
            daysElement.textContent = days.toString().padStart(2, '0');
            hoursElement.textContent = hours.toString().padStart(2, '0');
            minutesElement.textContent = minutes.toString().padStart(2, '0');
            secondsElement.textContent = seconds.toString().padStart(2, '0');
        } else {
            daysElement.textContent = '00';
            hoursElement.textContent = '00';
            minutesElement.textContent = '00';
            secondsElement.textContent = '00';
            
            // Tampilkan pesan khusus jika acara sudah berlangsung
            document.querySelector('.countdown-text').textContent = 'Acara Pernikahan Telah Berlangsung';
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
                <span class="comment-name">${name}</span>
                <span class="comment-date">${dateString} ${timeString}</span>
            </div>
            <div class="comment-message">${message}</div>
        `;
        
        commentsList.prepend(commentItem);
    }
    
    // Event listener untuk form komentar
    commentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('commentName').value.trim();
        const message = document.getElementById('commentMessage').value.trim();
        
        if (name && message) {
            addComment(name, message);
            
            // Reset form
            commentForm.reset();
            
            // Simpan komentar ke localStorage
            const comments = JSON.parse(localStorage.getItem('weddingComments') || '[]');
            comments.unshift({
                name: name,
                message: message,
                date: new Date().toISOString()
            });
            localStorage.setItem('weddingComments', JSON.stringify(comments));
            
            // Tampilkan pesan sukses
            alert('Ucapan Anda telah terkirim! Terima kasih atas doa dan restunya.');
        } else {
            alert('Harap isi nama dan ucapan Anda sebelum mengirim.');
        }
    });
    
    // Muat komentar dari localStorage saat halaman dimuat
    function loadComments() {
        const comments = JSON.parse(localStorage.getItem('weddingComments') || '[]');
        
        // Kosongkan daftar komentar terlebih dahulu
        commentsList.innerHTML = '';
        
        if (comments.length === 0) {
            commentsList.innerHTML = '<p style="text-align: center; color: #777; padding: 2rem;">Belum ada ucapan. Jadilah yang pertama memberikan ucapan!</p>';
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
                    <span class="comment-name">${comment.name}</span>
                    <span class="comment-date">${dateString} ${timeString}</span>
                </div>
                <div class="comment-message">${comment.message}</div>
            `;
            
            commentsList.appendChild(commentItem);
        });
    }
    
    // Panggil fungsi untuk memuat komentar
    loadComments();
    
    // Efek animasi saat halaman dimuat
    setTimeout(() => {
        const coverContainer = document.querySelector('.cover-container');
        coverContainer.style.opacity = '1';
        coverContainer.style.transform = 'translateY(0)';
    }, 300);
    
    // Tambahkan event listener untuk touch events pada perangkat mobile
    document.addEventListener('touchstart', function() {}, {passive: true});
    
    // Handler untuk error musik
    backgroundMusic.addEventListener('error', function(e) {
        console.error("Error loading audio:", e);
        musicToggle.style.display = 'none'; // Sembunyikan tombol musik jika error
    });
});
