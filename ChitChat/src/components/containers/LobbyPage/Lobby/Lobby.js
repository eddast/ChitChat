import React from 'react';
import ListViewChatRooms from '../ListViewChatRooms/ListViewChatRooms';
import ListItemChatRooms from '../ListItemChatRooms/ListItemChatRooms';
import ChatRoomWindow from '../ChatRoomWindow/ChatRoomWindow';
import Banner from '../../../containers/Banner/Banner';
import propTypes from 'prop-types';
import Modal from 'react-modal';
import PrivateMessageModal from '../PrivateMessageModal/PrivateMessageModal';

// The main page: contains active chatrooms
// Displays those chatrooms once user joins,
// along with all it's logic
class Lobby extends React.Component {
    
    constructor(props, ctx) {

        super(props, ctx);

        // Lobby states
        this.state = {
            userList : [],
            chatRoomList : [],
            selectedChatroom: null,
            showChatRoomAvailable : true,
            shouldreRender: false,
            displayModal: false,
            newChatroomName: '',
            newChatroomTopic: '',
            isSendingPrivateMessage: false,
            privateMessageTo: null,
            firstPrivateMessageRecieved: ''
        };
        
        // User is initially joined to the lobby chatroom
        // Get list of active chatroom to render
        this.server = this.context.serverAPI.server;
        this.server.joinChatroom('lobby');
        this.server.getChatrooms();
        this.server.listenToChatroomUpdates((chatRoomlist) => {
            this.setState({chatRoomList: chatRoomlist});
            this.setState({selectedChatroom: chatRoomlist[0]});
        });
        this.sendPrivateMessage = this.sendPrivateMessage.bind(this);
        this.closePrivateChatroom = this.closePrivateChatroom.bind(this);
        this.server.listenToPrivateMessage((username, message) => {
            this.handlePrivateMessageListen(username, message);
        });
        var currentUser = this.props.location.currentUser && this.props.location.currentUser.referrer;
        this.server.listenToKicksForUser((room, user) => {
            var lobby = this.state.chatRoomList[0];
            if(user == currentUser) {
                alert('You have been kicked from chatroom \"' + room + '\"');
                this.server.joinChatroom('lobby');
                this.setState({selectedChatroom: lobby});
                this.refs.window.swapChatrooms(lobby);
            }
        });
        this.server.listenToBansForUser((room, user) => {
            var lobby = this.state.chatRoomList[0];
            if(user == currentUser) {
                alert('You have been banned from chatroom \"' + room + '\"');
                this.server.joinChatroom('lobby');
                this.setState({selectedChatroom: lobby});
                this.refs.window.swapChatrooms(lobby);
                this.server.getChatrooms();
            }
        });
    }

    // Sets display modal to true, triggering a re-render
    // with the add-chatroom modal displayed
    addChatroomPrompt() {
        this.setState({displayModal: true});
    }

    // Updates chatroom name input value constantly
    updateNewChatroomName(evt) {
        this.setState({
            newChatroomName: evt.target.value
        });
    }

    // Updates chatroom topic input value constantly
    updateNewChatroomTopic(evt) {
        this.setState({
            newChatroomTopic: evt.target.value
        });
    }

    handlePrivateMessageListen(username, message) {
        if(message !== 'left the conversation') {
            this.setState({
                isSendingPrivateMessage : true,
                privateMessageTo: username,
                firstPrivateMessageRecieved: message
            });
        }
    }

    // Closes add chatroom modal and if user provided info,
    // a new chatroom is added to the list of chatrooms
    closeModalAndAdd() {
        this.setState({displayModal: false});
        if(this.state.newChatroomName !== '') {
            this.server.addChatroom( this.state.newChatroomName, this.state.newChatroomTopic, (didSucceed) => {
                if(didSucceed) {
                    this.server.getChatrooms();
                    this.server.listenToChatroomUpdates((chatRoomlist) => {
                        this.setState({chatRoomList: chatRoomlist});
                    });
                }
            });
        }
    }

    // On chatroom select, user parts the room he's in
    // and joins the new selected room
    // Then chatroom rendered by ChatroomWindow component
    // is changed to render a the new room
    selectChatroom (evt, chatroom) {
        var currentRoom = this.state.selectedChatroom.name;
        var newRoom = chatroom.name;
        this.server.partChatroom(currentRoom);
        this.server.joinChatroom(newRoom);
        this.setState({selectedChatroom: chatroom});
        this.refs.window.swapChatrooms(chatroom);
    }

    // Triggers display of private chatroom modal between two users
    sendPrivateMessage (user) {
        this.setState({
            isSendingPrivateMessage: true,
            privateMessageTo: user
        });
    }

    // Closes private chatroom modal between two users
    closePrivateChatroom() {
        this.setState({
            isSendingPrivateMessage: false,
            privateMessageTo: null,
            firstPrivateMessageRecieved: ''
        });
        // this.setState({privateMessageTo: null});
    }

    // JSX for main lobby body including banner, list of chatrooms,
    // and the chatroom window displaying selected chatroom
    getMainLobbyBody() {
        if(this.state.selectedChatroom) {
            var currentUser = this.props.location.currentUser && this.props.location.currentUser.referrer;
            return (
                <div>
                    <Banner key='banner'/>
                    <h2 id='lobbyGreeting'>Hello, {currentUser}!</h2>
                    <div className='LobbyBody'>
                        <div className='chatroomListDisplay'>
                            <ListViewChatRooms key='chatrooms' value={this.state.userList} addchatroom={() => this.addChatroomPrompt()}>
                                {this.state.chatRoomList.map((chatroom, i) => ( <ListItemChatRooms key={i} onClick={evt => this.selectChatroom(evt, chatroom)} currentUser={currentUser} value={chatroom} info={chatroom}/>))}
                            </ListViewChatRooms>
                        </div>
                        <ChatRoomWindow sendPrivateMessage={this.sendPrivateMessage} key='window' ref='window' currentUser={currentUser} chatroom={this.state.selectedChatroom}/>
                    </div>
                </div>
            );
        }
        // Error message for when something has gone wrong
        // (or page is briefly loading)
        return (
            <div>
                <h1>Our pigeon lost your messages in transit!</h1>
                <h3>To help guide our pigeons, check:</h3>
                <ul>
                    <li>Are you even logged in, bruf?</li>
                    <li>Is your server running, bruf?</li>
                    <li>Is your computer on, bruf?</li>
                </ul>
            </div>
        );
    }

    // JSX for add chatroom modal
    getAddChatroomModal() {
        return (
            <Modal className='addChatroomPrompt' isOpen={true} ariaHideApp={false} >
                <div className='row'>
                    <h1>Add Chatroom</h1>
                    <div className='col-md-10'>
                        <p>Chatroom Name:</p>
                        <input onChange={evt => this.updateNewChatroomName(evt)} type='text' className='form-control' placeholder='the Jedi Council'></input>
                    </div>
                    <div className='col-md-10'>
                        <p>Chatroom Topic:</p>
                        <input onChange={evt => this.updateNewChatroomTopic(evt)} type='text'className='form-control'placeholder='The High Ground'></input>
                    </div>
                </div>
                <div className='row'>
                    <button onClick={() => this.closeModalAndAdd()}>Create</button>
                </div>
            </Modal>
        );
    }

    // Renders view
    // If add chatroom modal should be displayed it does
    // Otherwise just the main body is displayed
    render() {

        if(this.state.displayModal) {
            return (
                // Renders modal to create new chatroom
                // If that modal is required
                <div>
                    {this.getMainLobbyBody()}
                    {this.getAddChatroomModal()}
                </div>
            );
        } else if(this.state.isSendingPrivateMessage) {
            // Renders private chatroom as modal when
            // user is sending private messages
            return (
                <div>
                    {this.getMainLobbyBody()}
                    <PrivateMessageModal firstMessage={this.state.firstPrivateMessageRecieved} key='privatemessage' closePrivateChatroom={this.closePrivateChatroom} toUser={this.state.privateMessageTo}/>
                </div>
            );
        }

        // If no modal should be displayed,
        // the core view is displayed
        return this.getMainLobbyBody();
    };
}

// Variables lobby needs from parent context
Lobby.contextTypes = {
    
    serverAPI: propTypes.shape({
        server: propTypes.component
    })
};

// Documentation via propTypes
// Required 'parameter' props for Lobby to function
// Same as it's contextType declaration declared in parent component
Lobby.propTypes = {
    serverAPI: propTypes.shape({
        server: propTypes.component
    })
}

export default Lobby;