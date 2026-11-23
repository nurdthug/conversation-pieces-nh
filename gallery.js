(() => {
  const dialog = document.getElementById('photo-viewer');
  if (!dialog || typeof dialog.showModal !== 'function') return;

  const links = [...document.querySelectorAll('a[data-gallery]')];
  const photo = document.getElementById('viewer-photo');
  const caption = document.getElementById('viewer-caption');
  const count = document.getElementById('photo-count');
  const close = document.getElementById('close-viewer');
  let index = 0;
  let opener;

  function showPhoto(position) {
    index = (position + links.length) % links.length;
    const link = links[index];
    const original = link.querySelector('img');
    photo.alt = original.alt;
    photo.src = link.href;
    caption.textContent = link.closest('figure').querySelector('figcaption').textContent.trim();
    count.textContent = `Photo ${index + 1} of ${links.length}`;
  }

  links.forEach((link, position) => {
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      opener = link;
      showPhoto(position);
      dialog.showModal();
      close.focus();
    });
  });
  close.addEventListener('click', () => dialog.close());
  document.getElementById('prev-photo').addEventListener('click', () => showPhoto(index - 1));
  document.getElementById('next-photo').addEventListener('click', () => showPhoto(index + 1));
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      showPhoto(index + (event.key === 'ArrowLeft' ? -1 : 1));
    }
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => opener?.focus({preventScroll: true}));
})();
