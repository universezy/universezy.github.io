var timeoutId = 0;
var redirectUrl = "universezy/dist/index.html";

function checkParams () {
  var url = window.location.href;
  return checkRedirect(url, '?blog$') 
    || checkRedirect(url, '?cotegory$') 
    || checkRedirect(url, '?column$');
}

function checkRedirect (url, flag) {
  var index = url.indexOf(flag)
  if (index > 0) {
    var params = url.substring(index);
    redirectUrl += params;
    return true;
  } else {
    return false;
  }
}

redirect = () => {
  window.location.href=redirectUrl;
}

window.onload = () => {
  if (checkParams()) {
    redirect();
  } else {
    timeoutId = setTimeout(redirect, 3000);
  }
}

window.onclick = () => {
  clearTimeout(timeoutId);
  redirect();
}