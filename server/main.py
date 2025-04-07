from flask import Flask, request, jsonify
from flask_cors import CORS

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
        {"id": 1, "subject": "Welcome!", "body": "Welcome to Epic Mail!", "sender": "admin@epicmail.com"},
        {"id": 2, "subject": "Update", "body": "Your account has been updated.", "sender": "support@epicmail.com"}
    ]
    return jsonify({"message": "Inbox emails fetched successfully", "emails": emails}), 200

# Default route
@app.route('/')
def default_route():
    return jsonify({"message": "Welcome to Epic Mail API"}), 200

if __name__ == '__main__':
    app.run(debug=True)