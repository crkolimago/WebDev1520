from werkzeug.utils import secure_filename
import slidata
import json
import random
import userData
from menuitem import MenuItem
from User import User
from google.cloud import storage
from google.oauth2 import id_token
from google.auth.transport import requests
from flask import Flask, session, redirect, render_template, request, Response
import six
import config


app = Flask(__name__)
app.secret_key = config.KEY

@app.route('/')
def root():
    if 'curUser' in session:
        return render_template("fukuPage.html", userName=userData.get_user(session['curUser']).userName)
    else:
        return render_template("fukuPage.html")


@app.route('/customDrink')
def customDrink():
    return render_template('customDrink.html')


@app.route('/info.html')
def info():
    return render_template('info.html')


@app.route('/profile', methods=['GET', 'POST'])
def profile():
    if 'curUser' in session:
        return render_template("profile.html", userName=userData.get_user(session['curUser']).userName , emailAddress=userData.get_user(session['curUser']).userEmail , rewards=0, setup="true")
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
            newUser = User(userId, userEmail, userName)
            log('saving for user: %s' % userName)
            userData.create_user(newUser)
    except ValueError:
        pass
    session['curUser'] = userId
    return render_template("fukuPage.html")
    # return render_template("fukuPage.html", userName=userName)


@app.route('/tokenSignOut', methods=['POST'])
def tokenSignOut():
    session.clear()
    log("user has been signed out")
    return render_template("fukuPage.html")


def log(msg):
    """Log a simple message."""
    # Look at: https://console.cloud.google.com/logs to see your logs.
    # Make sure you have "stdout" selected.
    print('main: %s' % msg)


@app.route('/order', methods=['GET', 'POST'])
def order():
    return render_template("orderPage.html")


@app.route('/random', methods=['GET', 'POST'])
def randomizer():
    return render_template("random.html")


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


@app.route('/load-sl-items')
def load_sli_items():
    # first we load the list items
    log('loading list items.')
    sli_list = slidata.get_list_items()
    json_list = []

    # TODO: then we load the photo urls based on id

    # then we convert it into a normal list of dicts so that we can easily turn it
    # into JSON
    for sl_item in sli_list:
        d = sl_item.to_dict()
        d['id'] = str(sl_item.id)
        json_list.append(d)

    responseJson = json.dumps(json_list)
    return Response(responseJson, mimetype='application/json')


@app.route('/menu.html')
def menu():
    if 'curUser' in session and (userData.get_user(session['curUser']).userId == '107547848533480653521' or userData.get_user(session['curUser']).userId  == '112301482083727417023'):
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


def save_item(price, name, url):

    # TODO: check if price is null

    item_id = None
    if 'id' in request.form:
        item_id = request.form['id']

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
        return redirect('/menu.html')
    file = request.files['file']
    # if user does not select file, browser also
    # submit a empty part without filename
    if file.filename == '':
        log('No selected file')
        return redirect('/menu.html')
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_url = upload_file(file.read(), filename, file.content_type)
        save_item(request.form['price'], request.form['name'], file_url)
        return redirect('/menu.html')

# here we use a Flask shortcut to pull the itemid from the URL.
@app.route('/get-item/<itemid>')
def get_item(itemid):
    log('retrieving item for ID: %s' % itemid)
    item = slidata.get_list_item(itemid)
    d = item.to_dict()
    d['id'] = itemid

    return Response(json.dumps(d), mimetype='application/json')
