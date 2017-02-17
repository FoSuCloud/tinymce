define(
  'ephox.alloy.api.ui.GuiTypes',

  [
    'ephox.boulder.api.Objects',
    'ephox.katamari.api.Arr',
    'ephox.epithet.Id',
    'ephox.peanut.Fun'
  ],

  function (Objects, Arr, Id, Fun) {
    var premadeTag = Id.generate('alloy-premade');
    var apiConfig = Id.generate('api');


    var premade = function (comp) {
      return Objects.wrap(premadeTag, comp);
    };

    var getPremade = function (spec) {
      return Objects.readOptFrom(spec, premadeTag);
    };

    var makeApis = function (apiNames) {
      var apis = Arr.map(apiNames, function (apiName) {
        return {
          key: apiName,
          value: function (component/*, ... */) {
            var args = Array.prototype.slice.call(arguments, 0);
            var spi = component.config(apiConfig);
            return spi[apiName].apply(null, args);
          }
        };
      });

      return Objects.wrapAll(apis);
    };

    return {
      apiConfig: Fun.constant(apiConfig),
      makeApis: makeApis,
      premade: premade,
      getPremade: getPremade
    };
  }
);