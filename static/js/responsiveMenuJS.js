function hideInfo() {
    document.getElementById("info-popup").style.visibility = "hidden";
}

function add(num) {
  let p = document.getElementById("info-popup-price");

  let pp = parseFloat(p.innerHTML.split('$')[1]);
  pp += num;
  p.innerHTML = '$' + pp;
}

function sub() {
  let p = document.getElementById("info-popup-price");
  let pp = localStorage.getItem('price');
  p.innerHTML = pp;
}

function showInfo(id, result) {
    if(result) {
        document.getElementById("info-popup").style.visibility = "visible";
        document.getElementById("info-popup-name").innerHTML = result.name;
        document.getElementById("form-name").value = document.getElementById("info-popup-name").innerHTML;
        document.getElementById("info-popup-price").innerHTML = '$'+result.price;
        document.getElementById("form-price").value = document.getElementById("info-popup-price").innerHTML;
        localStorage.setItem('price',document.getElementById("info-popup-price").innerHTML);
    } else {
        getItem(id);
    }
}

function saveItem(id) {
    console.log("saving item.");
    let params = {};
    if (id) {
        console.log("not complete. line 4 of responsiveMenuJS");
    }
    else {
        console.log("new item");
        params['name'] = document.getElementById("item-name").value;
        params['price'] = document.getElementById("item-price").value;
    }
    console.log("about to send request");
    sendJsonRequest('save-item', objectToParameters(params), itemSaved);
}

function sendJsonRequest(targetUrl, parameters, callbackFunction) {
    let xmlHttp = createXmlHttp();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4) {
            // note that you can check xmlHttp.status here for the HTTP response code
            console.log("status: " + xmlHttp.status);
            try {
                let myObject = JSON.parse(xmlHttp.responseText);
                callbackFunction(myObject, targetUrl, parameters);
            } catch (exc) {
                showError("There was a problem at the server caused by sendJsonRequest");
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
            console.log(xmlHttp.status)
            try {
                let myObject = JSON.parse(xmlHttp.responseText);
                callbackFunction(myObject, targetUrl);
            } catch (exc) {
                showError("There was a problem at the server caused by getData: " + exc);
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

// use this to clear the values in the "add item" form
function clearItemForm() {
    document.getElementById("item-name").value = '';
    document.getElementById("item-price").value = '';
}

function deleteAll() {
    if (confirm("Are you sure you want to delete?")) {
        sendJsonRequest('delete-all', null, itemsDeleted);
    }
}

// when we delete an item, we use this to reload the list of items.
function itemsDeleted(result) {
    if (result && result.ok) {
        console.log("Deleted item.");
        loadItems();
    } else {
        console.log("Received error: " + result.error);
        showError(result.error);
    }
}

function itemSaved(result, targetUrl, params) {
    if (result && result.ok) {
        console.log("itemSaved success.");
        clearItemForm();
        loadItems();
    } else {
        console.log("Received error: " + result.error);
        showError(result.error);
    }
}


function displayList(result) {
    if (result && result.length) {
        let text = "";
        let admin_menu = "";

        for (var i = 0; i < result.length; i++) {
            text += '<div class="menu-item">';
            text += '<img class="image" src="' + result[i].url + '" alt="' + result[i].name + '" id="img_' + result[i].id + '"/>';
            text += '<button onclick="showInfo(' + result[i].id + ');" class="item_button" id="item_' + result[i].id + '">' + result[i].name + '<br>$' + result[i].price + '</button>';
            text += '</div>';
            admin_menu += '<div class="divs" ondrop="drop(event)" ondragover="allowDrop(event)">';
            admin_menu += '<span id="drag_' + result[i].id + '" draggable="true" ondragstart="drag(event)">' + result[i].id + '</span>';
            admin_menu += '</div>';
        }
        document.getElementById("flex-container").innerHTML = text;
        if(document.getElementById('wrapper') != null) {
            document.getElementById('wrapper').innerHTML = admin_menu;
        }
    } else {
        document.getElementById("flex-container").innerHTML = 'No menu items.';
        if(document.getElementById('wrapper') != null) {
            document.getElementById('wrapper').innerHTML = 'No menu items.';
        }
    }
}

function getItem(id) {
  getData('/get-item/' + id, itemLoaded);
}

// when the item is loaded, we render an edit form in the list.
function itemLoaded(result, targetUrl) {
  showInfo(result.id, result);
}

function loadItems() {
    getData('/load-sl-items', displayList);
}
// when the page loads, let's load the initial items into the list.

function allowDrop(allowdropevent) {
    allowdropevent.preventDefault();
}

function drag(dragevent) {
    dragevent.dataTransfer.setData("text", dragevent.target.id);
}

function drop(dropevent) {
    dropevent.preventDefault();
    var data = dropevent.dataTransfer.getData("text");
    var cur = document.getElementById(data);
    var parent = cur.parentElement;
    var tgt = dropevent.currentTarget.firstElementChild;
    dropevent.currentTarget.replaceChild(cur, tgt);
    parent.appendChild(tgt);
}

function updateMenu() {
    let menu = document.getElementById('wrapper').childNodes;

    for(var i=0; i<menu.length; i++) {
        console.log(menu[i].firstChild.id.split('_')[1]);
    }
}

loadItems();