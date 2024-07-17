let content = "";

function makeTimeStamp() {
  return new Date().toLocaleString().replace(/\s|\/|,|:/g, "");
}

function downloadTxt(todo) {
  text = "~ Todo list ~\n\n";
  for (let i = 0; i < todo.length; i++) {
    text += "" + (i + 1) + ". " + todo[i] + "\n";
  }
  text += "\n~ Generated from https://www.gabriel-lg.com/projects/todo-list ~";

  const url = URL.createObjectURL(new Blob([text], { type: "application/txt" }));
  const element = document.createElement('a');

  element.href = url;
  element.download = "data_" + makeTimeStamp() + ".txt";
  element.click();
  URL.revokeObjectURL(url);
}

function downloadJSON(todo, undo, redo) {
  const data = {
    comment: "Generated from https://www.gabriel-lg.com/projects/todo-list",
    todo: todo,
    undo: undo,
    redo: redo
  };
  const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)],
    { type: "application/json" }));
  const element = document.createElement('a');

  element.href = url;
  element.download = "data_" + makeTimeStamp() + ".json";
  element.click();
  URL.revokeObjectURL(url);
}

function loadData() {
  const input = document.createElement('input');

  input.type = 'file';
  input.onchange = () => {
    const file = Array.from(input.files)[0];

    // if file type not supported, show the open dialog again
    if (!file.name.endsWith(".txt") && !file.name.endsWith(".json")) {
      loadData();
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        content = {
          text: reader.result,
          type: file.name.endsWith(".txt") ? "txt" : "json"
        }
      };
      reader.readAsText(file, 'utf-8');
    }
  };
  input.click();
}

// expose content to `app.js`
function getContent() {
  return content;
}

function resetContent() {
  content = "";
}