// Se ejecuta de forma síncrona en <head>, antes del primer pintado:
// evita el parpadeo de idioma y activa los estilos que dependen de JS.
(function () {
  var d = document.documentElement;
  d.classList.add('js');
  var lang, fx;
  try { lang = localStorage.getItem('lang'); fx = localStorage.getItem('fx'); } catch (e) {}
  if (lang !== 'es' && lang !== 'en') lang = ((navigator.language || 'es').slice(0, 2) === 'en') ? 'en' : 'es';
  d.lang = lang;
  d.setAttribute('data-fx', fx === 'off' ? 'off' : 'on');
})();
