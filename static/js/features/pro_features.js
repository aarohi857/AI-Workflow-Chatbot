/**
 * VELVIA PRO FEATURES - Neural Hub Module
 * Contains advanced functionalities for the AI-Workflow chatbot.
 * Integrated as a separate module to maintain UI integrity.
 */

function copyNeuralResponse(btn) {
    // Traverse the DOM to find the message content within the same bubble
    const textContainer = btn.parentElement.querySelector('.prose');
    const textToCopy = textContainer.innerText;

    navigator.clipboard.writeText(textToCopy).then(() => {
        const originalHTML = btn.innerHTML;
        // Visual feedback for successful copy
        btn.innerHTML = '<i class="fas fa-check text-green-400"></i>';
        setTimeout(() => { btn.innerHTML = originalHTML; }, 2000);
    }).catch(err => {
        console.error('Failed to copy neural logs: ', err);
    });
}

function shareNeuralSession() {
    const chatLog = document.getElementById('messagesContainer').innerText;
    const summary = "VELVIA AI Neural Session Summary:\n\n" + chatLog.substring(0, 1000) + "...\n\n[Session link copied to clipboard]";
    navigator.clipboard.writeText(summary).then(() => {
        alert("Session summary copied to clipboard for sharing!");
    });
}

// 3. Export Conversation as Markdown
function exportNeuralLog() {
    const chatLog = document.getElementById('messagesContainer').innerText;
    const blob = new Blob([chatLog], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link element to trigger the download
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = `VELVIA_Archive_${Date.now()}.md`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

// 5. Load Quick Suggestions in the UI
function loadNeuralSuggestions(avatar = 'aarvix') {
    let suggestionList = [];
    if (avatar === 'zenvix') {
        suggestionList = ["A* Search Complexity", "CNN Layer Design", "Gradient Descent Math", "GANs vs VAEs", "Transformer Attention", "SVM Kernels"];
    } else {
        suggestionList = ["What is AI?", "Is AI safe?", "AI in Agriculture", "Step-by-step ML guide", "How robots learn", "Ethics of AI"];
    }
    
    const suggestionBar = document.getElementById('suggestionBar');
    
    if (suggestionBar) {
        // Map through suggestions and create interactive buttons
        suggestionBar.innerHTML = suggestionList.map(item => 
            `<button onclick="document.getElementById('userInput').value='${item}'; sendMessage()" 
             class="px-3 py-1 bg-white/5 border border-white/10 rounded-full hover:bg-purple-500/20 text-[9px] transition whitespace-nowrap">
             ${item}</button>`
        ).join('');
    }
}

// 7. Global Search Feature
function triggerSearch() {
    const searchQuery = prompt("Search Neural Archive:");
    
    // Remove old highlights
    document.querySelectorAll('mark.search-highlight').forEach(mark => {
        const parent = mark.parentNode;
        parent.replaceChild(document.createTextNode(mark.textContent), mark);
        parent.normalize();
    });

    if (searchQuery && searchQuery.trim() !== '') {
        const allMessages = document.querySelectorAll('.prose');
        allMessages.forEach(msg => {
            const innerHTML = msg.innerHTML;
            const regex = new RegExp(`(${searchQuery})`, 'gi');
            msg.innerHTML = innerHTML.replace(regex, '<mark class="search-highlight bg-yellow-500/50 text-white rounded px-1">$1</mark>');
        });
    }
}

document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        triggerSearch();
    }
});

// 10. Voice-to-Text Integration
function toggleVoiceSync() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("Speech Recognition is not supported in this browser.");
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    const voiceBtn = document.getElementById('voiceBtn');
    
    // UI feedback during active listening
    voiceBtn.classList.add('text-red-500', 'animate-pulse');
    
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        document.getElementById('userInput').value = transcript;
    };
    
    recognition.onend = () => { 
        voiceBtn.classList.remove('text-red-500', 'animate-pulse'); 
    };

    recognition.start();
}

// 6. Neon Theme Switcher (Toggle Light/Dark Mode)
function toggleNeonTheme() {
    document.body.classList.toggle('light-theme');
}

// Initialize Pro-Features once the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    loadNeuralSuggestions();
    
    // Inject Search and Clear Chat buttons
    const inputDiv = document.querySelector('main .mt-2.p-1.bg-white\\/5');
    if (inputDiv) {
        // Clear Chat (Trash)
        const clearBtn = document.createElement('button');
        clearBtn.innerHTML = '<i class="fas fa-trash"></i>';
        clearBtn.className = 'ml-2 text-gray-500 hover:text-red-500 transition';
        clearBtn.title = 'Clear Chat';
        clearBtn.onclick = () => { if(typeof newSession === 'function') newSession(); };
        inputDiv.insertBefore(clearBtn, inputDiv.firstChild);

        // Search (Magnifying Glass)
        const searchBtn = document.createElement('button');
        searchBtn.innerHTML = '<i class="fas fa-search"></i>';
        searchBtn.className = 'ml-2 text-gray-500 hover:text-blue-500 transition';
        searchBtn.title = 'Search Chat';
        searchBtn.onclick = triggerSearch;
        inputDiv.insertBefore(searchBtn, inputDiv.firstChild);
    }
    
    // Inject Share Session button in sidebar
    const sidebarNav = document.querySelector('nav.mt-auto');
    if (sidebarNav) {
        const flexDiv = sidebarNav.querySelector('.flex.gap-2');
        if (flexDiv) {
            const shareBtn = document.createElement('button');
            shareBtn.innerHTML = '<i class="fas fa-share-alt"></i>';
            shareBtn.className = 'w-1/3 py-3 bg-white/5 rounded-xl text-[10px] uppercase tracking-widest hover:bg-white/10 transition flex items-center justify-center';
            shareBtn.title = 'Share Chat';
            shareBtn.onclick = shareNeuralSession;
            
            // Adjust widths of existing buttons
            Array.from(flexDiv.children).forEach(child => {
                child.classList.remove('w-1/2');
                child.classList.add('w-1/3');
                child.classList.add('flex', 'items-center', 'justify-center');
            });
            flexDiv.appendChild(shareBtn);
        }
    }
    
    console.log("VELVIA Pro-Features Module: Initialized.");
});