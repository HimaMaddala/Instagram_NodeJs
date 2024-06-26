# main.py

import os
from flask import Flask, jsonify, request
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
from flask_cors import CORS
import requests
from PIL import Image
from io import BytesIO
import json

SCORES_FILE = 'scores.json'

def save_scores(scores):
    with open(SCORES_FILE, 'w') as f:
        json.dump(scores, f)

def load_scores():
    try:
        with open(SCORES_FILE, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        # Return default scores if the file doesn't exist
        return {
            'cars': 0.3,
            'dogs': 0.3,
            'mountains': 0.3
        }

# Load scores from file
scores = load_scores()

app = Flask(__name__)
CORS(app, origins='*')

# Load the trained model
model_path = 'image_classifier_model_with_inceptionv3.h5'
model = load_model(model_path)


# Define function to update scores
def update_scores(predicted_class, scores, increase_factor=0.1):
    # Increase the score of the predicted class
    scores[predicted_class] += increase_factor
    # Decrease the scores of other classes
    for cls in scores:
        if cls != predicted_class:
            scores[cls] -= increase_factor / 2  # Adjust the decrease factor as needed
            if scores[cls] < 0:
                scores[cls] = 0  # Ensure scores are non-negative
    # Normalize scores to ensure they sum up to 1
    total_score = sum(scores.values())
    for cls in scores:
        scores[cls] /= total_score
    return scores

# Define function to predict class of an input image
def preprocess_image(image_array):
    # Ensure that the image has three color channels (RGB)
    if image_array.shape[-1] == 4:
        # If image has an alpha channel, remove it
        image_array = image_array[:, :, :3]
    # Resize the image to match the model's input shape
    image_resized = image.array_to_img(image_array, scale=False).resize((150, 150))
    # Convert the resized image to array
    image_array_resized = image.img_to_array(image_resized)
    # Rescale pixel values
    image_array_rescaled = image_array_resized / 255.0
    # Add batch dimension
    image_array_expanded = np.expand_dims(image_array_rescaled, axis=0)
    return image_array_expanded

def predict_class(image_array):
    try:
        # Preprocess the input image
        img_preprocessed = preprocess_image(image_array)
        print("Preprocessed image array shape:", img_preprocessed.shape)

        # Make prediction
        predictions = model.predict(img_preprocessed)
        print("Predictions:\n", predictions)

        # Interpret predictions
        class_labels = ['cars', 'dogs', 'mountains']
        predicted_class_index = np.argmax(predictions)
        predicted_class_label = class_labels[predicted_class_index]
        confidence = float(predictions[0][predicted_class_index])

        print("Predicted class:", predicted_class_label)
        print("Confidence:", confidence)

        return predicted_class_label, confidence
    except Exception as e:
        print("Error occurred during prediction:", e)
        return None, None

# Define route to handle image classification requests
@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Receive image URL from the client
        image_url = request.json['post_image']
        print(image_url)
        # Download the image from the URL
        response = requests.get(image_url)
        img = Image.open(BytesIO(response.content))

        # Convert image to array
        img_array = np.array(img)
        print(img_array.shape)
        # Predict class of the image
        predicted_class, confidence = predict_class(img_array)

        if predicted_class:
            # Update scores based on the predicted class
            global scores
            scores = update_scores(predicted_class, scores)
            # Save scores to file
            save_scores(scores)

        # Return the predicted class and confidence score to the client
        return jsonify({'predicted_class': predicted_class, 'confidence': confidence})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True,port=8080)
