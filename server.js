import './load-env.js';
import chalk from 'chalk';
import cron from 'node-cron';
import app from './src/app.js';
import http from 'http';
import express from 'express';
import dayjs from 'dayjs';
import Explorateur from "./src/models/explorateur.model.js";

import { Server } from 'socket.io';
import IOEVENTS from './public/io-events.js';
import { isObjectIdOrHexString } from 'mongoose';

const PORT = process.env.PORT;
const httpServer = http.createServer(app);
const socketServer = new Server(httpServer);

app.use(express.static('public'));
app.use(express.static('www'));

httpServer.listen(PORT, (err) => {

    if (err) {
        //TODO: Logger
        process.exit(1);
    }

    console.log(`Loading environment for ${process.env.NODE_ENV}`);

    //TODO: Logger
    console.log(chalk.blue(`Server listening on port: ${PORT}`));

});


cron.schedule('*/5 * * * *', async() =>{
    let explorateurs = await Explorateur.find().populate('creatures');
    console.log(explorateurs);
    explorateurs.forEach(explorateur => {
        explorateur.inox = explorateur.inox + 5;
        Explorateur.findByIdAndUpdate(explorateur.id, {inox: explorateur.inox},
            function (err, docs) {
if (err){
console.log(err)
}
else{
console.log("Updated User : ", docs);
}});
        /*console.log("KEKEKEKEKEK");
        console.log(explorateur._id.toString());
        console.log(explorateur.id);
        console.log(explorateur);
        console.log(`${explorateur.nom}`);*/
    });
});
cron.schedule('0 * * * *', async() =>{ // mettre une heure
    let explorateurs = await Explorateur.find().populate('creatures');
    let elements = ["kek", "coom", "homos", "roche", "wtf", "omegalul"];
    let threeElements = [];
    let element = "";
    while(threeElements.length < 3)
    {
        //console.log("help me");
        element = elements[Math.floor(Math.random()*elements.length)];
        if(!threeElements.includes(element))
        {
            console.log("first while : " + element);
            threeElements.push(element);
        }
        console.log("the tree elements to add: " + threeElements);
    }
    //console.log(explorateurs);
    explorateurs.forEach(explorateur => {
        //console.log("TOP KEKEK");
        try
        {
        if(explorateur.elements.length > 0)
        {
            explorateur.elements.forEach(element => {
                if(threeElements.includes(element.element))
                {
                    element.quantity = element.quantity + Math.floor(Math.random()*3 + 1);
                    console.log("element already exists : " + element);
                    //threeElements.splice(threeElements.indexOf(element.element));
                    threeElements[(threeElements.indexOf(element.element))] = "";
                    console.log("elements after removal: " + threeElements);
                }
            });
            console.log("new elements left to add: " + threeElements);

        }
        if(threeElements.length > 0)
        {
        threeElements.forEach(element => {
            console.log("new element to add : " + element);
            if(element != "")
            {
            explorateur.elements.push({ element: element, quantity : Math.floor(Math.random()*3 + 1)});
            }
        });
        }
        //explorateur.elements = [{ element: "kek", quantity: 15}];
        //console.log(explorateur.elements);
        //explorateur.elements.push({ element: "kek", quantity: 15 });
        //explorateur.elements.push({ element: "homos", quantity: 10 });
        //explorateur.elements.push({ element: "coom", quantity: 22 });
        }
        catch(err)
        {
            console.log(err);
        }
        //console.log(explorateur.elements);
        //console.log("TOP KEKEKEK");
        Explorateur.findByIdAndUpdate(explorateur.id, {elements : explorateur.elements},
            function (err, docs) {
if (err){
console.log(err)
}
else{
console.log("Updated User : ", docs);
}});
        /*console.log("KEKEKEKEKEK");
        console.log(explorateur._id.toString());
        console.log(explorateur.id);
        console.log(explorateur);
        console.log(`${explorateur.nom}`);*/
    });
});

//Connexion des clients

socketServer.on(IOEVENTS.CONNECTION, async (socket) => {
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
        socketServer.emit(IOEVENTS.NEW_MESSAGE, messageToBroadcast);
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
        avatar: randomAvatarImage()
    };

    socket.data.identity = newUser;
    await sendUserIdentities();

}


async function sendUserIdentities() {

    const sockets = await socketServer.fetchSockets();
    const users = sockets.map(s => s.data.identity);

    socketServer.emit(IOEVENTS.LIST_USERS, users);
    
}

function randomAvatarImage() {
    const avatarNumber = Math.floor(Math.random() * 8 + 1);
    return `./images/avatar${avatarNumber}.png`;
}