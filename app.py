from os import environ
from flask import Flask, jsonify, request
from waitress import serve
from urllib.request import urlretrieve

import numpy as np
import tensorflow as tf
import PIL
import PIL.Image

IMAGE_SHAPE = [224, 224]
model_url = environ.get('MODEL_URL')
model_path = 'model.h5'
urlretrieve(model_url, 'model.h5')
class_names = []

app = Flask(__name__)

@app.route('/', methods=['GET'])
def serverCheck():
    return 'Server is running perfectly!'

@app.route('/predict', methods=['POST'])
def predict():
    raw_img = request.files['image']
    img = PIL.Image.open(raw_img)
    img = tf.keras.utils.img_to_array(img)
    img = img[..., :3]
    img_rescaled = tf.image.resize(img, IMAGE_SHAPE)
    img_rescaled = tf.expand_dims(img_rescaled, 0)
    img_rescaled = np.vstack([img_rescaled])

    model = tf.keras.models.load_model(
        model_path, custom_objects=None, compile=True, safe_mode=True
    )
    model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

    prediction = model.predict(img_rescaled)
    prediction = np.argmax(prediction[0])
    result = class_names[prediction]
    result = result.split("_")
    result = " ".join(result)

    modelRes = jsonify({"result":result})
    modelRes.headers['Content-Type']='application/json; charset=utf-8'
    return modelRes

if __name__ == '__main__':
    print("Your model server running successfully!")
    serve(app, host=environ.get('HOST'), port=environ.get('PORT'))