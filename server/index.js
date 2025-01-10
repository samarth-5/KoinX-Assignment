import Crypto from './Models/cryptoModel.js';
import express from 'express';
import mongoose from 'mongoose';
import axios from 'axios';
import dotenv from 'dotenv';
import cron from 'node-cron';

const app = express();
const PORT = process.env.PORT || 3000;
dotenv.config();

await mongoose.connect(process.env.MONGO_URL)
        .then(()=>{ console.log("Database connected!!"); })
        .catch((err)=>{ console.log(err) }); 

function calcSD(prices) {
    const n=prices.length;
    const mean=prices.reduce((sum, price)=>sum+price,0)/n;
    const sqrDiff=prices.map(price=>Math.pow(price-mean,2));
    const variance=sqrDiff.reduce((sum,diff)=>sum+diff,0)/n;
    return Math.sqrt(variance);
}

async function fetchCryptoData(coin) {
    try {
        const options = {
            method: 'GET',
            url: `https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd&include_market_cap=true&include_24hr_change=true`,
            headers: {accept: 'application/json', 'x-cg-demo-api-key': process.env.API_KEY}
        };          
        const response=await axios.request(options);
        const data=response.data[coin];
        //console.log(data);
        await Crypto.create({
            coin,
            price: data.usd,
            marketCap: data.usd_market_cap,
            dayChange: data.usd_24h_change
        });
    } 
    catch (err) 
    {
        console.error(`Error fetching data for ${coin}!`,err.message);
    }
}

async function updateAllCryptos() {
    const coins = ['bitcoin', 'matic-network', 'ethereum'];
    for (const coin of coins) 
    {
        await fetchCryptoData(coin);
    }
}

cron.schedule('0 */2 * * *',()=>{
    //console.log('Crypto values updating!');
    updateAllCryptos();
});

app.get('/stats',async(req,res)=>{
    try {
        const {coin}=req.query;        
        const validCoins=['bitcoin','matic-network','ethereum'];
        if (!validCoins.includes(coin)) {
            return res.status(400).json({
                error: 'Invalid coin!'
            });
        }
        const cryptoData = await Crypto.findOne({coin:coin})
            .sort({updatedAt: -1})
            .select('-_id -__v');
        if (!cryptoData) 
        {
            return res.status(404).json({error: 'Data not found!'});
        }
        res.json({
            price: cryptoData.price,
            marketCap: cryptoData.marketCap,
            "24hChange": cryptoData.dayChange
        });
    } 
    catch (err) {
        console.error('Error in /stats endpoint:', err);
        res.status(500).json({error: 'Internal server error!'});
    }
});

app.get('/deviation',async(req,res)=>{
    try {
        const {coin}=req.query;
        const validCoins = ['bitcoin','matic-network','ethereum'];
        if (!validCoins.includes(coin)) 
        {
            return res.status(400).json({
                error: 'Invalid coin!'
            });
        }
        const records=await Crypto.find({coin: coin})
            .sort({ updatedAt: -1 })
            .limit(100)
            .select('price');
        if (!records.length) 
        {
            return res.status(404).json({error:'No data found found!'});
        }
        const prices=records.map(record=>record.price);
        const deviation=calcSD(prices);
        res.json({
            deviation: Number(deviation.toFixed(2))
        });
    } 
    catch (err) {
        console.error('Error in /deviation endpoint:', err);
        res.status(500).json({error:'Internal server error!'});
    }
});

updateAllCryptos();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}!!`);
});