/**/
function init() {
  let array = [1,2]
  var ul = document.getElementById('list');

  for(var i=0; i<array.length;i++) {
    var li = document.createElement('li');
    li.setAttribute('id','id'+array[i].toString());
    li.setAttribute('draggable', 'true');
    li.setAttribute('ondrop','drop(event)');
    li.setAttribute('ondragover','allowDrop(event)');
    li.appendChild(document.createTextNode(array[i].toString()));
    ul.appendChild(li);
  }

}

function allowDrop(allowdropevent) {
    //allowdropevent.target.style.color = 'blue';
    allowdropevent.preventDefault();
}

function drag(dragevent) {
    dragevent.dataTransfer.setData("text", dragevent.target.id);
    //dragevent.target.style.color = 'green';
}

function drop(dropevent) {
    dropevent.preventDefault();
    var data = dropevent.dataTransfer.getData("text");
    dropevent.target.appendChild(document.getElementById(data));
    document.getElementById(data).style.color = 'black';
}

init();
