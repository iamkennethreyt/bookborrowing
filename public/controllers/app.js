const app = angular.module("app", ["ngRoute"]);
app.config(function($routeProvider) {
  $routeProvider
    .when("/", {
      templateUrl: "../views/index.html",
      controller: "appController"
    })
    .when("/dashboardbooklist", {
      templateUrl: "../views/dashboardbooklist.html",
      controller: "appController"
    })
    .when("/dashboardmanagebook", {
      templateUrl: "../views/dashboardmanagebook.html",
      controller: "appController"
    })
    .when("/dashboardmanageborrower", {
      templateUrl: "../views/dashboardmanageborrower.html",
      controller: "appController"
    })
    .otherwise("/");
});
