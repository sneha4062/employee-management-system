import os

# Render injects the PORT environment variable (default to 5000 for local dev)
port = os.environ.get("PORT", "5000")
bind = f"0.0.0.0:{port}"
workers = 2
accesslog = "-"
errorlog = "-"
