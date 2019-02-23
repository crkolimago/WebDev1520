function add(clicked_id) {
	//var item_msg = "item: ";
	var item_id="item-".concat(clicked_id);
	var quantity_id="quantity-".concat(clicked_id);
	var list_id = document.getElementById('cart_list');
	var v = document.getElementById(clicked_id).value;
	var quantity_class = "quantity_class";
	var item_class = "item_class";
	
	//if id doesn't exist - add
	if(!document.getElementById(item_id)) {
		var list_item = document.createElement("li");
		var item_txt = document.createTextNode(v);
		list_item.setAttribute('id',item_id);
		list_item.setAttribute('class',item_class);
		list_item.appendChild(item_txt);
		list_id.appendChild(list_item);
		
		var quantity_input = document.createElement("input");
		quantity_input.type="number";
		quantity_input.value="1";
		quantity_input.setAttribute('id',quantity_id);
		quantity_input.setAttribute('class',quantity_class);
		list_item.appendChild(quantity_input);
	}
	else { //update quantity
		var v = document.getElementById(quantity_id).value++;
		v=v+1;
		document.getElementById(quantity_id).value = v;
	}
}

function clear_cart() {
	var ul = document.getElementById('cart_list');
	while(ul.firstChild) ul.removeChild(ul.firstChild);
	
	document.getElementById('total').style.display = "none";
}

function print_cart() {
	var nodeList = document.getElementById('cart_list');
	nodeList = nodeList.childNodes;
	
	var total = 0;
	
	for (var i=0; i<nodeList.length;i++) {
		console.log(nodeList[i].id);
		console.log(typeof(document.getElementById(nodeList[i].childNodes[1].id).value));
		var q = parseInt(document.getElementById(nodeList[i].childNodes[1].id).value);
		total+=q;
		console.log(total);
	}
	var pString = "Total: ".concat(total);
	
	if(total != 0) {
		document.getElementById('total').style.display = "block";
		document.getElementById('total').innerHTML = pString;
	}
}