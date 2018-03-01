import React from 'react';
import propTypes from 'prop-types';
import Modal from 'react-modal';

// Renders the modal of a private conversation between two users
// They can send messages which the modal 'stores' for each session
// These messages however are lost when modal is closed
class PrivateMessageModal extends React.Component {

    constructor(props, ctx) {

        super(props, ctx);

        this.state = {
            toUser : this.props.toUser,
            chatHistory: [],
            isMounted: false
        }
        this.server = this.context.serverAPI.server;
        this.closePrivateChatroom = this.props.closePrivateChatroom;
    }

    // Initiate listen to private message
    // Beware of is mounted state,
    // as these listen function can execute continously
    // even when module has been unmounted
    componentDidMount() {
        this.state.isMounted = true;
        this.server.listenToPrivateMessage((username, message) => {
            this.handlePrivateMessageListen(username, message);
        });
        // Catch the first message which triggered the private conversation modal
        // If the first message exists, this indicates that the conversation
        // was initiated by the other person, hence we display proper feedback for this
        if(this.props.firstMessage !== '') {
            var firstEntry = this.state.toUser + ' initiated a private conversation with you';
            var historyEntry = this.state.toUser + ': ' + this.props.firstMessage;
            var newChatHistory = this.state.chatHistory;
            newChatHistory.push(firstEntry);
            newChatHistory.push(historyEntry);
            this.setState({chatHistory: newChatHistory});
        // If the first message does not exist, this indicates that the conversation
        // was initiated by the current person, hence we display proper feedback for this
        } else {
            var firstEntry = 'You initiated a private conversation with ' + this.state.toUser;
            var newChatHistory = this.state.chatHistory;
            newChatHistory.push(firstEntry);
            this.setState({chatHistory: newChatHistory});
        }
    }
    
    // Listen to private message from the other person
    // Only displayed in the private conversation modal though
    // If it's from the person we're having conversation with
    // Updates chat history when message is received
    handlePrivateMessageListen(username, message) {
        if(this.state.isMounted) {
            if(username == this.state.toUser) {
                var historyEntry = username + ': ' + message;
                var newChatHistory = this.state.chatHistory;
                newChatHistory.push(historyEntry);
                this.setState({chatHistory: newChatHistory});
                this.refs.chatWindow.scrollTop = this.refs.chatWindow.scrollHeight;
            }
        }
    }
    
    // isMounted is set to false so that listening function
    // Can stop running now that component has unmounted
    componentWillUnmount() {
        this.server.sendPrivateMessage(this.state.toUser, 'left the conversation', (sendOK) => {
            if(sendOK) {
                this.state.isMounted = false;
            }
        });
        this.state.isMounted = false;
    }

    // Sends message to the other user
    // updates chat history accordingly
    sendMessage() {
        if(this.state.isMounted) {
            this.server.sendPrivateMessage(this.state.toUser, this.refs.messageBox.value, (sendOK) => {
                if(sendOK) {
                    var historyEntry = 'You: ' + this.refs.messageBox.value;
                    var newChatHistory = this.state.chatHistory;
                    newChatHistory.push(historyEntry);
                    this.setState({chatHistory: newChatHistory});
                    this.refs.messageBox.value = '';
                    this.refs.chatWindow.scrollTop = this.refs.chatWindow.scrollHeight;
                }
            });
        }
    }

    // Renders the modal
    render() {
        if(!this.state.toUser) {
            return <div/>
        }

        return (
            <Modal className='privateMessageChat' isOpen={true} ariaHideApp={false} >
                <div className='row'>
                    <h2>Private Conversation with {this.state.toUser}</h2>
                    <div className='row messagesPrivateChat' ref='chatWindow'>
                        <ul id="privateMessages">
                            {this.state.chatHistory.map((previousMessage, i) => (<li key={i}> {previousMessage} </li>))}
                        </ul>
                    </div>
                </div>
                <div className='row'>
                    <span className='col-md-9'>
                        <input className='form-control' type='text' ref='messageBox' placeholder='send your secret message...'/>
                    </span>
                    <button id='sendButton' className='col-md-3' onClick={() => this.sendMessage()}>Send</button>
                </div>
                <div className='row'>
                    <button id='exitButton' onClick={() => this.closePrivateChatroom()}>Exit Private Conversation</button>
                </div>
                <p>NOTE: All messages in this conversation will be lost when this window is exited</p>
            </Modal>
        );
    }
};

// Obtain server and current user
PrivateMessageModal.contextTypes = {
    
    serverAPI: propTypes.shape({
        server: propTypes.component
    }),

    currentUser: propTypes.shape({
        userName: propTypes.string
    }),
};

// Documentation via propTypes
// Required 'parameter' props for PrivateMessageModal to function
PrivateMessageModal.propTypes = {
    firstMessage: propTypes.string.isRequired,
    closePrivateChatroom: propTypes.func.isRequired,
    toUser: propTypes.string.isRequired,

    // From context types (parent component/s)
    serverAPI: propTypes.shape({
        server: propTypes.component
    }),

    currentUser: propTypes.shape({
        userName: propTypes.string
    }),
}

export default PrivateMessageModal;