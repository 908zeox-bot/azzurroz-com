// Azzurro Z — Main JS

// Mobile nav toggle
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', mobileMenu.classList.contains('open'));
  });
  // Close on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });
}

// FAQ accordion
document.querySelectorAll('.faq-toggle').forEach(toggle => {
  toggle.addEventListener('click', () => {
    const answer = toggle.nextElementSibling;
    const isOpen = answer.classList.contains('open');
    // Close all
    document.querySelectorAll('.faq-answer').forEach(a => a.classList.remove('open'));
    document.querySelectorAll('.faq-toggle').forEach(t => t.classList.remove('open'));
    // Open clicked (if wasn't open)
    if (!isOpen) {
      answer.classList.add('open');
      toggle.classList.add('open');
    }
  });
});

// Sticky nav background
const header = document.getElementById('site-header');
if (header) {
  window.addEventListener('scroll', () => {
    header.style.background = window.scrollY > 50
      ? 'rgba(10,42,66,0.98)'
      : 'transparent';
  });
}

// Netlify form submission feedback
const form = document.getElementById('waitlist-form');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type=submit]');
    btn.textContent = 'Submitting...';
    btn.disabled = true;

    const data = new FormData(form);
    try {
      const res = await fetch('/', { method: 'POST', body: data });
      if (res.ok) {
        form.innerHTML = '<div style="text-align:center;padding:40px 0"><p style="font-size:1.4rem;font-weight:700;color:white;margin-bottom:12px">You\'re on the list. ✓</p><p style="color:#C0C0C0">We\'ll be in touch as we approach opening. Welcome to the community.</p></div>';
      } else {
        btn.textContent = 'Send';
        btn.disabled = false;
        alert('Something went wrong. Please try again.');
      }
    } catch {
      btn.textContent = 'Send';
      btn.disabled = false;
      alert('Network error. Please try again.');
    }
  });
}
