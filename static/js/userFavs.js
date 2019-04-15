function hideInfo() {
    document.getElementById("info-popup-form").style.visibility = "hidden";
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
        console.log("got here");
        console.log(result.name);
        document.getElementById("info-popup-form").style.visibility = "visible";
        let text="";
            tea = result.tea;
            flavor = result.flavor;
            toppings = result.toppings;

            text += '<div class="order">';
                
            text += '<p> Drink:' + result.name;
            text += '<br>Size:' + result.size;
            if(tea != '') {
                text += '<br>Tea:'+tea;
            }
            if(flavor != '') {
                text += '<br>Flavor:'+flavor;
            }
            text += '<br>Milk:'+  result.milk;
            text += '<br>Sweetness:'+  result.sweetness;
            text += '<br>Temp:'+  result.temp;
            if(toppings != '') {
                text += '<br>Toppings:'+  result.toppings;
            }
            text += '<br>Payment Type:'+  result.payment;
            text += '<br>Price:'+  result.price;
            text += '</p>';
            text += '<button onclick="saveItem(' + result.id+ ');" class="item_button" id="item_' + result.id + '">'+'Submit'+'</button>';

            text += '</div>';

            console.log(text);
        document.getElementById("setText").innerHTML = text;
        //localStorage.setItem('price',document.getElementById("info-popup-price").innerHTML);
    } else {
        getItem(id);
    }
}

function saveItem(id) {
    console.log("saving item.");
    let params = {};
    if (id) {
        console.log("not complete. line 4 of responsiveMenuJS");
        params['name']='idk';
    }
    else {
        console.log("sending order");
    }
    console.log("about to send request");
    sendJsonRequest('/save-order/'+id+'', objectToParameters(params), itemSaved);
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
        hideInfo();
        loadItems();
    } else {
        console.log("Received error: " + result.error);
        showError(result.error);
    }
}


function displayList(result) {
    if (result && result.length) {
        let text = "";


        for (var i = 0; i < result.length; i++) {
            text += '<div class="menu-item">';
            text += '<img class="image" src="' + result[i].url + '" alt="' + result[i].name + '" id="img_' + result[i].id + '"/>';
            text += '<button onclick="showInfo(' + result[i].id+ ');" class="item_button" id="item_' + result[i].id + '">' + result[i].name + '<br>' + result[i].price + '</button>';
            text += '</div>';
        }
        document.getElementById("flex-container").innerHTML = text;
    } else {
        document.getElementById("flex-container").innerHTML = 'No menu items.';
    }
}

function getItem(id) {
  getData('/get-user-order/' + id, itemLoaded);
}

// when the item is loaded, we render an edit form in the list.
function itemLoaded(result, targetUrl) {
    console.log(result);
  showInfo(result.id, result);
}

function loadItems() {
    getData('/load-user-orders', displayList);
}
// when the page loads, let's load the initial items into the list.
/*
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
}*/


loadItems();