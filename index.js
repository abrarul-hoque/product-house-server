const express = require('express');
const cors = require('cors');
const app = express();
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 5000;
require("dotenv").config();

app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "http://localhost:5000",
            "https://product-house-825b4.firebaseapp.com",
            "https://product-house-825b4.app",
            "https://product-house.netlify.app",
        ]
    })
);
app.use(express.json());

//JWT releted api
app.post('/jwt', async (req, res) => {
    const user = req.body;
    const token = jwt.sign(user, process.env.ACCESS_TOKEN, {
        expiresIn: "1h"
    });
    res.send({ token });
})

//Middlewares
const verifyToken = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).send({ message: "unauthorized access" });
    }
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN, (error, decoded) => {
        if (error) {
            return res.status(401).send({ message: 'unauthorized access' });
        }
        req.decoded = decoded;
        next();
    })

}



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1qcsvas.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        const productsCollection = client.db('productHouse').collection('products')


        //Getting all products from mongodb

        //Pagination releted api
        // app.get('/products', async (req, res) => {
        //     const page = parseInt(req.query.page);
        //     const size = parseInt(req.query.size);
        //     console.log("Pagination query", req.query);
        //     const result = await productsCollection.find()
        //         .skip(page * size) //skip means data to be skiped till the res
        //         .limit(size) // limit is use for to show qty of size
        //         .toArray();
        //     res.send(result);
        // })
        app.get('/products', async (req, res) => {
            const result = await productsCollection.find().toArray();
            res.send(result);
        })


        //getting total job count
        app.get('/jobCount', async (req, res) => {
            const count = await jobsCollection.estimatedDocumentCount();
            res.send({ count });
        })




    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send("Product House is Running")
})
app.listen(port, (req, res) => {
    console.log(`Product House Server is running on Port: ${port}`)
})