# ChitChat: Your Gateway For a Better IM Experience
ChitChat is a small IM-messaging client developed for the course T-427-WEPO Web Programming by Darri Valgarðsson, Edda Steinunn Rúnarsdóttir and Sigurður Sturla Bjarnason.

## Installation and running ChitChat
The ChitChat client depends entirely on the server 'chatserver.js' that relies on a web socket. Note that the chatserver ChitChat uses is slightly modified from the original copy of 'chatserver.js' in order to enhance functionality in ChitChat, f.x. to get real time functionality in all entries. Hence, the modified copy of it is included in the project directory. This server provides practically any logic that involves keeping track of chatrooms, messages, users, etc. Therefore, in order to obtain ChitChat's functionality, this server must be running. If the server is not running when the project is run, the console outputs an error denoting that it cannot connect to the server and user cannot log in nor perform any actions. To run this server, one must have node installed; either node can be downloaded directly from https://nodejs.org/en/download/ or installed in the terminal on a linux based OS. The server is run from terminal/bash via node. To run it, make sure that one has navigated to the correct folder, then run the chatserver via node. See example terminal command below:

```bash
username$ pwd
~/.../Assignment3-darriv15_eddasr15_sigurdursb16/chatserver - socket
username$ node chatserver.js
```
In addition to this, all external dependencies for the project must be installed for it to work. This is achieved by using npm. npm can be downloaded from https://www.npmjs.com/get-npm or installed in the terminal on a linux based OS or installed via node. npm install automatically installs dependencies required for the project as specified by the package.json file. npm install must be done for the client itself, not to the server as above. To install these dependencies, make sure that one has navigated to the correct folder, then run this command. See example terminal command below: 

```bash
username$ pwd
~/.../Assignment3-darriv15_eddasr15_sigurdursb16/ChitChat
username$ npm install
```
Then finally, once the server is running and the dependencies have been installed, the project can be run as it's meant to. To run the program, one can use npm start. On npm start, the project will be hosted at https://localhost:9000. npm start must be run for the client, not server just as npm install and therefore needs to be done for the .../ChitChat folder in folder structure. See example terminal command below:

```bash
username$ pwd
~/.../Assignment3-darriv15_eddasr15_sigurdursb16/ChitChat
username$ npm start
```

## How does ChitChat work?
ChitChat provides two pages/views, the initial page (the login page) and the Lobby page. The initial page provides minimal functionality but prompts user for a username which he or she must provide to proceed to the Lobby page. The Lobby page on the other hand contains a list of active chatrooms, the chatroom to which user is joined and corresponding functionality.

### The Login Page: Specifying a Nickname
When prompted for a nickname in the login page, user must input one to proceed to the Lobby page. This nickname must be valid (f.x. not too long) and nickname must not be in use by another user currently using the client. The following shows an example of a successful login in the system - i.e. nickname is both valid and available. The user is immediately directed to the Lobby once he or she presses the 'join in' button:

![alt text](https://image.ibb.co/moeSoH/Login_Success.png "Login Succeeds")

The following shows an example of an invalid nickname, that is, user has attempted to login with a username that is in use by another user in the system:

![alt text](https://image.ibb.co/mnt92c/Login_Fail.png "Login Fails")

### The Lobby
The Lobby is what we call the view that contains all functionality related to joining and parting chatrooms, creating chatrooms, keeping track of users in chatrooms, chatroom interactions and user interactions. The Lobby cannot be accessed unless user is logged in, i.e. has provided a nickname. If user tries to access the Lobby without being logged in, the server 'chatserver.js' terminates and an error message is displayed instead of the Lobby view. The Lobby is composed of a greeting, stating the user's nickname at top, then displays a list of active chatrooms to the left and then displayes the chatroom to which the user is currently joined in the middle along with it's messages and users in chat.

#### Veiwing Active Rooms
Active rooms can be viewed to left of the Lobby and any active chatroom is visible at all times. The list is scrollable when large enough and the chatrooms and their information update in real time so user is always viewing this list in the state it currently is in. See below:

![alt text](https://image.ibb.co/i1BhoH/Active_Chatrooms.png "Active Chatrooms Bar")

#### Creating Chatrooms
To create a new chatroom, i.e. add it to the list of active chatrooms in real-time with all corresponding functionality, user clicks the plus symbol beside the active chatroom list. User is then presented with a module over the Lobby page, prompting him or her to insert name and topic of a chatroom. Once user has inserted all information he or she clicks "create" button in module which will update all user's chatroom list in real time, adding the new chatroom. It can then immediately be joined and used for communications. Invalid creations of chatrooms or creating chatrooms identical to other chatrooms will have no affect. An example of an invalid chatroom creation is not inserting a name (topic does not need to be inserted). The following figure illustrates the process of a user creating a chatroom in the system:

![alt text](https://image.ibb.co/iOHQax/Create_Chatroom.png "Creating New Chatroom")

#### Joining and Parting a Chatroom
Our version of implementation of joining and parting a chatroom is quite implicit; joining happens whenever user clicks on an active chatroom in list, resulting in user parting the previous chatroom he or she was joined to. Once chatroom is joined, the chatroom along with all it's messages and active users is displayed in the center of the page. User is essentially always joined to exactly one chatroom. When user logs in, he or she is automatically joined with the lobby chatroom since it's a "constant" chatroom - i.e. without any admin/op meaning it cannot be deleted and a user cannot be kicked from it nor banned - and therefore suits well for a default chatroom. The following demonstrates when a user changes chatrooms, meaning user parts with a chatroom and joins a new one:

![alt text](https://image.ibb.co/eRd92c/Join_Part.png "Joining and Parting a Chatroom")

Here, the user Yoda switches chatrooms - parts with the lobby chatroom and joins the Jedi Council room. Once Yoda has parted with the lobby chatroom and joined the Jedi Council, he has left the lobby chatroom, thus is not displayed in the user list of the lobby. The user list is updated in real time. Here's what the lobby chatroom looks like to other users in the lobby chatroom after Yoda has left:


![alt text](https://image.ibb.co/gN9tTH/Join_Part_Recipient.png "Chatroom After User Parts with it")

The user list is also updated in real time when user enters a room, meaning that the user list any user in a chatroom sees is always the current user list of a chatroom.

### The Lobby: The Chatroom Component
The chatroom is perhaps the most complex part of the Lobby page, containing the it's most important functionality and logic. The chatroom essentially displays information on user's joined chatroom, it's message history and list of all users joined to that room.

#### Sending, Viewing and Recieving of Messages in Chatroom
All messages that are sent and recieved are done so in real time. Therefore the message history displayed each time in a chatroom is always the current state of the message history of that chatroom. Once user joins a chatroom, the chatroom's entire message history is displayed, whether user was joined to that chatroom at the time the message was sent or not. The message history displayed is scrollable, and when user sends a message it automatically scrolls down to it. User can always send to a chatroom he or she is joined to by inputting message in a text box and clicking the 'send' button to the right of it. Immediately messages are shown to the sender and recievers. ChitChat makes a distiction between whether messages are from the current user (myself) in which case messages are displayed to the right of the chatroom and are yellow, or other users in which case messages are displayed to the left of the chatroom and are purple. Below is an example of when a users sends a message to a chatroom:

![alt text](https://image.ibb.co/neXE2c/send.png "Messages Sent to Chatroom")

#### Private Messages to Other Users from Chatroom User List
In addition to broadcasting messages to a chatroom, user can send a private message to another user. In a chatroom, the list of users is displayed for all users in chatroom and the list is scrollable when many users enough are in chatroom. The users in the user list have options, denoted as three dots to the right of a user list item in the active users list. Once clicked, all available options appear. The options are only two for regular users, that is to send a private message and to close options, but are more for admins/OPs which are described in a section below. Below image illustrates how to display these options for a user:

![alt text](https://image.ibb.co/cKABFx/Private_Convo1.png "Options for User Displayed")

When the option 'private message' is clicked (the envelope icon), the current user initiates a private conversation with that user via a private conversation module. Once a message is sent to that conversation module, the reciever is immediately presented with such a module, displaying that message from the sender. The module displays whether messages are from 'you' (current user) or from the user whom the current user is communicating with. The module stores the private messages temporarily (are lost when users exit the module) and explicitly notifies who started the conversation and when either party leaves a conversation. Below illustrates how the private conversation module works: 

![alt text](https://image.ibb.co/eGgwhc/Private_Convo2.png "Example Private Conversation")

#### Kicking or Banning a User from Chatroom
A user can be kicked from a chatroom by an admin/OP, that is the user who created the chatroom. When user is kicked from a chatroom it means that the user is forced to part with that chatroom but still can re-join it if he or she pleases. In our implementation of a chatroom kick, user automatically joines the lobby chatroom when kicked since as described before, it is an optimal default chatroom. User is explicitly informed when he or she is kicked from a chatroom. The admin/OP of a chatroom kicks a user by clicking the 'kick' option icon visible in user list options (an option only visible to OPs). See below figure for an example of a kick. Here, Yoda is admin/OP of the chatroom and kicks Anakin Out:

![alt text](https://image.ibb.co/bVYWFx/Kick.png "OP Kicks User from Chatroom")

A user can also be banned from a chatroom by an admin/OP. When user is banned from a chatroom it means that the user is forced to part with that chatroom and cannot re-join it it. In our implementation of a chatroom ban, user automatically joines the lobby chatroom when banned since as described before, it is an optimal default chatroom. User is explicitly informed when he or she is banned from a chatroom and cannot join a chatroom (can't click it from the active chatroom bar) but can still see it, with a message reminding user he or she has been banned to join this chatroom. The admin/OP of a chatroom bans a user by clicking the 'ban' option icon visible in user list options (an option only visible to OPs). See below figure for an example of a ban. Here, Yoda is admin/OP of the chatroom and bans Anakin from ever joining his chatroom again:


![alt text](https://image.ibb.co/jvvYTH/Ban.png "OP Bans User from Chatroom")

## Known Limitations
### Functionality
When a user is currently in a private conversation with another user, neither users can be private messaged by a third party. This is because once in a private converstation, both users in that conversation focus only on messages from each other. Due to lack of time and reluctancy to change 'chatserver.js' more than needed, this was not fixed before the due date of the assignment.
### Testing
We did not feel that the 'tools' we were given by lectures and lab classes were in any way adequate for us to actually be able to test a project on the level of our project. We did not have enough examples of Jest testing nor knowledge of the matter, even after watching the one lecture that covered this multiple times and even after hours and hours of Google-ing. We tried our best but we could not get anywhere with the tests, so only the dummy component InitialPage.js and the small component NicknameChoice.js are fully tested. Also, we could not surpress an annoying error that npm test yielded which involved that loading .svg images was not possible, despite having included an svg-loader in our webpack and despite that it works fine on npm start.

