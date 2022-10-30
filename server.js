import './load-env.js';
import chalk from 'chalk';
import app from './src/app.js';
import http from 'http';
import express from 'express';

//import { Server } from 'socket.io';
import IOEVENTS from './public/io-events.js';

const PORT = process.env.PORT;
//const httpServer = http.createServer(app);
//const socketServer = new Server(httpServer);

app.listen(PORT, (err) => {

    if (err) {
        //TODO: Logger
        process.exit(1);
    }

    console.log(`Loading environment for ${process.env.NODE_ENV}`);

    //TODO: Logger
    console.log(chalk.blue(`Server listening on port: ${PORT}`));
});

app.on(IOEVENTS.CONNECTION, async (socket) => {
    console.log(socket.id);

    await newUser(socket);
    

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
        app.emit(IOEVENTS.NEW_MESSAGE, messageToBroadcast);
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
        name: 'Anonyme',
    };

    socket.data.identity = newUser;
    await sendUserIdentities();

}


async function sendUserIdentities() {

    const sockets = await app.fetchSockets();
    const users = sockets.map(s => s.data.identity);

    app.emit(IOEVENTS.LIST_USERS, users);
    
}