const axios = require('axios');
const utils = require('../src/utils');

exports.getWikiSummary = async function (req, res) {
    let replies = [];

    if (!req.body.nlp.entities.person) {
        replies.push({ type: 'text', content: `Je vous prie de m'excuser, il a du y avoir un problème dans la formulation` });
        res.json({
            replies: replies
        });
        return;
    }

    const search = req.body.nlp.entities.person[0].fullname;

    try {
        const json = await axios.get('https://fr.wikipedia.org/w/api.php', {
            params: {
                format: 'json',
                action: 'query',
                generator: 'search',
                gsrlimit: '5',
                gsrsearch: search,
                prop: 'extracts',
                exintro: '',
                explaintext: '',
                exlimit: 'max'
            }
        })

        if (!json.data.query || !json.data.query.pages) {
            replies.push({ type: 'text', content: `Je vous prie de m'excuser, je ne trouve rien à ce nom` });
            res.json({
                replies: replies
            });
            return;
        }

        const pages = json.data.query.pages;

        let result = Object.keys(pages).find(pageId => {
            return utils.includesAll(pages[pageId].title, search.split(' '));
        });

        if (!result && Object.keys(pages)[0] > 0)
            result = Object.keys(pages)[0];

        if (result) {
            replies.push({ type: 'text', content: pages[result].extract.split('\n')[0] });
        } else {
            replies.push({ type: 'text', content: `Je vous présente mes excuses, je n'ai pas cette information` });
        }
    } catch (error) {
        console.log(error);
        replies.push({ type: 'text', content: `Je vous présente mes excuses, je n'arrive pas à accéder à cette information` });
    }

    res.json({
        replies: replies
    })
}