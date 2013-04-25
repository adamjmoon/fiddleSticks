var configuration =
{
    baseUrl:'/',
    paths:{
        'app':'app-cov',
        'jquery':'scripts.min',
        'npm':'/node_modules',
        async:'lib/core/require.async.min'
    }
};
if (name) configuration.context = name;

require.config(configuration);

define('sinon', ['lib/sinon'], function (sinon) {
    return sinon;
});
define('knockout', ['scripts.min'], function (ko) {
    return ko;
});
define('underscore', ['scripts.min'], function () {
    return this._;
});
define('bean', ['lib/bean-min'], function () {
    return this.bean;
});
define('flotr', ['lib/bean-min', 'lib/flotr2.amd'], function () {
    return this.Flotr;
});
define('createjs', ['lib/core/createjs.min'], function () {
    return this.createjs;
});

function runMocha(specs, postResults, $) {
    require(specs, function () {
            if (window.mochaPhantomJS) {
                mochaPhantomJS.run();
                mochaPhantomJS.runner.on('end', function () {
                    var stats = mochaPhantomJS.runner.stats;
                    postResults(stats, false);
                });
            }
            else {
                var runner = mocha.run();
                runner.on('end', function () {
                    var suites = $("ul#mocha-report li.suite ul");
                    $("#collapse").click(function () {
                        $(suites).each(function (index, element) {
                            element.hidden = true;
                        });
                        $("#collapse").hide();
                        $("#expand").show();
                    });
                    $("#expand").click(function () {
                        $(suites).each(function (index, element) {
                            element.hidden = false;
                        });
                        $("#expand").hide();
                        $("#collapse").show();
                    });

                    var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0;

                    var fittedContentHeight = windowHeight - 150;
                    if ($("ul#mocha-report").height() >= fittedContentHeight) {
                        $("ul#mocha-report").height(fittedContentHeight);
                    }
                    postResults(runner.stats, true, function () {
                            window.phantomResults = runner.stats;
                            window.phantomComplete = true;
                        }
                    );
                });
            }
        }
    );
}
require(['knockout', 'jquery', 'underscore', 'app/logger'], function (ko, $, _, log) {
    require(['lib/chai', 'sinon', 'lib/sinon-chai', 'npm/mocha-phantomjs/node_modules/mocha/mocha'], function (chai, sinon, sinonChai) {
        chai.use(sinonChai);
        assert = chai.assert;
        should = chai.should();
        mocha.setup('bdd');
        mocha.reporter('html');

        var done = false;
        var postResults = function (stats, includeCoverage, callback) {
            if (includeCoverage) {
                var coverage = JSON.stringify(window.__coverage__.valueOf());
                $.post("/coverage", {coverage:coverage});
            }
            $.post("/stats", { stats:stats}, function () {
                if (callback) {
                    callback();
                }
            });
        };
        try {
            if (window.location.search) {
                var array = window.location.search.split('?');
                var spec = "spec/js/" + array[1];
                runMocha([spec], postResults, $);
            } else {
                $.get('/specs', function (specs) {
                    runMocha(specs, postResults, $);
                });
            }
        } catch(ex)
        {
            console.log('dfasdf');
        }
    });
});


