let drinks = [];

let drink = {
							size: "",
							tea: "",
							flavor: "",
							milk: "",
							sweetness: "",
							toppings: [],
							temperature: "",
						};

function addSize(size) {
  drink.size = size;
}

function addTea(tea) {
	drink.tea = tea;
}

function addFlavor(flavor) {
	drink.flavor = flavor;
}

function addMilk(milk) {
	drink.milk = milk;
}

function addSweetness(sweetness) {
	drink.sweetness = sweetness;
}

function addToppings(topping) {
	drink.toppings.add(topping);
}

function addTemperature(temp) {
	drink.temperature = temp;
}

function confirmDrink() {
	alert("hello world");
    drink.size = document.getElementById("size").value;
    drink.tea = document.getElementById("tea").value;
  if(drink.size === "" || 
     drink.tea == "" || 
		 drink.flavor === ''|| 
		 drink.milk === "" || 
		 drink.sweetness === "" || 
		 drink.temperature === "") {
			 alert("Your Drink Order Form Isn't Complete!");
		 } else if (confirm("Your Drink: ", drink.size, drink.tea)) {
				let table = document.getElementById('cart_table');
				let drinkSize = table.insertRow(1);
				drinkSize.innerHTML = drink.size;
				let drinkTea = table.insertRow(2);
				drinkTea.innerHTML = drink.tea;
		}
}