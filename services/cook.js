let fs = require('fs');

function getVegFood(req, res) {
    const replies = [];
    if (req.body.nlp.entities.vegetable || req.body.nlp.entities.fruit) {
        const vegFood = req.body.nlp.entities.vegetable ? req.body.nlp.entities.vegetable[0] : req.body.nlp.entities.fruit[0];
        let vegList = JSON.parse(fs.readFileSync('./assets/data/fruits_veg.json', 'utf8'));
        vegList = vegList.filter(vegItem => compareVegNames(vegFood.value, vegItem.nameFr));

        if (vegList.length === 1 && vegList[0].month[new Date().getMonth() + 1]) {
            replies.push({ type: 'text', content: `Le ${vegFood.value} est bien de saison` });
        } else {
            replies.push({ type: 'text', content: `Le ${vegFood.value} n'est pas de saison` });
        }
    }

    res.json({
        replies: replies
    })
}

function compareVegNames(input, model) {
    model = model.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const regex = new RegExp(`(?:^|\s)(${model}s?)(?=\s|$)`);
    return input.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').match(regex);
}

module.exports = {
    getVegFood
}