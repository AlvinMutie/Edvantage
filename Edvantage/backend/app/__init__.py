from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_migrate import Migrate
from config import Config

db = SQLAlchemy()
jwt = JWTManager()
migrate = Migrate()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app)

    CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)

    # Register blueprints
    from app.routes.auth import auth_bp
    from app.routes.students import students_bp
    from app.routes.evaluation import evaluation_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(students_bp, url_prefix='/api/students')
    app.register_blueprint(evaluation_bp, url_prefix='/api/evaluation')
    
    from app.routes.users import users_bp
    app.register_blueprint(users_bp, url_prefix='/api/users')

    from app.routes.notifications import notifications_bp
    app.register_blueprint(notifications_bp, url_prefix='/api/notifications')

    from app.routes.settings import settings_bp
    app.register_blueprint(settings_bp, url_prefix='/api/settings')

    from app.routes.ai_analytics import ai_bp
    app.register_blueprint(ai_bp, url_prefix='/api/ai')

    from app.routes.assignments import assignments_bp
    app.register_blueprint(assignments_bp, url_prefix='/api/assignments')

    from app.routes.student_dashboard import student_dashboard_bp
    app.register_blueprint(student_dashboard_bp, url_prefix='/api/student-dashboard')

    from app.routes.bulk_operations import bulk_bp
    app.register_blueprint(bulk_bp, url_prefix='/api/bulk')

    from app.routes.reports import reports_bp
    app.register_blueprint(reports_bp, url_prefix='/api/reports')

    from app.routes.analytics import analytics_bp
    app.register_blueprint(analytics_bp, url_prefix='/api/analytics')

    from app.routes.search import search_bp
    app.register_blueprint(search_bp, url_prefix='/api/search')

    from app.routes.interventions_auto import interventions_bp
    app.register_blueprint(interventions_bp, url_prefix='/api/interventions')

    from app.routes.messages import messages_bp
    app.register_blueprint(messages_bp, url_prefix='/api/messages')

    return app
