import './load-env.js';
import { WebSocketServer } from 'ws';
import chalk from 'chalk';
import cron from 'node-cron';
import app from './src/app.js';
import url from 'url';
import express from 'express';
import Explorateur from './src/models/explorateur.model.js'
const clients = new Map();
const PORT = process.env.PORT;
app.use(express.static('public'));

const socketServer = new WebSocketServer({ port: 3000 });

app.listen(PORT, err => {
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
socketServer.on('connection',  (ws,req) => {
    console.log('connecté');
    const data = url.parse(req.url,true).query
    const name = data.name;
    console.log(data.name)
    const id = uuidv4();
    
    const metadata = { id, name  };
    clients.set(ws, metadata);

    ws.on('message', messageAsString => {
        const message = JSON.parse(messageAsString);
        console.log(message);
        const metadata = clients.get(ws);

        message.sender = metadata.id;
        message.user = metadata.name
        const outbound = JSON.stringify(message);

        [...clients.keys()].forEach(client => {
            client.send(outbound);
        });
    });

    
    ws.on("close", () => {
        clients.delete(ws);
        console.log("fermé");
      });
  
});

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
            v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
