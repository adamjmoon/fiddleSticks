var page = require("webpage").create();
var system = require('system');
var spec = undefined;
if (system.args.length === 2) {
    spec = system.args[1]
}
var url = "http://localhost:4000";
if (spec)
    url = url + "?" + spec

page.onConsoleMessage = function (message) {
    console.log(message);
}
try {
    page.open(url, function (success) {
        if (success === "success") {
            setInterval(function () {
                if (page.evaluate(function () {
                    return window.phantomComplete;
                })) {
                    var failures = page.evaluate(function () {
                        return window.phantomResults.failed;
                    });
                    phantom.exit(failures);
                }
            }, 250);
        } else {
            printError("Failure opening " + url);
            phantom.exit(1);
        }
    });
} catch (ex) {
    phantom.exit(1);
}