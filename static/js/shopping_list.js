
// we use this function to send a POST request to the server for updating / 
// creating new list items.
function saveItem(id) {
  let params = {};
  params['userName'] = document.getElementById("userName").value;
  params['title'] = document.getElementById("item_title").value;
  sendJsonRequest('save-item', objectToParameters(params), itemSaved);
}

// use this to clear the values in the "add item" form
function clearItemForm() {
  document.getElementById("userName").value = '';
  document.getElementById("item_title").value = '';
}

// this is called in response to saving list item data.
function itemSaved(result, targetUrl, params) {
  if (result && result.ok) {
    console.log("Saved item.");
    clearItemForm();
    loadItems();
  } else {
    console.log("Received error: " + result.error);
    showError(result.error);
  }
}

// when the list items are loaded from the server, we use this function to
// render them on the page
function displayList(result, targetUrl) {
  if (result && result.length) {
    let text = '<ul>';
    for (var i = 0; i < result.length; i++) {
      text += '<li id="li_' + result[i].id + '">';
      text += 'user: ' + result[i].userName + '<br>review: ' + result[i].title + '<br>';
      text += '<button onclick="deleteItem(\'' + result[i].id + '\');">Delete Post</button><br>';
      text += '</li>';
    }
    text += '</ul>';
    console.log("updating DisplayArea: " + text);
    document.getElementById("DisplayArea").innerHTML = text;
  } else {
    document.getElementById("DisplayArea").innerHTML = 'No Reviews yet, be the first to Post!.';
  }
}

// we use this to trigger a load of the data from the server for this list item
// so we can be sure to edit the latest data.
function editItem(id) {
  getData('/get-item/' + id, itemLoaded);
}
/*
// when the item is loaded, we render an edit form in the list.
function itemLoaded(result, targetUrl) {
  let text = '';
  text += '<input type="number" id="edit_item_quantity" value="' + result.quantity + '"> ) ';
  text += '<input type="text" id="edit_item_title" value="' + result.title + '"> ';
  text += '<button onclick="saveItem(' + result.id + ');">save</button> ';
  text += '<button onclick="loadItems();">cancel</button> ';
  document.getElementById('li_' + result.id).innerHTML = text;
}*/

function deleteItem(id) {
  if (confirm("Are you sure you want to delete?")) {
    let params = {"id": id};
    sendJsonRequest('delete-item', objectToParameters(params), itemDeleted);
  }
}

// when we delete an item, we use this to reload the list of items.
function itemDeleted(result, targetUrl, params) {
  if (result && result.ok) {
    console.log("Deleted item.");
    loadItems();
  } else {
    console.log("Received error: " + result.error);
    showError(result.error);
  }
}

function loadItems() {
  getData('/load-sl-items', displayList);
}

// when the page loads, let's load the initial items into the list.
loadItems();
