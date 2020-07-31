var request = require('request');

const base_url = "https://maps.googleapis.com/maps/api/geocode/json?";
const apiKey = process.env.GOOGLE_API_KEY || '<google_apikey>';

const getAddres = async(lat, lng) => {
    if(!apiKey || apiKey === '<google_apikey>') return '';
    
    const params = `latlng=${lat},${lng}`;
    const key_param = `&key=${apiKey}`;

    const final_url = base_url + params + key_param;

    const res = await new Promise(function (resolve, reject) {
        const json_result = {
            'city': undefined,
            'country': undefined,
        }

        request(final_url, function (error, response, body) {
            const results = JSON.parse(response.body).results || [];
            for(let i = 0; i < results.length; i++)
            {
                const element = results[i];
                const address_components = element['address_components'];

                for(let j = 0; j < address_components.length; j++)
                {
                    const address_element = address_components[j];
                    if( address_element.types.includes('locality') && !json_result['city'])
                    {
                        json_result['city'] = address_element.long_name;  
                    }
                    else if( address_element.types.includes('country') && !json_result['country'] ){
                        json_result['country'] = address_element.short_name;  
                    }

                    if( json_result['city'] != undefined && json_result['country'] != undefined)
                    {
                        resolve(json_result);
                    }
                }    
            }
            resolve(json_result);
        });
    });

    return res;
}

module.exports = {
    getAddres: getAddres,
};
  