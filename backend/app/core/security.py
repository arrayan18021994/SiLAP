from passlib.context import CryptContext
import argon2
from passlib.hash import argon2 as argon2_hash

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_activation_credential(plain_credential: str, hashed_credential: str) -> bool:
    return pwd_context.verify(plain_credential, hashed_credential)

def get_activation_credential_hash(credential: str) -> str:
    return pwd_context.hash(credential)
