const axios = require('axios');
const moment = require('moment-timezone');

const time = require('./time');

const emojis = {
    "01d": "☀️",
    "01n": "🌕",
    "02d": "⛅",
    "02n": "☁️",
    "03d": "☁️",
    "03n": "☁️",
    "04d": "☁️",
    "04n": "☁️",
    "09d": "🌧️",
    "09n": "🌧️",
    "10d": "🌦️",
    "10n": "🌧️",
    "11d": "🌩️",
    "11n": "🌩️",
    "13d": "🌨️",
    "13n": "🌨️",
    "50d": "🌫️",
    "50n": "🌫️"
}

exports.getWeather = async function (req, res) {
    const data = req.body;
    let replies = [];
    let json;
    let lat, lng, place;
    if (data.nlp.entities.location) {
        lat = data.nlp.entities.location[0].lat;
        lng = data.nlp.entities.location[0].lng;
        place = data.nlp.entities.location[0].type === 'locality' ? data.nlp.entities.location[0].formatted.split(',')[0] : null;
    } else {
        lat = data.conversation.memory.location.lat;
        lng = data.conversation.memory.location.lng;
        place = data.conversation.memory.location.type === 'locality' ? data.conversation.memory.location.formatted.split(',')[0] : null;
    }

    const datetimes = data.nlp.entities.datetime ? data.nlp.entities.datetime : [];
    const hoursAccuracies = ['halfday', 'hour', 'min', 'sec'];
    let hourForcasts = undefined;
    let dayForcasts = undefined;
    if (datetimes.length > 0) {
        await asyncForEach(datetimes, async (dt) => {
            if (dt.chronology === 'past')
                replies.push({ type: 'text', content: `La date que vous avez entrez est dépassée` });
            else if (dt.accuracy.split(',').reverse()[0] === 'now') {
                try {
                    json = await getWeather('/weather', lat, lng);
                    replies.push({ type: 'text', content: `${capitalizeFirstLetter(json.weather[0].description)} à ${place || json.name}, la température est de ${json.main.temp}°C` });
                } catch (err) {
                    console.log(err);
                }
            } else if (hoursAccuracies.includes(dt.accuracy.split(',').reverse()[0])) {
                json = await time.getTimezone(lat, lng);
                const localTime = (moment(dt.iso).valueOf() / 1000) - json.gmtOffset;
                try {
                    json = await getWeather('/forecast', lat, lng);
                    hourForcasts = json.list;
                    const finalForecast = hourForcasts.filter(forecast => Math.abs(forecast.dt - localTime) < (1799 * 3))
                    if (finalForecast.length === 1)
                        replies.push({ type: 'text', content: `${capitalizeFirstLetter(dt.raw)} ${finalForecast[0].weather[0].description} à ${place || json.city.name}, la température sera de ${finalForecast[0].main.temp}°C` });
                    else
                        replies.push({ type: 'text', content: `Je vous prie de m'excuser, je n'arrive pas à obtenir cette information` });
                } catch (err) {
                    console.log(err);
                    replies.push({ type: 'text', content: `Je vous prie de m'excuser, je n'arrive pas à obtenir cette information` });
                }
            } else if (!hoursAccuracies.includes(dt.accuracy.split(',').reverse()[0])) {
                json = await time.getTimezone(lat, lng);
                const localTime = (moment(dt.iso).valueOf() / 1000) - json.gmtOffset + 12*3600;
                try {
                    json = await getWeather('/forecast/daily', lat, lng, 16);
                    dayForcasts = json.list;
                    const finalForecast = dayForcasts.filter(forecast => Math.abs(forecast.dt - localTime) < (1799 * 24))
                    if (finalForecast.length === 1)
                        replies.push({ type: 'text', content: `${capitalizeFirstLetter(dt.raw)} ${finalForecast[0].weather[0].description} à ${place || json.city.name}, la température sera de ${finalForecast[0].temp.day}°C` });
                    else
                        replies.push({ type: 'text', content: `Je vous prie de m'excuser, je n'arrive pas à obtenir cette information` });
                } catch (err) {
                    console.log(err);
                    replies.push({ type: 'text', content: `Je vous prie de m'excuser, je n'arrive pas à obtenir cette information` });
                }
            }
        })
        res.json({
            replies: replies
        })
        return;
    }

    try {
        json = await getWeather('/weather', lat, lng);
    } catch (err) {
        console.log(err);
    }

    res.json({
        replies: [
            { type: 'text', content: `${capitalizeFirstLetter(json.weather[0].description)} à ${place || json.name}, la température est de ${json.main.temp}°C` }
        ]
    })
}

getWeather = function (route, lat, lng, cnt) {
    /**
     * '/weather' Current weather
     * '/forecast' 3h/5days weather
     * '/forecast/daily' 16 days daily weather
     * cnt necessary to get 16 days in daily forecasts
     */
    return new Promise(async (resolve, reject) => {
        try {
            const json = await axios.get(`https://api.openweathermap.org/data/2.5${route}`, {
                params: {
                    APPID: process.env.OPENWEATHERMAP_API_KEY,
                    mode: 'json',
                    units: 'metric',
                    lang: 'fr',
                    lat: lat,
                    lon: lng,
                    cnt: cnt
                }
            })
            resolve(json.data);
        } catch (error) {
            reject(error)
        }
    })
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
    }
}