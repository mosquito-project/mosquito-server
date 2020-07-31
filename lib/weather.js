var request = require('request');

const base_url = "https://api.openweathermap.org/data/2.5/weather?";
const apiKey = process.env.OPENWEATHER_KEY || '<openweather_apikey>';

const fromQuery = async( query ) => {
    if(!apiKey || apiKey === '<openweather_apikey>') return {};

    const params = `q=${query}&units=metric`;
    const key_param = `&appid=${apiKey}`;

    const final_url = base_url + params + key_param;
    const res = await new Promise(function (resolve, reject) {
        const json_result = {
            'locale_name': undefined,
            'locale_country': undefined,
            'humidity': undefined,
            'temp': undefined,
            'description': undefined,
        }

        request(final_url, function (error, response, body) {
            const results = JSON.parse(response.body) || {};
            if( 'main' in results)
            {
                json_result['temp'] = results['main']['temp'];
                json_result['humidity'] = results['main']['humidity'];
                json_result['description'] = results['main']['description'];
            }
            if('sys' in results)
            {
                json_result['locale_country'] = results['sys']['country'];
            }
            json_result['locale_name'] = results['name'];

            resolve(json_result);
        });
    });
    
    return res;
}

const fromLatLng = async(lat, lng) => {
    if(!apiKey || apiKey === '<openweather_apikey>') return {};
    
    const params = `lat=${lat}&lon=${lng}&units=metric`;
    const key_param = `&appid=${apiKey}`;

    const final_url = base_url + params + key_param;
    const res = await new Promise(function (resolve, reject) {
        const json_result = {
            'locale_name': undefined,
            'locale_country': undefined,
            'humidity': undefined,
            'temp': undefined,
            'description': undefined,
        }

        request(final_url, function (error, response, body) {
            const results = JSON.parse(response.body) || {};
            if( 'main' in results)
            {
                json_result['temp'] = results['main']['temp'];
                json_result['humidity'] = results['main']['humidity'];
                json_result['description'] = results['main']['description'];
            }
            if('sys' in results)
            {
                json_result['locale_country'] = results['sys']['country'];
            }
            json_result['locale_name'] = results['name'];

            resolve(json_result);
        });
    });
    
    return res;
}

module.exports = {
    fromLatLng: fromLatLng,
    fromQuery: fromQuery,
};
  