from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

# TODO: Include some WSGI server instead of running from Flask eventually

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])

def init_user_db():
    """Initialize the SQLite database and create the users table if it doesn't exist."""
    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()

    # Drop the users table if it exists
    # cursor.execute("DROP TABLE IF EXISTS users")

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

def init_email_db():
    """Create an individual email database for each registered user in users.db."""
    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()

    # Fetch all registered users
    cursor.execute("SELECT email FROM users")
    users = cursor.fetchall()
    conn.close()

    for (email,) in users:
        # Create a database file for each user based on their email
        db_name = f"{email.replace('@', '_').replace('.', '_')}_emails.db"
        email_conn = sqlite3.connect(db_name)
        email_cursor = email_conn.cursor()

        # Create the emails table for the user
        email_cursor.execute('''
            CREATE TABLE IF NOT EXISTS emails (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                "from" TEXT NOT NULL,
                "to" TEXT NOT NULL,
                subject TEXT NOT NULL,
                message TEXT NOT NULL,
                category TEXT NOT NULL,
                read BOOLEAN NOT NULL DEFAULT 0
            )
        ''')

        # Check if the default email already exists
        email_cursor.execute("SELECT * FROM emails WHERE subject = 'Welcome to Epic Mail!' AND \"from\" = 'admin@epicmail.com'")
        default_email_exists = email_cursor.fetchone()
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
            email_cursor.execute('''
                INSERT INTO emails ("from", "to", subject, message, category, read)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (default_email["from"], default_email["to"], default_email["subject"],
                  default_email["message"], default_email["category"], default_email["read"]))

        email_conn.commit()
        email_conn.close()

    print("Email databases initialized for all registered users.")

init_user_db()
init_email_db()

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
        conn.close()

    # Create the user's email database and send the default email
        db_name = f"{email.replace('@', '_').replace('.', '_')}_emails.db"
        email_conn = sqlite3.connect(db_name)
        email_cursor = email_conn.cursor()

        # Create the emails table for the user
        email_cursor.execute('''
            CREATE TABLE IF NOT EXISTS emails (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                "from" TEXT NOT NULL,
                "to" TEXT NOT NULL,
                subject TEXT NOT NULL,
                message TEXT NOT NULL,
                category TEXT NOT NULL,
                read BOOLEAN NOT NULL DEFAULT 0
            )
        ''')

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
        email_cursor.execute('''
            INSERT INTO emails ("from", "to", subject, message, category, read)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (default_email["from"], default_email["to"], default_email["subject"],
              default_email["message"], default_email["category"], default_email["read"]))

        email_conn.commit()
        email_conn.close()

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

    if not user_email:
        return jsonify({"message": "User email is required"}), 400

    # Generate the database name for the user
    db_name = f"{user_email.replace('@', '_').replace('.', '_')}_emails.db"
    print(db_name)

    try:
        # Connect to the user's email database
        email_conn = sqlite3.connect(db_name)
        email_cursor = email_conn.cursor()

        # Fetch all emails from the user's email database
        email_cursor.execute("SELECT * FROM emails")
        emails = email_cursor.fetchall()

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

        email_conn.close()
        return jsonify({"message": "Inbox emails fetched successfully", "emails": email_list}), 200
    except sqlite3.Error as e:
        return jsonify({"message": f"Error fetching emails: {str(e)}"}), 500

# Default route
@app.route('/')
def default_route():
    return jsonify({"message": "Welcome to Epic Mail API"}), 200

if __name__ == '__main__':
    app.run(debug=True)