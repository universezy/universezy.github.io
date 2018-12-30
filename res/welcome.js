var timeoutId = 0;

redirect = () => {
  window.location.href="https://universezy.github.io/universezy/dist/index.html";
}

window.onload = () => {
  timeoutId = setTimeout(redirect, 3000);
}

window.onclick = () => {
  clearTimeout(timeoutId);
  redirect()
}