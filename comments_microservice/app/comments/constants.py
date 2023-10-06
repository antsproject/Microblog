import os
from pathlib import Path
from dotenv import load_dotenv

from .utils import ensure_trailing_slash

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv('./.env')

COMMENTS_MICROSERVICE_URL = ensure_trailing_slash(os.getenv('COMMENTS_MICROSERVICE_URL'))
USERS_MICROSERVICE_URL = ensure_trailing_slash(os.getenv('USERS_MICROSERVICE_URL'))

