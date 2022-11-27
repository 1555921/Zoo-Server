import './load-env.js';
import { WebSocketServer } from "ws";
import chalk from 'chalk';
import cron from 'node-cron';
import app from './src/app.js';
import IOEVENTS from './public/io-events.js';
import http from 'http';
import { Server } from "socket.io";
import express from 'express';

const PORT = process.env.PORT;
app.use(express.static('public'));

const socketServer = new WebSocketServer({ port: 3000 });


app.listen(PORT, (err) => {

    if (err) {
        //TODO: Logger
        process.exit(1);
    }
    //TODO: Logger
    console.log(chalk.blue(`Server listening on port: ${PORT}`));
});

cron.schedule('*/5 * * * *', async () => {
    let explorateurs = await Explorateur.find();
    console.log(explorateurs);
    explorateurs.forEach(explorateur => {
        explorateur.inox = explorateur.inox + 5;
        Explorateur.findByIdAndUpdate(explorateur.id, { inox: explorateur.inox }, function (err, docs) {
            if (err) {
                console.log(err);
            } else {
                console.log('Updated User : ', docs);
            }
        });
       
    });
});
cron.schedule('0 * * * *', async () => {
    let explorateurs = await Explorateur.find();
    explorateurs.forEach(explorateur => {
        try {
            explorateur.elements.forEach(element => {
                
                    element.quantity = element.quantity + Math.floor(Math.random() * 3 + 1);
            });
            explorateur.save();
        } catch (err) {
            console.log(err);
        }
    });
});

//Connexion des clients
socketServer.on("connection",  (socket) => {
    console.log('connecté');
    socket.on("message", (data) => {
        const packet = JSON.parse(data);
    
        switch (packet.type) {
          case "hello from client":
            console.log("message");
            break;
        }
      });
    socket.send(JSON.stringify({
        type: "hello from server",
        content: [ 1, "2" ]
      }));
    //Réception d'un nouveau message
    socket.on(IOEVENTS.SEND_MESSAGE, message => {
        console.log(message);
        const messageToBroadcast = {
            socketId: socket.id,
            text: message.text,
            timestamp: dayjs(),
            avatar: socket.data.identity.avatar,
            name: socket.data.identity.name
        };
        socketServer.emit(IOEVENTS.NEW_MESSAGE, messageToBroadcast);
    });
    socket.on("hello from client", (...args) => {
        console.log('mnessage');
      });
    //Réception d'une demande de changement de nom
    socket.on(IOEVENTS.CHANGE_USERNAME, identity => {
        socket.data.identity.name = identity.name;
        //TODO: CHANGER AVATAR?
        sendUserIdentities();
    });

    socket.on(IOEVENTS.DISCONNECT, reason => {
        console.log(reason);
        sendUserIdentities();
    });
});

async function newUser(socket) {
    const newUser = {
        id: socket.id,
        name: 'Anonyme'
        
    };

    socket.data.identity = newUser;
    await sendUserIdentities();
}

async function sendUserIdentities() {
    const sockets = await io.fetchSockets();
    const users = sockets.map(s => s.data.identity);

    socketServer.emit(IOEVENTS.LIST_USERS, users);
}


