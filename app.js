(function () {
  "use strict";

  angular.module("TodoListApp", [])
    .controller("TodoListAddController", TodoListAddController)
    .controller("TodoListShowController", TodoListShowController);

  var todoList = [];

  TodoListAddController.$inject = ["$scope"];
  function TodoListAddController(s) {
    s.addItem = function () {
      if (s.item) { todoList.push(s.item); }
    }
  }

  TodoListShowController.$inject = ["$scope"];
  function TodoListShowController(s) {
    s.items = todoList;

    s.removeItem = function (itemIndex) { todoList.splice(itemIndex, 1); }
  }
})();
