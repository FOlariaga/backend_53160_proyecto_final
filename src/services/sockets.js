import { Server } from 'socket.io';
import chatModel from "../models/chat.model.js";
import productsModel from "../models/products.model.js";

const initSocket = (httpServer) => {
    
    const io = new Server(httpServer);

    io.on('connection', async (client) => {

        const messages = await chatModel.find().lean()
        
        client.emit('chatLog', messages);
        console.log(`Cliente conectado, id ${client.id} desde ${client.handshake.address}`);
    
        client.on('newMessage', async (data) => {
            await chatModel.create(data)
            console.log(`Mensaje recibido desde ${client.id}: ${data.user} ${data.message}`);
    
            io.emit('messageArrived', data);
        });

        client.on("newProduct", async (data) => {
            await productsModel.create(data)
            console.log(`producto ${data.title} cargado con exito`)
        })
    });

    return io;
}

export default initSocket;