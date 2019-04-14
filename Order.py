# we'll use this separate file so that we don't have to tightly couple our 
# data access code and our application.


class Order(object):
    def __init__(self, orderId="", size="", tea="", flavor="", milk="", sweetness="", temp="", toppings="", price=0):
        self.orderId = orderId
        self.size = size
        self.tea = tea
        self.flavor = flavor
        self.milk = milk
        self.sweetness = sweetness
        self.temp = temp
        self.toppings = toppings
        self.price = price

    def to_dict(self):
        return {
            'orderId': self.orderId,
            'size': self.size,
            'tea': self.tea,
            'flavor': self.flavor,
            'milk': self.milk,
            'sweetness': self.sweetness,
            'temp': self.temp,
            'toppings': self.toppings,
            'price': self.price,
        }
