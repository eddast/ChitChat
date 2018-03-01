import React from 'react';

// Renders the list in active user list view along with heading
const ListViewUsers = ({ children }) => {
    return (
        <div className='usersActiveList'>
            <p id='ListViewUsersHeading'>Users in chat</p>
            <ul className='listViewUsers'>{children}</ul>
        </div>
    );
};

export default ListViewUsers;