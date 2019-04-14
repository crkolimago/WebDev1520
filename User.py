# we'll use this separate file so that we don't have to tightly couple our 
# data access code and our application.


class User(object):
    def __init__(self, userId="", userEmail="", userName="", userPoints=0, userMoneySpent=0):
        self.userId = userId
        self.userEmail = userEmail
        self.userName = userName
        self.userPoints = userPoints
        self.userMoneySpent = userMoneySpent

    def to_dict(self):
        return {
            'userId': self.userId,
            'userEmail': self.userEmail,
            'userName': self.userName,
            'userPoints': self.userPoints,
            'userMoneySpent': self.userMoneySpent,
        }
