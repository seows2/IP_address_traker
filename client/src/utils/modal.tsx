const alert = (message: string, ms?: number) => {
  const alertModalDom = document.querySelector(
    '#portal > .alert-modal',
  ) as HTMLElement;
  alertModalDom.classList.add('show');
  const span = alertModalDom.querySelector('span') as HTMLElement;
  span.innerText = message;

  setTimeout(() => {
    alertModalDom.classList.remove('show');
  }, ms ?? 2000);
};

export { alert };
