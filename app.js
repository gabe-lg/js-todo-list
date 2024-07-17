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
        s.undoList.length ? "" : "disabled",
        s.redoList.length ? "" : "disabled",
        (s.todoList.length ? "" : "disabled") + " dropdown-toggle",
        "dropdown-toggle"];
    }

    s.setItems = () => {
      /** Updates the items in `ShowController` */
      s.items = s.todoList;
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

    s.load = content => {
      /** 
       * Opens a file dialog, and imports file into app.
       * Supported file extensions: .json and .txt.
       */
      if (content.type == "json") {
        const contentJSON = JSON.parse(content.text);
        s.todoList = contentJSON.todo;
        s.undoList = contentJSON.undo;
        s.redoList = contentJSON.redo;
      } else {
        const items = content.text.split("\n");
        s.todoList = [];
        items.forEach(item => {
          if (item[0] != '~' && item) {
            s.todoList.push(item.replace(/^\d.\s*/, ""));
          }
        });
      }
      s.setState();
      s.setItems();
    }
  }

  TodoListOptions.$inject = ["$scope", "$timeout"];
  function TodoListOptions(s, tm) {
    s.buttons = ["Undo", "Redo", "Save", "Load"];
    s.setState();
    // dropdown menus
    s.dropdown = ["", "", "dropdown", "dropdown"];
    s.dropdownContent = [];
    s.dropdownContent[2] = [
      "Download current list",
      "Download raw data [.json]"
    ];
    s.dropdownContent[3] = [];
    s.dropdownContent[3][0] = "hi";

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

    s.dropdownOptions = function (itemName) {
      if (itemName == s.dropdownContent[2][0]) {
        downloadTxt(s.todoList);
      }
      if (itemName == s.dropdownContent[2][1]) {
        downloadJSON(s.todoList, s.undoList, s.redoList);
      }
      if (itemName == s.dropdownContent[3][0]) {
        let content = "";
        function timeout () {
          tm(() => {
            if (!getContent()) {
              timeout();
            } else {
              content = getContent();
              console.log(content);
              resetContent();

              s.load(content);
            }
          }, 100);
        }
        loadData();
        timeout();
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
    s.setItems();

    s.removeItem = function (itemIndex) {
      s.modify(new s.Item(false, s.todoList[itemIndex], itemIndex));
    }
  }
})();