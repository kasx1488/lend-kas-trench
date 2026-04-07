// ── CURSOR
  const cursor = document.getElementById('cursor');
  const glow = document.getElementById('cursor-glow');
  document.addEventListener('mousemove', e => {
    cursor.style.left = (e.clientX) + 'px';
    cursor.style.top = (e.clientY) + 'px';
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });

  // ── COUNTDOWN
  // Логика: таймер 3 часа.
  // Если с последнего визита прошло > 1 часа — таймер сбрасывается.
  // Если < 1 часа — продолжает с того места где остановился.
  (function() {
    const KEY_END  = 'sc_end';
    const KEY_LAST = 'sc_last';
    const DURATION  = 3 * 3600000;   // 3 часа
    const MAX_AWAY  = 1 * 3600000;   // порог отсутствия = 1 час

    const now      = Date.now();
    const lastSeen = parseInt(localStorage.getItem(KEY_LAST) || '0');
    const storedEnd = parseInt(localStorage.getItem(KEY_END) || '0');
    const awayMs   = now - lastSeen;

    let endTime;
    if (!storedEnd || awayMs > MAX_AWAY) {
      // Первый визит или отсутствовал > 1 часа — сбросить
      endTime = now + DURATION;
      localStorage.setItem(KEY_END, endTime);
    } else {
      // Вернулся в течение часа — продолжить
      endTime = storedEnd;
    }

    // Обновляем время последнего визита
    localStorage.setItem(KEY_LAST, now);

    function tick() {
      const diff = endTime - Date.now();
      const el = document.getElementById('countdown');
      if (diff <= 0) { el.textContent = '00:00:00'; return; }
      const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
      const m = String(Math.floor(diff % 3600000 / 60000)).padStart(2, '0');
      const s = String(Math.floor(diff % 60000 / 1000)).padStart(2, '0');
      el.textContent = h + ':' + m + ':' + s;
    }
    tick();
    setInterval(tick, 1000);
  })();

  // ── FADE IN
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.08 });
  document.querySelectorAll('.fade').forEach(el => io.observe(el));
