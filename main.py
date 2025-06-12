from flask import Flask, render_template, request, redirect, url_for, session
import mysql.connector
import bcrypt

app = Flask(__name__)
app.secret_key = "gaghtni_banali"

def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        port=8889,
        user="root",
        password="root",
        database="Sunramics"
    )

@app.route('/')
def home():
    return render_template("home.html")

@app.route('/about_us')
def about_us():
    return render_template('about-us.html')

@app.route('/services')
def services():
    return render_template('services.html')

@app.route('/plates')
def plates():
    return render_template('plates.html')

@app.route('/vases')
def vases():
    return render_template('vases.html')

@app.route('/mugs')
def mugs():
    return render_template('mugs.html')

@app.route('/calendar2')
def calendar2():
    return render_template('calendar2.html')

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        name = request.form["username"]
        password = request.form["password"]

        if not name or not password:
            return "Please enter both username and password."

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT * FROM users WHERE name = %s", (name,))
        user = cursor.fetchone()

        cursor.close()
        conn.close()

        if user and bcrypt.checkpw(password.encode('utf-8'), user["password"].encode('utf-8')):
            session["username"] = user["name"]
            session["email"] = user["email"]
            return redirect(url_for("home"))
        else:
            return "Wrong username or password!"

    return render_template("login1.html")

@app.route("/signup", methods=["GET", "POST"])
def signup():
    if request.method == "POST":
        name = request.form["username"]
        password = request.form["password"]
        email = request.form["email"]

        if not (name and password and email):
            return "All fields are required."

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT * FROM users WHERE name = %s OR email = %s", (name, email))
        existing_user = cursor.fetchone()

        if existing_user:
            cursor.close()
            conn.close()
            return "Name or email already exists!"

        # Хешируем пароль
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        cursor.execute("INSERT INTO users (name, password, email) VALUES (%s, %s, %s)", (name, hashed_password, email))
        conn.commit()
        cursor.close()
        conn.close()

        session["username"] = name
        session["email"] = email

        return redirect(url_for("home"))

    return render_template("signup1.html")

@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("login"))

if __name__ == '__main__':
    app.debug = True
    app.run()