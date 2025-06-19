// import files
import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';


const app = express();
const port = 3000;

app.use(express.static('public')); // to have access to the files inside public folder
app.use(bodyParser.urlencoded({ extended: true })); // middleware for processing request

app.get('/', (req, res) => {
  res.render('index.ejs'); //server rendering the home page
});

app.post('/uv', async(req, res) => { //server rendering the uv page
    const { lat, lng } = req.body;

    try{ //put in a try an catch error to catch error if the request fail
        const result = await axios.get(`https://api.openuv.io/api/v1/uv?lat=${lat}&lng=${lng}`, { // get request use to get the api used
            headers: {
                'x-access-token': 'openuv-1ehf2xrma0y83s5-io',
                'Content-Type': 'application/json'
            }
    });
        const data = result.data.result;

        const sunriseUTC = new Date(data.sun_info.sun_times.sunrise); //conversion of the sunrise time
        const sunsetUTC = new Date(data.sun_info.sun_times.sunset); // conversion of the sunset time
        const maxUV = new Date(data.uv_max_time); // conversion od the max uv time
        const uvIndex = data.uv.toFixed(0); // convert the uv index to 0 standard form
        const uvMaxIndex = data.uv_max.toFixed(0); // convert the uv max index to 0 standard time

        const options = { 
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
            timeZone: 'Africa/Lagos',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
            };

        const formattedSunrise = sunriseUTC.toLocaleTimeString('en-US', options);
        const formattedSunset = sunsetUTC.toLocaleTimeString('en-US', options);
        const formattedMaxUV = maxUV.toLocaleTimeString('en-US', options);

        function getUvLevel(uv) {
            if (uv < 3) return 'Low, Safe for most people';
            if (uv < 6) return 'Moderate, Use sunscreen, hat, sunglasses';
            if (uv < 8) return 'High, Protection needed, seek shade';
            if (uv < 11) return 'Very High, Extra protection essential';
            return 'Extreme, Avoid sun, very high risk Stay indoors if possible';
          }
          
          const uvLevel = getUvLevel(data.uv);
        
        res.render('uv.ejs', { // pass all the data needed in the uv ejs
            data,
            uvIndex,
            uvMaxIndex,
            uvLevel,
            sunrise: formattedSunrise,
            sunset: formattedSunset,
            maxUV: formattedMaxUV,
        });
    }catch (error){ // pass the error data to uv ejs to display error message
        res.status(500).render('uv.ejs', {error: 'Error fetching data from OpenUV API'});
    }
})

app.listen(port, () => { // the server is running on port 3000
    console.log(`Server is running on port ${port}`);
})