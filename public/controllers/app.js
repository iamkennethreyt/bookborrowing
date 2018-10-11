const app = angular.module("app", ["ngRoute"]);
app.config(function($routeProvider) {
  $routeProvider
    .when("/", {
      templateUrl: "../views/index.html",
      controller: "appController"
    })
    .when("/signup", {
      templateUrl: "../views/signup.html",
      controller: "appController"
    })
    .when("/signin", {
      templateUrl: "../views/signin.html",
      controller: "appController"
    })
    .when("/profile", {
      templateUrl: "../views/profile.html",
      controller: "appController"
    })
    .otherwise("/");
});
