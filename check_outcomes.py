import sys
import os

# Add the backend directory to sys.path
sys.path.append(os.path.join(os.getcwd(), 'Edvantage', 'backend'))

from app import create_app, db
from app.models.risk import InterventionOutcome

app = create_app()
with app.app_context():
    print(f"Outcomes: {InterventionOutcome.query.count()}")
