const fs = require('fs');
const moment = require('moment-timezone');

function getVegFood(req, res) {
    const replies = [];
    const month = req.body.nlp.entities.datetime ? moment(req.body.nlp.entities.datetime[0].iso).get('month') + 1 : moment().get('month') + 1;
    let vegList = JSON.parse(fs.readFileSync('./assets/data/fruits_veg.json', 'utf8'));
    if (req.body.nlp.entities.vegetable || req.body.nlp.entities.fruit) {
        const vegFood = req.body.nlp.entities.vegetable ? req.body.nlp.entities.vegetable[0] : req.body.nlp.entities.fruit[0];
        vegList = vegList.filter(vegItem => compareNames(vegFood.value, vegItem.nameFr));

        if (vegList.length === 1 && vegList[0].month[month]) {
            replies.push({ type: 'text', content: `Le ${vegFood.value} est bien de saison` });
        } else {
            replies.push({ type: 'text', content: `Le ${vegFood.value} n'est pas de saison` });
        }
    } else if (req.body.nlp.entities.food_category) {
        const category = req.body.nlp.entities.food_category[0].value;
        if (compareNames(category, 'légume')) {
            vegList = vegList.filter(vegItem => vegItem.type === 'vegetable' && vegItem.month[month]);
            replies.push({ type: 'text', content: `Voilà la liste des légumes que j'ai trouvée :` });
            replies.push({ type: 'text', content: `${vegList.map(vegItem => {return vegItem.nameFr}).join('\n')}` })
        } else if (compareNames(category, 'fruit')) {
            vegList = vegList.filter(vegItem => vegItem.type === 'fruit' && vegItem.month[month]);
            replies.push({ type: 'text', content: `Voilà la liste des fruits que j'ai trouvée :` });
            replies.push({ type: 'text', content: `${vegList.map(vegItem => {return vegItem.nameFr}).join('\n')}` })
        }
    }

    res.json({
        replies: replies
    })
}

function compareNames(input, model) {
    model = model.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const regex = new RegExp(`(?:^|\s)(${model}s?)(?=\s|$)`);
    return input.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').match(regex);
}

module.exports = {
    getVegFood
}