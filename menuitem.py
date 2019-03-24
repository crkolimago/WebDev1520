# we'll use this separate file so that we don't have to tightly couple our
# data access code and our application.


class MenuItem(object):
    def __init__(self, id, name='', price=0, url=''):
        self.name = name
        self.price = price
        self.url = url
        self.id = id

    def to_dict(self):
        return {
            'name': self.name,
            'price': self.price,
            'url': self.url
        }
