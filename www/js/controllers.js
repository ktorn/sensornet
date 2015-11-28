angular.module('starter.controllers', [])

  .controller('DashCtrl', function ($scope, $ionicPlatform, $cordovaToast) {

    console.log("entered controller.")

    // var posOptions = {timeout: 10000, enableHighAccuracy: false};
    var ref = new Firebase("https://sensornet.firebaseio.com/");
    var location = ref.child("loc")
    var userRef = location.child("test");

    var watchOptions = {
      timeout: 3000,
      maximumAge: 1000,
      enableHighAccuracy: false // may cause errors if true
    };
    $scope.enableOpenData = false;
    $scope.toggleOpenData = function () {
      if($scope.enableOpenData)
      {
        $cordovaToast.show("Stop sharing to Open Data", "short", "center");
      }
      else
      {
        $cordovaToast.show("Start sharing to Open Data", "short", "center");

      }
      $scope.enableOpenData = !$scope.enableOpenData;
      var prefs = userRef.child("preferences");
      var time = new Date().getTime();
      var userTime = userRef.child(time);
      userTime.set({openData: $scope.enableOpenData});
    }
    $ionicPlatform.ready(function () {

      function locService() {
        console.log("entered locService.")

        var callbackFn = function (position) {
          var lat = position.latitude
          var lon = position.longitude
          var time = new Date().getTime();
          var altitude =  position.altitude;
          var speed =  position.speed;
          var userTime = userRef.child(time);
          userTime.set({
            lat: lat,
            lon: lon,
            altitude:altitude,
            speed:speed

          })
          console.log("lat: [" + lat + "] lon: [" + lon + "]")
          $scope.location = {lat: lat, lon: lon, altitude:altitude, speed:speed};
          $scope.$apply();
          $cordovaToast.show("Location saved", "short", "center");
          console.log('[js] BackgroundGeoLocation callback:  ' + position.latitude + ',' + position.longitude + " speed:" + position.speed);

          // Do your HTTP request here to POST location to your server.
          // jQuery.post(url, JSON.stringify(location));

          /*
           IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
           and the background-task may be completed.  You must do this regardless if your HTTP request is successful or not.
           IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
           */
          backgroundGeoLocation.finish();
        };

        var failureFn = function (error) {
          console.log('BackgroundGeoLocation error');


        };

        // BackgroundGeoLocation is highly configurable. See platform specific configuration options
        backgroundGeoLocation.configure(callbackFn, failureFn, {
          desiredAccuracy: 10,
          stationaryRadius: 1,
          distanceFilter: 1,
          maximumAge: 2000, timeout: 2000, enableHighAccuracy: true,
          debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
          stopOnTerminate: false, // <-- enable this to clear background location settings when the app terminates
        });

        // Turn ON the background-geolocation system.  The user will be tracked whenever they suspend the app.
        backgroundGeoLocation.start();

      }

      locService()

    })

  })

  .controller('ChatsCtrl', function ($scope, Chats) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.chats = Chats.all();
    $scope.remove = function (chat) {
      Chats.remove(chat);
    };
  })

  .controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
  })

  .controller('AccountCtrl', function ($scope) {
    $scope.settings = {
      enableFriends: true
    };
  });
