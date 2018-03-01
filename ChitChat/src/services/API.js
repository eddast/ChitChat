/*
 * SERVER: Communicates with chatserver.js API
 */
import * as io from 'socket.io-client';

var Service = {

    socket : null,
    connect: function() {

        this.socket = io.connect('http://localhost:8080');
    },


    // Listens to chatserver.js socket for update on active chatrooms
    listenToChatroomUserUpdates : function(resolve) {
        this.socket.on('updateusers',  (roomName, newUserSet, newOps) => {
            newUserSet = this.convertDict(newUserSet);
            resolve(roomName, newUserSet, newOps);
        });
    },

    // Listens to chatserver.js socket for update on active chatrooms
    listenToChatroomUpdates : function(resolve) {
        this.socket.on('roomlist', rooms => {
            var roomlist = this.dictToArray(rooms);
            for(var i in roomlist) {
                roomlist[i].users = this.convertDict(roomlist[i].users);
            }
            resolve(roomlist);
        });
    },

    // Convert dict to array with new attribute name
    dictToArray : function(dict) {
        var newArray = [];
        for(var i in dict) {
            dict[i].name = i;
            newArray.push(dict[i]);
        }

        return newArray;
    },

    // Convert dict to array
    convertDict : function(dict) {
        var newArray = [];
        for(var i in dict) {
            newArray.push(dict[i]);
        }

        return newArray;
    },

    // Sets user nickname
    setNickname : function(nickname) {
        return new Promise((resolve) => {
            this.socket.emit('adduser', nickname, (nameOK) => {
                resolve(nameOK);
            });
        });
    },

    // Emits to chatserver.js for information on active users
    getUsers : function() {
        this.socket.emit('users');
    },

    // Emits to chatserver.js for information on active chatrooms
    getChatrooms : function() {
        this.socket.emit('rooms');
    },

    // Adds chatroom by name and topic
    addChatroom : function(name, topic, resolve) {
        var newRoom = {room: name};
        this.socket.emit('joinroom', newRoom, (creationOK) => {
            if(creationOK) {
                var newTopic = {topic: topic, room: name};
                this.socket.emit('settopic', newTopic, (topicOK) => {
                    resolve(topicOK);
                });
            }
            resolve(false);
        });
    },

    // Explicitly tell chatserver.js that user has parted a chatroom
    partChatroom : function(name) {
        this.socket.emit('partroom', name);
    },

    // Explicitly tell chatserver.js that user has joined a chatroom
    joinChatroom : function(name) {
        var toJoin = {room: name};
        this.socket.emit('joinroom', toJoin, (joinOK) => {
            return joinOK;
        });
    },

    // Sends message to chatroom
    sendMessage : function(toRoom, message) {
        var data = {
            roomName: toRoom,
            msg: message
        };
        this.socket.emit('sendmsg', (data));
    },

    // Listens to new messages
    listenToMessageUpdates : function(resolve) {
        this.socket.on('updatechat', (roomName, newMessageHistory) => {
            resolve(roomName, newMessageHistory);
        });
    },

    // Sends private message 'message' to user 'toUser'
    sendPrivateMessage : function(toUser, msg, resolve) {
        var message = {
            nick : toUser,
            message : msg
        }
        this.socket.emit('privatemsg', message, (sendOK) => {
            resolve(sendOK);
        })
    },

    // Listen to private messages incoming
    listenToPrivateMessage : function (resolve) {
        this.socket.on('recv_privatemsg', (username, message) => {
            resolve(username, message);
        });
    },

    kickUser : function (user, room, resolve) {
        var kickObj = {
            room: room,
            user: user
        }
        this.socket.emit('kick', kickObj, (kickOK) => {
            resolve(kickOK);
        });
    },

    listenToKicksForUser : function (resolve) {
        this.socket.on('kicked', (room, user) => {
            resolve(room, user);
        });
    },

    banUser : function (user, room, resolve) {
        this.kickUser(user, room , (kickOK) => {
            if(kickOK) {
                var banObj = {
                    room: room,
                    user: user
                }
                this.socket.emit('ban', banObj, (banOK) => {
                    resolve(banOK);
                });
            }
        });
    },

    listenToBansForUser : function (resolve) {
        this.socket.on('banned', (room, user) => {
            resolve(room, user);
        });
    }


}

export default Service;
