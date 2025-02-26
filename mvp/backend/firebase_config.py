"""
backend/firebase_config.py

Initializes Firebase Admin SDK for server-side authentication.
Make sure your service account key JSON is placed at:
  backend/serviceAccountKey.json
"""

import os
import firebase_admin
from firebase_admin import credentials, auth

service_account_path = os.path.join(
    os.path.dirname(__file__), 
    "serviceAccountKey.json"  # adjust path if needed
)

cred = credentials.Certificate(service_account_path)
firebase_app = firebase_admin.initialize_app(cred)
