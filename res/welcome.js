var timeoutId = 0;
var redirectUrl = "universezy/dist/index.html";

function checkParams () {
  var url = window.location.href;
  var index = url.indexOf('?blogId=');
  if (index > 0) {
    var params = url.substring(index);
    redirectUrl="universezy/dist/index.html" + params;
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