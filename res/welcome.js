var timeoutId = 0;
var redirectUrl = "universezy/dist/index.html";

function checkParams () {
  var url = window.location.href;
  var index = url.indexOf('?blogId=');
  if (index > 0) {
    var params = url.substring(index);
    redirectUrl += params;
    return true;
  } else {
    var indexQZone = url.indexOf('?');
    if (indexQZone > 0) {
      var blogId = url.substring(indexQZone + 1);
      var params = '?blogId=' + blogId;
      redirectUrl += params;
      return true;
    }
  }
  return false;
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