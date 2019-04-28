# nestor-server
Server for Nestor, a virtual assistant build with [Recast.AI](https://recast.ai)

## Features 🇫🇷

* 💬 - Small talk
* ☀️ - Weather
* 🕥 - Time
* 📁 - Information about personality
* 🍓 - *In progress* - Seasonal fruits and vegetables
* 🎥 - *Future* - Movies currently in theatres
* 📰 - *Future* - News

## Usage

* Install dependencies: `npm install`
* Run the server: `npm start`

## Environment

### RecastAI

Go on [Nestor page](https://recast.ai/bertrandda/nestor), fork it. In your new bot settings, note:
* Bot name (1)
* Developer token (2)
* Your user slug (3)

### TimezoneDB

You need [TimezoneDB](https://timezonedb.com) API Key to manage multiple countries time/weather...

### OpenWeatherMap

You need [OpenWeatherMap](https://openweathermap.org/api) API Key for weather forecast.

Duplicate the file `.env.sample`, rename it `.env` and change/fill the default values if necessary.

| Variable                 | Default          | Description                |
|--------------------------|------------------|----------------------------|
| `PORT`                   | "5000"           | Port of the server         |
| `RECAST_USER_SLUG`       | ""               | User name on Recast.ai (3) |
| `RECAST_BOT_SLUG`        | ""               | Bot name (1)               |
| `BOT_ACCESS_TOKEN`       | ""               | Bot access token (2)       |
| `TIMEZONEDB_API_KEY`     | ""               | **TimezoneDB** API Key     |
| `OPENWEATHERMAP_API_KEY` | ""               | **OpenWeatherMap** API Key |
| `ORIGINS`                | "localhost:3000" | Your client address if you use [react-nestor-client](https://github.com/bertrandda/react-nestor-client) |

### Recast configuration

Recast bot need request your server API.

#### Online server

In Nestor settings (your bot page), set `Bot webhook base URL` with your serveur address.

#### Local server

For development, use [Ngrok](https://ngrok.com/) to allow Recast to access your server. [Download](https://ngrok.com/download) and install Ngrok.
Use the command `./ngrok http <PORT>` (replace <PORT> by the value in your .env file).
In Nestor settings (your bot page), set `Bot webhook base URL` with the new value given by Ngrok (e.g. `https://abcdefgh.ngrok.io`).

## Clients

### Custom client

You can use [react-nestor-client](https://github.com/bertrandda/react-nestor-client), a minimalist client to talk with Nestor.

### Bot connector

RecastAI provide solution to connect directly bot on multiple channels. On your bot page click on `Connect` tab and follow instructions to use Nestor on Messenger, Skype, Slack, Telegram...

## License

MIT © Bertrand d'Aure