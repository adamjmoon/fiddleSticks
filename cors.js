
    function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {

      // Check if the XMLHttpRequest object has a "withCredentials" property.
      // "withCredentials" only exists on XMLHTTPRequest2 objects.
      xhr.open(method, url, true);

    } else if (typeof XDomainRequest != "undefined") {

      // Otherwise, check if XDomainRequest.
      // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
      xhr = new XDomainRequest();
      xhr.open(method, url);

    } else {

      // Otherwise, CORS is not supported by the browser.
      xhr = null;

    }
    return xhr;
  }
  var xhr = createCORSRequest('GET', themeFile);
  if (!xhr) {
    throw new Error('CORS not supported');
  }
  // Response handlers.
  xhr.onload = function() {
    var text = xhr.responseText;
      var style=document.createElement("style");
                 style.type = 'text/css';
                 style.innerHTML = text;
                 var head = document.getElementsByTagName("head")[0];
                head.insertBefore(style,head.firstChild);
    
    var title = getTitle(text);
    alert('Response from CORS request to ' + url + ': ' + title);
  };

  xhr.onerror = function() {
    alert('Woops, there was an error making the request.');
  };

  xhr.send();
