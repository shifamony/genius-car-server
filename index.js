const express = require('express');
const cors = require('cors');
const app = express();
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

function verifyJWT(req, res, next){
  const authHeader = req.headers.authorization;
  if(!authHeader){
    return res.status(401).send({message: 'Unauthorized access here'})
  }
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,function(err, decoded){
    if(err){
      res.status(401).send({message: 'Unauthorized access you'})
    }
    req.decoded = decoded;
    next();
  })
}
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
  try{
   //ALL SERVICES GET
     const servicesCollection = client.db('geniusCar').collection('services');
     const ordersCollection = client.db('geniusCar').collection('orders');

     app.post('/jwt', (req,res) => {
        const user = req.body;
        console.log(user);
        const token = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'1h'});
        res.send({token});
     })




     app.get('/services', async (req, res) => {
      const query = {};
      const cursor = servicesCollection.find(query)
      const services = await cursor.toArray();
      res.send(services);
     })

//SINGLE SERVICE GET
app.get('/services/:id', async (req, res) => {
   const id = req.params.id;
   const query = {_id: ObjectId(id)};
   const service = await servicesCollection.findOne(query);
   res.send(service); 
 })

//ORDERS API GET
app.get('/orders', verifyJWT, async (req, res) => {

  const decoded = req.decoded;
  console.log('Inside orders api',decoded);
  if(decoded.email !== req.query.email){
    res.status(403).send({message: 'That is not fare'})
  }
   //console.log(req.query);
   //const query = {};
   let query = {};
   if(req.query.email){
     query = {
        email: req.query.email
     }
   }

   const cursor = ordersCollection.find(query);
   const orders = await cursor.toArray();
   res.send(orders);
})


//ORDERS API CREATE
app.post('/orders', async (req, res) => {
    const order = req.body;
    const result = await ordersCollection.insertOne(order);
    res.send(result);
});

///UPDATE FUNCTION
app.patch('/orders/:id', async (req, res) => {
   const id = req.params.id;
   const status = req.body.status;
   const query = {_id: ObjectId(id)};
   const updateDoc = {
    $set: {
      status: status
    }
   }
   const result = await ordersCollection.updateOne(query, updateDoc);
   res.send(result);
})


//DELETE FUNCTION
app.delete('/orders/:id', async (req, res) => {
  const id = req.params.id;
  const query = {_id: ObjectId(id)};
  const result = await ordersCollection.deleteOne(query);
  res.send(result);
})

  }
  finally{

  }
}
run().catch(err => console.error(err))



app.listen(port, () => {
    console.log(`Genius car is running on port ${port}`);
});