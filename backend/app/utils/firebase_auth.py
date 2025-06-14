import os
import firebase_admin
from firebase_admin import credentials


def init_firebase():
    if not firebase_admin._apps:
        base_dir = os.path.dirname(
            os.path.abspath(__file__)
        )  # this gives path to `app/utils/`
        root_dir = os.path.abspath(os.path.join(base_dir, ".."))  # this goes to `app/`
        if os.getenv("IS_RENDER") == "true":
            # Running on Render
            cred_path = "/etc/secrets/firebase-adminsdk.json"
        else:
            # Running locally
            cred_path = os.path.join(root_dir, "firebase-adminsdk.json")

        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
