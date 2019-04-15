from werkzeug.utils import secure_filename
import slidata
import json
import random
import userData
import userOrder
import orderData
import adminData
from Empty import Empty
from menuitem import MenuItem
from User import User
from Order import Order
from google.cloud import storage
from google.cloud import datastore
from google.oauth2 import id_token
from google.auth.transport import requests
from flask import Flask, session, redirect, render_template, request, Response
import six
import config
import datetime

app = Flask(__name__)
app.secret_key = config.KEY


@app.route('/')
def root():
    if 'curUser' in session and (userData.get_user(session['curUser']).userId == '107547848533480653521' or userData.get_user(session['curUser']).userId == '112301482083727417023'):
        return render_template("fukuPage.html", admin="true")
    else:
        return render_template("fukuPage.html", admin="false")
    """ if 'curUser' in session:
        return render_template("fukuPage.html", userName=userData.get_user(session['curUser']).userName)
    else:"""


@app.route('/customDrink')
def customDrink():
    if 'curUser' in session and userData.checkUser(session['curUser']):
        return render_template('customDrink.html', user='true')
    else:
        return render_template('customDrink.html', user='false')


@app.route('/info')
def info():
    return render_template('info.html')


@app.route('/profile', methods=['GET', 'POST'])
def profile():
    if 'curUser' in session and userData.checkUser(session['curUser']):
        temp = userData.get_user(session['curUser'])
        return render_template("profile.html", userName=temp.userName, emailAddress=temp.userEmail, rewards=temp.userPoints, setup="true", picture=temp.userPicture, lastname=temp.userLastName)
    else:
        return render_template("profile.html")


@app.route('/tokenSignIn', methods=['POST'])
def tokenSignIn():
    token = request.form['idtoken']
    log('token: %s' % token)
    try:
        log('Got here')
        idinfo = id_token.verify_oauth2_token(
            token, requests.Request(), config.CLIENT_ID)
        if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            log("error occured")
            raise ValueError('Wrong issuer.')
        # ID token is valid. Get the user's Google Account ID from the decoded token.
        userId = idinfo['sub']
        log("userId is %s " % userId)
        # If userId is in cloudstore retrieve userProf from cloudstore
        # else create new user and store in db
        if userData.checkUser(userId) is not None:
            log('already saved:')
        else:
            userEmail = idinfo['email']
            userName = idinfo['given_name']
            userPicture = idinfo['picture']
            userLastName = idinfo['family_name']
            newUser = User(userId, userEmail, userName, 0,
                           0, userPicture, userLastName)
            log('saving for user: %s' % userName)
            userData.create_user(newUser)
    except ValueError:
        pass
    session['curUser'] = userId
    return redirect('/')


@app.route('/tokenSignOut', methods=['POST'])
def tokenSignOut():
    session.clear()
    log("user has been signed out")
    return redirect('/')


def log(msg):
    """Log a simple message."""
    # Look at: https://console.cloud.google.com/logs to see your logs.
    # Make sure you have "stdout" selected.
    print('main: %s' % msg)


@app.route('/order', methods=['GET', 'POST'])
def order():

    return render_template("orderPage.html")

    if request.method == "GET":
        return render_template("orderPage.html")


@app.route('/customDrink', methods=['GET', 'POST'])
def customOrder():
    if request.method == "GET":
        return render_template("customDrink.html")


def displayUserOrders():
    if 'curUser' in session:
        log("begin the madness")
        return userOrder.get_user_orders(session['curUser'])


@app.route('/save-order', methods=['GET', 'POST'])
def saveOrder():
    try:
        log(request)
        try:
            toppings = request.form['toppings']
        except KeyError:
            toppings = ''

        # now sure how to generate unique IDs for every order
        name = request.form['name']
        # money_spent = request.form['total']
        size = request.form['size']
        try:
            tea = request.form['tea']
        except KeyError:
            tea = ''
        try:
            flavor = request.form['flavor']
        except KeyError:
            flavor = ''
        milk = request.form['milk']
        sweetness = request.form['sweetness']
        temp = request.form['temp']
        price = request.form['price']
        payment = request.form['payment']
        try:
            url = request.form['url']
        except KeyError:
            url = "https://storage.googleapis.com/fukutea-menu-images/8bit.jpg"

        if 'curUser' in session and userData.checkUser(session['curUser']):
            user = userData.get_user(session['curUser'])
            try:
                if payment == 'Cash':
                    old_points = user.userPoints
                    old_money = user.userMoneySpent
                    new_points = int(old_points) + config.POINTS_PER_DRINK
                    try:
                        new_money = float(old_money) + float(price.split('$')[1])
                    except IndexError:
                        new_money = float(old_money) + float(price)
                    uuser = User(user.userId, user.userEmail, user.userName,
                                 new_points, new_money, user.userPicture, user.userLastName)
                    userData.save_user(uuser)
                else:
                    old_points = user.userPoints
                    if old_points >= config.COST_PER_DRINK:
                        new_points = int(old_points) - config.COST_PER_DRINK
                        uuser = User(user.userId, user.userEmail, user.userName, new_points,
                                     user.userMoneySpent, user.userPicture, user.userLastName)
                        userData.save_user()
                    else:
                        # alert you dont have enough points
                        pass
            except AttributeError:
                log("Check around line 140 in main.py and add them to your config file.")
        elif payment == 'Rewards':
            # alert cannot pay with Rewards
            pass

        order = Order(None, name, size, tea, flavor, milk, sweetness, temp,
                      toppings, price, payment, str(datetime.datetime.now()), url)
        orderData.create_order(order)
        userOrder.create_order(order,  session['curUser'])
        order_list = displayUserOrders()
        for order in order_list:
            log(str(order.to_dict()))
    except Exception as exc:
        log(str(exc))

    return redirect('/menu')


@app.route('/leaderBoard', methods=['GET', 'POST'])
def leaderBoard():
    if request.method == "GET":
        userList = userData.get_list_items()
        for user in userList:
            userName = user.userName
            userPoints = user.userPoints
            userMoneySpent = user.userMoneySpent
        return render_template("leaderBoard.html", userName=userName, userPoints=userPoints, userMoneySpent=userMoneySpent)


@app.route('/get-leaderboard-data')
def get_leaderboard_data():
    # get list of users
    # iterate thru list of users
    # somehow send each part to the front end
    # templates maybe?
    # send list to JS and parse there maybe?
    responseJson = json.dumps({
        'Text': 'Put LeaderBoard Here',
    })
    userList = userData.get_list_items()

    # responseJson = json.dumps({ 'Name': user.userName, })
    return Response(responseJson)


@app.route('/random', methods=['GET', 'POST'])
def randomizer():
    return render_template("random.html")


@app.route('/admin', methods=['GET', 'POST'])
def admin():
    if 'curUser' in session and (userData.get_user(session['curUser']).userId == '107547848533480653521' or userData.get_user(session['curUser']).userId == '112301482083727417023'):
        return render_template('adminPage.html', admin="true")
    else:
        return render_template('adminPage.html', admin="false")


@app.route('/load-random')
def load_random():
    # first we load the list items
    sli_list = slidata.get_list_items()
    json_list = []
    i = random.randint(0, len(sli_list))
    log('loading rand %s ' % i)
    d = sli_list[i].to_dict()
    d['id'] = str(sli_list[i].id)
    log(d)
    json_list.append(d)
    responseJson = json.dumps(json_list)

    return Response(responseJson, mimetype='application/json')


@app.route('/load-order-items')
def load_order_items():

    # first we load the list items

    log('loading list orders.')
    order_list = adminData.get_list_items()
    json_list = []

    # TODO: then we load the photo urls based on id

    # then we convert it into a normal list of dicts so that we can easily turn it
    # into JSON
    for order in order_list:
        d = order.to_dict()
        d['id'] = str(order.orderId)
        json_list.append(d)

    responseJson = json.dumps(json_list)
    return Response(responseJson, mimetype='application/json')


@app.route('/load-user-orders')
def load_user_orders():

    # first we load the list items
    log('loading list orders.')
    order_list = userOrder.get_user_orders(session['curUser'])
    json_list = []

    # TODO: then we load the photo urls based on id

    # then we convert it into a normal list of dicts so that we can easily turn it
    # into JSON
    for order in order_list:
        d = order.to_dict()
        d['id'] = str(order.orderId)
        json_list.append(d)

    responseJson = json.dumps(json_list)
    return Response(responseJson, mimetype='application/json')


@app.route('/delete-order', methods=['POST'])
def delete_order():
    # retrieve the parameters from the request
    order_id = request.form['id']
    json_result = {}
    try:
        log('deleting item for ID: %s' % order_id)
        adminData.delete_order_item(order_id)
        json_result['ok'] = True
    except Exception as exc:
        log(str(exc))
        json_result['error'] = 'The item was not removed.'

    return Response(json.dumps(json_result), mimetype='application/json')


@app.route('/load-sl-items')
def load_sli_items():

    # first we load the list items

    log('loading list items.')
    sli_list = slidata.get_list_items()
    json_list = []

    # then we convert it into a normal list of dicts so that we can easily turn it
    # into JSON
    for sl_item in sli_list:
        d = sl_item.to_dict()
        d['id'] = str(sl_item.id)
        json_list.append(d)

    responseJson = json.dumps(json_list)
    return Response(responseJson, mimetype='application/json')


@app.route('/menu')
def menu():
    if 'curUser' in session and (userData.get_user(session['curUser']).userId == '107547848533480653521' or userData.get_user(session['curUser']).userId == '112301482083727417023'):
        return render_template('menu.html', admin="true")
    else:
        return render_template('menu.html', admin="false")


@app.route('/delete-all', methods=['POST'])
def delete_all():
    # first we load the list items
    log('loading list items.')
    sli_list = slidata.get_list_items()

    # then we delete using a for loop
    json_result = {}
    try:
        for sl_item in sli_list:
            log('deleting item for ID: %s' % sl_item.id)
            slidata.delete_list_item(sl_item.id)
            json_result['ok'] = True
    except Exception as exc:
        log(str(exc))
        json_result['error'] = 'The item was not removed.'

    return Response(json.dumps(json_result), mimetype='application/json')


@app.route('/delete-item', methods=['POST'])
def delete_item():
    # retrieve the parameters from the request
    sli_id = request.form['id']
    try:
        log('deleting item for ID: %s' % sli_id)
        slidata.delete_list_item(sli_id)

    except Exception as exc:
        log(str(exc))

    return redirect('/menu')


# here we use a Flask shortcut to pull the itemid from the URL.
@app.route('/get-item/<itemid>')
def get_item(itemid):
    log('retrieving item for ID: %s' % itemid)
    item = slidata.get_list_item(itemid)
    d = item.to_dict()
    d['id'] = itemid
    return Response(json.dumps(d), mimetype='application/json')

# here we use a Flask shortcut to pull the itemid from the URL.
@app.route('/save-order/<itemid>', methods=['POST'])
def save_order(itemid):
    log('retrieving item for ID: %s' % itemid)
    item = userOrder.get_user_order(itemid, session['curUser'])

    if 'curUser' in session and userData.checkUser(session['curUser']):
        user = userData.get_user(session['curUser'])
        try:
            if item.payment == 'Cash':
                old_points = user.userPoints
                old_money = user.userMoneySpent
                new_points = int(old_points) + config.POINTS_PER_DRINK
                try:
                    new_money = float(old_money) + float(item.price.split('$')[1])
                except IndexError:
                    new_money = float(old_money) + float(item.price)
                uuser = User(user.userId, user.userEmail, user.userName,
                                new_points, new_money, user.userPicture, user.userLastName)
                userData.save_user(uuser)
            else:
                old_points = user.userPoints
                if old_points >= config.COST_PER_DRINK:
                    new_points = int(old_points) - config.COST_PER_DRINK
                    uuser = User(user.userId, user.userEmail, user.userName, new_points,
                                    user.userMoneySpent, user.userPicture, user.userLastName)
                    userData.save_user()
                else:
                    # alert you dont have enough points
                    pass
        except AttributeError:
                log("Check around line 140 in main.py and add them to your config file.")
    elif item.payment == 'Rewards':
        # alert cannot pay with Rewards
        pass

    newItem = Order(random.randint(1, 999999999999), item.name, item.size, item.tea, item.flavor, item.milk, item.sweetness,
                    item.temp, item.toppings, item.price, item.payment, str(datetime.datetime.now()), item.url)
    orderData.create_order(newItem)
    log("yeah buddy")
    d = item.to_dict()
    d['id'] = itemid
    return Response(json.dumps(d), mimetype='application/json')


@app.route('/get-user-order/<itemid>')
def get_user_order(itemid):
    log('retrieving item for ID: %s' % itemid)
    item = userOrder.get_user_order(str(itemid), session['curUser'])
    d = item.to_dict()
    d['id'] = itemid
    return Response(json.dumps(d), mimetype='application/json')


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)


@app.after_request
def set_response_headers(response):
    response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'
    return response


def _get_storage_client():
    return storage.Client(
        project=config.PROJECT_ID)


def upload_file(file_stream, filename, content_type):
    client = _get_storage_client()
    bucket = client.bucket(config.CLOUD_STORAGE_BUCKET)
    blob = bucket.blob(filename)

    blob.upload_from_string(
        file_stream,
        content_type=content_type)

    url = blob.public_url

    if isinstance(url, six.binary_type):
        url = url.decode('utf-8')

    log(url)

    return url


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in config.ALLOWED_EXTENSIONS


def save_item(price, name, url, item_id):

    result = ""

    try:
        if item_id:
            item = MenuItem(item_id, name, price, url)
            log('saving list item for ID: %s' % item_id)
            slidata.save_list_item(item)
        else:
            log('saving new list item')
            slidata.create_list_item(MenuItem(None, name, price, url))
        result += name + " ok. "
    except Exception as exc:
        log(str(exc))
        result += name + 'The item was not saved. '
    log(result)


@app.route('/save-data', methods=['POST'])
def save_data():
    log(request.form)
    if 'file' not in request.files:
        log('No file part')
        return redirect('/menu')
    file = request.files['file']
    # if user does not select file, browser also
    # submit a empty part without filename
    if file.filename == '':
        log('No selected file')
        return redirect('/menu')
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_url = upload_file(file.read(), filename, file.content_type)
        save_item(request.form['price'], request.form['name'], file_url, None)
        return redirect('/menu')


@app.route('/edit-data', methods=['POST'])
def edit_data():
    # log(request.form)

    item_id = request.form['id']
    item_price = request.form['price']
    item_name = request.form['name']

    item = slidata.get_list_item(item_id)

    d = item.to_dict()

    # log("price: " + d['price'] + ", name: " + d['name'] + ", url: " + d['url'])

    item_url = d['url']

    if item_price == '':
        item_price = d['price']

    if item_name == '':
        item_name = d['name']

    save_item(item_price, item_name, item_url, item_id)

    return redirect('/menu')


@app.route('/currentUser/<itemid>')
def get_current_user(itemid):
    if 'curUser' in session and userData.checkUser(session['curUser']):
        user = userData.get_user(session['curUser'])
        d = user.to_dict()
        d['itemid'] = itemid
    else:
        e = Empty()
        d = e.to_dict()
        d['itemid'] = itemid

    return Response(json.dumps(d), mimetype='application/json')