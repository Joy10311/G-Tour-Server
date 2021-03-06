const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();

const app = express()
const port = process.env.PORT || 5000

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.znwze.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

console.log(uri)

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run() {
    try {
        await client.connect();

        const database = client.db('G_Tour');
        const servicesCollection = database.collection('services');
        const orderCollection = database.collection('orders')

        // post API
        // POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await servicesCollection.insertOne(service);
            res.json(result)
        });

        // order confirm post api handleclick
        app.post('/orders', async (req, res) => {
            const newBooking = req.body;
            const result = await orderCollection.insertOne(newBooking);
            res.json(result);
        });

        // Get Api from orders
        app.get('/processOrders', async (req, res) => {
            const getOrders = await orderCollection.find({}).toArray();
            res.json(getOrders)
        });

        // GET API by email
        app.get('/processOrders/:email', async (req, res) => {
            const userEmail = req.params.email;
            console.log(userEmail);
            const myOrder = await orderCollection.find({ email: req.params.email }).toArray();
            res.json(myOrder);
        });


        // GEt all data in Manage all orders
        app.get('/allorders', async (req, res) => {
            const getOrders = await orderCollection.find({}).toArray();
            res.json(getOrders)
        })

        // Delete API 
        app.delete('/processOrders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await orderCollection.deleteOne(query);
            res.json(result)
        });
        // // find it 
        // app.get('/processOrders/:id', async (req, res) => {
        //     const id = req.params.id;

        //     const result = await orderCollection.find({ _id: req.params.id }).toArray();
        //     console.log(result)
        //     res.json(result)
        // });

        // *************
        // offer page// 
        // ************

        // GET services API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        // Get single API
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const service = await servicesCollection.findOne(query);
            res.json(service)

        });



    }
    finally {
        // await client.close();
    }

}

run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});