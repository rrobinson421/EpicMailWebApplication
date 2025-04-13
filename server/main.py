from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

# TODO: Include some WSGI server instead of running from Flask eventually

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])

def init_db():
    """Initialize the SQLite database and create the users table if it doesn't exist."""
    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
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

    conn.commit()
    conn.close()

init_db()

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
        conn.close()
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
# TODO: Determine how to select category
@app.route('/email-inbox', methods=['GET'])
def email_inbox():
    # Fetch and return inbox emails
    emails = [
        {"from": "ethan63510.edu", "subject": "Hello!", "message": "This is a test email.", "category": "all", "read": False},
        {"from": "adg42902@uga.edu", "subject": "Meeting Reminder", "message": "Don't forget our project meeting at 3 AM.", "category": "work", "read": True},
        {"from": "thv35131@uga.edu", "subject": "Epic Project Update", "message": "The latest project updates are in.", "category": "work", "read": False},
        {"from": "professor@uga.edu", "subject": "Assignment Due", "message": "Your final project is due next week.", "category": "school", "read": True},
        {"from": "newsletter@tech.com", "subject": "Weekly Updates", "message": "Here are the latest tech news.", "category": "subscriptions", "read": False}
    ]
    return jsonify({"message": "Inbox emails fetched successfully", "emails": emails}), 200

# Default route
@app.route('/')
def default_route():
    return jsonify({"message": "Welcome to Epic Mail API"}), 200

if __name__ == '__main__':
    app.run(debug=True)