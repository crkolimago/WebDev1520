from flask import Flask, redirect, render_template, request

app = Flask(__name__)

@app.route('/')
def root():
    return redirect("fukuPage.html", code=302)

@app.route('/login', methods=['GET', 'POST'] )
def login():
    if request.method == "GET" :
        return render_template("login.html")
    elif request.method == "POST":
        userName = "Welcome Back, "+ request.form["userName"] + "!"
        password = request.form["password"]
        return redirect("/static/fukuPage.html", userName=userName, password=password)
    else: 
    	return "Invalid"


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)


@app.after_request
def set_response_headers(response):
  response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
  response.headers['Pragma'] = 'no-cache'
  response.headers['Expires'] = '0'
  return response