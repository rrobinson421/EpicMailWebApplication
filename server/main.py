from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
#from sqlalchemy import create_engine, Column, Integer, String, UniqueConstraint
#from sqlalchemy.ext.declarative import declarative_base

# TODO: Include some WSGI server instead of running from Flask eventually

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])

def init_user_db():
    """Initialize the SQLite database and create the users table if it doesn't exist."""
    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()

    # Drop the users table if it exists
    cursor.execute("DROP TABLE IF EXISTS users")
    cursor.execute("DROP TABLE IF EXISTS inbox")

    conn.execute("PRAGMA foreign_keys = ON") 

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password TEXT UNIQUE NOT NULL
        )
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS inbox (
            eid INTEGER PRIMARY KEY AUTOINCREMENT,
            "from" TEXT NOT NULL,
            "to" TEXT NOT NULL,
            subject TEXT NOT NULL,
            message TEXT NOT NULL,
            category TEXT NOT NULL,
            read BOOLEAN NOT NULL DEFAULT 0,
            FOREIGN KEY ("to") REFERENCES users(email)
        )
    ''')
    conn.commit()

    # Insert example users only if they don't already exist
    example_users = [
        ("user1@example.com", "password123"),
        ("user2@example.com", "securepass"),
        ("user3@example.com", "mypassword")
    ]
    for email, password in example_users:
        cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
        if cursor.fetchone() is None:  # Check if the user already exists
            cursor.execute("INSERT INTO users (email, password) VALUES (?, ?)", (email, password))
    for email, password in example_users:
        cursor.execute("SELECT * FROM inbox WHERE subject = 'Welcome to Epic Mail!' AND \"from\" = 'admin@epicmail.com' AND \"to\" = ?", (email,))
        default_email_exists = cursor.fetchone()
        username = email.split('@')[0]

        if not default_email_exists:
            # Insert the default email into the emails table
            default_email = {
                "from": "admin@epicmail.com",
                "to": email,
                "subject": "Welcome to Epic Mail!",
                "message": "Welcome " + username + "! Enjoy using Epic Mail!",
                "category": "all",
                "read": False
            }
            cursor.execute('''
                INSERT INTO inbox ("from", "to", subject, message, category, read)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (default_email["from"], default_email["to"], default_email["subject"],
                  default_email["message"], default_email["category"], default_email["read"]))

    conn.commit()
    conn.close()

init_user_db()

# TODO: update local user databases
# Route for user registration
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400

    try:
        conn = sqlite3.connect("users.db")
        cursor = conn.cursor()
        cursor.execute("INSERT INTO users (email, password) VALUES (?, ?)", (email, password))
        conn.commit()

        # Insert the default email into the emails table
        username = email.split('@')[0]
        default_email = {
            "from": "admin@epicmail.com",
            "to": email,
            "subject": "Welcome to Epic Mail!",
            "message": f"Welcome to Epic Mail, {username}!",
            "category": "welcome",
            "read": False
        }
        cursor.execute('''
            INSERT INTO inbox ("from", "to", subject, message, category, read)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (default_email["from"], default_email["to"], default_email["subject"],
              default_email["message"], default_email["category"], default_email["read"]))

        conn.commit()
        cursor.close()

        return jsonify({"message": "User registered successfully"}), 201
    except sqlite3.IntegrityError:
        return jsonify({"message": "User with this email already exists"}), 400

# Route for user login
@app.route('/login', methods=['POST'])
def login():
    print(f"Raw request data: {request.data}")
    data = request.json
    # Process login data
    email = data.get('email')
    password = data.get('password')
    print(f"Username: {email}, Password: {password}")
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM users WHERE email = ? AND password = ?', (email, password))
    user = cursor.fetchone()
    conn.close()

    if user:
        return jsonify({"message": "✅ Login successful!", "email": email}), 200
    else:
        return jsonify({"error": "❌ Invalid email or password", "email": email, "password": password}), 401
    
# Route for email management
@app.route('/email-management', methods=['GET'])
def email_management():
    # Fetch and return email management data
    return jsonify({"message": "Email management data fetched successfully"}), 200

# Route for sending an email
@app.route('/email-send', methods=['POST'])
def email_send():
    email_data = request.json
    # Process email sending
    return jsonify({"message": "Email sent successfully", "data": email_data}), 200

# Route for fetching inbox emails
# TODO: Determine how to select category, update the to: format, and mark as read
@app.route('/email-inbox', methods=['POST'])
def email_inbox():
    data = request.json
    user_email = data.get("email")  # Get the logged-in user's email
    print(user_email)
    if not user_email:
        return jsonify({"message": "User email is required"}), 400

    try:
        # Connect to the user's email database
        conn = sqlite3.connect("users.db")
        cursor = conn.cursor()

        # Fetch all emails from the user's inbox
        cursor.execute("SELECT * FROM inbox WHERE \"to\" = (?)", (user_email,))
        emails = cursor.fetchall()

        # Map the emails to a dictionary format
        email_list = [
            {
                "id": email[0],
                "from": email[1],
                "to": email[2],
                "subject": email[3],
                "message": email[4],
                "category": email[5],
                "read": bool(email[6]),
            }
            for email in emails
        ]

        conn.close()
        return jsonify({"message": "Inbox emails fetched successfully", "emails": email_list}), 200
    except sqlite3.Error as e:
        return jsonify({"message": f"Error fetching emails: {str(e)}"}), 500

# Default route
@app.route('/')
def default_route():
    return jsonify({"message": "Welcome to Epic Mail API"}), 200

if __name__ == '__main__':
    app.run(debug=True)