require('dotenv').config({silent: true});
const list_geocode = require('./lib/municipios.json');

const express = require('express');
const bodyParser = require('body-parser');

const assistant = require('./lib/assistant.js');
const geocode = require('./lib/geocode.js');
const weather = require('./lib/weather.js');
const infodengue = require('./lib/infodengue.js');
const forecast = require('./lib/forecast.js');

const port = process.env.PORT || 3000;

const getCodeIBGE = ( name ) => {
  const target_name = name.toLowerCase();
  for( var i = 0; i < list_geocode.length; i++)
  {
      if( target_name === list_geocode[i]['nome'].toLowerCase())
      {
          return list_geocode[i]['codigo_ibge'];
      }
  }
  return null;
}

const app = express();
app.use(bodyParser.json());

const testConnection = () => {
  return assistant.session()
    .then(sessionid => {
      console.log('Successfully connected to Watson Assistant');
      return 'ok';
    })
    .catch(err => {
      const msg = 'Failed to connect to Watson Assistant';
      console.error(msg);
      console.error(err);
      return msg;
    });
}

const handleError = (res, err) => {
  const status = err.code !== undefined && err.code > 0 ? err.code : 500;
  return res.status(status).json(err);
};

app.get('/', (req, res) => {
  testConnection().then(status => res.json({ status: status }));
});

app.get('/weather/br', async(req, res) => {
  const target_query = req.query.target_query;
  if( target_query != null )
  {
    try {
      const result = await weather.fromQuery(target_query);
      res.send(result)
    } catch (error) {
      res.send({});
    }
  }
  else{
    res.send({})
  }
});

app.get('/weather', async(req, res) => {
  var is_number = /^(-?\d+\.\d+)$|^(-?\d+)$/;
  const lat = req.query.lat;
  const lng = req.query.lng;
  if( lat && is_number.test(lat) &&
      lat && is_number.test(lng))
    {
      try {
        const result = await weather.fromLatLng(lat, lng);
        res.send(result)
      } catch (error) {
        res.send({});
      }
    }
    else{
      res.send({});
    }
});

app.get('/forecast', async(req, res) => {
  var is_number = /^(-?\d+\.\d+)$|^(-?\d+)$/;
  const temp = req.query.temp;
  const population = req.query.population;
  if( temp && is_number.test(temp) &&
  population && is_number.test(population))
    {
      try {
        const result = await forecast.forecast(temp, population);
        res.send(result)
      } catch (error) {
        res.send({});
      }
    }
    else{
      res.send({});
    }
});

app.get('/dengue', async(req, res) => {
  const geocode= req.query.geocode
  if( geocode != null){
    try {
        const result = await infodengue.fromGeocode( geocode );
        res.send(result)
    } catch (error) {
      res.send([]);
    }
  }else{
    res.send([]);
  }
});

app.get('/dengue/br', async(req, res) => {
  const geocode= getCodeIBGE(`${req.query.place}`)
  if( geocode != null){
    try {
        const result = await infodengue.fromGeocode( geocode );
        res.send(result)
    } catch (error) {
      res.send([]);
    }
  }else{
    res.send([]);
  }
});

app.get('/geocode', async(req, res) => {
  var is_number = /^(-?\d+\.\d+)$|^(-?\d+)$/;
  const lat = req.query.lat;
  const lng = req.query.lng;

  if( lat && is_number.test(lat) &&
      lat && is_number.test(lng))
    {
      try {
        const result = await geocode.getAddres(lat, lng);
        res.send(result)
      } catch (error) {
        res.send({});
      }
    }
    else{
      res.send({});
    }
});

app.get('/api/session', (req, res) => {
  assistant
    .session()
    .then(sessionid => res.send(sessionid))
    .catch(err => handleError(res, err));
});

app.post('/api/message', (req, res) => {
  const text = req.body.text || '';
  const sessionid = req.body.sessionid;

  assistant
    .message(text, sessionid)
    .then(result => res.json(result))
    .catch(err => handleError(res, err));
});

const server = app.listen(port, () => {
   const host = server.address().address;
   const port = server.address().port;
   console.log(`listening at http://${host}:${port}`);
   testConnection();
});
