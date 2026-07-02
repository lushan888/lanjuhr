// ====== 蓝巨人力官网 - JavaScript ======

document.addEventListener('DOMContentLoaded', function() {

    // ====== 导航栏滚动效果 ======
    const header = document.getElementById('navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // ====== 移动端菜单 ======
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });

    // 点击导航链接关闭菜单
    document.querySelectorAll('.nav-link').forEach(function(link) {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
        });
    });

    // ====== 数字动画 ======
    function animateNumbers() {
        var stats = document.querySelectorAll('.stat-num');
        stats.forEach(function(el) {
            var target = parseInt(el.getAttribute('data-target'));
            if (!target) return;
            var current = 0;
            var increment = Math.ceil(target / 60);
            var timer = setInterval(function() {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                el.textContent = current;
            }, 25);
        });
    }

    // ====== 滚动动画 ======
    function handleScrollAnimations() {
        // 数字动画 - 进入Hero区域触发
        var hero = document.querySelector('.hero');
        if (hero) {
            var heroBottom = hero.getBoundingClientRect().bottom;
            if (heroBottom > 0 && heroBottom < window.innerHeight) {
                var nums = document.querySelectorAll('.stat-num');
                var alreadyAnimated = false;
                nums.forEach(function(n) {
                    if (parseInt(n.textContent) > 0) alreadyAnimated = true;
                });
                if (!alreadyAnimated) animateNumbers();
            }
        }

        // 时间线动画
        var timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach(function(item) {
            var rect = item.getBoundingClientRect();
            if (rect.top < window.innerHeight - 80) {
                item.classList.add('visible');
            }
        });

        // 业务卡片动画
        var cards = document.querySelectorAll('.business-card');
        cards.forEach(function(card, i) {
            var rect = card.getBoundingClientRect();
            if (rect.top < window.innerHeight - 50) {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                card.style.transition = '0.6s ease ' + (i * 0.1) + 's';
            }
        });
    }

    // 初始化业务卡片
    document.querySelectorAll('.business-card').forEach(function(c) {
        c.style.opacity = '0';
        c.style.transform = 'translateY(30px)';
    });

    window.addEventListener('scroll', handleScrollAnimations);
    setTimeout(handleScrollAnimations, 300);

    // ====== 照片墙加载 ======
    var galleryGrid = document.getElementById('galleryGrid');
    if (galleryGrid) {
        // 尝试加载照片列表
        var photos = [];
        // 先从photo_01到photo_20找存在的照片
        for (var i = 1; i <= 20; i++) {
            photos.push('photos/photo_' + (i < 10 ? '0' + i : i) + '.jpg');
        }

        var loadedCount = 0;
        photos.forEach(function(src, idx) {
            var img = new Image();
            img.onload = function() {
                var item = document.createElement('div');
                item.className = 'gallery-item';
                var imgEl = document.createElement('img');
                imgEl.src = src;
                imgEl.alt = '蓝巨人力工作掠影';
                item.appendChild(imgEl);
                item.addEventListener('click', function() {
                    openLightbox(src);
                });
                galleryGrid.appendChild(item);
                loadedCount++;
            };
            img.onerror = function() {};
            img.src = 'assets/' + src;
        });

        // 如果没加载到照片，显示占位
        setTimeout(function() {
            if (loadedCount === 0) {
                for (var i = 1; i <= 4; i++) {
                    var item = document.createElement('div');
                    item.className = 'gallery-item';
                    item.style.cssText = 'background: linear-gradient(135deg, var(--primary), var(--primary-light)); display: flex; align-items: center; justify-content: center; color: white; font-size: 14px;';
                    item.textContent = '照片 ' + i;
                    galleryGrid.appendChild(item);
                }
            }
        }, 1000);
    }

    // ====== Lightbox ======
    var lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.id = 'lightbox';
    lightbox.innerHTML = '<span class="lightbox-close" id="lightboxClose">&times;</span><img id="lightboxImg" src="" alt="">';
    document.body.appendChild(lightbox);

    function openLightbox(src) {
        var img = document.getElementById('lightboxImg');
        img.src = src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeLightbox();
    });

    // ====== 平滑锚点滚动 ======
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

});
