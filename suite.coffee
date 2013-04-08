define "Suite", [], (test) ->
  (desc, code) ->
    @suiteDesc = ko.observable(desc)
    @jsUnderTest = ko.observable(code)
    @tests = ko.observableArray([])
    return