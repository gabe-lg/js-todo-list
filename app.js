(function () {
  "use strict";

  angular.module("TodoListApp", [])
    .controller("TodoListMainController", TodoListMainController)
    .controller("TodoListOptions", TodoListOptions)
    .controller("TodoListAddController", TodoListAddController)
    .controller("TodoListShowController", TodoListShowController);

  TodoListMainController.$inject = ["$scope"];
  function TodoListMainController(s) {
    s.todoList = [];
    s.undoList = [];
    s.redoList = [];

    s.Item = function (action, value, index, fromUndo = false, fromRedo = false) {
      /**
       * Creates an Item object with attributes `action`, `value`, and `index`.
       * @param action `true` if "add" and `false` if "remove".
       * @param value Text to be displayed to user.
       * @param index The item's index in `todoList`.
       * @param fromUndo If the item was from `undoList`.
       * @param fromRedo If the item was from `redoList`.
       */
      this.action = action;
      this.value = value;
      this.index = index;
      this.fromUndo = fromUndo;
      this.fromRedo = fromRedo;
    }

    s.setState = function () {
      /** Sets the states of buttons between active and disabled. */
      s.states = [
        s.undoList.length == 0 ? "disabled" : "",
        s.redoList.length == 0 ? "disabled" : "",
        s.todoList.length == 0 ? "disabled" : "",
        ""];
    }

    s.modify = function (item) {
      /** Adds to or removes an item from `todoList`. */

      // If the item has been undone, push it into `redoList`.
      // Otherwise, push it into `undoList` and clear `redoList`
      // only if the item wasn't from `redoList`.
      if (item.fromUndo) {
        s.redoList.push(item);
      } else {
        s.undoList.push(item);
        if (!item.fromRedo) { s.redoList = []; }
      }

      // modify `todoList`
      if (item.action) {
        s.todoList.splice(item.index, 0, item.value);
      } else {
        s.todoList.splice(item.index, 1);
      }

      s.setState();
    }
  }

  TodoListOptions.$inject = ["$scope"];
  function TodoListOptions(s) {
    s.buttons = ["Undo", "Redo", "Save", "Load"];
    s.setState();

    s.options = function (buttonIndex) {
      if (buttonIndex == 0) {
        // undo
        var item = s.undoList.pop();
        item.action = !item.action;
        item.fromUndo = true;
        s.modify(item);
      }
      if (buttonIndex == 1) {
        // redo
        var item = s.redoList.pop();
        item.action = !item.action;
        item.fromUndo = false;
        item.fromRedo = true;
        s.modify(item);
      }
      if (buttonIndex == 2) {
        // save
      }
      if (buttonIndex == 3) {
        // load
      }
    }
  }

  TodoListAddController.$inject = ["$scope"];
  function TodoListAddController(s) {
    s.addItem = function () {
      if (s.value) { s.modify(new s.Item(true, s.value, s.todoList.length)); }
    }
  }

  TodoListShowController.$inject = ["$scope"];
  function TodoListShowController(s) {
    s.items = s.todoList;

    s.removeItem = function (itemIndex) {
      s.modify(new s.Item(false, s.todoList[itemIndex], itemIndex));
    }
  }
})();