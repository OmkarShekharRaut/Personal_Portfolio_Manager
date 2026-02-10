import secrets

# secret_key
print(secrets.token_hex(32))

# jwt_secret_key
print(secrets.token_urlsafe(64))
