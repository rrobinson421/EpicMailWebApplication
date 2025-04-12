from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

# TODO: Include some WSGI server instead of running from Flask eventually

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])

# Route for user registration
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    # Process registration data
    return jsonify({"message": "User registered successfully", "data": data}), 201

# Route for user login
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    # Process login data
    return jsonify({"message": "User logged in successfully", "data": data}), 200

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