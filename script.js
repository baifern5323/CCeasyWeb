// --- GIMMICK 1: Custom Cursor ---
const cursorDot = document.getElementById("cursor-dot");
const cursorOutline = document.getElementById("cursor-outline");

window.addEventListener("mousemove", (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    // Dot follows immediately
    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    // Outline follows with slight delay (animation in CSS)
    cursorOutline.style.left = `${posX}px`;
    cursorOutline.style.top = `${posY}px`;
    
    // Re-render animation keyframe (hacky smooth follow)
    cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
    }, { duration: 500, fill: "forwards" });
});

// Add hover effect to interactive elements
const hoverables = document.querySelectorAll('.hoverable, a, button, input, select, textarea');
hoverables.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
});


// --- GIMMICK 2: Typewriter Effect ---
const typeText = document.getElementById('typewriter-text');
const phrases = ["ลูกค้าตัวจริงของคุณ", "แฟนคลับของแบรนด์", "ยอดขายที่ยั่งยืน"];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 100;

function type() {
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
        typeText.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 50;
    } else {
        typeText.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 100;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        typeSpeed = 2000; // Pause at end
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 500; // Pause before new word
    }

    setTimeout(type, typeSpeed);
}
// Start typing
setTimeout(type, 1000);


// --- GIMMICK 3: 3D Tilt Effect ---
const tiltCards = document.querySelectorAll('.tilt-card');

tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Calculate rotation based on center of card
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -10; // Max 10 deg
        const rotateY = ((x - centerX) / centerX) * 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
});


// --- GIMMICK 4: Animated Counter ---
const counters = document.querySelectorAll('.count-up');
const speed = 200; // The lower the slower

const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counter = entry.target;
            const target = +counter.getAttribute('data-target');
            
            const updateCount = () => {
                const count = +counter.innerText;
                const inc = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 20);
                } else {
                    counter.innerText = target + (target > 100 ? "+" : ""); // Add + for big numbers
                }
            };
            updateCount();
            countObserver.unobserve(counter);
        }
    });
}, { threshold: 0.5 });

counters.forEach(counter => countObserver.observe(counter));


// --- Existing Logic (Navbar, FadeIn, AI, Forms) ---
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('shadow-md');
        navbar.classList.replace('bg-white/90', 'bg-white/95');
    } else {
        navbar.classList.remove('shadow-md');
        navbar.classList.replace('bg-white/95', 'bg-white/90');
    }
});

const btn = document.getElementById('mobile-menu-btn');
const menu = document.getElementById('mobile-menu');
btn.addEventListener('click', () => {
    menu.classList.toggle('hidden');
});
document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        menu.classList.add('hidden');
    });
});

const form = document.getElementById('contactForm');
const modal = document.getElementById('successModal');
const modalContent = document.getElementById('modalContent');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modalContent.classList.remove('scale-90');
        modalContent.classList.add('scale-100');
    }, 10);
    form.reset();
});

function closeModal() {
    modal.classList.add('opacity-0');
    modalContent.classList.remove('scale-100');
    modalContent.classList.add('scale-90');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { root: null, rootMargin: '0px', threshold: 0.1 });

document.querySelectorAll('.fade-in-up').forEach((el) => {
    observer.observe(el);
});

// Gemini AI Logic
async function generatePlan() {
    const bizName = document.getElementById('aiBizName').value.trim();
    const bizDesc = document.getElementById('aiBizDesc').value.trim();
    
    if(!bizName || !bizDesc) {
        alert('กรุณากรอกข้อมูลชื่อธุรกิจและรายละเอียดให้ครบถ้วน');
        return;
    }

    const btn = document.getElementById('aiBtn');
    const resultDiv = document.getElementById('aiResult');
    const loadingDiv = document.getElementById('aiLoading');

    btn.disabled = true;
    btn.classList.add('opacity-75', 'cursor-not-allowed');
    resultDiv.classList.add('hidden');
    loadingDiv.classList.remove('hidden');

    try {
        const prompt = `Act as a professional web consultant and copywriter. 
        A client has a business named '${bizName}' described as '${bizDesc}'.
        
        Please provide a website plan in Thai language.
        Return ONLY a JSON object with this structure (no markdown formatting, just raw JSON):
        {
            "headline": "A short, catchy, professional Hero Section Headline (H1)",
            "subheadline": "A persuasive subheadline explaining the value proposition",
            "sitemap": ["Page 1", "Page 2", "Page 3", "Page 4 (add emojis if appropriate)"],
            "features": ["Feature 1", "Feature 2", "Feature 3"],
            "marketing_tip": "One short, actionable marketing tip for this specific business type"
        }`;

        // !!! ใส่ API KEY ของคุณตรงนี้ !!!
        const apiKey = ""; 
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { responseMimeType: "application/json" }
            })
        });

        const data = await response.json();
        
        let aiResponse;
        try {
            aiResponse = JSON.parse(data.candidates[0].content.parts[0].text);
        } catch (e) {
            const cleanText = data.candidates[0].content.parts[0].text.replace(/```json/g, '').replace(/```/g, '');
            aiResponse = JSON.parse(cleanText);
        }

        let sitemapHtml = aiResponse.sitemap.map(page => 
            `<span class="bg-white border border-violet-100 text-primary px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm transform hover:scale-105 transition cursor-default">${page}</span>`
        ).join('');
        
        let featuresHtml = aiResponse.features.map(feat => 
            `<li class="flex items-start gap-3 bg-white p-3 rounded-lg border border-gray-50 shadow-sm hover:shadow-md transition">
                <i class="fas fa-check-circle text-brandGreen mt-1 flex-shrink-0"></i>
                <span class="text-slate-600 font-medium">${feat}</span>
            </li>`
        ).join('');

        resultDiv.innerHTML = `
            <div class="bg-gradient-to-br from-violet-50 to-white border border-violet-100 rounded-2xl p-6 mb-6 shadow-sm relative overflow-hidden">
                <div class="absolute top-0 right-0 p-4 opacity-10"><i class="fas fa-quote-right text-6xl text-primary"></i></div>
                <h3 class="text-lg font-bold text-secondary mb-4 flex items-center gap-2">
                    <i class="fas fa-lightbulb text-accent animate-pulse"></i> ไอเดียสำหรับ ${bizName}
                </h3>
                <div class="mb-2 relative z-10">
                    <p class="text-xs text-slate-400 uppercase font-bold tracking-wider mb-2">Recommended Headline</p>
                    <p class="text-2xl md:text-3xl font-bold text-primary mb-2 leading-tight">"${aiResponse.headline}"</p>
                    <p class="text-slate-600 font-medium">${aiResponse.subheadline}</p>
                </div>
            </div>
            
            <div class="grid md:grid-cols-2 gap-8">
                <div>
                    <h4 class="font-bold text-secondary mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
                        <i class="fas fa-sitemap text-primary"></i> โครงสร้างเว็บ (Sitemap)
                    </h4>
                    <div class="flex flex-wrap gap-2">
                        ${sitemapHtml}
                    </div>
                </div>
                <div>
                    <h4 class="font-bold text-secondary mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
                        <i class="fas fa-star text-brandRed"></i> ฟีเจอร์แนะนำ
                    </h4>
                    <ul class="space-y-2 text-sm">
                        ${featuresHtml}
                    </ul>
                </div>
            </div>

            <div class="mt-8 pt-6 border-t border-gray-100 bg-accent/5 p-4 rounded-xl transform hover:scale-[1.01] transition duration-300">
                <p class="text-sm text-slate-700 font-medium">
                    <span class="font-bold text-accent mr-1"><i class="fas fa-bullhorn"></i> Tips:</span> 
                    ${aiResponse.marketing_tip}
                </p>
            </div>
            
            <div class="mt-8 text-center animate-bounce-slow">
                <p class="text-sm text-slate-400 mb-2">นี่เป็นเพียงไอเดียเบื้องต้น ปรึกษาเราเพื่อสร้างของจริงได้ทันที</p>
                <a href="#contact" class="inline-flex items-center gap-2 bg-secondary text-white px-8 py-3 rounded-full text-sm font-bold hover:bg-slate-800 transition shadow-lg hoverable">
                    คุยรายละเอียดโปรเจกต์นี้ <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        `;

        resultDiv.classList.remove('hidden');
        resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    } catch (error) {
        console.error('Gemini API Error:', error);
        alert('เกิดข้อผิดพลาดในการเชื่อมต่อกับ AI กรุณาลองใหม่อีกครั้ง');
    } finally {
        loadingDiv.classList.add('hidden');
        btn.disabled = false;
        btn.classList.remove('opacity-75', 'cursor-not-allowed');
    }
}