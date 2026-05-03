let currentAvatar = '';
const fonts = ["'Space Grotesk'", "'Michroma'", "'Syncopate'"];
const phrases = ["VELVIA.AI", "NEURAL CORE", "SYSTEM ARCHITECT"];
let fIdx = 0, charIdx = 0, isErase = false;

// 11. Consistent Purple Headings (Render Phase)
const renderer = new marked.Renderer();
renderer.heading = function(token, level, raw, slugger) {
    let headingText = token;
    let headingLevel = level;
    
    // Support for modern marked.js (v5+) where the first argument is a token object
    if (typeof token === 'object' && token !== null) {
        headingText = token.text;
        headingLevel = token.depth;
    }
    
    return `<h${headingLevel} style="color: #9d4edd !important; margin-top: 1.5rem; margin-bottom: 0.75rem; font-weight: bold; font-family: 'Michroma', sans-serif; letter-spacing: 0.05em;">${headingText}</h${headingLevel}>`;
};
marked.use({ renderer });

// 12. Isolated Session Storage
let sessionMessages = { zenvix: [], aarvix: [] };

// 1. Typewriter Animation
function typewriter() {
    const el = document.getElementById('typing-text');
    if(!el) return;
    el.parentElement.style.fontFamily = fonts[fIdx];
    let cur = phrases[fIdx];
    if (!isErase) {
        el.textContent = cur.substring(0, charIdx++);
        if (charIdx > cur.length) { setTimeout(() => isErase = true, 2500); }
    } else {
        el.textContent = cur.substring(0, charIdx--);
        if (charIdx < 0) { isErase = false; fIdx = (fIdx + 1) % fonts.length; }
    }
    setTimeout(typewriter, isErase ? 50 : 120);
}

const introData = {
    zenvix: { name: "ZENVIX", bio: "Elite ML System Architect specialized in neural optimization.", img: "/static/images/zenvix_bot.png" },
    aarvix: { name: "AARVIX", bio: "Intuitive AI Strategist focused on accessible solution design.", img: "/static/images/aarvix_bot.png" }
};

function showIntro(id) {
    currentAvatar = id; const data = introData[id];
    document.getElementById('introName').innerText = data.name;
    document.getElementById('introBio').innerText = data.bio;
    document.getElementById('introBotImg').src = data.img;
    document.getElementById('introBotImg').className = `w-64 z-10 floating ${id}-glow`;
    document.getElementById('introStand').className = `hologram-stand ring-${id}`;
    
    // Dynamic styling
    const line = document.getElementById('introLine');
    const btn = document.getElementById('introBtn');
    const glow = document.getElementById('introCardGlow');
    
    if (id === 'zenvix') {
        line.className = 'h-[6px] w-24 rounded-full bg-[#9d4edd] shadow-[0_0_15px_#9d4edd] opacity-0';
        btn.className = 'px-12 py-5 bg-transparent text-white font-bold uppercase rounded-full border-2 border-[#9d4edd] hover:bg-[#9d4edd] hover:text-white transition-all shadow-[0_0_20px_rgba(157,78,221,0.3)] active:scale-95 opacity-0 mt-8 font-space';
        glow.className = 'absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[2px] blur-[2px] bg-[#9d4edd]/60';
    } else {
        line.className = 'h-[6px] w-24 rounded-full bg-[#00f5ff] shadow-[0_0_15px_#00f5ff] opacity-0';
        btn.className = 'px-12 py-5 bg-transparent text-white font-bold uppercase rounded-full border-2 border-[#00f5ff] hover:bg-[#00f5ff] hover:text-[#1a1a1a] transition-all shadow-[0_0_20px_rgba(0,245,255,0.3)] active:scale-95 opacity-0 mt-8 font-space';
        glow.className = 'absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[2px] blur-[2px] bg-[#00f5ff]/60';
    }

    // Reset animations
    document.getElementById('introName').style.animation = 'none';
    document.getElementById('introBio').style.animation = 'none';
    line.style.animation = 'none';
    btn.style.animation = 'none';
    
    // Trigger animations
    setTimeout(() => {
        document.getElementById('introName').style.animation = 'slideUpFade 0.8s ease-out forwards';
        line.style.animation = 'slideUpFade 0.8s ease-out 0.1s forwards';
        document.getElementById('introBio').style.animation = 'slideUpFade 0.8s ease-out 0.2s forwards';
        btn.style.animation = 'slideUpFade 0.8s ease-out 0.3s forwards';
    }, 50);

    document.getElementById('avatarPage').classList.add('hidden');
    document.getElementById('introPage').classList.remove('hidden');
}

function startNeuralLink() {
    document.getElementById('introPage').classList.add('hidden');
    document.getElementById('chatPage').classList.remove('hidden');
    document.getElementById('sidebarAvatarIcon').src = introData[currentAvatar].img;
    document.getElementById('sidebarAvatarIcon').className = `w-32 z-10 floating ${currentAvatar}-glow`;
    document.getElementById('sidebarName').innerText = currentAvatar.toUpperCase();
    document.getElementById('sidebarRing').className = `hologram-stand scale-50 ring-${currentAvatar}`;
    document.getElementById('sidebar').className = `w-80 border-r border-white/10 p-6 flex flex-col bg-black/20 ${currentAvatar}-active`;
    
    loadSession();
}

function loadSession() {
    const container = document.getElementById('messagesContainer');
    container.innerHTML = '';
    
    if (sessionMessages[currentAvatar].length === 0) {
        let greeting = currentAvatar === 'zenvix' 
            ? "ZENVIX INITIALIZED. Awaiting technical inquiry regarding AI/ML architectures, or algorithmic complexity analysis..."
            : "Hello! I'm AARVIX! 🌟 I'm here to help you understand AI using simple, everyday analogies. What would you like to explore today?";
        appendMessage(greeting, 'bot', false);
    } else {
        sessionMessages[currentAvatar].forEach(msg => {
            renderMessageUI(msg.content, msg.role);
        });
    }
    
    // Refresh Quick Suggestions
    if (typeof loadNeuralSuggestions === 'function') {
        loadNeuralSuggestions(currentAvatar);
    }
}

async function newSession() {
    sessionMessages[currentAvatar] = [];
    document.getElementById('messagesContainer').innerHTML = '';
    
    try {
        await fetch('/api/reset', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ avatar: currentAvatar })
        });
    } catch(e) {}
    
    loadSession();
}

async function sendMessage() {
    const input = document.getElementById('userInput');
    const msg = input.value.trim();
    if (!msg) return;
    appendMessage(msg, 'user');
    input.value = '';
    
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: msg, avatar: currentAvatar })
        });
        const data = await response.json();
        if (data.success) {
            appendMessage(data.response, 'bot');
        } else {
            appendMessage("NEURAL LINK ERROR: " + data.error, 'bot', false);
        }
    } catch (e) { appendMessage("NEURAL LINK ERROR: " + e.message, 'bot', false); }
}

function appendMessage(content, role, save = true) {
    if (save) {
        sessionMessages[currentAvatar].push({ content, role });
    }
    renderMessageUI(content, role);
}

function renderMessageUI(content, role) {
    const container = document.getElementById('messagesContainer');
    const div = document.createElement('div');
    div.className = `flex ${role === 'user' ? 'justify-end' : 'justify-start'} mb-8`;
    
    // 1. Sanitize text formatting
    let cleanContent = content || "";
    if (typeof cleanContent !== 'string') {
        try {
            cleanContent = JSON.stringify(cleanContent, null, 2);
        } catch(e) {
            cleanContent = String(cleanContent);
        }
    }

    // 5. Dynamic Chart Extraction (Must happen BEFORE string replacements to protect JSON structure)
    let chartJsons = [];
    if (role === 'bot') {
        const chartRegex = /<chart>([\s\S]*?)<\/chart>/g;
        let match;
        while ((match = chartRegex.exec(cleanContent)) !== null) {
            chartJsons.push(match[1]);
        }
        cleanContent = cleanContent.replace(/<chart>[\s\S]*?<\/chart>/g, ''); // Remove all chart tags
        
        // Clean up any stray raw JSON blocks that look like Plotly configs the LLM might have leaked
        cleanContent = cleanContent.replace(/```json\s*\{[\s\S]*?"data"\s*:[\s\S]*?"layout"\s*:[\s\S]*?\}\s*```/g, '');
        cleanContent = cleanContent.replace(/\{[\s\S]*?"data"\s*:[\s\S]*?"layout"\s*:[\s\S]*?\}/g, function(match) {
            // Only remove if it looks like a valid chart JSON leaked
            try { JSON.parse(match.replace(/\\\*/g, '*')); return ''; } catch(e) { return match; }
        });
    }

    // Convert escaped newlines from the model to actual newlines for the markdown body
    cleanContent = cleanContent.replace(/\\n/g, '\n').replace(/\\r/g, '').replace(/\\\\/g, '\\');
    
    // Purge any raw [object Object] artifacts
    cleanContent = cleanContent.replace(/\[object Object\]/g, '');

    // Process math blocks to protect them from marked.js
    let mathBlocks = [];
    if (role === 'bot') {
        cleanContent = cleanContent.replace(/\$\$([\s\S]+?)\$\$/g, (match, p1) => {
            mathBlocks.push({ display: true, text: p1 });
            return `@@MATH_BLOCK_${mathBlocks.length - 1}@@`;
        });
        cleanContent = cleanContent.replace(/\$((?:[^$]|\\[$])+?)\$/g, (match, p1) => {
            mathBlocks.push({ display: false, text: p1 });
            return `@@MATH_INLINE_${mathBlocks.length - 1}@@`;
        });
    }

    let htmlContent = role === 'bot' ? marked.parse(cleanContent) : cleanContent;

    // Restore math blocks safely without $ swallow
    if (role === 'bot') {
        mathBlocks.forEach((block, i) => {
            if (block.display) {
                htmlContent = htmlContent.replace(`@@MATH_BLOCK_${i}@@`, () => `$$${block.text}$$`);
            } else {
                htmlContent = htmlContent.replace(`@@MATH_INLINE_${i}@@`, () => `$${block.text}$`);
            }
        });
    }
    const timeString = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

    const widthClass = role === 'user' ? 'max-w-[85%]' : 'w-full max-w-[95%]';
    const bgClass = role === 'user' ? 'bg-purple-600/20 border border-purple-500/30 rounded-[24px_24px_4px_24px]' : 'chat-bubble-bot shadow-xl';

    let innerHTML = `<div class="${widthClass} relative p-5 ${bgClass}">
        <div class="text-sm leading-relaxed prose prose-invert max-w-none">${htmlContent}</div>
        <div class="chart-mount"></div>
        <div class="text-[10px] text-gray-500 mt-2 ${role === 'user' ? 'text-right' : 'text-left'}">${timeString}</div>`;
    
    if (role === 'bot') {
        innerHTML += `<button onclick="copyNeuralResponse(this)" class="absolute top-2 right-2 text-gray-500 hover:text-white text-xs bg-black/40 px-2 py-1 rounded transition" title="Copy Response"><i class="fas fa-copy"></i></button>`;
    }
    innerHTML += `</div>`;
    div.innerHTML = innerHTML;
    
    container.appendChild(div);
    
    // Render Math using KaTeX
    if (role === 'bot' && typeof renderMathInElement === 'function') {
        renderMathInElement(div, {
            delimiters: [
                {left: '$$', right: '$$', display: true},
                {left: '$', right: '$', display: false},
                {left: '\\(', right: '\\)', display: false},
                {left: '\\[', right: '\\]', display: true}
            ],
            throwOnError: false
        });
    }
    
    // Render Chart if found
    if (chartJsons && chartJsons.length > 0) {
        const mount = div.querySelector('.chart-mount');
        if (typeof renderDynamicChart === 'function') {
            chartJsons.forEach(json => {
                const chartContainer = document.createElement('div');
                mount.appendChild(chartContainer);
                renderDynamicChart(chartContainer, json);
            });
        }
    }
    
    container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });

    // 2. Code Formatting using Highlight.js
    if (role === 'bot') {
        div.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightElement(block);
        });
    } else if (role === 'user') {
        // 9. Neural History snippet
        const historyContainer = document.getElementById('neuralHistory');
        if (historyContainer) {
            const snippet = content.length > 25 ? content.substring(0, 25) + '...' : content;
            const historyItem = document.createElement('div');
            historyItem.className = "text-xs text-gray-400 bg-white/5 p-2 rounded cursor-pointer hover:bg-white/10 transition truncate border border-white/5";
            historyItem.innerText = snippet;
            historyItem.onclick = () => { document.getElementById('userInput').value = content; };
            historyContainer.prepend(historyItem);
        }
    }
}

// 8. File Attachments (UI Only)
function handleFileUpload(input) {
    if (input.files && input.files.length > 0) {
        const fileName = input.files[0].name;
        const userInp = document.getElementById('userInput');
        userInp.value = `[Attachment: ${fileName}] ` + userInp.value;
        // Reset file input so same file can be selected again
        input.value = '';
    }
}

function switchAvatarMenu() {
    document.getElementById('chatPage').classList.add('hidden');
    document.getElementById('avatarPage').classList.remove('hidden');
}

document.addEventListener('DOMContentLoaded', typewriter);