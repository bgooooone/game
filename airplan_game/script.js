// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function () {
    // 初始化所有功能
    initNavigation();
    initScrollEffects();
    initSkillBars();
    initProjectModals();
    initContactForm();
    initSmoothScrolling();
    initImageUpload();
    initTheme();
    initI18n();
});

// 导航栏功能
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // 汉堡菜单切换
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function () {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // 点击导航链接时关闭移动菜单
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            if (navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });

    // 滚动时导航栏样式变化
    window.addEventListener('scroll', function () {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        if (window.scrollY > 50) {
            navbar.style.background = isDark ? 'rgba(17, 24, 39, 0.9)' : 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.2)';
        } else {
            navbar.style.background = isDark ? 'rgba(17, 24, 39, 0.8)' : 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });
}

// 滚动效果
function initScrollEffects() {
    // 创建Intersection Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');

                // 如果是技能条，启动动画
                if (entry.target.classList.contains('skill-progress')) {
                    animateSkillBar(entry.target);
                }
            }
        });
    }, observerOptions);

    // 观察需要动画的元素
    const animatedElements = document.querySelectorAll('.project-card, .skill-item, .stat, .contact-item');
    animatedElements.forEach(el => observer.observe(el));
}

// 技能条动画
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach(bar => {
        // 设置初始宽度为0
        bar.style.width = '0%';
    });
}

function animateSkillBar(bar) {
    const targetWidth = bar.getAttribute('data-width');
    bar.style.width = targetWidth;
}

// 项目模态框功能
function initProjectModals() {
    const modal = document.getElementById('project-modal');
    const closeBtn = document.querySelector('.close');
    const modalBody = document.getElementById('modal-body');

    // 项目详情数据
    const projectDetails = {
        'airplane-game': {
            title: '飞机大战游戏',
            description: '这是一个使用Python和Pygame开发的2D射击游戏，具有以下特色功能：',
            features: [
                '动态背景滚动效果',
                '护盾系统保护玩家',
                '等级系统和难度递增',
                '多种敌机类型',
                '音效和视觉效果',
                '高分记录系统'
            ],
            technologies: ['Python', 'Pygame', 'PIL', 'NumPy'],
            images: ['assets/images/preview.gif'],
            github: '#',
            demo: '#'
        },
        'portfolio-website': {
            title: '个人作品集网站',
            description: '响应式个人作品集网站，采用现代设计理念，具有以下特色：',
            features: [
                '完全响应式设计',
                '照片上传功能',
                '项目展示模态框',
                '技能条动画效果',
                '平滑滚动导航',
                '本地存储功能'
            ],
            technologies: ['HTML5', 'CSS3', 'JavaScript', '响应式设计'],
            images: [],
            github: '#',
            demo: '#'
        },
        'task-manager': {
            title: '智能任务管理器',
            description: '基于React开发的现代化任务管理应用，具有以下功能：',
            features: [
                '拖拽排序任务',
                '标签分类系统',
                '进度跟踪',
                '团队协作',
                '数据可视化',
                '移动端适配'
            ],
            technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
            images: [],
            github: '#',
            demo: '#'
        },
        'weather-app': {
            title: '天气预报应用',
            description: '实时天气预报应用，提供准确的天气信息：',
            features: [
                '实时天气数据',
                '7天天气预报',
                '天气预警系统',
                '多城市查询',
                'PWA支持',
                '离线缓存'
            ],
            technologies: ['Vue.js', 'API集成', 'PWA', 'Service Worker'],
            images: [],
            github: '#',
            demo: '#'
        },
        'chat-room': {
            title: '实时聊天室',
            description: '基于WebSocket的实时聊天应用，支持多种功能：',
            features: [
                '实时消息传输',
                '多房间支持',
                '私聊功能',
                '文件传输',
                '表情包支持',
                '用户状态管理'
            ],
            technologies: ['Socket.io', 'Node.js', 'Express', 'Redis'],
            images: [],
            github: '#',
            demo: '#'
        },
        'ecommerce': {
            title: '电商平台',
            description: '全栈电商网站，提供完整的购物体验：',
            features: [
                '用户注册登录',
                '商品展示搜索',
                '购物车功能',
                '支付集成',
                '订单管理',
                '后台管理系统'
            ],
            technologies: ['React', 'Redux', 'PostgreSQL', 'Stripe API'],
            images: [],
            github: '#',
            demo: '#'
        }
    };

    // 关闭模态框
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // 显示项目详情
    window.showProjectDetails = function (projectId) {
        const project = projectDetails[projectId];
        if (project) {
            modalBody.innerHTML = `
                <h2>${project.title}</h2>
                <p class="project-description">${project.description}</p>
                <div class="project-features">
                    <h3>主要功能</h3>
                    <ul>
                        ${project.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>
                <div class="project-technologies">
                    <h3>使用技术</h3>
                    <div class="tech-tags">
                        ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                </div>
                <div class="project-links">
                    <a href="${project.github}" class="btn btn-primary" target="_blank">
                        <i class="fab fa-github"></i> 查看源码
                    </a>
                    <a href="${project.demo}" class="btn btn-secondary" target="_blank">
                        <i class="fas fa-play"></i> 在线演示
                    </a>
                </div>
            `;
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    };

    // 下载游戏功能
    window.downloadGame = function () {
        // 创建下载链接
        const link = document.createElement('a');
        link.href = 'dist/main.exe'; // 假设游戏可执行文件在dist目录
        link.download = '飞机大战游戏.exe';
        link.click();

        // 显示下载提示
        showNotification('游戏开始下载，请稍候...', 'success');
    };

    // 事件监听器
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    if (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // ESC键关闭模态框
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
}

// 联系表单功能
function initContactForm() {
    const form = document.querySelector('.contact-form');

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            // 获取表单数据
            const formData = new FormData(form);
            const name = form.querySelector('input[type="text"]').value;
            const email = form.querySelector('input[type="email"]').value;
            const subject = form.querySelectorAll('input[type="text"]')[1].value;
            const message = form.querySelector('textarea').value;

            // 简单验证
            if (!name || !email || !subject || !message) {
                showNotification('请填写所有必填字段', 'error');
                return;
            }

            if (!isValidEmail(email)) {
                showNotification('请输入有效的邮箱地址', 'error');
                return;
            }

            // 模拟发送
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;

            submitBtn.innerHTML = '<span class="loading"></span> 发送中...';
            submitBtn.disabled = true;

            setTimeout(() => {
                showNotification('消息发送成功！我会尽快回复您。', 'success');
                form.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
}

// 邮箱验证
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 平滑滚动
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // 考虑导航栏高度
                // 全屏遮罩 + 目标区块过渡
                const overlay = document.querySelector('.page-overlay');
                document.body.classList.add('overlay-active');
                setTimeout(() => {
                    // 目标元素入场
                    targetSection.classList.add('page-transition-enter');
                    requestAnimationFrame(() => {
                        targetSection.classList.add('page-transition-enter-active');
                    });
                    window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                }, 30);
                setTimeout(() => {
                    targetSection.classList.remove('page-transition-enter', 'page-transition-enter-active');
                    document.body.classList.remove('overlay-active');
                }, 550);
            }
        });
    });
}

// 通知系统
function showNotification(message, type = 'info') {
    // 移除现有通知
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // 添加样式
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 3000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;

    document.body.appendChild(notification);

    // 显示动画
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // 关闭按钮
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });

    // 自动关闭
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    return icons[type] || icons.info;
}

function getNotificationColor(type) {
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    return colors[type] || colors.info;
}

// 页面加载动画
window.addEventListener('load', function () {
    document.body.classList.add('loaded');

    // 延迟显示元素
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        setTimeout(() => {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 300);
    }
});

// 主题切换
function initTheme() {
    const root = document.documentElement;
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (prefersDark ? 'dark' : 'light');
    setTheme(theme);

    const toggle = document.getElementById('themeToggle');
    if (toggle) {
        toggle.addEventListener('click', () => {
            const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            setTheme(next);
        });
    }

    // 系统主题变化监听
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
}

function setTheme(theme) {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    const icon = document.querySelector('#themeToggle i');
    if (icon) {
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// 多语言
function initI18n() {
    const dict = {
        zh: {
            'about.timeline.title': '专业经历',
            'about.timeline.r1.title': '全栈开发工程师 · 自由职业',
            'about.timeline.r1.desc': '负责从前端到后端的端到端交付，涵盖需求澄清、技术选型、实现与上线。',
            'about.timeline.r2.title': '前端开发工程师 · 互联网公司',
            'about.timeline.r2.desc': '负责Web前端架构与性能优化，推动设计系统与组件化落地。',
            'about.timeline.r3.title': '游戏开发实习生 · 独立团队',
            'about.timeline.r3.desc': '参与2D游戏原型迭代与玩法验证，完成工具链脚本与关卡编辑。',
            'about.achievements.title': '个人成就与证书',
            'about.achievements.a1.title': '开源贡献',
            'about.achievements.a1.desc': '为多个开源项目提交PR并被合并，涉及工具链与UI组件。',
            'about.achievements.a2.title': '前端工程化证书',
            'about.achievements.a2.desc': '系统完成现代前端工程化课程并获得认证。',
            'about.achievements.a3.title': '编程竞赛优胜',
            'about.achievements.a3.desc': '若干校级/市级编程竞赛中取得优胜成绩。',
            'contact.map.title': '我的位置',
            'hero.title': '你好，我是 <span class="highlight">开发者</span>',
            'hero.desc': '我是一名充满热情的程序员，专注于游戏开发和Web开发。 喜欢创造有趣的项目，将创意转化为现实。',
            'hero.viewProjects': '查看作品',
            'hero.contactMe': '联系我',
            'about.title': '关于我',
            'about.story': '我的故事',
            'about.p1': '我是一名充满热情的开发者，专注于游戏开发和Web应用开发。 从大学时期开始接触编程，我就被代码的魅力深深吸引。 我喜欢将创意转化为现实，创造有趣且实用的项目。',
            'about.p2': '在编程的道路上，我不断学习新技术，提升自己的技能。 从Python游戏开发到现代Web技术，我始终保持着对技术的热爱和好奇心。 我相信技术可以改变世界，让生活变得更加美好。',
            'about.p3': '除了编程，我还喜欢摄影、音乐和旅行。这些爱好让我在技术之外，也能从不同角度思考问题，为我的项目带来更多创意和灵感。',
            'about.years': '年开发经验',
            'about.projects': '完成项目',
            'about.stacks': '技术栈',
            'about.satisfaction': '客户满意度',
            'about.upload': '点击上传照片',
            'about.changePhoto': '更换照片',
            'projects.title': '我的作品',
            'projects.airplane.title': '飞机大战游戏',
            'projects.airplane.desc': '使用Python + Pygame开发的2D射击游戏，包含动态背景、护盾系统、等级系统等特色功能。',
            'projects.portfolio.title': '个人作品集网站',
            'projects.portfolio.desc': '响应式个人作品集网站，采用现代设计理念，展示个人项目和技能。支持照片上传、项目展示等功能。',
            'projects.task.title': '智能任务管理器',
            'projects.task.desc': '基于React开发的现代化任务管理应用，支持拖拽排序、标签分类、进度跟踪等功能。',
            'projects.weather.title': '天气预报应用',
            'projects.weather.desc': '实时天气预报应用，支持多城市查询、7天预报、天气预警等功能。使用OpenWeatherMap API。',
            'projects.chat.title': '实时聊天室',
            'projects.chat.desc': '基于WebSocket的实时聊天应用，支持多房间、私聊、文件传输、表情包等功能。',
            'projects.ecommerce.title': '电商平台',
            'projects.ecommerce.desc': '全栈电商网站，包含用户管理、商品展示、购物车、支付集成、订单管理等功能。',
            'skills.title': '技能专长',
            'skills.languages': '编程语言',
            'skills.frameworks': '框架与工具',
            'testimonials.title': '客户评价',
            'testimonials.t1': '"非常专业的开发者，项目完成度很高，沟通也很顺畅。强烈推荐！"',
            'testimonials.a1': '张经理',
            'testimonials.a1title': '某科技公司产品经理',
            'testimonials.t2': '"技术实力很强，能够快速理解需求并给出最佳解决方案。合作很愉快！"',
            'testimonials.a2': '李总',
            'testimonials.a2title': '创业公司CEO',
            'testimonials.t3': '"代码质量很高，文档也很详细。后续维护很方便，值得信赖的合作伙伴。"',
            'testimonials.a3': '王总监',
            'testimonials.a3title': '互联网公司技术总监',
            'contact.title': '联系我',
            'contact.subtitle': '让我们开始对话',
            'contact.desc': '如果您对我的作品感兴趣，或者有合作的想法，欢迎联系我！',
            'contact.location': '中国，广东',
            'contact.form.name': '您的姓名',
            'contact.form.email': '您的邮箱',
            'contact.form.subject': '主题',
            'contact.form.message': '您的消息',
            'contact.form.send': '发送消息',
            'nav.home': '首页',
            'nav.about': '关于',
            'nav.projects': '作品',
            'nav.testimonials': '评价',
            'nav.contact': '联系',
            'footer.copyright': '© 2024 个人作品集. 保留所有权利.'
        },
        en: {
            'about.timeline.title': 'Professional Experience',
            'about.timeline.r1.title': 'Full‑stack Developer · Freelancer',
            'about.timeline.r1.desc': 'End‑to‑end delivery from frontend to backend: requirements, tech choices, implementation and release.',
            'about.timeline.r2.title': 'Frontend Engineer · Internet Company',
            'about.timeline.r2.desc': 'Led web architecture and performance, drove design system and componentization.',
            'about.timeline.r3.title': 'Game Dev Intern · Indie Team',
            'about.timeline.r3.desc': 'Iterated 2D game prototypes, built tooling scripts and level editor.',
            'about.achievements.title': 'Achievements & Certificates',
            'about.achievements.a1.title': 'Open Source Contributions',
            'about.achievements.a1.desc': 'Submitted PRs merged across projects, tooling and UI components.',
            'about.achievements.a2.title': 'Frontend Engineering Certificate',
            'about.achievements.a2.desc': 'Completed modern frontend engineering course with certification.',
            'about.achievements.a3.title': 'Programming Contest Awards',
            'about.achievements.a3.desc': 'Won several school/city‑level programming contests.',
            'contact.map.title': 'My Location',
            'hero.title': 'Hi, I am <span class="highlight">Developer</span>',
            'hero.desc': 'I am a passionate programmer focusing on game and web development. I love creating fun projects and turning ideas into reality.',
            'hero.viewProjects': 'View Projects',
            'hero.contactMe': 'Contact Me',
            'about.title': 'About Me',
            'about.story': 'My Story',
            'about.p1': 'I am an enthusiastic developer focusing on game and web apps. Since college, I have been fascinated by code and enjoy turning ideas into practical projects.',
            'about.p2': 'I keep learning new technologies and improving my skills. From Python game dev to modern web, my curiosity never stops. I believe tech makes life better.',
            'about.p3': 'Besides coding, I enjoy photography, music, and travel, which inspire creativity from different perspectives.',
            'about.years': 'Years of Experience',
            'about.projects': 'Projects Completed',
            'about.stacks': 'Tech Stacks',
            'about.satisfaction': 'Client Satisfaction',
            'about.upload': 'Click to upload photo',
            'about.changePhoto': 'Change Photo',
            'projects.title': 'Projects',
            'projects.airplane.title': 'Airplane Shooter',
            'projects.airplane.desc': 'A 2D shooter made with Python + Pygame featuring dynamic background, shields, and leveling.',
            'projects.portfolio.title': 'Portfolio Website',
            'projects.portfolio.desc': 'Responsive portfolio with modern design, photo upload and project modals.',
            'projects.task.title': 'Task Manager',
            'projects.task.desc': 'Modern task manager built with React, supporting drag-n-drop, labels, and tracking.',
            'projects.weather.title': 'Weather App',
            'projects.weather.desc': 'Real-time weather app with multi-city search, 7-day forecast, and alerts using OpenWeatherMap.',
            'projects.chat.title': 'Realtime Chat',
            'projects.chat.desc': 'WebSocket-based chat with rooms, DM, file transfer, and emojis.',
            'projects.ecommerce.title': 'E-commerce',
            'projects.ecommerce.desc': 'Full-stack e-commerce with users, catalog, cart, payments, and orders.',
            'skills.title': 'Skills',
            'skills.languages': 'Languages',
            'skills.frameworks': 'Frameworks & Tools',
            'testimonials.title': 'Testimonials',
            'testimonials.t1': '"Very professional developer. High completion and smooth communication. Highly recommended!"',
            'testimonials.a1': 'Manager Zhang',
            'testimonials.a1title': 'Product Manager at Tech Co.',
            'testimonials.t2': '"Strong technical skills and quickly understands requirements with optimal solutions."',
            'testimonials.a2': 'Mr. Li',
            'testimonials.a2title': 'Startup CEO',
            'testimonials.t3': '"High code quality and detailed docs. Easy to maintain and trustworthy."',
            'testimonials.a3': 'Director Wang',
            'testimonials.a3title': 'Tech Director at Internet Co.',
            'contact.title': 'Contact Me',
            'contact.subtitle': "Let's Start a Conversation",
            'contact.desc': 'If you like my work or want to collaborate, feel free to reach out!',
            'contact.location': 'Beijing, China',
            'contact.form.name': 'Your Name',
            'contact.form.email': 'Your Email',
            'contact.form.subject': 'Subject',
            'contact.form.message': 'Your Message',
            'contact.form.send': 'Send Message',
            'nav.home': 'Home',
            'nav.about': 'About',
            'nav.projects': 'Projects',
            'nav.testimonials': 'Testimonials',
            'nav.contact': 'Contact',
            'footer.copyright': '© 2024 Portfolio. All rights reserved.'
        }
    };

    const select = document.getElementById('langSelect');
    const savedLang = localStorage.getItem('lang') || 'zh';
    applyI18n(dict, savedLang);
    if (select) {
        select.value = savedLang;
        select.addEventListener('change', () => {
            const lang = select.value;
            localStorage.setItem('lang', lang);
            applyI18n(dict, lang);
        });
    }
}

function applyI18n(dict, lang) {
    const nodes = document.querySelectorAll('[data-i18n]');
    nodes.forEach(node => {
        const key = node.getAttribute('data-i18n');
        const html = dict[lang] && dict[lang][key];
        if (html !== undefined) node.innerHTML = html;
    });

    const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
    placeholders.forEach(input => {
        const key = input.getAttribute('data-i18n-placeholder');
        const text = dict[lang] && dict[lang][key];
        if (text !== undefined) input.setAttribute('placeholder', text);
    });
}

// 返回顶部按钮
function createBackToTopButton() {
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTop.className = 'back-to-top';
    backToTop.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--gradient-primary);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1.2rem;
        box-shadow: var(--shadow-lg);
        transition: var(--transition);
        z-index: 1000;
        opacity: 0;
        visibility: hidden;
    `;

    document.body.appendChild(backToTop);

    // 滚动显示/隐藏
    window.addEventListener('scroll', function () {
        if (window.scrollY > 300) {
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
        }
    });

    // 点击返回顶部
    backToTop.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 悬停效果
    backToTop.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-3px) scale(1.1)';
    });

    backToTop.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0) scale(1)';
    });
}

// 初始化返回顶部按钮
createBackToTopButton();

// 键盘导航支持
document.addEventListener('keydown', function (e) {
    // Tab键导航增强
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

// 鼠标导航时移除键盘导航样式
document.addEventListener('mousedown', function () {
    document.body.classList.remove('keyboard-navigation');
});

// 性能优化：防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 优化滚动事件
const optimizedScrollHandler = debounce(function () {
    // 滚动相关的性能优化处理
}, 16); // 约60fps

window.addEventListener('scroll', optimizedScrollHandler);

// 照片上传功能
function initImageUpload() {
    const imageUpload = document.getElementById('imageUpload');
    const imagePlaceholder = document.getElementById('imagePlaceholder');
    const uploadOverlay = document.getElementById('uploadOverlay');
    const uploadBtn = document.getElementById('uploadBtn');
    const uploadContainer = document.querySelector('.image-upload-container');

    if (!imageUpload || !imagePlaceholder || !uploadOverlay || !uploadBtn) {
        return;
    }

    // 点击容器触发文件选择
    uploadContainer.addEventListener('click', function (e) {
        if (e.target !== uploadBtn) {
            imageUpload.click();
        }
    });

    // 点击上传按钮
    uploadBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        imageUpload.click();
    });

    // 文件选择处理
    imageUpload.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            // 验证文件类型
            if (!file.type.startsWith('image/')) {
                showNotification('请选择图片文件', 'error');
                return;
            }

            // 验证文件大小 (5MB限制)
            if (file.size > 5 * 1024 * 1024) {
                showNotification('图片文件过大，请选择小于5MB的图片', 'error');
                return;
            }

            // 创建图片预览
            const reader = new FileReader();
            reader.onload = function (e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.alt = '个人照片';

                // 清除原有内容并添加新图片
                imagePlaceholder.innerHTML = '';
                imagePlaceholder.appendChild(img);

                // 保存到本地存储
                localStorage.setItem('profileImage', e.target.result);

                showNotification('照片上传成功！', 'success');
            };
            reader.readAsDataURL(file);
        }
    });

    // 页面加载时检查是否有保存的照片
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) {
        const img = document.createElement('img');
        img.src = savedImage;
        img.alt = '个人照片';
        imagePlaceholder.innerHTML = '';
        imagePlaceholder.appendChild(img);
    }

    // 拖拽上传功能
    uploadContainer.addEventListener('dragover', function (e) {
        e.preventDefault();
        uploadContainer.style.border = '2px dashed var(--primary-color)';
        uploadContainer.style.background = 'rgba(102, 126, 234, 0.1)';
    });

    uploadContainer.addEventListener('dragleave', function (e) {
        e.preventDefault();
        uploadContainer.style.border = 'none';
        uploadContainer.style.background = 'transparent';
    });

    uploadContainer.addEventListener('drop', function (e) {
        e.preventDefault();
        uploadContainer.style.border = 'none';
        uploadContainer.style.background = 'transparent';

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                // 模拟文件选择
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                imageUpload.files = dataTransfer.files;

                // 触发change事件
                const event = new Event('change', { bubbles: true });
                imageUpload.dispatchEvent(event);
            } else {
                showNotification('请拖拽图片文件', 'error');
            }
        }
    });
}
