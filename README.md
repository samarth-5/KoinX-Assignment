# KoinX-Assignment Backend

A server-side application built with Node.js and MongoDB to fetch and store cryptocurrency data (Bitcoin, Matic, and Ethereum) using the CoinGecko API. It provides an API endpoint to retrieve the latest statistics for any of the supported cryptocurrencies, as well as the standard deviation of the price over the last 100 records.

---
![Screenshot 2025-01-10 225251](https://github.com/user-attachments/assets/8739d9b5-bb07-4e5b-8f4c-4a04e8abae52)
![Screenshot 2025-01-10 232250](https://github.com/user-attachments/assets/ae40f413-8ad8-44e2-a29b-415f686b92c1)
![Screenshot 2025-01-10 231432](https://github.com/user-attachments/assets/6ba6bf17-dbcd-406e-965f-ff589920605a)

## Features  

1. Background job that runs every 2 hours to fetch cryptocurrency data and stores it in MongoDB.
2. API `/stats` to retrieve the latest price, market cap, and 24-hour change for Bitcoin, Matic, and Ethereum.
3. API `/deviation` to return the standard deviation of the price of a requested cryptocurrency for the last 100 records.

---

## Prerequisites  

Before you begin, ensure you have the following installed:  

- [Node.js](https://nodejs.org/) (v14+ recommended)
- [MongoDB](https://www.mongodb.com/) (local or cloud instance)
- [Nodemon](https://nodemon.io/) (optional, for development)

---

## Environment Variables  

Create a `.env` file in the project root with the following variables and put it in server folder:  

```env
PORT=3000  # The port the server will run on
MONGO_URL=<Your MongoDB Connection String>  # MongoDB URI
API_KEY=<Your CoinGecko API Key>  # API Key for CoinGecko (if required)
```

## Installation and Starting  

First clone the repository to your local machine & then run the project:
```bash
git clone https://github.com/your-username/KoinX-Assignment.git
cd KoinX-Assignment
cd server
npm install
npm run dev
```
