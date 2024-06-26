from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins='*')

@app.route('/predict', methods=['POST'])
def predict():
    # Assuming you want to receive some data from the frontend
    data = request.json
    # Do something with the data (you can process it, save it to a database, etc.)
    # For now, let's just print it
    print("Received data:", data)
    return jsonify({'message': 'Prediction successful'})  # Sending back a response

@app.route('/')
def index():
    return 'Welcome to the backend!'

if __name__ == '__main__':
    app.run(debug=True, port=8080)