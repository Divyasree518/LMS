class VemuAIAssistant {
  constructor() {
    this.chatPanel = null;
    this.messages = JSON.parse(localStorage.getItem('vemuChatHistory')) || [];
    this.isOpen = false;
    this.recognition = null; // speech recognition
    this.init();
  }

  init() {
    this.createUI();
    this.loadHistory();
    this.bindEvents();
    this.initVoiceInput();
  }

  createUI() {
    const button = document.createElement('button');
    button.id = 'aiChatToggle';
    button.innerHTML = '🤖';
    button.className = 'ai-chat-btn';
    button.title = 'AI Assistant';
    button.ariaLabel = 'Open AI Assistant';
    document.body.appendChild(button);

    const panel = document.createElement('div');
    panel.id = 'aiChatPanel';
    panel.className = 'ai-chat-panel hidden';
    panel.innerHTML = `
      <div class="ai-chat-header">
        <span>🤖 Vemu AI Helper</span>
        <button id="aiChatClose" class="ai-close-btn">&times;</button>
      </div>
      <div id="aiChatMessages" class="ai-messages"></div>
      <div class="ai-input-area">
        <input type="text" id="aiChatInput" placeholder="Ask anything... (తెలుగు/English)" maxlength="500">
        <button id="aiChatSend">Send</button>
        <button id="aiChatVoice">🎤</button>
      </div>
      <div class="ai-lang-hint">Detected language auto-replies in Telugu/English</div>
    `;
    document.body.appendChild(panel);

    this.chatPanel = panel;
  }

  bindEvents() {
    const toggle = document.getElementById('aiChatToggle');
    const close = document.getElementById('aiChatClose');
    const send = document.getElementById('aiChatSend');
    const input = document.getElementById('aiChatInput');
    const voiceBtn = document.getElementById('aiChatVoice');

    toggle.onclick = () => this.toggle();
    close.onclick = () => this.close();
    send.onclick = () => this.sendMessage();
    input.onkeypress = (e) => { if (e.key === 'Enter') this.sendMessage(); };
    voiceBtn.onclick = () => this.startVoiceInput();

    document.addEventListener('click', (e) => {
      if (!this.chatPanel.contains(e.target) && !toggle.contains(e.target)) this.close();
    });
  }

  toggle() {
    this.isOpen = !this.isOpen;
    this.chatPanel.classList.toggle('hidden', !this.isOpen);
    if (this.isOpen) {
      document.getElementById('aiChatInput').focus();
      this.scrollToBottom();
    }
  }

  close() {
    this.isOpen = false;
    this.chatPanel.classList.add('hidden');
  }

  addMessage(content, isUser = false) {
    this.messages.push({ content, isUser, timestamp: new Date().toISOString() });
    this.saveHistory();
    this.renderMessages();
    this.scrollToBottom();

    if (!isUser) {
      this.speak(content);
    }
  }

  sendMessage() {
    const input = document.getElementById('aiChatInput');
    const msg = input.value.trim();
    if (!msg) return;

    this.addMessage(msg, true);
    input.value = '';

    setTimeout(() => {
      const response = this.generateResponse(msg);
      this.addMessage(response, false);
    }, 800 + Math.random() * 600);
  }

  detectTelugu(text) {
    const teluguRange = /[\u0C00-\u0C7F]/u;
    return teluguRange.test(text);
  }

  generateResponse(query) {
    const lowerQuery = query.toLowerCase().trim();
    const isTelugu = this.detectTelugu(query);
    let lang = isTelugu ? 'te' : 'en';

    const keywords = {
      en: {
        'hello': 'Hi there!',
        'hi': 'Hello! How can I help?',
        'help': 'I can help with login, books, fines, code examples.',
        'book': 'Books on student portal. Search and borrow!',
        'library': 'Vemu Library LMS. Login to access.',
        'login': 'Select role → Enter ID/Email → Password → Submit.',
        'fine': '₹10/day after 10 days. Check History.',
        'code': 'Ask for specific code!',
        'default': "I'm not sure. Try 'help' or more details."
      },
      te: {
        'hello': 'నమస్కారం!',
        'hi': 'హలో! నేను సహాయం చేయగలను?',
        'help': 'లాగిన్, పుస్తకాలు, ఫైన్స్, కోడ్ ఉదాహరణలు.',
        'book': 'స్టూడెంట్ పోర్టల్ లో పుస్తకాలు.',
        'library': 'వేము లైబ్రరీ LMS.',
        'login': 'రోల్ ఎంచుకోండి → ID/ఇమెయిల్ → పాస్‌వర్డ్.',
        'fine': '10 రోజుల తర్వాత ₹10/రోజు. History చూడండి.',
        'code': 'కోడ్ అడగండి!',
        'default': 'తెలియదు. మరిన్ని వివరాలు ఇవ్వండి.'
      }
    };

    let answer = keywords[lang].default;
    for (let key in keywords[lang]) {
      if (lowerQuery.includes(key) && key !== 'default') {
        answer = keywords[lang][key];
        break;
      }
    }

    if (lowerQuery.includes('code') || lowerQuery.includes('javascript') || lowerQuery.includes('html') || lowerQuery.includes('js')) {
      answer = this.getCodeResponse(lowerQuery, lang);
    }

    let fullResp = answer;
    if (answer !== keywords[lang].default) {
      fullResp += '\n\n**How:** ' + (isTelugu ? 'సరళమైనది.' : 'Simple steps.');
      fullResp += '\n**Example:** Try "how to login?"';
    }

    return fullResp;
  }

  getCodeResponse(query, lang) {
    const isTelugu = lang === 'te';
    if (query.includes('login')) {
      const code = `<button onclick="handleLogin()">Login</button>`;
      return isTelugu ? 
`కోడ్:
\`\`\`html
${code}
\`\`\`
**వివరణ:** Login ఫంక్షన్ పిలుస్తుంది.
**ఉదాహరణ:** onclick ఉపయోగించండి.` :
`Code:
\`\`\`html
${code}
\`\`\`
**Explanation:** Calls login function on click.
**Example:** Add to your button.`;
    }
    return isTelugu ? "శుభ్రమైన JS కోడ్ సిద్ధంగా ఉంది. మరిన్ని వివరాలు చెప్పండి!" : "Clean JS code ready. Share more details!";
  }

  speak(text) {
    if (!window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = this.detectTelugu(text) ? 'te-IN' : 'en-IN';
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  initVoiceInput() {
    if (!('webkitSpeechRecognition' in window)) return;
    this.recognition = new webkitSpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.lang = 'en-IN'; // default
    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      document.getElementById('aiChatInput').value = transcript;
      this.sendMessage();
    };
    this.recognition.onerror = (e) => console.error('Voice error:', e);
  }

  startVoiceInput() {
    if (!this.recognition) return;
    this.recognition.lang = 'en-IN'; // fallback
    this.recognition.start();
  }

  renderMessages() {
    const container = document.getElementById('aiChatMessages');
    container.innerHTML = this.messages.map(msg => {
      const className = msg.isUser ? 'ai-msg-user' : 'ai-msg-ai';
      const time = new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      return `<div class="${className}">
        <div class="ai-msg-content">${msg.content.replace(/\n/g, '<br>')}</div>
        <span class="ai-msg-time">${time}</span>
      </div>`;
    }).join('');
  }

  scrollToBottom() {
    const messages = document.getElementById('aiChatMessages');
    messages.scrollTop = messages.scrollHeight;
  }

  loadHistory() {
    this.renderMessages();
  }

  saveHistory() {
    localStorage.setItem('vemuChatHistory', JSON.stringify(this.messages.slice(-50)));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.vemuAI = new VemuAIAssistant();
});
