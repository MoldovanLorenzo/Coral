import flask
from routes.route_handlers import app_routes
from database_interface import db
from web_socket import socketio
from flask_cors import CORS

app=flask.Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test_database.db'

db.init_app(app)
#with app.app_context():
#    db.drop_all()
#    db.create_all()
app.register_blueprint(app_routes)
CORS(app, resources={r'/*': {'origins': '*'}})
socketio.init_app(app,cors_allowed_origins="*")
socketio.run(app,debug=True)
