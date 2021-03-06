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
    console.log("Creating GET request to: " + targetUrl);
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


function displayList(result, targetUrl) {
    if (result && result.length) {
        let text = "";

        for (var i = 0; i < result.length; i++) {
            tea = result[i].tea;
            flavor = result[i].flavor;
            toppings = result[i].toppings;

            text += '<div class="order">';
            text += '<p><b>Drink</b>:' + result[i].name;
            text += '<br><b>Size</b>:' + result[i].size;
            if(tea != '') {
                text += '<br><b>Tea</b>:'+tea;
            }
            if(flavor != '') {
                text += '<br><b>Flavor</b>:'+flavor;
            }
            text += '<br><b>Milk</b>:'+  result[i].milk;
            text += '<br><b>Sweetness</b>:'+  result[i].sweetness;
            text += '<br><b>Temp</b>:'+  result[i].temp;
            if(toppings != '') {
                text += '<br><b>Toppings</b>:'+  result[i].toppings;
            }
            text += '<br><b>Payment</b>:'+  result[i].payment;
            text += '<br><b>Price</b>:'+  result[i].price.split('$')[1];
            text += '<br><b>Time:</b>'+  result[i].time;
            text += '</p>';
            text += '<button class="delete" onclick="deleteItem(\'' + result[i].id + '\');">Remove Order</button> ';
            text += '</div>';
        }
        if(document.getElementById("flex-container") != null) {
            document.getElementById("flex-container").innerHTML = text;
        }
    } else {
        if(document.getElementById("flex-container") != null) {
            document.getElementById("flex-container").innerHTML = 'No Orders.';
        }
    }
}

function deleteItem(id) {
    let params = {"id": id};
    sendJsonRequest('delete-order', objectToParameters(params), itemDeleted);
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
    console.log("hey");
    getData('/load-order-items', displayList);
    console.log("hey now");
}
// when the page loads, let's load the initial items into the list.
console.log("hey");
loadItems();