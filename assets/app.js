// Basic form handling for GitHub Pages (no backend).
// To enable real submissions, create a free Formspree form and paste the endpoint below.
const FORM_ENDPOINT = ""; // e.g., "https://formspree.io/f/yourFormId"

const form = document.getElementById('signup-form');
const msg = document.getElementById('form-message');
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = Object.fromEntries(new FormData(form).entries());

  if (!formData.email || !String(formData.email).includes('@')) {
    msg.textContent = 'Please enter a valid email address.';
    msg.className = 'mt-3 text-sm text-red-300';
    return;
  }

  // If no endpoint, simulate success and guide setup.
  if (!FORM_ENDPOINT) {
    msg.innerHTML = 'Thanks! This demo stored your email locally. To collect real signups, add your Formspree endpoint in <code>assets/app.js</code>.';
    msg.className = 'mt-3 text-sm text-emerald-300';
    try {
      const stored = JSON.parse(localStorage.getItem('simplomation_signups') || '[]');
      stored.push({ ...formData, ts: Date.now() });
      localStorage.setItem('simplomation_signups', JSON.stringify(stored));
    } catch {}
    form.reset();
    return;
  }

  try {
    const res = await fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(form)
    });
    if (res.ok) {
      msg.textContent = 'Thanks! Please check your inbox for a confirmation.';
      msg.className = 'mt-3 text-sm text-emerald-300';
      form.reset();
    } else {
      msg.textContent = 'Something went wrong. Please try again later.';
      msg.className = 'mt-3 text-sm text-red-300';
    }
  } catch (err) {
    msg.textContent = 'Network error. Please try again.';
    msg.className = 'mt-3 text-sm text-red-300';
  }
});

/* ===== Mobile menu toggler ===== */
(function () {
  const btn = document.getElementById('mobile-menu-button');
  const menu = document.getElementById('mobile-menu');
  const openI = document.getElementById('icon-open');
  const closeI = document.getElementById('icon-close');
  if (!btn || !menu) return; // page may not have the mobile menu

  function closeMenu() {
    btn.setAttribute('aria-expanded', 'false');
    menu.classList.add('hidden');
    openI?.classList.remove('hidden');
    closeI?.classList.add('hidden');
  }

  btn.addEventListener('click', () => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!isOpen));
    menu.classList.toggle('hidden');
    openI?.classList.toggle('hidden');
    closeI?.classList.toggle('hidden');
  });

  // close on link click
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  // close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  // (optional) close on outside click
  document.addEventListener('click', (e) => {
    if (!menu.classList.contains('hidden') && !menu.contains(e.target) && e.target !== btn && !btn.contains(e.target)) {
      closeMenu();
    }
  });
})();
