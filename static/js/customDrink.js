let drinks = [];
let toppings = [];

function Drink(size, tea, flavor, milk, sweetness, toppings, temp) {
    this.size = size;
    this.tea = tea;
    this.flavor = flavor;
    this.milk = milk;
    this.sweetness = sweetness;
    this.toppings = toppings;
    this.temp = temp;
}

/*let drink = {
							size: "",
							tea: "",
							flavor: "",
							milk: "",
							sweetness: "",
							toppings: [],
							temperature: "",
						};*/

function confirmDrink(form) {
  console.log(form);
  console.log("I HATE WEB DEV");
  var sizes = form.elements["size"];
  for (var i=0; i<sizes.length; i++) {
    if (sizes[i].checked) {
      var size = sizes[i].value;
      break;
    }
  }

  var teas = form.elements["tea"];
  for (var i=0; i<teas.length; i++) {
    if (teas[i].checked) {
      var tea = teas[i].value;
      break;
    }
  }

  drink = new Drink(size, tea, flavor, milk, sweetness, toppings, temp);
  document.write(size, tea);
  if(drink.size === "" || drink.tea == "" || drink.flavor === ''|| drink.milk === "" || drink.sweetness === "" || drink.temperature === "") {
    alert("Your Drink Order Form Isn't Complete!");
  } else if (confirm("Your Drink: ", drink.size, drink.tea)) {
    drinks.push(drink);
    alert("Your Drinks: ", drinks);
  }
}

function addTopping(topping) {
  toppings.push(topping);
}

function displayJelly() {

}

function displayPoppingBoba() {

}