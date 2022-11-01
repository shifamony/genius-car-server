const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

//middle wares
app.use(express.json());
app.use(cors());

// console.log(process.env.DB_USER);
// console.log(process.env.DB_PASSWORD)

app.get('/', (req, res) => {
   res.send('Genius server is running');
});

//USERNAME: geniusDBUser
//PASSW: t6F51I0OMaLlXITX

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jj8cffr.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});





app.listen(port, () => {
    console.log(`Genius car is running on port ${port}`);
});