function displayRand(result, targetUrl) {
    if (result && result.length) {
        let text = "";

        for (var i = 0; i < result.length; i++) {
            text += '<div class="menu-item">';
            text += '<img class="image" src="' + result[i].url + '" alt="' + result[i].name + '" id="img_' + result[i].id + '"/>';
            text += '<button onclick="link();" class="item_button" id="item_' + result[i].id + '">' + result[i].name + '<br>Price:$' + result[i].price + '</button>';
            text += '</div>';
        }
        console.log("updatin random: " + text);
        document.getElementById("randomItem").innerHTML = text;
    } else {
        document.getElementById("randomItem").innerHTML = 'Press Random to get a Random Drink!';
    }
}

function link() {
    window.location.replace("https://fukuteashop.appspot.com");
}

function Randomizer() {
    getData('/load-random', displayRand);
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


function showError(msg) {
    let errorAreaDiv = document.getElementById('ErrorArea');
    errorAreaDiv.display = 'block';
    errorAreaDiv.innerHTML = msg;
}
function hideError() {
    let errorAreaDiv = document.getElementById('ErrorArea');
    errorAreaDiv.display = 'none';
}