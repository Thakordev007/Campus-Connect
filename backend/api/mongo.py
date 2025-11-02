from pymongo import MongoClient
from django.conf import settings

_client = MongoClient(settings.MONGO_URI)
_db = _client[settings.MONGO_DB]

def col(name: str):
    return _db[name]


