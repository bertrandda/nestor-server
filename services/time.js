const axios = require('axios');
const moment = require('moment-timezone');

getTime = async function (req, res) {
    let time;
    let location;
    let timeZone;
    let verbTime = 'est';
    if (req.body.nlp.entities.datetime) {
        time = moment(req.body.nlp.entities.datetime[0].iso);
        if (req.body.nlp.entities.datetime[0].chronology === "past") {
            verbTime = 'était';
        } else if (req.body.nlp.entities.datetime[0].chronology === "future") {
            verbTime = 'sera';
        }
    } else {
        time = moment(req.body.nlp.timestamp);
    }

    if (req.body.nlp.entities.location) {
        try {
            const json = await getTimezone(req.body.nlp.entities.location[0].lat, req.body.nlp.entities.location[0].lng);
            timeZone = json.zoneName;
            const splitLoc = req.body.nlp.entities.location[0].formatted.split(',');
            location = splitLoc.length > 1 ? splitLoc[0] : timeZone.split('/')[1];
        } catch (error) {
            console.log(error);
            res.json({
                replies: [
                    { type: 'text', content: `Je vous prie de m'excuser, je n'arrive pas à accéder à ce fuseau horaire` }
                ]
            })
            return;
        }
    } else {
        timeZone = 'Europe/Paris';
        location = 'Paris';
    }

    res.json({
        replies: [
            { type: 'text', content: `À ${location} il ${verbTime} ${time.tz(timeZone).format('HH:mm')}` }
        ]
    })
}

getTimezone = function (lat, lng) {
    return new Promise(async (resolve, reject) => {
        try {
            const json = await axios.get('https://api.timezonedb.com/v2/get-time-zone', {
                params: {
                    key: process.env.TIMEZONEDB_API_KEY,
                    format: 'json',
                    by: 'position',
                    lat: lat,
                    lng: lng
                }
            })
            resolve(json.data);
        } catch (error) {
            reject(error);
        }
    })
}

module.exports = {
    getTime,
    getTimezone
}