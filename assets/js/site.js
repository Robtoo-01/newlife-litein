// New Life Church Litein — progressive enhancements. The site works without this file.
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const WA = document.documentElement.dataset.wa; // set from src/data/site.json at build
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Header: shadow when scrolled, hide on scroll down, show on scroll up. Sticky mobile CTA after hero.
  const header = $('[data-header]'), cta = $('[data-mobile-cta]');
  let lastY = scrollY;
  addEventListener('scroll', () => {
    const y = scrollY;
    header.classList.toggle('is-scrolled', y > 8);
    if (!document.body.classList.contains('menu-open')) header.classList.toggle('is-hidden', y > 400 && y > lastY);
    cta?.classList.toggle('is-visible', y > 600);
    lastY = y;
  }, { passive: true });
  header.addEventListener('focusin', () => header.classList.remove('is-hidden'));

  // Mobile menu
  const btn = $('[data-menu-btn]'), nav = $('[data-nav]');
  const setMenu = open => {
    btn.setAttribute('aria-expanded', open);
    btn.querySelector('span').textContent = open ? 'Close' : 'Menu';
    btn.querySelector('use').setAttribute('href', open ? '#i-close' : '#i-menu');
    nav.style.setProperty('--nav-top', header.getBoundingClientRect().bottom + 'px');
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    if (open) nav.querySelector('a')?.focus();
  };
  btn.addEventListener('click', () => setMenu(btn.getAttribute('aria-expanded') !== 'true'));
  addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); btn.focus(); } });
  nav.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  matchMedia('(min-width: 1080px)').addEventListener('change', () => setMenu(false));

  // Scroll reveal
  if (!reduce && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
    $$('[data-reveal]').forEach(el => io.observe(el));
  } else $$('[data-reveal]').forEach(el => el.classList.add('is-in'));

  // Click-to-load embeds (no third-party cookies until the visitor presses play)
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-embed]');
    if (!b) return;
    const f = document.createElement('iframe');
    f.src = b.dataset.embed;
    f.title = b.getAttribute('aria-label') || 'Embedded content';
    f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    f.allowFullscreen = true;
    f.loading = 'lazy';
    f.referrerPolicy = 'strict-origin-when-cross-origin';
    b.replaceChildren(f);
    b.removeAttribute('data-embed');
    b.style.cursor = 'auto';
    f.focus();
  });

  // Copy buttons (till number, share links)
  document.addEventListener('click', async e => {
    const b = e.target.closest('[data-copy]');
    if (!b) return;
    try { await navigator.clipboard.writeText(b.dataset.copy); } catch { return; }
    const label = b.querySelector('.sr-only, [data-copy-label]') || b;
    const was = label.textContent;
    b.classList.add('is-done'); label.textContent = 'Copied';
    setTimeout(() => { b.classList.remove('is-done'); label.textContent = was; }, 2000);
  });

  // Forms → WhatsApp. Nothing is stored on a server; the visitor reviews and sends the message themselves.
  $$('form[data-wa]').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (form.querySelector('.hp input')?.value) return; // honeypot: bots fill it
      let ok = true;
      $$('[data-validate]', form).forEach(f => {
        const err = form.querySelector(`#${f.id}-error`);
        let msg = '';
        if (f.required && f.value.trim().length < (+f.dataset.min || 1)) msg = f.dataset.msg || 'Please fill in this field.';
        else if (f.type === 'tel' && f.value.trim() && !/^\+?[\d\s()-]{9,16}$/.test(f.value.trim())) msg = 'Please enter a valid phone number, e.g. 0712 345 678.';
        else if (f.type === 'email' && f.value.trim() && !f.checkValidity()) msg = 'Please enter a valid email address.';
        f.setAttribute('aria-invalid', !!msg);
        if (err) err.textContent = msg;
        if (msg && ok) { f.focus(); ok = false; }
      });
      if (!ok) return;
      const lines = [form.dataset.wa];
      $$('[data-label]', form).forEach(f => {
        const v = f.type === 'checkbox' ? (f.checked ? 'Yes' : '') : f.value.trim();
        if (v) lines.push(`${f.dataset.label}: ${v}`);
      });
      window.open(`https://wa.me/${WA}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener');
      const done = form.nextElementSibling;
      if (done?.classList.contains('form-success')) { form.hidden = true; done.hidden = false; done.focus(); }
    });
  });

  // Events: hide finished ones (no rebuild needed when a date passes)
  const list = $('[data-events]');
  if (list) {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const cards = $$('[data-end]', list);
    cards.forEach(c => { if (new Date(c.dataset.end + 'T23:59:59') < today) c.hidden = true; });
    if (cards.every(c => c.hidden)) $('[data-events-empty]').hidden = false;
  }

  // Sermon archive filter
  const filter = $('[data-sermon-filter]');
  if (filter) {
    const items = $$('[data-sermons] > *'), count = $('[data-sermon-count]');
    const run = () => {
      const q = filter.q.value.trim().toLowerCase(), se = filter.series.value, sp = filter.speaker.value;
      let n = 0;
      items.forEach(it => {
        const show = (!q || it.dataset.text.includes(q)) && (!se || it.dataset.series === se) && (!sp || it.dataset.speaker === sp);
        it.hidden = !show; n += show;
      });
      count.textContent = `${n} of ${items.length} messages`;
    };
    filter.addEventListener('input', run); run();
  }

  // time-limited sections (e.g. an invitation) disappear the day after they end
  $$('[data-expires]').forEach(el => { if (new Date(el.dataset.expires + 'T23:59:59') < new Date()) el.hidden = true; });

  $$('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
})();
