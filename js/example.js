var item_msg = "item: ";

function add(clicked_id) {
	var list_id = document.getElementById('cart_list');
	/* var item_txt = document.createTextNode(item_msg.concat(clicked_id));
	
	item_id.appendChild(item_txt);
	item_id.appendChild(document.createElement("br")); */
	var list_item = document.createElement("LI");
	var item_txt = document.createTextNode(item_msg.concat(clicked_id));
	list_item.appendChild(item_txt);
	list_id.appendChild(list_item);
}