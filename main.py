"""import json
import slidata"""

from flask import Flask, render_template, request
"""Response"""
"""from shoppinglistitem import ShoppingListItem"""
app = Flask(__name__)


@app.route('/')
def root():
    return render_template("fukuPage.html")


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == "GET":
        return render_template("login.html")
    elif request.method == "POST":
        userName = "Welcome back " + request.form["userName"] + "!"
        password = request.form["password"]
        return render_template("fukuPage.html", userName=userName, password=password)
    else:
        return "Hello"


@app.route('/order', methods=['GET', 'POST'])
def order():
    if request.method == "GET":
        return render_template("orderPage.html")


"""@app.route('/load-sl-items')
def load_sli_items():
    # first we load the list items
    log('loading list items.')
    sli_list = slidata.get_list_items()
    json_list = []

    # then we convert it into a normal list of dicts so that we caneasilyturnit
    # into JSON
    for sl_item in sli_list:
        d = sl_item.to_dict()
        d['id'] = str(sl_item.id)
        json_list.append(d)
        responseJson = json.dumps(json_list)
        return Response(responseJson, mimetype='application/json')


@app.route('/save-item', methods=['POST'])
def save_item():
    # retrieve the parameters from the request
    userName = request.form['userName']
    title = request.form['title']
    item_id = None
    if 'id' in request.form:
        item_id = request.form['id']
    json_result = {}
    try:
        if item_id:
            item = ShoppingListItem(item_id, title, userName)
            log('saving list item for ID: %s' % item_id)
            slidata.save_list_item(item)
        else:
            log('saving new list item')
            slidata.create_list_item(ShoppingListItem(None, title, userName))
            json_result['ok'] = True
    except Exception as exc:
        log(str(exc))
        json_result['error'] = 'The item was not saved.'
    return Response(json.dumps(json_result), mimetype='application/json')


@app.route('/delete-item', methods=['POST'])
def delete_item():
    # retrieve the parameters from the request
    sli_id = request.form['id']
    json_result = {}
    try:
        log('deleting item for ID: %s' % sli_id)
        slidata.delete_list_item(sli_id)
        json_result['ok'] = True
    except Exception as exc:
        log(str(exc))
        json_result['error'] = 'The item was not removed.'

    return Response(json.dumps(json_result), mimetype='application/json')


# here we use a Flask shortcut to pull the itemid from the URL.
@app.route('/get-item/<itemid>')
def get_item(itemid):
    log('retrieving item for ID: %s' % itemid)
    item = slidata.get_list_item(itemid)
    d = item.to_dict()
    d['id'] = itemid
    return Response(json.dumps(d), mimetype='application/json')"""


def log(msg):
    """Log a simple message."""
    # Look at: https://console.cloud.google.com/logs to see your logs.
    # Make sure you have "stdout" selected.
    print('main: %s' % msg)


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)


@app.after_request
def set_response_headers(response):
    response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'
    return response
