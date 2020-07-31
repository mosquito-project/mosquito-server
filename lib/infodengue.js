var request = require('request');

const base_url = "https://info.dengue.mat.br/api/alertcity/?";

const fromGeocode = async(geocode) => {
    
    const params = `geocode=${geocode}`;
    const default_params = "&disease=dengue&format=json&ew_start=1&ey_start=2020&ew_end=51&ey_end=2020";

    const final_url = base_url + params + default_params;
    const res = await new Promise(function (resolve, reject) {
        /* the API sometimes return 'data_iniSE' or 'data' */
        request(final_url, function (error, response, body) {
            var results = JSON.parse(response.body) || [];
            if( results.length > 0)
            {
                if('data_iniSE' in results[0])
                {
                    results = results.map((item) => {
                        item['data'] = item['data_iniSE'];
                        return item;
                    });
                }

                results = results.sort((a, b) => parseFloat(b.id) - parseFloat(a.id));
                results = results.filter((thing, index, self) =>
                    index === self.findIndex((t) => (
                        t.data === thing.data
                    ))
                )
                results = results.sort((a, b) => parseFloat(a.data) - parseFloat(b.data));
                results = results.map((item) => {
                return({
                    'date': item['data'],
                    'cases': item['casos'],
                    'tempmin': item['tempmin'],
                    'umidmax': item['umidmax'],
                })});
            
                results = results.filter((item) => item.cases != null);
            }
            resolve(results);
        });
    });
    
    return res;
}

module.exports = {
    fromGeocode: fromGeocode,
};
  