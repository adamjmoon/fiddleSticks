// if we were doing cross domain

    var iframe = document.createElement("iframe");
    var uniqueString = "coverage1234";
    document.body.appendChild(iframe);
    iframe.style.display = "none";
    iframe.contentWindow.name = uniqueString;
    iframe.src = "javascript:false";
    iframe.style.visibility = "hidden";
    iframe.style.position = "absolute";
    iframe.style.top = 0;

    // construct a form with hidden inputs, targeting the iframe
    var form = document.createElement("form");
    form.target = uniqueString;
    form.action = "http://localhost:4000/coverage";
    form.method = "POST";

    // repeat for each parameter
    var input = document.createElement("input");
    input.type = "hidden";
    input.name = "coverage";
    input.value = JSON.stringify(window.__coverage__);
    form.appendChild(input);

    document.body.appendChild(form);
    form.submit();