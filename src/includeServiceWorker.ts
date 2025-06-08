export default () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/serviceWorker.js')
        .then((reg) => {
          console.log('Service worker registered:', reg.scope);
        })
        .catch((err) => {
          console.error('Service worker registration failed:', err);
        });
    });
  }
}
