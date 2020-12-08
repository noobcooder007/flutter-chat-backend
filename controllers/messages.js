const Message = require('../models/message');

const getChat = async (req, res) => {
    const myId = req.uid;
    const messagesOf = req.params.of;
    const last30 = await Message.find({
        $or: [{
            from: myId,
            to: messagesOf
        }, {
            from: messagesOf,
            to: myId
        }]
    }).sort({
        createdAt: 'desc'
    }).limit(30);
    res.json({
        ok: true,
        messages: last30
    });
}

module.exports = {
    getChat
}