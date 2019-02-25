function add(clicked_id) {
	var item_id="item-".concat(clicked_id);
	var quantity_id="quantity-".concat(clicked_id);
  
  var table = document.getElementById('cart_table');
  var item = document.getElementById(clicked_id);
  
  if(!document.getElementById(item_id)) {
    var item_value = item.value;
    
    var row = table.insertRow(1);
    var item_cell = row.insertCell(0);
    var quantity_cell = row.insertCell(1);
    
    var quantity_input = document.createElement("input");
		quantity_input.type="number";
    quantity_input.setAttribute('min',0);
    quantity_input.setAttribute('max',30);
		quantity_input.value="1";
    
    item_cell.innerHTML = item_value;
    item_cell.setAttribute('id',item_id);
    
    quantity_cell.setAttribute('id',quantity_id);
    quantity_cell.appendChild(quantity_input);
  } else {
    var quantity_input = document.getElementById(quantity_id);
    var quantity_value = parseInt(quantity_input.firstChild.value);
    quantity_value = quantity_value + 1;
    quantity_input.firstChild.value = quantity_value;
  }
}

function clear_cart() {
	var table = document.getElementById('cart_table');
  for(var i = table.rows.length - 1; i > 0; i--)
  {
      table.deleteRow(i);
  }
	document.getElementById('price').style.display = "none";
	document.getElementById('tax').style.display = "none";
	document.getElementById('total').style.display = "none";
}

function print_cart() {
	var table = document.getElementById('cart_table');
  
  initialize_data();
  
  var prices = JSON.parse(localStorage.getItem('default'));
  
  var total = 0;
  var price = 0;
  var tax=0;
  var taxF = 0.6;
  
  for(var i=1; i<table.rows.length; i++) {
    var val = parseInt(table.rows[i].lastChild.firstChild.value);
    
    if(val >= 0)
      total = total + val;
  }
  
  price = total * prices.large;
  tax = price * 0.06;
  
  disp_price = CurrencyFormatted(price);
  disp_tax = CurrencyFormatted(tax);
  disp_priceAndTax = CurrencyFormatted(price+tax);
  
  var priceString = "Price: $".concat(disp_price);
  var taxString = "Tax: $".concat(tax);
  var totalString = "Total: $".concat(disp_priceAndTax);
  
  if(total != 0) {
		document.getElementById('price').style.display = "block";
		document.getElementById('tax').style.display = "block";
		document.getElementById('total').style.display = "block";
		document.getElementById('price').innerHTML = priceString;
		document.getElementById('tax').innerHTML = taxString;
		document.getElementById('total').innerHTML = totalString;
	}
}

function initialize_data() {
  localStorage.setItem('default', JSON.stringify({ large: 4.20, small: 3.80 }));
}

function CurrencyFormatted(amount) {
	var i = parseFloat(amount);
	if(isNaN(i)) { i = 0.00; }
	var minus = '';
	if(i < 0) { minus = '-'; }
	i = Math.abs(i);
	i = parseInt((i + .005) * 100);
	i = i / 100;
	s = new String(i);
	if(s.indexOf('.') < 0) { s += '.00'; }
	if(s.indexOf('.') == (s.length - 2)) { s += '0'; }
	s = minus + s;
	return s;
}