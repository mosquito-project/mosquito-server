const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const watson = require('./watson.js');

function apiPost(scoring_url, token, mlInstanceID, payload, loadCallback, errorCallback){
	const oReq = new XMLHttpRequest();
	oReq.addEventListener("load", loadCallback);
	oReq.addEventListener("error", errorCallback);
	oReq.open("POST", scoring_url);
	oReq.setRequestHeader("Accept", "application/json");
	oReq.setRequestHeader("Authorization", token);
	oReq.setRequestHeader("ML-Instance-ID", mlInstanceID);
	oReq.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	oReq.send(payload);
}

const forecast = async( cases, population) => {
    // NOTE: generate iam_token based on provided documentation
    const wtoken = await watson.getToken();
    const wmlToken = "Bearer " + wtoken;

    // NOTE: retrieve ml_instance_id based on provided documentation
    const mlInstanceId = process.env.ML_INSTANCE_ID;
    const deploy_id = process.env.ML_DEPLOY_ID;

    // NOTE: manually define and pass the array(s) of values to be scored in the next line
    const payload = `{"fields": ["tmin", "population"], "values": [[${cases}, ${population}]]}`;
    const scoring_url = "https://us-south.ml.cloud.ibm.com/v3/wml_instances/"+mlInstanceId+"/deployments/"+deploy_id+"/online";

    const res = await new Promise(function (resolve, reject) {
        apiPost(scoring_url, wmlToken, mlInstanceId, payload, function (resp) {
            let parsedPostResponse;
            try {
                parsedPostResponse = JSON.parse(this.responseText);
                resolve(parsedPostResponse);
            } catch (ex) {
                // TODO: handle parsing exception
                resolve({});
            }
            //console.log("Scoring response");
            //console.log(parsedPostResponse);
            
        }, function (error) {
            console.log(error);
        });
    });
    return res;
}

module.exports = {
    forecast: forecast,
};