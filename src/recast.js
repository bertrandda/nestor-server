const recastai = require('recastai').default;

const build = new recastai.build(process.env.BOT_ACCESS_TOKEN);

function dialog(conversationId, textRequest, socket) {
    build.dialog({ 'type': 'text', content: textRequest }, { conversationId: conversationId })
        .then(res => {
            socket.emit('reply', { reply: res.messages });
        })
        .catch(err => {
            console.error('Something went wrong', err)
            socket.emit('reply', { reply: [{ type: 'text', content: 'Désolé quelque chose c\'est mal passée' }] });
        })
}

function deleteConversation(conversationId) {
    build.deleteConversation(process.env.RECAST_USER_SLUG, process.env.RECAST_BOT_SLUG, conversationId)
        .then(res => {
            // console.log(res);
        })
        .catch(err => console.error('Something went wrong', err))
}

module.exports.dialog = dialog;
module.exports.deleteConversation = deleteConversation;