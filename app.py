"""
Root entrypoint for Render deployments.
Proxies to the Flask application in backend/app.py.
"""
import sys
import os

# Add backend directory to Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), 'backend')))

import backend.app
app = backend.app.app

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug_mode = os.environ.get('FLASK_DEBUG', 'False').lower() in ('true', '1')
    app.run(debug=debug_mode, host='0.0.0.0', port=port)
