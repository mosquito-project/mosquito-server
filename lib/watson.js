var btoa    = require( "btoa" );
var request = require( 'request' );

// Paste your Watson Machine Learning service apikey here
var apikey = process.env.MACHINE_LEARN_KEY

// Use this code as written to get an access token from IBM Cloud REST API
//
var IBM_Cloud_IAM_uid = "bx";
var IBM_Cloud_IAM_pwd = "bx";


const getToken = async() =>
{
    var options = { url     : "https://iam.bluemix.net/oidc/token",
                headers : { "Content-Type"  : "application/x-www-form-urlencoded",
                            "Authorization" : "Basic " + btoa( IBM_Cloud_IAM_uid + ":" + IBM_Cloud_IAM_pwd ) },
                body    : "apikey=" + apikey + "&grant_type=urn:ibm:params:oauth:grant-type:apikey" };

    const res = await new Promise(function (resolve, reject) {
        request.post( options, function( error, response, body )
        {
            var iam_token = JSON.parse( body )["access_token"];
            resolve(iam_token);
        } );
    });
    return res;
    
}

module.exports = {
    getToken: getToken,
};