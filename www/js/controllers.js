angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $interval, $cordovaGeolocation) {

  var posOptions = {timeout: 10000, enableHighAccuracy: false};
  var ref = new Firebase("https://sensornet.firebaseio.com/");
  var location = ref.child("loc")

 $interval(function()
 {
 // var watchOptions = {
 //    timeout : 3000,
 //    enableHighAccuracy: false // may cause errors if true
 //  };

 //  var watch = $cordovaGeolocation.watchPosition(watchOptions);
 //  watch.then(
 //    null,
 //    function(err) {
 //      // error
 //    },
 //    function(position) {
 //      var lat  = position.coords.latitude
 //      var lon = position.coords.longitude

 //      location.set({
 //                      test: { lat: lat,
 //                              lon: lon
 //                            }
 //      })
 //      $scope.location={lat:lat, lon:lon};
 //  });
 //  watch.clearWatch();
$cordovaGeolocation
    .getCurrentPosition(posOptions)
    .then(function (position) {
      var lat  = position.coords.latitude
      var lon = position.coords.longitude

      location.set({
                      test: { lat: lat,
                              lon: lon
                            }
      })
            $scope.location={lat:lat, lon:lon};

    
    }, function(err) {
      alert("error: " + JSON.stringify(err))
    });
  },1000 )

// },1000)
 

})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
