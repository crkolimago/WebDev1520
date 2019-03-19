function saveItem(id) {
  let params={};
  if (id) {
      console.log("not complete. line 4 of responsiveMenuJS");
  }
  else {
    params['name'] = document.getElementById("item-name").value;
    params['price'] = document.getElementById("item-price").value;
    /*params['attributes'] = document.getElementById("item-attributes").value;*/
  }
  sendJsonRequest('save-item', objectToParameters(params), itemSaved);
}

function sendJsonRequest(targetUrl, parameters, callbackFunction) {
  let xmlHttp = createXmlHttp();
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4) {
      // note that you can check xmlHttp.status here for the HTTP response code
      try {
        let myObject = JSON.parse(xmlHttp.responseText);
        callbackFunction(myObject, targetUrl, parameters);
      } catch (exc) {
        showError("There was a problem at the server.");
      }
    }
  }
  postParameters(xmlHttp, targetUrl, parameters);
}

function createXmlHttp() {
  let xmlhttp;
  if (window.XMLHttpRequest) {
    xmlhttp = new XMLHttpRequest();
  } else {
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }
  if (!(xmlhttp)) {
    alert("Your browser does not support AJAX!");
  }
  return xmlhttp;
}

function postParameters(xmlHttp, targetUrl, parameters) {
  if (xmlHttp) {
    console.log("Creating POST request to " + targetUrl);
    xmlHttp.open("POST", targetUrl, true); // XMLHttpRequest.open(method, url, async)
    xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    console.log("Sending parameters: " + parameters);
    xmlHttp.send(parameters);
   }
}

function getData(targetUrl, callbackFunction) {
  let xmlHttp = createXmlHttp();
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4) {
      // note that you can check xmlHttp.status here for the HTTP response code
      try {
        let myObject = JSON.parse(xmlHttp.responseText);
        callbackFunction(myObject, targetUrl);
      } catch (exc) {
        showError("There was a problem at the server.");
      }
    }
  }
  // parameters: method="GET", url=targetUrl, asynchronous=true
  console.log("Creating GET request to: " + targetUrl);
  xmlHttp.open("GET", targetUrl, true);
  xmlHttp.send();
}

function showError(msg) {
  let errorAreaDiv = document.getElementById('ErrorArea');
  errorAreaDiv.display = 'block';
  errorAreaDiv.innerHTML = msg;
}
function hideError() {
  let errorAreaDiv = document.getElementById('ErrorArea');
  errorAreaDiv.display = 'none';
}

function objectToParameters(obj) {
  let text = '';
  for (var i in obj) {
    // encodeURIComponent is a built-in function that escapes to URL-safe values
    text += encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]) + '&';
  }
  return text;
}

function itemSaved(result, targetUrl, params) {
  if (result && result.ok) {
    console.log("Saved item.");
    //clearItemForm();
    loadItems();
  } else {
    console.log("Received error: " + result.error);
    showError(result.error);
  }
}

function displayList(result, targetUrl) {
  if (result && result.length) {
    for (var i = 0; i < result.length; i++) {
      let text = '<div class="menu-item">';
      text += '<img class="image" src="static/img/thai_iced_tea.jpg" alt="thai_iced_tea" id="img_' + result[i].id + '"/>';
      text += '<button class="item_button" id="Thai_Tea" value="Thai Tea">Thai Tea ';
      text += result[i].price + ' ' + result[i].name;
      text += '</button>';
    }
    text += '</div>';
    console.log("updating DisplayArea: " + text);
    document.getElementById("DisplayArea").innerHTML = text;
  } else {
    document.getElementById("DisplayArea").innerHTML = 'No list items.';
  }
}

function loadItems() {
  getData('/load-sl-items', displayList);
}
// when the page loads, let's load the initial items into the list.
loadItems();