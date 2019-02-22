function add(clicked_id) {
	var item_msg = "item: ";
	var item_id="item-".concat(clicked_id);
	var quantity_id="quantity-".concat(clicked_id);
	var list_id = document.getElementById('cart_list');
	
	//if id doesn't exist - add
	if(!document.getElementById(item_id)) {
		var list_item = document.createElement("li");
		var item_txt = document.createTextNode(item_msg.concat(clicked_id));
		list_item.setAttribute('id',item_id);
		list_item.appendChild(item_txt);
		list_id.appendChild(list_item);
		
		var quantity_input = document.createElement("input");
		quantity_input.type="number";
		quantity_input.value="0";
		quantity_input.setAttribute('id',quantity_id);
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
}

function print_cart() {
	var nodeList = document.querySelectorAll('cart_list');
	// Calling nodeList.item(i) isn't necessary in JavaScript
	for(var i = 0; i < nodeList.length; i++)
		console.log(nodeList[i].value); //trust, credit, confidence
}

/* 
function clear() {
	var list_id = document.getElementById('cart_list');
	
	while(list_id.firstChild) list_id.removeChild(list_id.firstChild);
} */