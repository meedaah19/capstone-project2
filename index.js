import express from 'express';
import axios from 'axios';
import { readFile } from 'fs/promises'

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.get('/', async(req, res) => {
    try{
        const result = await axios.get(' https://api.openuv.io/api/v1/uv?lat=:lat&lng=:lng&alt=:alt&dt=:dt', {
            headers: {
                'x-access-token': 'openuv-1ehf2xrma0y83s5-io',
                'Content-Type': 'application/json'
            }
    });
        res.render('index.ejs', {data: result.data});
    }catch (error){
        console.error('Error fetching data from OpenUV API:', error);
        res.status(500)('index.ejs', {error: 'Error fetching data from OpenUV API'});
    }
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})