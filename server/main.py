from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
from enum import Enum

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
    cursor.execute("DROP TABLE IF EXISTS users") # Comment these out when neccesary
    cursor.execute("DROP TABLE IF EXISTS inbox")
    cursor.execute("DROP TABLE IF EXISTS categories")

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
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS categories (
            "to" TEXT NOT NULL,
            "from" TEXT NOT NULL,
            category TEXT NOT NULL,
            PRIMARY KEY ("to", "from"),
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
    '''
    example_categories = [
        ("user1@example.com", "user3@example.com", "school"),
        ("user2@example.com", "admin@epicemail.com", "work"),
        ("user3@example.com", "spectrum@exchange.spectrum.com", "promotions")
    ]
     for recipient, sender, category in example_categories:
        cursor.execute("INSERT INTO categories (\"to\", \"from\", category) VALUES (?, ?, ?)", (recipient, sender, category))
    '''
   
    
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
@app.route('/email-management', methods=['POST'])
def email_management():
    data = request.json
    print(f"Raw request data: {request.data}")
    action = data.get("action") 
    print(action)
    original_email_id = data.get("email_id")  # ID of the email being replied to or forwarded
    new_email_data = data.get("email_data")  # New email details (to, subject, message, etc.)

    if action == "mark-as-read":
        # Mark the email as read
        if not original_email_id:
            return jsonify({"message": "Email ID is required to mark as read"}), 400

        try:
            conn = sqlite3.connect("users.db")
            cursor = conn.cursor()

            # Update the read status of the email
            cursor.execute("UPDATE inbox SET read = 1 WHERE eid = ?", (original_email_id,))
            conn.commit()
            conn.close()

            return jsonify({"message": "Email marked as read"}), 200
        except sqlite3.Error as e:
            return jsonify({"message": f"Error updating email read status: {str(e)}"}), 500
        
    if action == 'update-category':
        new_category = data.get('new_category').lower()
        to_data = data.get('to')
        from_data = data.get('from')

        try:
            conn = sqlite3.connect('users.db')
            cursor = conn.cursor()
            cursor.execute(
                "UPDATE inbox SET category = ? WHERE eid = ?",
                (new_category, original_email_id)
            )
            conn.commit()

            ### TODO: Logic implementing categories to a single user

            # Print the inbox database neatly
            print("Inbox Database:")
            for email in cursor.execute("SELECT * FROM inbox"):
                print(f"ID: {email[0]}, From: {email[1]}, To: {email[2]}, Subject: {email[3]}, "
                f"Message: {email[4]}, Category: {email[5]}, Read: {bool(email[6])}")

            conn.close()
            return jsonify({"message": "Category updated successfully"}), 200
        except Exception as e:
            return jsonify({"message": str(e)}), 500

    if not action or not original_email_id or not new_email_data:
        return jsonify({"message": "Action, email ID, and email data are required"}), 400

    try:
        conn = sqlite3.connect("users.db")
        cursor = conn.cursor()

        # Fetch the original email
        cursor.execute("SELECT * FROM inbox WHERE eid = ?", (original_email_id,))
        original_email = cursor.fetchone()
        if not original_email:
            return jsonify({"message": "Original email not found"}), 404

        # Validate the recipient
        recipient_email = new_email_data.get("to")
        cursor.execute("SELECT * FROM users WHERE email = ?", (recipient_email,))
        recipient = cursor.fetchone()
        if not recipient:
            return jsonify({"message": f"Recipient email '{recipient_email}' is not registered"}), 400

        # Create the new email
        original_message = original_email[4]  # Assuming the 5th column is the message body
        if action == "reply":
            # Format the reply message
            new_message = f"--- Reply ---\n\n{new_email_data.get('message')}\n\n--- Original Message ---\nFrom: {original_email[1]}\nTo: {original_email[2]}\nSubject: {original_email[3]}\n\n{original_message}"
        elif action == "forward":
            # Format the forwarded message
            new_message = f"--- Forwarded Message ---\nFrom: {original_email[1]}\nTo: {original_email[2]}\nSubject: {original_email[3]}\n\n{original_message}\n\n{new_email_data.get('message')}"
        else:
            return jsonify({"message": "Invalid action"}), 400

        new_email = {
            "from": new_email_data.get("from"),
            "to": new_email_data.get("to"),
            "subject": f"Re: {original_email[3]}" if action == "reply" else f"Fwd: {original_email[3]}",
            "message": new_message,
            "category": "all",
            "read": False  # Automatically mark as unread
        }

        # Insert the new email into the inbox
        cursor.execute('''
            INSERT INTO inbox ("from", "to", subject, message, category, read)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (new_email["from"], new_email["to"], new_email["subject"],
              new_email["message"], new_email["category"], new_email["read"]))

        conn.commit()
        conn.close()

        return jsonify({"message": f"Email {action}ed successfully"}), 200
    except sqlite3.Error as e:
        return jsonify({"message": f"Error processing email: {str(e)}"}), 500

# Route for sending an email
@app.route('/email-send', methods=['POST'])
def email_send():
    email_data = request.json
    # Process email sending
    print(f"Raw request data: {request.data}")
    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email = ?", (email_data.get("to"),))
    user = cursor.fetchone()
    if not user:
        return jsonify({"message": "Reciever email not registered"}), 400
    # Check if the reciever email is registered

    # Create the email
    new_email = {
        "from": email_data.get("from"),
        "to": email_data.get("to"),
        "subject": email_data.get("subject"),
        "message": email_data.get("message"),
        "category": email_data.get("category"),
        "read": False
    }

    # Add the email to the database
    cursor.execute('''
                INSERT INTO inbox ("from", "to", subject, message, category, read)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (new_email["from"], new_email["to"], new_email["subject"],
                  new_email["message"], new_email["category"], new_email["read"]))
    # Connect to the database
    conn.commit()
    conn.close()
    return jsonify({"message": "Email sent successfully", "data": email_data}), 200

# Route for fetching inbox emails
# TODO: Determine how to select category, update the to: format, and mark as read
@app.route('/email-inbox', methods=['POST', 'GET'])
def email_inbox():
    if request.method == 'GET':
        try:
            conn = sqlite3.connect("users.db")
            cursor = conn.cursor()

            # Fetch all emails from the inbox table
            cursor.execute("SELECT * FROM inbox")
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
            return jsonify({"message": "All emails fetched successfully", "emails": email_list}), 200
        except sqlite3.Error as e:
            return jsonify({"message": f"Error fetching emails: {str(e)}"}), 500
    elif request.method == 'POST':
        data = request.json
        user_email = data.get("email")  # Get the logged-in user's email
        print(f"Raw request data: {request.data}")
        if not user_email:
            return jsonify({"message": "User email is required"}), 400

        try:
            # Connect to the user's email database
            conn = sqlite3.connect("users.db")
            cursor = conn.cursor()
            # Connect to the database

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
            print(e)
        return jsonify({"message": f"Error fetching emails: {str(e)}"}), 500

# Default route
@app.route('/')
def default_route():
    return jsonify({"message": "Welcome to Epic Mail API"}), 200

if __name__ == '__main__':
    app.run(debug=False, use_reloader=False)