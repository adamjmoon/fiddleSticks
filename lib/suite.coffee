define "Suite", ["Test", "benchmark", "knockout"], (Test, Benchmark, ko) ->
  (desc, js) ->
    setupTestCases = (context, base) ->
      for prop of context
        if context[prop] instanceof Function
          try
            tc =
              name: base + "." + prop
              value: context[prop].toString()

            self.testCases.push tc
        else if context[prop] instanceof Object
          if Object.toSource
            tc =
              name: prop
              value: context[prop].toSource()

            self.testCases.push tc
        setupTestCases context[prop]::, base + "." + prop + ".prototype"  if context[prop] and context[prop]::
    
    # var benchmarksCopy = self.benchmarks().slice();
    # self.benchmarks.removeAll();
    $ = (id) ->
      (if typeof id is "string" then document.getElementById(id) else id)
    createElement = (tagName) ->
      document.createElement tagName
    setHTML = (element, html) ->
      element.innerHTML = (if not html? then "" else html)  if element = $(element)
      element
    self = this
    self.suiteDesc = ko.observable(desc)
    self.jsContext = new js()
    self.jsContextStr = ko.observable(js.toString())
    self.tests = ko.observableArray([])
    self.testCases = ko.observableArray([])
    self.shouldShow = ko.observable(true)
    self.benchmarks = ko.observableArray([])
    self.benchmarksDone = ko.observable(false)
    self.benchmarkSuite = new Benchmark.Suite
    self.benchmarkPlatform = ko.observable(Benchmark.platform.description)
    setupTestCases self.jsContext, "context"
    self.benchmarkSuite.on("cycle", (event) ->
      b = event.target
      self.benchmarks.push
        name: ko.observable(b.name.replace(/context\.(.*?)\(\)\;/g, "$1"))
        expression: ko.observable(b.name)
        hz: ko.observable(b.hz.toFixed(0))
        relativateMarginError: ko.observable(b.stats.rme.toFixed(2) + "%")
        timesFaster: ko.observable("pending...")
        slowest: ko.observable(false)
        fastest: ko.observable(false)
        iterationPerSampleCycle: ko.observable(b.count)
        numAnalysisCycles: ko.observable(b.cycles)
        numSampleCycles: ko.observable(b.stats.sample.length)

    ).on "complete", ->
      self.benchmarks.sort (left, right) ->
        leftHz = parseInt(left.hz())
        rightHz = parseInt(right.hz())
        (if leftHz is rightHz then 0 else ((if leftHz > rightHz then -1 else 1)))

      self.benchmarks()[0].fastest true
      length = self.benchmarks().length
      self.benchmarks()[length - 1].slowest true
      slowestHz = self.benchmarks()[length - 1].hz()
      i = 0

      while i < length
        self.benchmarks()[i].timesFaster (self.benchmarks()[i].hz() / slowestHz).toFixed(3)
        i++
      self.benchmarksDone true
      return

    self.add = (shouldEqual, expression, name) ->
      test = new Test(shouldEqual, expression, self.jsContext, name)
      self.tests.push test
      self.benchmarkSuite.add test.expression, (->
        expression self.jsContext, name
      ),
        async: true
        queued: true
        minSamples: 100

      self

    self.shouldEqual = (shouldEqual) ->
      self.shouldEqualValue = shouldEqual
      self

    self.compare = (func) ->
      for testcase of self.jsContext
        self.add self.shouldEqualValue, func, testcase
      self

    self.run = ->
      self.benchmarksDone false
      self.benchmarks.removeAll()
      self.benchmarkSuite.run()
      return

    ko.applyBindings self
    return
