module.exports = (grunt) ->
  root = __dirname + "/"
  theme = root + 'theme/'
  themeAmelia = theme + 'amelia/'
  themeCerulean = theme + 'cerulian/'
  themeCyborg = theme + 'cyborg/'
  themeCosmo = theme + 'cosmo/'
  lib = root +'lib/'
  app = root + 'app/'
  views = root + 'app/views/'
  test = root + 'test/'
  coverage = root + 'coverage/'
  cp = require('child_process')
  testServerPort = '4000'
  testServerWebSocketPort = 4001

   # Load external tasks
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-contrib-jshint'
  grunt.loadNpmTasks 'grunt-recess'
  grunt.loadNpmTasks 'grunt-yui-compressor'
  grunt.loadNpmTasks 'grunt-shell'
  grunt.loadNpmTasks 'grunt-istanbul'
  grunt.loadNpmTasks 'grunt-parallel'

  # Make task shortcuts
  grunt.registerTask 'default', ['jshint', 'recess', 'concat']
  grunt.registerTask 'build', ['default', 'min']
  grunt.registerTask 'run', ['parallel:test']
  grunt.registerTask 'css', ['recess']
  grunt.registerTask 'optimize', ['concat', 'min', 'recess', 'cssmin']
  grunt.registerTask 'start', ['startUnitTestServer']
  grunt.registerTask 'kill', ['killUnitTestServer']
  grunt.registerTask 'test', ['parallel:a']
  grunt.registerTask 'cover', ['instrument', 'compileSpecs', 'start', 'run', 'makeReport', 'kill']
  grunt.registerTask 'ci', ['instrument', 'compileSpecs', 'start', 'run', 'makeReport', 'openCoverageReport', 'watch']

  # Configure Grunt
  grunt.initConfig
    jshint:
      files: [js + '_*.js']
    recess:
      amelia:
        src: [themeAmelia + '*.less']
        dest: themeAmelia + 'bootstrap.min.css'
        options: compile: true, compress: true, noIDs: true
    concat:
      js:
        src: [lib + 'jquery-1.8.2.js', lib + 'json2.min.js', lib + 'underscore.js', lib + 'jquery.PrintArea.js', lib + 'bootstrap/bootstrap-collapse.js', lib + 'bootstrap/bootstrap-dropdown.js', lib + 'bootstrap/bootstrap-modal.js', lib + 'bootstrap/bootstrap-carousel.js', lib + 'knockout.js', app + 'config.js', app + 'dataservice.js', app + 'portaldataservice.js', app + 'errorlog.js', app + 'logger.js', app + 'redirect.js', app + 'activitytracker.navigation.js', app + 'alerts.summary.vm.js', app + 'alerts.summary.js', app + 'navigation.vm.js', app + 'navigation.js', app + 'footer.js', app + 'knockout.bindings.js', app + 'offer.vm.js', app + 'offer.js']
        dest: js + 'scripts.js'

      scriptsCopy:
        src: [js + 'scripts.js']
        dest: js + 'scripts.min.js'

      alerts:
        src: [app + 'alerts.vm.js', app + 'alerts.js']
        dest: views + 'alertsView.js'

      scoreCast:
        src: [app + 'scoreCast.vm.js', app + 'scoreCast.js']
        dest: views + 'scoreCastView.js'

      creditReport:
        src: [app + 'creditReport.vm.js', app + 'creditReport.js']
        dest: views + 'creditReportView.js'

      scoreTracker:
        src: [app + 'scoreTracker.vm.js', app + 'scoreTracker.js']
        dest: views + 'scoreTrackerView.js'

      myAccount:
        src: [app + 'selectState.js', app + 'customer.js', app + 'account.myAccount.vm.js', app + 'account.myAccount.js', app + 'offer.OnlineCancellation.vm.js', app + 'offer.OnlineCancellation.js']
        dest: views + 'myAccountView.js'

      neighborhoodReport:
        src: [app + 'sexOffender.grid.vm.js', app + 'sexOffender.grid.js', app + 'sexOffender.map.js']
        dest: views + 'neighborhoodReportView.js'

      identityReport:
        src: [app + 'idReport.vm.js', app + 'idReport.js', app + 'idReport.address.vm.js', app + 'idReport.address.js', app + 'idReport.alias.vm.js', app + 'idReport.alias.js', app + 'idReport.criminal.vm.js', app + 'idReport.criminal.js', app + 'idReport.monitoredCredentials.vm.js', app + 'idReport.monitoredCredentials.js', app + 'idReport.payday.vm.js', app + 'idReport.payday.js', app + 'idReport.paydaySummary.vm.js', app + 'idReport.paydaySummary.js', app + 'idReport.surveillance.vm.js', app + 'idReport.surveillance.js']
        dest: views + 'identityReportView.js'

      dashboard:
        src: [app + 'creditSummary.vm.js', app + 'creditSummary.js', app + 'dashboard.scores.vm.js', app + 'dashboard.scores.js', app + 'dashboard.scoreRatingCanvas.js', app + 'dashboard.scores.canvas.js', app + 'dashboard.scores.flash.js', app + 'dashboard.familysafety.vm.js', app + 'dashboard.familysafety.js', app + 'dashboard.idscore.vm.js', app + 'dashboard.idscore.js', app + 'dashboard.idScoreRatingCanvas.js', app + 'dashboard.idscore.canvas.js', app + 'dashboard.idscore.flash.js']
        dest: views + 'dashboardView.js'

      mainCopy:
        src: [js + 'main.js']
        dest: js + 'main.min.js'

      alertsCopy:
        src: [views + 'alertsView.js']
        dest: views + 'alertsView.min.js'

      creditReportCopy:
        src: [views + 'creditReportView.js']
        dest: views + 'creditReportView.min.js'

      scoreTrackerCopy:
        src: [views + 'scoreTrackerView.js']
        dest: views + 'scoreTrackerView.min.js'

      scoreCastCopy:
        src: [views + 'scoreCastView.js']
        dest: views + 'scoreCastView.min.js'

      identityReportCopy:
        src: [views + 'identityReportView.js']
        dest: views + 'identityReportView.min.js'

      neighborhoodReportCopy:
        src: [views + 'neighborhoodReportView.js']
        dest: views + 'neighborhoodReportView.min.js'

      myAccountCopy:
        src: [views + 'myAccountView.js']
        dest: views + 'myAccountView.min.js'

      dashboardCopy:
        src: [views + 'dashboardView.js']
        dest: views + 'dashboardView.min.js'

    min:
      dist:
        src: [js + 'scripts.js']
        dest: js + 'scripts.min.js'

      main:
        src: [js + 'main.js']
        dest: js + 'main.min.js'

      alerts:
        src: [views + 'alertsView.js']
        dest: views + 'alertsView.min.js'

      creditReport:
        src: [views + 'creditReportView.js']
        dest: views + 'creditReportView.min.js'

      scoreTracker:
        src: [views + 'scoreTrackerView.js']
        dest: views + 'scoreTrackerView.min.js'

      scoreCast:
        src: [views + 'scoreCastView.js']
        dest: views + 'scoreCastView.min.js'

      myAccount:
        src: [views + 'myAccountView.js']
        dest: views + 'myAccountView.min.js'

      dashboard:
        src: [views + 'dashboardView.js']
        dest: views + 'dashboardView.min.js'

      neighborhoodReport:
        src: [views + 'neighborhoodReportView.js']
        dest: views + 'neighborhoodReportView.min.js'

      identityReport:
        src: [views + 'identityReportView.js']
        dest: views + 'identityReportView.min.js'

    uglify:
      mangle:
        toplevel: true
        squeeze:
          dead_code: false
          codegen: quote_keys: true
    cssmin:
      compress:
        files:
          'brand/MyCreditHealth/css/app.min.css': ['brand/MyCreditHealth/css/app.css']
          'brand/ScoreSense/css/app.min.css': ['brand/ScoreSense/css/app.min.css']
    watch:
      gruntfile:
        files: ['gruntfile.coffee', js + 'main.js']
        tasks: ['default']
        options: nocase: true

      test:
        files: [app + '**/*', lib + '**/*']
        tasks: ['instrument', 'test', 'default']

      css:
        files: [less + '**/*.less']
        tasks: ['css']

      cover:
        files: [coverage + 'coverage.json']
        tasks: ['makeReport']
    parallel:
      default:
        tasks:
          [
            {grunt: true, args: ['jshint']},
            {grunt: true, args: ['recess']},
            {grunt: true, args: ['concat']}
          ]
      build:
       tasks:
         [
           {grunt: true, args: ['jshint']},
           {grunt: true, args: ['recess']},
           {grunt: true, args: ['concat','min']}
         ]
      ci:
         tasks:
           [
             {grunt: true, args: ['startUnitTestServer']},
             {grunt: true, args: ['recess']},
             {grunt: true, args: ['concat','min']}
           ]
    makeReport:
      src: coverage + 'coverage.json'
      options:
        type: 'lcov'
        dir: coverage
    instrument:
      files: app + '*.js'
      options:
        basePath: js + 'app-cov/'
        flatten: true

  testServer = undefined

  #  grunt.event.on "watch", (action, filepath) ->
  #    grunt.log.writeln filepath + " has " + action

  grunt.registerTask 'startUnitTestServer', ->
    alreadyOn = false
    callback = (result) ->
      alreadyOn = result
      unless alreadyOn
        startServer(done)
      else
        console.log 'no need to start JS Unit Test Server'
        done()
    testSocket testServerPort, this.async, callback
    done = this.async()

    startServer = (done) ->
      spawn = cp.spawn
      console.log js + 'app.js'
      testServer = spawn('node', [js + 'app.js'])
      testServer.stdout.pipe process.stdout
      testServer.stderr.pipe process.stderr
      testServer.on 'exit', (code) ->
        console.log 'server killed'
        done()

  grunt.registerTask 'kill', ->
    exec = cp.exec
    nodekill = exec('taskkill /IM node.exe /F', {}, () -> done())
    nodekill.stdout.pipe process.stdout
    nodekill.stderr.pipe process.stderr
    grunt.log.write 'Waiting...'
    done = this.async()

  grunt.registerTask 'compileSpecs', ->
    exec = cp.exec
    script = spec + 'coffee.cmd'
    console.log script
    coffee = exec(script, null, () -> done())
    coffee.stdout.pipe process.stdout
    coffee.stderr.pipe process.stderr
    done = this.async()

  grunt.registerTask 'mocha', ->
    exec = cp.exec
    mochaScript = __dirname + '\\node_modules\\.bin\\mocha-phantomjs.cmd http://localhost:4000 --reporter spec'
    console.log mochaScript
    mocha = exec(mochaScript, null, () -> done())
    mocha.stdout.pipe process.stdout
    mocha.stderr.pipe process.stderr
    done = this.async()

  grunt.registerTask 'runTests', ->
    exec = cp.exec
    phantomRunner = __dirname + '\\phantomRunner.cmd'
    console.log phantomRunner
    phantomTestRunner = exec(phantomRunner, null, () -> done())
    phantomTestRunner.stdout.pipe process.stdout
    phantomTestRunner.stderr.pipe process.stderr
    done = this.async()

  grunt.registerTask 'openCoverageReport', ->
    pageAlreadyOpen = false
    callback = (result) ->
      pageAlreadyOpen = result
      console.log pageAlreadyOpen
      unless pageAlreadyOpen
        openCoveragePage(done)
      else
        console.log('Coverage Report Already Open')
    testWebSocket testServerWebSocketPort, this.async, callback
    done = this.async()

    openCoveragePage = (doneCallback) ->
      spawn = require('child_process').spawn
      url_to_open = 'http://localhost:' + testServerPort + '/coverage'
      chrome = spawn process.env[(if (process.platform is 'win32') then 'USERPROFILE' else 'HOME')] + '\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe', ['--new-tab', url_to_open]
      doneCallback()

  testSocket = (port, async, result) ->
    net = require('net')
    sock = new net.Socket()
    sock.setTimeout 1500
    sock.on('connect',
      () ->
        result true
        done()
    ).on('error',
      (e) ->
        sock.destroy()
        result(false)
        done()
    ).on('timeout',
      (e) ->
        console.log 'ping timeout'
        result(false)
        done()
    ).connect port, '127.0.0.1'
    grunt.log.write 'Waiting...'
    done = async

  testWebSocket = (port, async, result) ->
    WS = require('ws').Server
    wss = new WS({ port: port, verifyClient: true })

    Emitter = require('events').EventEmitter
    emitter = new Emitter

    wss.on 'connection', (ws) ->
      ws.send JSON.stringify(r: Date.now().toString()), (error) ->
        unless error
          result true
          wss.close()
          done()
        else
          console.log e
          result false
          wss.close()
          done()

    checkTimeout = () -> if wss._server && wss._server.connections == 0
      result false
      wss.close()
      done()
    setTimeout checkTimeout, 500
    grunt.log.write 'Waiting...'
    done = async