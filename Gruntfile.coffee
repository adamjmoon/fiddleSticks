module.exports = (grunt) ->
  r = __dirname + "/"
  theme = r + 'theme/'
  themeAmelia = theme + 'amelia/'
  themeCerulean = theme + 'cerulian/'
  themeCyborg = theme + 'cyborg/'
  themeCosmo = theme + 'cosmo/'
  lib = r + 'lib/'
  #vendor root
  v = r + 'vendor/'
  views = r + 'app/views/'
  test = r + 'test/'
  coverage = r + 'coverage/'
  cp = require('child_process')
  testServerPort = '4000'
  testServerWebSocketPort = 4001

   # Load external tasks
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-contrib-jshint'
  grunt.loadNpmTasks 'grunt-recess'
  grunt.loadNpmTasks 'grunt-yui-compressor'
  # grunt.loadNpmTasks 'grunt-istanbul'
  # grunt.loadNpmTasks 'grunt-parallel'

  # Make task shortcuts
  grunt.registerTask 'default', ['concat','min']
  # grunt.registerTask 'build', ['default', 'min']
  # grunt.registerTask 'run', ['parallel:test']
  # grunt.registerTask 'css', ['recess']
  # grunt.registerTask 'optimize', ['concat', 'min', 'recess', 'cssmin']
  # grunt.registerTask 'start', ['startUnitTestServer']
  # grunt.registerTask 'kill', ['killUnitTestServer']
  # grunt.registerTask 'test', ['parallel:a']
  # grunt.registerTask 'cover', ['instrument', 'compileSpecs', 'start', 'run', 'makeReport', 'kill']
  # grunt.registerTask 'ci', ['instrument', 'compileSpecs', 'start', 'run', 'makeReport', 'openCoverageReport', 'watch']

  # Configure Grunt
  grunt.initConfig
    jshint:
      files: [r + '*.js']
    recess:
      cyborg:
        src: [themeCyborg + '*.less']
        dest: themeCyborg + 'bootstrap.min.css'
        options: compile: true, compress: true
    concat:
      scripts:
        src: [v+'jquery-2.0.0b1.js',v+'bootstrap.min.js',v+'lodash.min.js',v+'platform.js',v+'benchmark.js',v+'knockout-min.js']
        dest: r + 'scripts.js'
      scriptsCopy:
        src: [r + 'scripts.js']
        dest: r + 'scripts.min.js'
      module: 
        src: [lib + 'suite.js', lib + 'test.js', lib + 'spy.js', lib + 'verify.js', lib + 'fiddleSticks.js']
        dest: r + 'fiddleSticks.js'
    min:
      dist:
        src: [r + 'scripts.js']
        dest: r + 'scripts.min.js',
      module: 
        src: [r + 'fiddleSticks.js']
        dest: r + 'fiddleSticks.min.js'
      main:
        src: [r + 'main.js']
        dest: r + 'main.min.js'
    
    
    # watch:
    #   gruntfile:
    #     files: ['gruntfile.coffee', r + 'main.js']
    #     tasks: ['default']
    #     options: nocase: true

    #   test:
    #     files: [app + '**/*', lib + '**/*']
    #     tasks: ['instrument', 'test', 'default']

    #   css:
    #     files: [less + '**/*.less']
    #     tasks: ['css']

    #   cover:
    #     files: [coverage + 'coverage.json']
    #     tasks: ['makeReport']
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
    # makeReport:
    #   src: coverage + 'coverage.json'
    #   options:
    #     type: 'lcov'
    #     dir: coverage
    # instrument:
    #   files: app + '*.js'
    #   options:
    #     basePath: js + 'app-cov/'
    #     flatten: true

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
    mocha = exec(mochaScript, null, () -> done())
    mocha.stdout.pipe process.stdout
    mocha.stderr.pipe process.stderr
    done = this.async()

  grunt.registerTask 'runTests', ->
    exec = cp.exec
    phantomRunner = __dirname + '\\phantomRunner.cmd'
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
        # console.log('Coverage Report Already Open')
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