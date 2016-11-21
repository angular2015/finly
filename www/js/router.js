app.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $ionicConfigProvider.views.transition('none');
  $stateProvider
  	//sidebar
    .state('news', {
      url: "/news",
      abstract: true,
      templateUrl: "templates/sidebar-menu.html"
    })
	 // Home page
	 .state('news.home', {
      url: "/home",
		cache : false,
      views: {
        'menuWorPress' :{
          	templateUrl: "templates/home.html",
		  		controller: "HomeCtrl"
        }
      }
    })
    // Login page
 	 .state('news.login', {
       url: "/login",
 		cache : false,
       views: {
         'menuWorPress' :{
           	templateUrl: "templates/login.html",
 		  		controller: "LoginCtrl"
         }
       }
     })
     // Register page
     .state('news.register', {
        url: "/register",
      cache : false,
        views: {
          'menuWorPress' :{
              templateUrl: "templates/register.html",
            controller: "SignUpCtrl"
          }
        }
      })
      // OTP page
      .state('news.otp', {
         url: "/otp",
       cache : false,
         views: {
           'menuWorPress' :{
               templateUrl: "templates/otp.html",
             controller: "OtpCtrl"
           }
         }
       })
      // Forgot page
      .state('news.forgot', {
         url: "/forgot",
       cache : false,
         views: {
           'menuWorPress' :{
               templateUrl: "templates/forgot.html",
             controller: "ForgotCtrl"
           }
         }
       })
    // Channel page
 	 .state('news.channel', {
       url: "/channel/:channelid",
 		cache : false,
       views: {
         'menuWorPress' :{
           	templateUrl: "templates/channel.html",
 		  		controller: "ChannelCtrl"
         }
       }
     })

     .state('news.settings', {
     url: "/settings",
     views: {
       'menuWorPress' :{
           templateUrl: "templates/settings.html",
         controller: "SettingsCtrl"
       }
     }
   })

     // Channel page
     .state('news.themes', {
        url: "/themes",
      cache : false,
        views: {
          'menuWorPress' :{
              templateUrl: "templates/themes.html",
            controller: "ThemeCtrl"
          }
        }
      })

  	$urlRouterProvider.otherwise("/news/home");
})
