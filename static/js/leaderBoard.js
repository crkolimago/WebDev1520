// this function converts a simple key-value object to a parameter string.
function objectToParameters(obj) {
  let text = '';
  for (var i in obj) {
    // encodeURIComponent is a built-in function that escapes to URL-safe values
    text += encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]) + '&';
  }
  return text;
}

function createXmlHttp() {
  var xmlhttp;
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

function sendJsonRequest(targetUrl, parameters, callbackFunction) {
  var xmlHttp = createXmlHttp();
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4) {
      var myObject = JSON.parse(xmlHttp.responseText);
      callbackFunction(myObject, targetUrl, parameters);
    }
  }
  postParameters(xmlHttp, targetUrl, parameters);
}

function postParameters(xmlHttp, target, parameters) {
  if (xmlHttp) {
    xmlHttp.open("POST", target, true); // XMLHttpRequest.open(method, url, async)
    xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlHttp.send(parameters);
   }
}

// This can load data from the server using a simple GET request.
function getData(targetUrl, callbackFunction) {
  let xmlHttp = createXmlHttp();
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4) {
      // note that you can check xmlHttp.status here for the HTTP response code
      try {
        let myObject = JSON.parse(xmlHttp.responseText);
        callbackFunction(myObject, targetUrl);//what is this?
      } catch (exc) {
        console.log(exc);
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

function loadBoard() {
  getData('/get-leaderboard-data', displayBoardOnPage);
}

function displayBoardOnPage(result, targetUrl) {
  if (result.Text) {
    document.getElementById('body').innerHTML = result.Text;
  } else {
    showError("Failed to Load Data");
  }
}

function sortByLoyalty() {

}

function sortByMoneySpent() {
  
}