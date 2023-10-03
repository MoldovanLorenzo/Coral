import flask
from database_interface import addUser,verifyUser,addChatroom,getChatroomsFromUserId,getUsersInChatroom,getMessagesFromChatroom,addMessage,addUserToChatroom

app_routes = flask.Blueprint('app_routes', __name__)
#====Routes====
@app_routes.route('/')
def index():
    return "Hello api user!"

@app_routes.route("/login",methods=['POST','OPTIONS'])
def login_handler():
    try:
        data=flask.request.get_json()
        is_in_database,token=verifyUser(data.get('username'),data.get('password'))
        if is_in_database:
            return flask.jsonify({'response':'OK','auth_token':token})
        else:
            raise Exception('User/password combination does not exist in database!')
    except Exception as e:
        return flask.jsonify({'response':'NOK, ERROR: '+str(e)})    

@app_routes.route('/signup',methods=['POST','OPTIONS'])
def signup_handler():
    try:
        data=flask.request.get_json()
        
        addUser(data.get('username'),data.get('password'))
        return flask.jsonify({'response':'OK'})
    except Exception as e:
        if "UNIQUE constraint failed" in str(e):
            return flask.jsonify({'response':'NOK, ERROR: Username already taken!'})
        return flask.jsonify({'response':'NOK, ERROR: '+str(e)})
    
@app_routes.route('/chatrooms',methods=['POST','GET','DELETE'])
def chatroom_handler():
    
    try:
        request_method=flask.request.method
        data=flask.request.get_json()
        what=data['what']
        token=flask.request.headers.get('Authorization')
        if request_method=='POST':
            assert(what in ['addChatroom','addMessage','addUserToChatroom'])
            if what=='addChatroom':
                addChatroom(data['name'],data['is_public'],token)
            elif what=='addMessage':
                addMessage(data['chatroom_id'],data['content'],token) 
            elif what=='addUserToChatroom':
                addUserToChatroom(data['chatroom_id'],token) 
            return flask.jsonify({'response':'OK'})
        if request_method=='GET':
            
            assert(what in ['getUsersInChatroom','getMessagesFromChatroom','getChatroomsFromUserId'])
            if what=='getUsersInChatroom':
                result=getUsersInChatroom(data['chatroom_id'],token)
                return flask.jsonify(result)
            elif what=='getMessagesFromChatroom':
                result=getMessagesFromChatroom(data['chatroom_id'],data['num_of_messages'],token)  
                return flask.jsonify(result)
            elif what=='getChatroomsFromUserId':
                result=getChatroomsFromUserId(token)
                return flask.jsonify(result)  

    except Exception as e:
        return flask.jsonify({'response':'NOK, ERROR: '+str(e)})        