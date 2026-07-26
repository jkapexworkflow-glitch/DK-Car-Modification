/* ==========================================================================
   DK CAR MODIFICATIONS — SITE SCRIPT
   ========================================================================== */

// ---- Business contact constants (single source of truth) ----
const DK = {
  whatsappNumber: '256706285674',   // Airtel — WhatsApp only
  callNumber: '+256785598590',      // MTN — calls & SMS
  callNumberDisplay: '0785 598 590',
  whatsappDisplay: '0706 285 674',
  email: 'lorenzojakim@gmail.com',
  location: 'Mukono, Uganda',
  hours: 'Open Daily · 9:00 AM – 6:00 PM',
};

function buildWhatsAppLink(message) {
  const base = `https://wa.me/${DK.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

function defaultWhatsAppMessage(context) {
  const svc = context || '[service/vehicle]';
  return `Hi DK Car Modifications 👋 I'd like to enquire about ${svc} — could you help me with a quote?`;
}

document.addEventListener('DOMContentLoaded', () => {
  // ---- Populate every data-wa-link element with the correct deep link ----
  document.querySelectorAll('[data-wa-link]').forEach((el) => {
    const context = el.getAttribute('data-wa-context') || '';
    el.href = buildWhatsAppLink(defaultWhatsAppMessage(context));
    el.target = '_blank';
    el.rel = 'noopener';
  });
  document.querySelectorAll('[data-call-link]').forEach((el) => {
    el.href = `tel:${DK.callNumber}`;
  });
  document.querySelectorAll('[data-email-link]').forEach((el) => {
    el.href = `mailto:${DK.email}`;
  });
  document.querySelectorAll('[data-call-text]').forEach((el) => { el.textContent = DK.callNumberDisplay; });
  document.querySelectorAll('[data-wa-text]').forEach((el) => { el.textContent = DK.whatsappDisplay; });
  document.querySelectorAll('[data-email-text]').forEach((el) => { el.textContent = DK.email; });
  document.querySelectorAll('[data-location-text]').forEach((el) => { el.textContent = DK.location; });
  document.querySelectorAll('[data-hours-text]').forEach((el) => { el.textContent = DK.hours; });
  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

  // ---- Header scroll state ----
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ---- Mobile nav toggle ----
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('is-open');
      navToggle.classList.toggle('is-open', open);
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    navLinks.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      navToggle.classList.remove('is-open');
      document.body.style.overflow = '';
    }));
  }

  // ---- Scroll reveal ----
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  // ---- FAQ accordion ----
  document.querySelectorAll('.faq-item').forEach((item) => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      item.parentElement.querySelectorAll('.faq-item').forEach((other) => {
        other.classList.remove('is-open');
        other.querySelector('.faq-a').style.maxHeight = null;
        other.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('is-open');
        a.style.maxHeight = a.scrollHeight + 'px';
        q.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ---- Before/After sliders ----
  document.querySelectorAll('.ba-slider').forEach((slider) => {
    const handle = slider.querySelector('.ba-handle');
    let dragging = false;

    const setPos = (clientX) => {
      const rect = slider.getBoundingClientRect();
      let pct = ((clientX - rect.left) / rect.width) * 100;
      pct = Math.max(4, Math.min(96, pct));
      slider.style.setProperty('--pos', pct + '%');
    };

    handle.addEventListener('pointerdown', (e) => { dragging = true; handle.setPointerCapture(e.pointerId); });
    handle.addEventListener('keydown', (e) => {
      const current = parseFloat(getComputedStyle(slider).getPropertyValue('--pos')) || 50;
      if (e.key === 'ArrowLeft') slider.style.setProperty('--pos', Math.max(4, current - 3) + '%');
      if (e.key === 'ArrowRight') slider.style.setProperty('--pos', Math.min(96, current + 3) + '%');
    });
    window.addEventListener('pointermove', (e) => { if (dragging) setPos(e.clientX); });
    window.addEventListener('pointerup', () => { dragging = false; });
    slider.addEventListener('click', (e) => { if (e.target === handle || handle.contains(e.target)) return; setPos(e.clientX); });
  });

  // ---- Gallery filter ----
  const filterBar = document.querySelector('.filter-bar');
  if (filterBar) {
    const chips = filterBar.querySelectorAll('.filter-chip');
    const items = document.querySelectorAll('[data-category]');
    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        chips.forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');
        const cat = chip.getAttribute('data-filter');
        items.forEach((item) => {
          const show = cat === 'all' || item.getAttribute('data-category') === cat;
          item.style.display = show ? '' : 'none';
        });
      });
    });
  }

  // ---- Lightbox: click any [data-lightbox] photo card to view enlarged ----
  const lightboxTriggers = document.querySelectorAll('[data-lightbox]');
  if (lightboxTriggers.length) {
    const lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.innerHTML = `
      <button class="lightbox-close" aria-label="Close">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 5l14 14M19 5 5 19"/></svg>
      </button>
      <img src="" alt="">
      <div class="lightbox-caption"></div>
    `;
    document.body.appendChild(lb);
    const lbImg = lb.querySelector('img');
    const lbCaption = lb.querySelector('.lightbox-caption');

    const openLightbox = (src, caption) => {
      lbImg.src = src;
      lbImg.alt = caption || '';
      lbCaption.textContent = caption || '';
      lb.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    };
    const closeLightbox = () => {
      lb.classList.remove('is-open');
      document.body.style.overflow = '';
    };

    lightboxTriggers.forEach((el) => {
      el.addEventListener('click', () => {
        const img = el.querySelector('img');
        if (!img) return;
        openLightbox(img.currentSrc || img.src, el.getAttribute('data-caption') || img.alt);
      });
    });
    lb.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
  }

  // ---- Quote / contact form -> WhatsApp handoff (no backend yet, see project notes) ----
  const quoteForm = document.querySelector('#quote-form');
  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(quoteForm);
      const name = data.get('name') || '';
      const phone = data.get('phone') || '';
      const vehicle = data.get('vehicle') || '';
      const service = data.get('service') || '';
      const details = data.get('details') || '';

      const message = [
        `Hi DK Car Modifications 👋 New quote request from the website:`,
        `Name: ${name}`,
        `Phone: ${phone}`,
        `Vehicle: ${vehicle}`,
        `Service: ${service}`,
        details ? `Details: ${details}` : null,
      ].filter(Boolean).join('\n');

      window.open(buildWhatsAppLink(message), '_blank', 'noopener');

      const confirmBox = document.querySelector('#form-confirm');
      if (confirmBox) {
        confirmBox.hidden = false;
        confirmBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      quoteForm.reset();
    });
  }
});
