drink = new Drink("", "", "", "", "", "", [], 0);
var toppingsList = ["No Toppings"];

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
    for (var i = 0; i < sizes.length; i++) {
        if (sizes[i].checked) {
            var size = sizes[i].value;
            drink.size = size;
            if (size === "Small")
                drink.price = 3.45;
            else if (size === "Large")
                drink.price = 4.20;
            break;
        }
    }

    var teas = form.elements["tea"];
    for (var i = 0; i < teas.length; i++) {
        if (teas[i].checked) {
            var tea = teas[i].value;
            drink.tea = tea;
            break;
        }
    }

    var flavors = form.elements["flavor"];
    for (var i = 0; i < flavors.length; i++) {
        if (flavors[i].checked) {
            var flavor = flavors[i].value;
            drink.flavor = flavor;
            break;
        }
    }

    var milks = form.elements["milk"];
    for (var i = 0; i < milks.length; i++) {
        if (milks[i].checked) {
            var milk = milks[i].value;
            drink.milk = milk;
            if (milk === "Soymilk")
                drink.price += .50;
            break;
        }
    }

    var sweetnesses = form.elements["sweetness"];
    for (var i = 0; i < sweetnesses.length; i++) {
        if (sweetnesses[i].checked) {
            var sweetness = sweetnesses[i].value;
            drink.sweetness = sweetness;
            break;
        }
    }

    var temps = form.elements["temp"];
    for (var i = 0; i < temps.length; i++) {
        if (temps[i].checked) {
            var temp = temps[i].value;
            drink.temp = temp;
            break;
        }
    }

    drink.toppings = toppingsList;
    for (var t in toppingsList) {
        drink.price += .50;
    }
    console.log("price: " + drink.price);

    if (drink.size === "" || drink.tea == "" || drink.flavor === '' || drink.milk === "" || drink.sweetness === "" || drink.temp === "") {
        alert("Your Drink Order Form Isn't Complete!");//how to not refresh the page?
    } else {
        var drink_as_string = '';
        for (var property in drink) {
            drink_as_string += drink[property] + ", ";
        }
        console.log(drink_as_string);
        alert(drink_as_string);
        var item_id = "item-".concat("Custom Drink");
        var quantity_id = "quantity-".concat("Custom Drink");
        var table = document.getElementById("cart_table");
        var row = table.insertRow(1);
        var item_cell = row.insertCell(0);
        var quantity_cell = row.insertCell(1);
        var quantity_input = document.createElement("input");
        quantity_input.type = "number";
        quantity_input.setAttribute('min', 0);
        quantity_input.setAttribute('max', 30);
        quantity_input.value = "1";
        item_cell.innerHTML = "Your Drink: " + drink_as_string;
        item_cell.setAttribute('id', item_id);
        quantity_cell.setAttribute('id', quantity_id);
        quantity_cell.appendChild(quantity_input);
    }
}

function addTopping(topping) {
    if (toppingsList.includes("No Toppings")) {
        toppingsList.pop();
    }
    if (toppingsList.includes(topping)) {
        console.log("Cannot include multiple of the same topping.");
    } else {
        toppingsList.push(topping);
    }
    console.log(toppingsList);
}