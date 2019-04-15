# we'll use this separate file so that we don't have to tightly couple our 
# data access code and our application.
import datetime

class Order(object):
    def __init__(self, orderId="", name="", size="", tea="", flavor="", milk="", sweetness="", temp="",toppings="",price=0.0,payment=""):
        self.orderId = orderId
        self.name = name
        self.size = size
        self.tea = tea
        self.flavor = flavor
        self.milk = milk
        self.sweetness = sweetness
        self.temp = temp
        self.toppings = toppings
        self.price = price
        self.payment = payment
        self.time = datetime.datetime.now()

    def to_dict(self):
        return {
            'orderId': self.orderId,
            'name': self.name,
            'size': self.size,
            'tea': self.tea,
            'flavor': self.flavor,
            'milk': self.milk,
            'sweetness': self.sweetness,
            'temp': self.temp,
            'toppings': self.toppings,
            'price': self.price,
            'payment': self.payment,
            'time': self.time
        }
