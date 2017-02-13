import React from 'react';

import {
  generateDisplayTimestamp,
} from '../lib/posts';

import PostTitle from '../components/post-title/post-title.component';

const TITLE = 'Socket.IO';
const TIMESTAMP = '20130526';
const DISPLAY_TIMESTAMP = generateDisplayTimestamp(TIMESTAMP);

export const config = {
  image: 'https://s3.amazonaws.com/dylants-blog/public/images/20130526/socket-io-logo.png',
  title: TITLE,
  timestamp: TIMESTAMP,
  displayTimestamp: DISPLAY_TIMESTAMP,
};

export default function Post() {
  return (
    <section className="post">
      <PostTitle title={TITLE} timestamp={DISPLAY_TIMESTAMP} />

      <p>
      Moving logic from the server to the client is becoming more and more common.  But as more moves, the difficulty of keeping everything in sync increases.  Providing REST endpoints on the server side for the clients to consume is a great pattern, however that's more of a <em>pull</em> model than a <em>push</em> model.  If your data is changing but your clients don't know about it, the users are seeing stale information.  Keeping the data updated real-time (or as close to real-time as possible) on the client is then the goal.  And although there are many ways to solve this problem, <a href="http://socket.io/">Socket.IO</a> wraps them up in a nice candy shell while providing a uniform API to use on both the client and the server.
      </p>

      <h2>An Overview of Socket.IO</h2>

      <p>
      Socket.IO, at a high level, allows you to send messages between the client and the server, in most cases using the <a href="http://en.wikipedia.org/wiki/WebSocket">WebSocket protocol</a>.  There are some fallbacks if the protocol is not supported by the browser (or hosting server), but all of that is handled without the user needing to know about the underlying details.  The end result is a simple API that allows you to send messages back and forth simulating real-time communication between all of your clients and server(s).
      </p>

      <p>
      In addition to sending messages, you are also given access to useful features available within the Socket.IO platform.  Features such as being notified on the server if a client connects or disconnects, the ability to broadcast messages to all clients, or in contrast, limiting the scope of your messages to a namespace, are all available from the library.  More information on all of these can be found within the <a href="http://socket.io/">Socket.IO documentation</a>.
      </p>

      <h2>Tic-Tac-Toe: An Example use of Socket.IO</h2>

      <p>
      For me, like most other things, I wanted to develop something with Socket.IO to better understand how it works.  There's a ton of chat programs out there that use Socket.IO, so I chose instead to focus on something different, and created a tic-tac-toe game.  The thinking was that two players would use different devices to play the game, and their view of the game board would update in real-time.  In the tic-tac-toe game, the server places players into games two-by-two (each player is then a client), and their interactions with the game board are sent to the server who controls the game logic for each client.  So the logic on the client can be very simple, just send information to the server on what the user has done, and respond to messages from the server which trigger actions (mark a space with an "X", end the game, etc). <a href="https://github.com/dylants/tic-tac-toe">The full source of the game can be found on GitHub</a>.
      </p>

      <h3>Connecting Client and Server</h3>

      <p>
      To begin working with Socket.IO, you'll need to configure your Node.js server to listen for incoming messages from the client.  This is done by importing the Socket.IO library into your controller code, and from there listen for incoming connections:
      </p>

      <pre className="prettyprint">
{`var socketio = require("socket.io");

...

io = socketio.listen(server);
io.sockets.on("connection", function(socket) {

...
`}
      </pre>

      <p>
      On the client, you'll need to include the Socket.IO client library which is automatically hosted once you utilize Socket.IO on the server (this was a bit confusing to me when I initially looked into it &mdash; once you start your Node server, it will be hosted).  The default location of the client library is "/socket.io/socket.io.js".  I include that in my RequireJS main configuration file on the client, and passed it as a dependency into the code.  Within your client code you'll need to create a connection to your server (without any arguments to the connect() function, the Socket.IO library assumes localhost):
      </p>

      <pre className="prettyprint">
{`var socket = socketio.connect();
`}
      </pre>

      <h4>Calling connect() on the Client</h4>

      <p>
      One thing to note is that you can call "connect()" as many times as you'd like on the client to get a reference to the socket object.  The first time the connect() function is called, Socket.IO will create a connection (which calls the server, invoking the "connection" code).  Every subsequent time, Socket.IO will simply retrieve that connection and return the socket object.  In this way you're able to use the same "socket" from within different areas of your code without having to store it globally.
      </p>

      <h3>Sending Messages from the Client to the Server</h3>

      <p>
      Once the connections are established, you can easily send messages between the client and the server (or vice-versa).  Let's first look at client to server communication.  On the client side, first retrieve the socket from a call to connect(), and then emit a message with an optional data element.  On the server side, from within the "connection" block, provide a function to handle processing the message.  In the tic-tac-toe example, a message is sent from the client to the server when a user clicks a space on the board.
      </p>

      <p>
      Client side code (the "clicked" message sends a data object which contains information on the space that the user clicked):
      </p>

      <pre className="prettyprint">
{`var socket = socketio.connect();
socket.emit("clicked", {spaceID: this.model.get("spaceID")});
`}
      </pre>

      <p>
      Server side code:
      </p>

      <pre className="prettyprint">
{`// called when a client clicks one of the spaces on the game board
socket.on("clicked", function(data) {
   ...
   // process the click action using the data.spaceID which contains
   // which space was clicked by the user
   ...
}
`}
      </pre>

      <h3>Sending Messages from the Server to the Client(s)</h3>

      <p>
      Sending a message from the server to your various clients is a little bit different.  If you only need to send a message to the client who originally connected (or sent a message), you can use the existing socket.  You can also broadcast a message to all clients <a href="http://socket.io/#how-to-use">as described in the Socket.IO documentation</a>.  However, in the case of the tic-tac-toe game, I needed to send a message solely to the set of clients that were playing in same game.  To do this, you can access a specific client's socket via the socket ID (each client who connects passes with it a unique ID).  During the initial placement of each client to a game, the server stores the "socket.id" in the game object:
      </p>

      <pre className="prettyprint">
{`game.player1.assignID(socket.id);
`}
      </pre>

      <p>
      Then, in circumstances when the server must send messages to just those two clients, it can retrieve the socket based on the socket.id and use it to send a message (in the code below, the server is sending a message "space_claimed" with data about which space was claimed and a symbol stating who claimed the space, X or O):
      </p>

      <pre className="prettyprint">
{`io.sockets.socket(game.player1.getID()).emit("space_claimed", {
  spaceID: data.spaceID,
  xo: game.currentPlayer.getXO()
});
io.sockets.socket(game.player2.getID()).emit("space_claimed", {
  spaceID: data.spaceID,
  xo: game.currentPlayer.getXO()
});
`}
      </pre>

      <p>
      Back on the client, the code processes these messages and marks the space as claimed:
      </p>

      <pre className="prettyprint">
{`socket.on("space_claimed", function(data) {
  var model = spaceModels[data.spaceID];
  model.set("owner", data.xo);
});
`}
      </pre>

      <h3>Handling Disconnects</h3>

      <p>
      Socket.IO also provides a simple API to handle when a client disconnects from the server.  In the tic-tac-toe game, if one player leaves the game, the other player should be notified.  The remaining player must then wait for a new player to arrive to play a new game.  This logic is written on the server side (from within the same "connection" block) by providing a "disconnect" event handler:
      </p>

      <pre className="prettyprint">
{`socket.on("disconnect", function() {
  var game;

  // get the game for this client
  game = ticTacToe.findGameForPlayerID(socket.id);

  // remove the player from the game
  game = ticTacToe.removePlayerFromGame(game, socket.id);

  // inform the other player (if exists) that the game has reset
  if (game.player1.isInUse()) {
    io.sockets.socket(game.player1.getID()).emit("waiting_for_player");
  }
  if (game.player2.isInUse()) {
    io.sockets.socket(game.player2.getID()).emit("waiting_for_player");
  }
});
`}
      </pre>

      <p>
      In the code above, the server is able to retrieve the game based on the socket.id of the disconnecting client, remove that player from the game, and inform the remaining player about the situation.  The client code handles this message by displaying information to the user on the device:
      </p>

      <pre className="prettyprint">
{`socket.on("waiting_for_player", function() {
  ...

  // reset the view, and notify the player they must wait
  // for another player to join

  ...
});
`}
      </pre>

      <h3>Connect/Disconnect Issues</h3>

      <p>
      If you have problems with disconnects (maybe you encounter some delays in Socket.IO registering that a client has connected or disconnected), you might try editing the configuration of Socket.IO itself. There are many configuration details to manage, and problems with disconnects can sometimes be fixed by modifying the close timeout property. The heartbeat timeout, heartbeat interval, and polling duration properties may also be useful in connection related issues. For more information, consult the <a href="https://github.com/LearnBoost/Socket.IO/wiki/Configuring-Socket.IO">Socket.IO configuration guide</a>.
      </p>

      <h2>In Summary</h2>

      <p>
      <a href="https://github.com/dylants/tic-tac-toe">The tic-tac-toe game I developed using Socket.IO</a> was a great introduction to the library and it's uses.  Socket.IO's simple interface allows for a variety of needs which become necessary in situations where clients and servers need real-time updates.  In addition, while some browsers (<a href="https://devcenter.heroku.com/articles/using-socket-io-with-node-js-on-heroku">and some application servers</a>) do not fully support the WebSocket protocol, Socket.IO provides fallbacks to work around those deficiencies.  But probably the best part of Socket.IO is how well it fits into a Node.js backend/Javascript frontend application.  It requires only a few lines of code and allows you to focus on the problem you're trying to solve, rather than the protocols or transport you're using to solve it.
      </p>

      <p>
      I really enjoyed learning about Socket.IO, and would recommend playing around with it, if you haven't yet had the opportunity to do so.
      </p>

    </section>
  );
}
