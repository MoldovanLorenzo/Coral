from flask_sqlalchemy import SQLAlchemy
import bcrypt
from datetime import datetime
import uuid
import misc_helpers as msc

db = SQLAlchemy()

class User(db.Model):
    id=db.Column(db.String(10),primary_key=True)
    username=db.Column(db.String(25),unique=True,nullable=False)
    password=db.Column(db.String(20),unique=False,nullable=False)   
    def __init__(self,username,password):
        self.username=username
        self.password=password
        if not self.id:
            self.id = uuid.uuid4().hex[:10]
    def as_dict(self):
        return{
            'id':self.id,
            'username':self.username,
        }                      
class Chatroom(db.Model):
    id=db.Column(db.String(10),primary_key=True)
    name=db.Column(db.String(80),unique=True,nullable=False)
    members=db.relationship('User',secondary='chatroom_members',backref='chatrooms') 
    is_public = db.Column(db.Boolean, default=True, nullable=False)
    def __init__(self,name,is_public):
        self.name=name
        self.is_public=is_public
        if not self.id:
            self.id = uuid.uuid4().hex[:10]
    def as_dict(self):
        return{
            'id':self.id,
            'name':self.name,
            'is_public':self.is_public,
        }          

chatroom_members=db.Table('chatroom_members',db.Column('chatroom_id',db.Integer,db.ForeignKey('chatroom.id'),primary_key=True),
                          db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True))     

class Message(db.Model):
    id = db.Column(db.String(15), primary_key=True)
    content = db.Column(db.String(255), nullable=False)
    sender_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    chatroom_id = db.Column(db.Integer, db.ForeignKey('chatroom.id'), nullable=False)

    
    sender = db.relationship('User', backref=db.backref('sent_messages', lazy=True))
    chatroom = db.relationship('Chatroom', backref=db.backref('messages', lazy=True))

    def __init__(self,content,sender_id,chatroom_id):
        self.content=content
        self.sender_id=sender_id
        self.chatroom_id=chatroom_id
        if not self.id:
            self.id = uuid.uuid4().hex[:15]
    def as_dict(self):
        return{
            'id':self.id,
            'content':self.content,
            'sender_id':self.sender_id,
            'timestamp':self.timestamp,
            'chatroom_id':self.chatroom_id
        }      
def addUser(username,password):
    hashed_password=bcrypt.hashpw(password.encode('utf-8'),bcrypt.gensalt())
    new_user=User(username,hashed_password)
    db.session.add(new_user)
    db.session.commit()

def verifyUser(username,password):
    user=User.query.filter_by(username=username).first()
    if user:
        if bcrypt.checkpw(password.encode('utf-8'),user.password):
            token=msc.generate_token(user.id)
            return True,token
    return False,None           

def addUserToChatroom(chatroom_id,token):
    valid,info=msc.verify_token(token)
    if not valid:
        raise Exception(info['message'])
    chatroom=Chatroom.query.get(chatroom_id)
    user=User.query.get(info.get('user_id'))
    chatroom.members.append(user)
    db.session.commit()
    
def addChatroom(name,is_public,token):
    valid,info=msc.verify_token(token)
    if not valid:
        raise Exception(info['message'])
    new_chatroom=Chatroom(name,msc.string_to_bool(is_public))
    db.session.add(new_chatroom)
    user=User.query.get(info.get('user_id'))
    new_chatroom.members.append(user)
    db.session.commit()
    


def getChatroomsFromUserId(token):
    valid,info=msc.verify_token(token)
    if not valid:
        raise Exception(info['message'])
    user_chatrooms=Chatroom.query.filter(Chatroom.members.any(id=info.get('user_id'))).all()
    return[chatroom.as_dict() for chatroom in  user_chatrooms]

def getUsersInChatroom(chatroom_id,token):
    valid,info=msc.verify_token(token)
    if not valid:
        raise Exception(info['message'])
    chatroom=Chatroom.query.get(chatroom_id)
    users_in_chatroom=chatroom.members
    return [user.as_dict() for user in users_in_chatroom]

def addMessage(chatroom_id,content,token):
    valid,info=msc.verify_token(token)
    if not valid:
        raise Exception(info['message'])
    new_message=Message(content,info.get('user_id'),chatroom_id)
    db.session.add(new_message)
    db.session.commit()

def getMessagesFromChatroom(chatroom_id,num_of_messages,token):
    valid,info=msc.verify_token(token)
    if not valid:
        raise Exception(info['message'])
    try:
        chatroom_messages = Message.query.filter_by(chatroom_id=chatroom_id).order_by(Message.timestamp.desc()).limit(int(num_of_messages)).all()
        return [message.as_dict() for message in chatroom_messages]
    except Exception as e:
        return {'Exception':str(e)}   
