(function () {
  var currentScript = document.currentScript;
  if (!currentScript) return;

  var chatbotId = currentScript.getAttribute('data-chatbot-id');
  if (!chatbotId) return;

  var scriptSrc = currentScript.getAttribute('src') || '';
  var baseUrl;
  try {
    baseUrl = new URL(scriptSrc, window.location.href).origin;
  } catch (e) {
    baseUrl = 'https://aistaffer.co.uk';
  }

  var storageKey = 'aistaffer_widget_' + chatbotId;
  var state = {
    open: false,
    conversationId: null,
    visitorId: null,
    messages: [],
    loading: false,
  };

  try {
    var stored = localStorage.getItem(storageKey);
    if (stored) {
      var parsed = JSON.parse(stored);
      state.conversationId = parsed.conversationId || null;
      state.visitorId = parsed.visitorId || null;
      state.messages = Array.isArray(parsed.messages) ? parsed.messages : [];
    }
  } catch (e) {}

  function persist() {
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          conversationId: state.conversationId,
          visitorId: state.visitorId,
          messages: state.messages,
        })
      );
    } catch (e) {}
  }

  var style = document.createElement('style');
  style.textContent = '' +
    '.aistaffer-launcher{position:fixed;bottom:20px;right:20px;width:60px;height:60px;border-radius:999px;background:#2563eb;color:#fff;border:none;cursor:pointer;box-shadow:0 12px 30px rgba(37,99,235,.35);z-index:2147483646;font:600 24px/1 Arial,sans-serif}' +
    '.aistaffer-panel{position:fixed;bottom:92px;right:20px;width:360px;max-width:calc(100vw - 24px);height:520px;max-height:calc(100vh - 120px);background:#fff;border:1px solid #e5e7eb;border-radius:20px;box-shadow:0 20px 50px rgba(15,23,42,.18);display:none;flex-direction:column;overflow:hidden;z-index:2147483646;font-family:Arial,sans-serif}' +
    '.aistaffer-header{background:#2563eb;color:#fff;padding:16px}' +
    '.aistaffer-title{font-size:16px;font-weight:700;margin:0 0 4px}' +
    '.aistaffer-subtitle{font-size:12px;opacity:.9;margin:0}' +
    '.aistaffer-messages{flex:1;padding:16px;background:#f8fafc;overflow-y:auto}' +
    '.aistaffer-row{display:flex;margin-bottom:12px}' +
    '.aistaffer-row.user{justify-content:flex-end}' +
    '.aistaffer-bubble{max-width:82%;padding:10px 12px;border-radius:16px;font-size:14px;line-height:1.4;white-space:pre-wrap;word-break:break-word}' +
    '.aistaffer-row.bot .aistaffer-bubble{background:#fff;color:#111827;border:1px solid #e5e7eb;border-top-left-radius:4px}' +
    '.aistaffer-row.user .aistaffer-bubble{background:#2563eb;color:#fff;border-top-right-radius:4px}' +
    '.aistaffer-typing{display:inline-flex;gap:4px;align-items:center}' +
    '.aistaffer-dot{width:6px;height:6px;border-radius:999px;background:#94a3b8;animation:aistaffer-bounce 1.2s infinite ease-in-out}' +
    '.aistaffer-dot:nth-child(2){animation-delay:.15s}.aistaffer-dot:nth-child(3){animation-delay:.3s}' +
    '@keyframes aistaffer-bounce{0%,80%,100%{transform:scale(.8);opacity:.6}40%{transform:scale(1);opacity:1}}' +
    '.aistaffer-form{display:flex;gap:8px;padding:12px;border-top:1px solid #e5e7eb;background:#fff}' +
    '.aistaffer-input{flex:1;border:1px solid #d1d5db;border-radius:12px;padding:10px 12px;font-size:14px;outline:none}' +
    '.aistaffer-input:focus{border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,.12)}' +
    '.aistaffer-send{border:none;background:#2563eb;color:#fff;border-radius:12px;padding:0 16px;font-size:14px;font-weight:600;cursor:pointer}' +
    '.aistaffer-send:disabled{opacity:.6;cursor:not-allowed}' +
    '@media (max-width:480px){.aistaffer-panel{right:12px;left:12px;width:auto;height:70vh;bottom:84px}.aistaffer-launcher{right:12px;bottom:12px}}';
  document.head.appendChild(style);

  var launcher = document.createElement('button');
  launcher.className = 'aistaffer-launcher';
  launcher.setAttribute('aria-label', 'Open chat');
  launcher.textContent = '💬';

  var panel = document.createElement('div');
  panel.className = 'aistaffer-panel';
  panel.innerHTML = '' +
    '<div class="aistaffer-header">' +
      '<p class="aistaffer-title">Chat with us</p>' +
      '<p class="aistaffer-subtitle">Usually replies instantly</p>' +
    '</div>' +
    '<div class="aistaffer-messages"></div>' +
    '<form class="aistaffer-form">' +
      '<input class="aistaffer-input" type="text" placeholder="Type your message..." />' +
      '<button class="aistaffer-send" type="submit">Send</button>' +
    '</form>';

  document.body.appendChild(panel);
  document.body.appendChild(launcher);

  var messagesEl = panel.querySelector('.aistaffer-messages');
  var form = panel.querySelector('.aistaffer-form');
  var input = panel.querySelector('.aistaffer-input');
  var send = panel.querySelector('.aistaffer-send');
  var header = panel.querySelector('.aistaffer-header');

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function renderMessages() {
    var html = state.messages.map(function (message) {
      return '<div class="aistaffer-row ' + (message.role === 'user' ? 'user' : 'bot') + '">' +
        '<div class="aistaffer-bubble">' + escapeHtml(message.content) + '</div>' +
      '</div>';
    }).join('');

    if (state.loading) {
      html += '<div class="aistaffer-row bot"><div class="aistaffer-bubble"><span class="aistaffer-typing"><span class="aistaffer-dot"></span><span class="aistaffer-dot"></span><span class="aistaffer-dot"></span></span></div></div>';
    }

    messagesEl.innerHTML = html || '<div class="aistaffer-row bot"><div class="aistaffer-bubble">Hi there! How can I help you today?</div></div>';
    messagesEl.scrollTop = messagesEl.scrollHeight;
    send.disabled = state.loading;
    input.disabled = state.loading;
  }

  launcher.addEventListener('click', function () {
    state.open = !state.open;
    panel.style.display = state.open ? 'flex' : 'none';
    launcher.textContent = state.open ? '×' : '💬';
    if (state.open) {
      input.focus();
      renderMessages();
    }
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (state.loading) return;

    var text = input.value.trim();
    if (!text) return;

    state.messages.push({ role: 'user', content: text });
    input.value = '';
    state.loading = true;
    renderMessages();
    persist();

    fetch(baseUrl + '/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: text,
        chatbot_id: chatbotId,
        conversation_id: state.conversationId,
        visitor_id: state.visitorId,
      }),
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        state.loading = false;
        if (data.conversation_id) state.conversationId = data.conversation_id;
        if (data.visitor_id) state.visitorId = data.visitor_id;
        state.messages.push({
          role: 'assistant',
          content: data.reply || data.error || 'Sorry, something went wrong.',
        });
        persist();
        renderMessages();
      })
      .catch(function () {
        state.loading = false;
        state.messages.push({
          role: 'assistant',
          content: 'Sorry, something went wrong. Please try again in a moment.',
        });
        persist();
        renderMessages();
      });
  });

  renderMessages();
})();
