import sys
import cv2
import numpy as np
import requests
import matplotlib.pyplot as plt
from tensorflow.keras.models import load_model # type: ignore
import os

# const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dohfbsepn/image/upload';
# const CLOUDINARY_UPLOAD_PRESET = 'AroraOpticals'; // Set this in your Cloudinary dashboard.
# const CLOUDINARY_DELETE_URL = 'https://api.cloudinary.com/v1_1/dohfbsepn/image/destroy';
# const CLOUDINARY_API_SECRET = "mGc4mgrnhkCrBuvXaN2vFnt5f_s";
# const CLOUDINARY_API_KEY = '192436767777992';

model_path = os.path.join(os.path.dirname(__file__), 'segmentation_model.keras')
model = load_model(model_path, compile=False)
image_url = sys.argv[1]

resp = requests.get(image_url, stream=True).raw
img_arr = np.asarray(bytearray(resp.read()), dtype="uint8")
img = cv2.imdecode(img_arr, cv2.IMREAD_COLOR)
img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
img = cv2.resize(img, (256, 256)) / 255.0
input_img = np.expand_dims(img, axis=0)

pred = model.predict(input_img)[0]
mask = (pred > 0.5).astype(np.uint8) * 255
cv2.imwrite('predicted_mask.png', mask)
print('predicted_mask.png', flush=True)

# Upload to Cloudinary
import cloudinary.uploader # type: ignore
cloudinary.config(
    cloud_name='dohfbsepn',
    api_key='192436767777992',
    api_secret='mGc4mgrnhkCrBuvXaN2vFnt5f_s'
)
upload_result = cloudinary.uploader.upload(
    'predicted_mask.png',
    folder='CancerDetectionSystem'  # ✅ target folder in Cloudinary
)

print(upload_result['secure_url'], flush=True)  # returned to Node.js
