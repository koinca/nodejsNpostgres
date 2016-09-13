'use strict';

/**
 * @ngdoc directive
 * @name alphaApp.directive:fileReader
 * @description
 * # fileReader
 */
angular.module('alphaApp')
    .directive('fileReader', function() {
        return {
        scope: {
          readerHandler: '&',
          fileReader : "="
        },
        link: function(scope, element) {
          $(element).on('change', function(changeEvent) {
            var files = changeEvent.target.files;
            if (files.length) {
              var r = new FileReader();
              r.onload = function(e) {
                  var contents = e.target.result;
                  scope.$apply(function () {
                      scope.fileReader = contents;
                      if(_.has(scope, 'readerHandler')) {
                        scope.readerHandler({content: contents});
                      }
                  });
              };

              r.readAsText(files[0]);
            }
          });
        }
        };
    });

