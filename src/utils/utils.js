

const axios = require("axios");
// move this function utills folder
async function getCoordinates(street, city, state, zip) {
        return await axios.get(
                `http://www.mapquestapi.com/geocoding/v1/address?key=${
                process.env.MAPQUEST_API
                }&location=${street + " "}, ${city + " "},${state + " "} ${zip}`
        );
}
exports.getCoordinates = getCoordinates;
