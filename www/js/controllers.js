// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('finly', ['ionic', 'finly.user', 'tabSlideBox', 'ionic-material','ngSanitize', 'ngCordova','ngIOS9UIWebViewPatch'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // then override any default you want
window.plugins.nativepagetransitions.globalOptions.duration = 500;
window.plugins.nativepagetransitions.globalOptions.iosdelay = 350;
window.plugins.nativepagetransitions.globalOptions.androiddelay = 350;
window.plugins.nativepagetransitions.globalOptions.winphonedelay = 350;
window.plugins.nativepagetransitions.globalOptions.slowdownfactor = 4;
// these are used for slide left/right only currently
window.plugins.nativepagetransitions.globalOptions.fixedPixelsTop = 0;
window.plugins.nativepagetransitions.globalOptions.fixedPixelsBottom = 0;
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

//app run getting device id
app.run(function ($rootScope, myPushNotification) {
	// app device ready
	document.addEventListener("deviceready", function(){
		myPushNotification.registerPush();
	});
   $rootScope.get_device_token = function () {
      if(localStorage.device_token) {
         return localStorage.device_token;
      } else {
         return '-1';
      }
   }
})

//myservice device registration id to localstorage
app.service('myService', ['$http','Config','SendPush', function($http,Config,SendPush) {
   this.registerID = function(regID, platform) {
	  window.localStorage.setItem("regID", regID);
    window.localStorage.setItem("platform", platform);
		localStorage.device_token = regID;
   }
}]);



app.controller('LoginCtrl', function($scope, $state, $ionicPopup, $ionicHistory, User, $ionicLoading){

  $scope.credentials = {
  mobile_number    :'',
  password :''
};

  $scope.login = function(credentials) {
    $ionicLoading.show({
         template: 'Login...'
      });
    User.login($scope.credentials)
    .then(function(credentials) {
      $ionicLoading.show({
           template: 'Login...'
        });
      var regID = localStorage.device_token;
      var platform = window.localStorage.getItem("platform");
   		if(regID && platform && device.uuid ){
   			User.registerDevice(regID, device.uuid, platform, $scope.credentials.mobile_number)
   			.success(function (data) {
          $ionicLoading.hide();
          $ionicHistory.nextViewOptions({historyRoot: true});
          $state.go('news.home');
   			})
   			.error(function (error) {
          $ionicLoading.hide();
          var alertPopup = $ionicPopup.alert({
            title: '1',
            template: 'Please check your credentials!'
          });
   			});
   		}
   		localStorage.device_token = regID;
    }, function(err) {
      $ionicLoading.hide();
      var alertPopup = $ionicPopup.alert({
        title: 'Login failed!',
        template: 'Please check your credentials!'
      });
    });
  };

})

app.controller('SignUpCtrl', function($scope, $state, $ionicPopup, User, $ionicLoading){

  $scope.user = {
    firstname     :'',
    lastname      :'',
    mobile_number :'',
    email         :'',
    password      :''
  };

  $scope.signUp = function() {
    $ionicLoading.show({
         template: 'Registering...'
      });
    var regID = localStorage.device_token;
    var platform = window.localStorage.getItem("platform");
    User.register($scope.user, regID, device.uuid, platform).then(function(){
      $ionicLoading.hide();
      $state.go('news.otp');
    }, function(err) {
      $ionicLoading.hide();
      var alertPopup = $ionicPopup.alert({
        title: 'Registration failed!',
        template: 'Connection Problem!'
      });
    });
  };

})

app.controller('OtpCtrl', function($scope, $state, $ionicPopup, $ionicHistory, User, $ionicLoading){

  $scope.otp = {
    otpnum     :''
  };

  $scope.user = {
  };

  $scope.doOtp = function() {
    $ionicLoading.show({
         template: 'Verifying...'
      });
    User.otpVerify($scope.otp).then(function(){
      $ionicLoading.hide();
          $ionicHistory.nextViewOptions({historyRoot: true});
          $state.go('news.home');
    }, function(err) {
      $ionicLoading.hide();
      var alertPopup = $ionicPopup.alert({
        title: 'Incorrect OTP!',
        template: 'Enter Again!'
      });
    });
  };

  $scope.reOtp = function() {
    $ionicLoading.show({
         template: 'Sending...'
      });
    User.resendOTP($scope.user).then(function(){
          $ionicLoading.hide();
          $state.go('news.otp');
    }, function(err) {
      $ionicLoading.hide();
      var alertPopup = $ionicPopup.alert({
        title: 'Sorry!',
        template: 'Unable to resend!'
      });
    });
  };

})

app.controller('ForgotCtrl', function($scope) {


})

app.controller('NewsCtrl', ['$scope', '$rootScope', '$state', '$sce', '$ionicSlideBoxDelegate','Color', 'User','Config', function($scope, $rootScope, $state, $sce, $ionicSlideBoxDelegate, Color, User, Config) {

	$scope.appColor = Color.AppColor;
  $scope.AndroidAppUrl = Config.AndroidAppUrl;
	$scope.AppName = Config.AppName;
  	// Toggle left function for app sidebar
  	$scope.toggleLeft = function() {
    	$ionicSideMenuDelegate.toggleLeft();
  	};
	// sharing plugin

  $rootScope.isLoggedIn = function() {
  console.log(User.isLoggedIn());
    return User.isLoggedIn();
  }
  $rootScope.isLoggedIn();

  var firstname = window.localStorage.getItem("firstname");
  $scope.firstname = $sce.trustAsHtml(firstname);

  $rootScope.logout = function() {
  //  console.log(User.isLoggedIn());
    return User.logout();
  }
	$scope.shareArticle = function(title,url){
		window.plugins.socialsharing.share(title, null, null, url)
	}
	// open link url
	$scope.openLinkArticle = function(url){
		//window.open(url, '_system');
		var ref = cordova.InAppBrowser.open(url, '_blank', 'location=yes');
		//use ref
	}
	$scope.openLinkSystem = function(url){
		//window.open(url, '_system');
		var ref = cordova.InAppBrowser.open(url, '_system', 'location=yes');
		// use  ref
	}
	$scope.shareArticleImage = function(title,url) {
		navigator.screenshot.URI(function(error,res){
		  if(error){
			console.error(error);
		  }else{
			  window.plugins.socialsharing.share(title, Config.AppName, res.URI, url)
		  }
		},'jpg',70);
	}
}
])

app.controller('ChannelCtrl',['$scope', '$stateParams', '$timeout', 'NewsApp', '$q', 'ionicMaterialMotion', 'ionicMaterialInk',
 function($scope, $stateParams, $timeout, NewsApp, $q, ionicMaterialMotion, ionicMaterialInk) {

    // Set Motion
    $timeout(function() {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);

    $timeout(function() {
        ionicMaterialMotion.fadeSlideInRight({
            startVelocity: 3000
        });
    }, 700);

    $scope.items = [];
    $scope.times = 0 ;


    $scope.channelid = parseInt($stateParams.channelid);

    $scope.channel = function(){
  		NewsApp.channel($scope.channelid)
  		.success(function (posts) {
  			$scope.items = $scope.items.concat(posts.channel);
  			NewsApp.posts = $scope.items;
        $scope.item_index = 0;
        $scope.item = {};
  			$scope.times = $scope.times + 1;
  		})
  		.error(function (error) {
  			$scope.items = [];
  		});
  	}

    $scope.channel();

    // Set Ink
    ionicMaterialInk.displayEffect();
}
])

app.controller('HomeCtrl', ['$rootScope', "$scope", '$state', 'User', 'NewsApp', "$stateParams", "$q", "$location", "$window", '$timeout',
			function($rootScope, $scope, $state, User, NewsApp, $stateParams, $q, $location, $window, $timeout){
        $scope.heading = 'News';
        $scope.items = [];
	$scope.times = 0 ;
	$scope.postsCompleted = false;
  $rootScope.active_tab=1;
	// load more content function
	$scope.getPosts = function(){
		NewsApp.getPosts()
		.success(function (posts) {
			$scope.items = $scope.items.concat(posts.news);
			NewsApp.posts = $scope.items;
      var article = window.localStorage.getItem("last_read_article");
      if (article == null){
          article = 0;
      }
      var num = article;
      $scope.item_index = num;
      $scope.item = {};
			$scope.times = $scope.times + 1;
      var obj = { finly_article_create_date : "Today",
                  finly_article_description : "You have read all the article. But don't worry many articles are on the way.",
                  finly_article_id : "logo",
                  finly_article_image_ext : "png",
                  finly_article_name : "THANK YOU!",
                  finly_channel_name : "Finly Curation Team - Harsh"}
      $scope.items[$scope.items.length] = obj;
      $scope.items[-1] = obj;
      $scope.onSwipeUp = function () {
            $scope.swipe='up';
        if ($scope.item_index < $scope.items.length && $scope.item_index >= 0) {
          
              $scope.item_index++;
              var article = window.localStorage.getItem("last_read_article");

              if(article < $scope.item_index) {
              window.localStorage.setItem("last_read_article", $scope.item_index);
              }
          }
          console.log('up',$scope.items.length + '/' + $scope.item_index);
      };

        $scope.onSwipeDown = function () {
             $scope.swipe='down';
         if ($scope.item_index < $scope.items.length && $scope.item_index>0) {
              $scope.item_index--;
          } else {
              $scope.item_index = 0;
          }
          console.log($scope.items.length + '/' + $scope.item_index);
    };
			if(posts.news.length == 0) {

				$scope.postsCompleted = true;
			}
		})
		.error(function (error) {
			$scope.items = [];
		});
	}

  $rootScope.isLoggedIn = function() {
  //  console.log(User.isLoggedIn());
    return User.isLoggedIn();
  }

/*  $rootScope.likepost=function(){
    if($rootScope.isLoggedIn()) {
  if($rootScope.active_like){
    $rootScope.active_like=false
  }else{
    $rootScope.active_like=true
  }
} else {
  $state.go('news.login');
}
  }*/

  $scope.getPosts();

  // pull to refresh buttons
	$rootScope.doRefresh = function(){
		$scope.times = 0 ;
		$scope.items = [];
		$scope.postsCompleted = false;
		$scope.getPosts();
	}
        	$scope.onSlideMove = function(data){
				  if (data.index === 0) {
               $scope.heading = 'News';
               $rootScope.active_tab=1;
				  } else if (data.index === 1) {
               $scope.heading = 'Ideas';
               $rootScope.active_tab=2;
             } else if (data.index === 2) {
                  $scope.heading = 'Research';
                  $rootScope.active_tab=3;
                } else {
                  $scope.heading = 'News';
                  $rootScope.active_tab=1;
                }
			};
        }
])

app.controller('ThemeCtrl', ['$rootScope', "$scope", '$state', 'User', 'NewsApp', "$stateParams", "$q", "$location", "$window", '$timeout',
			function($rootScope, $scope, $state, User, NewsApp, $stateParams, $q, $location, $window, $timeout){
        $scope.heading = 'News';
        $scope.items = [];
	$scope.times = 0 ;
	$scope.postsCompleted = false;
  $rootScope.active_tab=1;
	// load more content function
	$scope.getChannels = function(){
		NewsApp.getChannels()
		.success(function (posts) {
			$scope.items = $scope.items.concat(posts.channels);
			NewsApp.posts = $scope.items;
      $scope.item_index = 0;
      $scope.item = {};
			$scope.times = $scope.times + 1;
			if(posts.news.length == 0) {

				$scope.postsCompleted = true;
			}
		})
		.error(function (error) {
			$scope.items = [];
		});
	}

  $rootScope.isLoggedIn = function() {
  //  console.log(User.isLoggedIn());
    return User.isLoggedIn();
  }

  $rootScope.likechannel=function(channelid){
    console.log(channelid);
    var mobile = window.localStorage.getItem("LOCAL_MOBILE");
    if($rootScope.isLoggedIn()) {
  if($rootScope.active_like){
    $rootScope.active_like=false;
  }else{
    $rootScope.active_like=true;
  }
} else {
  $state.go('news.login');
}
  }





  //$rootScope.ShowTags(channelid);


  $scope.getChannels();
        	$scope.onSlideMove = function(data){
				  if (data.index === 0) {
               $scope.heading = 'Channels for all themes';
               $rootScope.active_tab=1;
				  } else if (data.index === 1) {
               $scope.heading = 'Ideas';
               $rootScope.active_tab=2;
             } else if (data.index === 2) {
                  $scope.heading = 'Research';
                  $rootScope.active_tab=3;
                } else {
                  $scope.heading = 'Channels for all themes';
                  $rootScope.active_tab=1;
                }
			};

        }
])

app.controller('SettingsCtrl', ['$scope','SendPush','Config', function( $scope, SendPush, Config ) {

	$scope.AndroidAppUrl = Config.AndroidAppUrl;
	$scope.AppName = Config.AppName;


}])

app.directive('goNative', ['$ionicGesture', '$ionicPlatform', function($ionicGesture, $ionicPlatform) {
  return {
    restrict: 'A',

    link: function(scope, element, attrs) {

      $ionicGesture.on('tap', function(e) {

        var direction = attrs.direction;
        var transitiontype = attrs.transitiontype;

        $ionicPlatform.ready(function() {

          switch (transitiontype) {
            case "slide":
              window.plugins.nativepagetransitions.slide({
                  "direction": direction
                },
                function(msg) {
                  console.log("success: " + msg)
                },
                function(msg) {
                  alert("error: " + msg)
                }
              );
              break;
            case "flip":
              window.plugins.nativepagetransitions.flip({
                  "direction": direction
                },
                function(msg) {
                  console.log("success: " + msg)
                },
                function(msg) {
                  alert("error: " + msg)
                }
              );
              break;

            case "fade":
              window.plugins.nativepagetransitions.fade({

                },
                function(msg) {
                  console.log("success: " + msg)
                },
                function(msg) {
                  alert("error: " + msg)
                }
              );
              break;

            case "drawer":
              window.plugins.nativepagetransitions.drawer({
				  "origin"         : direction,
				  "action"         : "open"
                },
                function(msg) {
                  console.log("success: " + msg)
                },
                function(msg) {
                  alert("error: " + msg)
                }
              );
              break;

            case "curl":
              window.plugins.nativepagetransitions.curl({
				  "direction": direction
                },
                function(msg) {
                  console.log("success: " + msg)
                },
                function(msg) {
                  alert("error: " + msg)
                }
              );
              break;

            default:
              window.plugins.nativepagetransitions.slide({
                  "direction": direction
                },
                function(msg) {
                  console.log("success: " + msg)
                },
                function(msg) {
                  alert("error: " + msg)
                }
              );
          }


        });
      }, element);
    }
  };
}])

;
