drink = new Drink("", "", "", "", "", "", [], 0);
var toppingsList = ["No Toppings"];
var drinks = [];
var size = '';
var tea = '';
var flavor = '';
var milk = '';
var sweetness = '';
var temp = '';
var price = 0;
var subTotal = 0;

function Drink(size, tea, flavor, milk, sweetness, temp, toppings, price) {
    this.size = size;
    this.tea = tea;
    this.flavor = flavor;
    this.milk = milk;
    this.sweetness = sweetness;
    this.temp = temp;
    this.toppings = toppingsList;
    this.price = price;
}

function confirmDrink(form) {
  var sizes = form.elements["size"];
  for (var i=0; i<sizes.length; i++) {
    if (sizes[i].checked) {
      size = sizes[i].value;
      drink.size = size;
      if (size === "Small") 
        drink.price = 3.45;
      else if (size === "Large")
        drink.price = 4.20;
      break;
    }
  }

  var teas = form.elements["tea"];
  for (var i=0; i<teas.length; i++) {
    if (teas[i].checked) {
      tea = teas[i].value;
      drink.tea = tea;
      break;
    }
  }
  
  var flavors = form.elements["flavor"];
  for (var i=0; i<flavors.length; i++) {
    if (flavors[i].checked) {
      flavor = flavors[i].value;
      drink.flavor = flavor;
      break;
    }
  }

  var milks = form.elements["milk"];
  for (var i=0; i<milks.length; i++) {
    if (milks[i].checked) {
      milk = milks[i].value;
      drink.milk = milk;
      if (milk === "Soymilk") 
        drink.price += .50;
      break;
    }
  }

  var sweetnesses = form.elements["sweetness"];
  for (var i=0; i<sweetnesses.length; i++) {
    if (sweetnesses[i].checked) {
      sweetness = sweetnesses[i].value;
      drink.sweetness = sweetness;
      break;
    }
  }

  var temps = form.elements["temp"];
  for (var i=0; i<temps.length; i++) {
    if (temps[i].checked) {
      temp = temps[i].value;
      drink.temp = temp;
      break;
    }
  }

  drink.toppings = toppingsList;
  for (var t in toppingsList) {
    drink.price += .50;
  }
  drink.price -= .50;

  if (drink.size === "" || drink.tea == "" || drink.flavor === ''|| drink.milk === "" || drink.sweetness === "" || drink.temp === "") {
    alert("Your Drink Order Form Isn't Complete!");
    return false;
  } else {
    var drink_as_string = '';
    for (var property in drink) {
      drink_as_string += drink[property] + ', ';
    }
    console.log(drink_as_string);
    var table = document.getElementById('cart_table');
    var row = table.insertRow(1);
    var item_cell = row.insertCell(0);
    var quantity_cell = row.insertCell(1);
    var quantity_input = document.createElement('input');
    quantity_input.type='number';
    quantity_input.setAttribute('min',0);
    quantity_input.setAttribute('max',30);
		quantity_input.value = 1;

    item_cell.innerHTML = 'Custom Drink: ';
    var drink_list = document.createElement('ul');
    drink_list.setAttribute('id', 'customDrinkInCart');
    var arr = drink_as_string.split(',');
    for (var i = 0; i < arr.length-1; i++) {
      var li = document.createElement('li');
      li.textContent = arr[i];
      drink_list.appendChild(li);
    }
    item_cell.appendChild(drink_list);
    item_cell.setAttribute('id', 'custom_drink');
    item_cell.setAttribute('class', 'shopping_cart_item');
    quantity_cell.appendChild(quantity_input);

    drinks.push(drink);
    drink = new Drink('', '', '', '', '', '', [], 0);
    toppingsList = ['No Toppings'];
  }
}

function addTopping(topping) {
  if (toppingsList.includes('No Toppings')) {
    toppingsList.pop();
  }
  if (toppingsList.includes(topping)) {
    alert('Cannot include multiple of the same topping');
    return false;
  } else {
    toppingsList.push(topping);
  }
  console.log(toppingsList);
}

function clear_cart() {
	var table = document.getElementById('cart_table');
  for(var i = table.rows.length-1; i > 0; i--) {
      table.deleteRow(i);
  }
	document.getElementById('subtotal').style.display = 'none';
	document.getElementById('tax').style.display = 'none';
	document.getElementById('total').style.display = 'none';
}

function submit_cart() {
  let params = {};
	var table = document.getElementById('cart_table');
  var subtotal = 0;

  for (var i = 1; i < table.rows.length; i++) {
    var quantity = table.rows[i].lastChild.value;
    //var quantity = table.rows[i].cells[1].value;
    var ul = document.getElementById('customDrinkInCart');
    var items = ul.getElementsByTagName('li');
    var price = parseFloat(items[items.length-1].textContent);
    console.log('individual price: ' + price);
    console.log('quantity: ' + quantity);
    var product = price * quantity;
    subtotal += price;
    //subtotal += product;
    console.log(product);
    console.log(subtotal);
  }

  var tax = subtotal * 0.06;
  var total = subtotal + tax;
  var disp_subtotal = CurrencyFormatted(subtotal);
  disp_tax = CurrencyFormatted(tax);
  disp_total = CurrencyFormatted(total);
  
  var subtotalString = 'Subtotal: $'.concat(disp_subtotal);
  var taxString = 'Tax: $'.concat(tax);
  var totalString = 'Total: $'.concat(disp_total);

  if (total != 0) {
		document.getElementById('subtotal').style.display = 'block';
		document.getElementById('tax').style.display = 'block';
		document.getElementById('total').style.display = 'block';
		document.getElementById('subtotal').innerHTML = subtotalString;
    subTotal = disp_subtotal;
		document.getElementById('tax').innerHTML = taxString;
		document.getElementById('total').innerHTML = totalString;
	}
}

function save_order() {
  let params = {};
  params['total'] = subTotal;
  params['customDrink'] = 'Custom Drink';
  params['size'] = size;
  params['tea'] = tea;
  params['flavor'] = flavor;
  params['milk'] = milk;
  params['temp'] = temp;
  params['price'] = price;
  for (i in params) {
    console.log(params[i])
  }
  sendJsonRequest('/save-order', objectToParameters(params), itemSaved);
}

// this is called in response to saving list item data.
function itemSaved(result, targetUrl, params) {
  if (result && result.ok) {
    console.log("Saved item.");
    //clearItemForm();
    //loadItems();
  } else {
    console.log("Received error: " + result.error);
    showError(result.error);
  }
}

function CurrencyFormatted(amount) {
	var i = parseFloat(amount);
	if (isNaN(i)) { 
    i = 0.00;
  }
	var minus = '';
	if (i < 0) { 
    minus = '-';
  }
	i = Math.abs(i);
	i = parseInt((i + .005) * 100);
	i = i / 100;
	s = new String(i);
	if (s.indexOf('.') < 0) { 
    s += '.00';
  }
	if (s.indexOf('.') == (s.length - 2)) {
    s += '0';
  }
	s = minus + s;
	return s;
}