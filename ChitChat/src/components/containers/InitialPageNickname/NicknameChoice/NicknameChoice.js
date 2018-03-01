import React from 'react';
import propTypes from 'prop-types';

// Class containing prompt for user nickname and logic
// Redirects user to chatroom selection when user
// has provided a valid nickname to participate
class NicknameChoice extends React.Component {

    constructor(props, ctx) {
        super(props, ctx);
        this.state = {
            inputValue: '',
            nicknameAvailable: false,
        };
        this.server = this.context.serverAPI.server;
        this.redirect = this.context.routeTools.redirect;
    }

    // Constantly update input value as user nickname
    updateInputValue(evt) {
        this.setState({
            inputValue: evt.target.value
        });
    }
    
    // Calls to API to see if setting nickname for user was sucessful
    // If so, redirects view to the chatroom selection page
    joinChatroomClick () {
        let isAvailable = this.server.setNickname(this.state.inputValue);
        isAvailable.then((nicknameIsAvailable) => {
            if(nicknameIsAvailable) {
                this.setState({nicknameAvailable: true});
            } else {
                alert('Sorry, nickname is either taken or invalid, please try another nickname');
            }
        });
    };

    render() {
        if(this.state.nicknameAvailable) {
            return <this.redirect to={{
                pathname: '/lobby',
                currentUser: { referrer: this.state.inputValue }
            }} />
        }
        return (
            <div>
                <div className='nicknameInput'>
                    <p className='nicknamePrompt'>Enter nickname:</p>
                    <div className='row'>
                        <span className='inputNickname'>
                            <input type='text' value={this.state.inputValue} onChange={evt => this.updateInputValue(evt)} className='nicknameInputTextField' placeholder='nickname'></input>
                        </span>
                    </div>
                    <span className='row nicknameButtonDiv'>
                        <button className='nicknameInputButton' onClick={evt => this.joinChatroomClick(evt)}>JOIN IN!</button>
                    </span>
                </div>
            </div>
        );
    };
};

// Needs redirect component and server component
// from parent context
NicknameChoice.contextTypes = {

    routeTools: propTypes.shape({
        redirect: propTypes.component,
    }),
    
    serverAPI: propTypes.shape({
        server: propTypes.component
    }),
};

// Documentation via PropTypes
// Required 'parameter' props for ListItemUsers to function
// Same as it's contextType declaration declared in parent component
NicknameChoice.propTypes = {
    routeTools: propTypes.shape({
        redirect: propTypes.component,
    }),
    
    serverAPI: propTypes.shape({
        server: propTypes.component
    }),
}

export default NicknameChoice;