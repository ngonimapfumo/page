const themeToggle = document.querySelector('.theme-toggle');
let savedTheme = null;
try {
  savedTheme = window.localStorage.getItem('theme');
} catch (error) {
  savedTheme = null;
}
const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
const initialTheme = savedTheme || (prefersLight ? 'light' : 'dark');

document.documentElement.dataset.theme = initialTheme;

if (themeToggle) {
  const updateThemeToggle = (theme) => {
    const isLight = theme === 'light';
    themeToggle.setAttribute('aria-pressed', String(isLight));
    themeToggle.setAttribute('aria-label', `Switch to ${isLight ? 'dark' : 'light'} theme`);
    themeToggle.querySelector('.theme-toggle-icon').textContent = isLight ? '●' : '☼';
    themeToggle.querySelector('.theme-toggle-label').textContent = isLight ? 'Dark' : 'Light';
  };

  updateThemeToggle(initialTheme);
  themeToggle.addEventListener('click', () => {
    const nextTheme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = nextTheme;
    try {
      window.localStorage.setItem('theme', nextTheme);
    } catch (error) {
      // Theme still works for the current page when storage is restricted.
    }
    updateThemeToggle(nextTheme);
  });
}

// Small scroll-reveal effect — respects `prefers-reduced-motion`.
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!prefersReduced && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.animate(
          [{ opacity: 0, transform: 'translateY(18px)' }, { opacity: 1, transform: 'translateY(0)' }],
          { duration: 650, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'forwards' }
        );
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.project, .about > *, .hobbies > *, .contact > *').forEach(el => observer.observe(el));
}
