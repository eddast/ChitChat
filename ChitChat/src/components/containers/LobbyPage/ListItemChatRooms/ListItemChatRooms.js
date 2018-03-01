import React from 'react';
import FontAwesome from 'react-fontawesome';
import propTypes from 'prop-types';

// Renders a cell in chatroom list
// Each cell has an on click event in parent
// Displays name and topic of chatroom
const ListItemChatRooms = ({ currentUser, onClick, info }) => {

    // Props necessary for ListItemChatRooms to function
    propTypes: {
        currentUser: propTypes.string.isRequired
        onClick: propTypes.func.isRequired
        info: propTypes.shape({
            banned: propTypes.array,
            name: propTypes.string,
            topic: propTypes.string
        })
    }

    const { banned, name, topic } = info;
    if(banned[currentUser] === undefined) {
        return (
            <li onClick={onClick} className='chatroomListItem'>
                <FontAwesome className='col-' id='chatroomIcon' aria-hidden='false' name='comments'/>
                <div className='col-'>
                    <p id='chatroomName'>{name}</p>
                    <p id='chatroomTopic'>{topic}</p>
                </div>
            </li>
        );
    }
    return (
        <li className='chatroomListItemBanned'>
            <FontAwesome className='col-' id='chatroomIcon' aria-hidden='false' name='comments'/>
            <div className='col-'>
                <p id='chatroomName'>{name}</p>
                <p id='chatroomTopic'>{topic}</p>
                <p id='youreBanned'>YOU HAVE BEEN BANNED FROM ENTERING HERE</p>
            </div>
        </li>
    );
};

export default ListItemChatRooms;