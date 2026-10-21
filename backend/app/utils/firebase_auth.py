import firebase_admin
from firebase_admin import credentials

from app.config import FIREBASE_CREDENTIALS_PATH


def init_firebase():
    """Initialise the default Firebase app once."""
    try:
        firebase_admin.get_app()
    except ValueError:
        firebase_admin.initialize_app(credentials.Certificate(FIREBASE_CREDENTIALS_PATH))
