define "Suite", ["Test", "benchmark"], (Test, Benchmark) ->
  (desc, js) ->
    self = this
    self.suiteDesc = ko.observable(desc)
    self.jsContext = new js()
    self.jsContextStr = ko.observable(js.toString())
    self.tests = ko.observableArray([])
    self.testCases = ko.observableArray([])
    for prop of self.jsContext
      tc =
        name: prop
        func: self.jsContext[prop]

      self.testCases.push tc
    self.shouldShow = ko.observable(true)
    self.benchmarks = ko.observableArray([])
    self.benchmarksStatus = ko.observable()
    self.benchmarkSuite = new Benchmark.Suite
    self.benchmarkPlatform = ko.observable(Benchmark.platform.description)
    ko.applyBindings self
    self.benchmarkSuite.on("cycle", (event) ->
      event.target.slowest = false
      event.target.fastest = false
      event.target.timesFaster = false
      self.benchmarks.push event.target
    ).on "complete", ->
      timesFaster = (benchmarkHz, slowestHz) ->
        (benchmarkHz / slowestHz).toFixed 3
      slowestBenchmark = @filter("slowest")[0]
      slowestBenchmark.slowest = true
      slowestHz = slowestBenchmark.hz
      fastestBenchmark = @filter("fastest")[0]
      fastestBenchmark.fastest = true
      self.benchmarks.remove slowestBenchmark
      self.benchmarks.remove fastestBenchmark
      benchmarksCopy = self.benchmarks().slice()
      self.benchmarks.removeAll()
      fastestBenchmark.timesFaster = timesFaster(fastestBenchmark.hz, slowestHz)
      self.benchmarks.push fastestBenchmark
      i = 0

      while i < benchmarksCopy.length
        benchmarksCopy[i].timesFaster = timesFaster(benchmarksCopy[i].hz, slowestHz)
        self.benchmarks.push benchmarksCopy[i]
        i++
      self.benchmarks.push slowestBenchmark
      self.benchmarksStatus "Completed"

    self.add = (shouldEqual, expression) ->
      test = new Test(shouldEqual, expression, self.jsContext)
      self.tests.push test
      self.benchmarkSuite.add test.expression, ->
        expression self.jsContext

      self

    self.run = ->
      self.benchmarkSuite.run async: true
      self.benchmarksStatus "Running..."
