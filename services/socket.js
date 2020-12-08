const { io } = require('../index');
const { validateJWT } = require('../helpers/jwt');
const { userConnected, userDisconnected, saveMessage } = require('../controllers/socket');

io.on('connection', client=>{
    console.log('Client conected');
    const [ valid, uid ] = validateJWT(client.handshake.headers['x-token']);
    if (!valid) {
        return client.disconnect();
    }
    console.log('Client authenticated');
    userConnected(uid);
    client.join(uid);
    client.on('message-private', async (payload) => {
        await saveMessage(payload);
        io.to(payload.to).emit('message-private', payload);
    });
    client.on('disconnect', () => {
        userDisconnected(uid);
        console.log('Client disconnected');
    });
    client.on('message', (payload) => {
        console.log('message', payload);
        client.emit('message', { admin: 'Hi there' });
    });
});