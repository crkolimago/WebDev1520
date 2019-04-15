# we'll use this separate file so that we don't have to tightly couple our 
# data access code and our application.


class Empty(object):
    def __init__(self):
        self.userName = 'empty'

    def to_dict(self):
        return {
            'userName': self.userName
        }
