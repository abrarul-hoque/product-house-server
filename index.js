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
            "https://product-house-abrar.netlify.app",
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
    // serverApi: {
    //     version: ServerApiVersion.v1,
    //     strict: true,
    //     deprecationErrors: true,
    // }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        const productsCollection = client.db('productHouse').collection('products')
        const userCollection = client.db('productHouse').collection('users')




        //getting data with pagination, sortting, and filtering
        app.get('/products', async (req, res) => {
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            const sortOrder = req.query.sortOrder;

            const brand = req.query.brand || "";
            const category = req.query.category || "";
            const priceRange = req.query.priceRange || "";

            let [min, max] = priceRange.split('-').map(Number);



            const minPrice = min !== undefined && !isNaN(min) ? min : 0;
            const maxPrice = max !== undefined && !isNaN(max) ? max : Number.MAX_SAFE_INTEGER;

            console.log(priceRange);
            let filterQuery = {};
            if (brand) {
                filterQuery.brandName = brand;
            }
            if (category) {
                filterQuery.category = category;
            }
            if (priceRange) {
                filterQuery.price = { $gte: minPrice, $lte: maxPrice };
            }

            console.log("Pagination query", req.query);


            let sortQuery = {};
            if (sortOrder === "priceAsc") {
                sortQuery = { price: 1 };
            } else if (sortOrder === "priceDesc") {
                sortQuery = { price: -1 };
            } else if (sortOrder === "dateAsc") {
                sortQuery = { createdOn: 1 };
            } else if (sortOrder === "dateDesc") {
                sortQuery = { createdOn: -1 };
            }
            const result = await productsCollection.find(filterQuery)
                .sort(sortQuery)
                .skip(page * size) //skip means data to be skiped till the res
                .limit(size) // limit is use for to show qty of size
                .toArray();
            res.send(result);
        })




        app.get('/products/brands', async (req, res) => {
            const brands = await productsCollection.distinct("brandName");
            console.log(brands);
            res.send(brands);
        })

        app.get('/products/categories', async (req, res) => {
            const categories = await productsCollection.distinct('category');
            res.send(categories)

        })

        // http://localhost:5000/products&search=
        app.get('/products/search/:name', async (req, res) => {
            const searchText = req.params.name;
            const query = { name: { $regex: searchText, $options: 'i' } };
            const result = await productsCollection.find(query).toArray();
            res.send(result);
        })





        //getting total job count
        app.get('/productCount', async (req, res) => {
            const count = await productsCollection.estimatedDocumentCount();
            res.send({ count });
        })



        //User releted api
        //Post user to mongodb
        app.post('/users', async (req, res) => {
            const user = req.body;
            const query = { email: user.email };
            const existingUser = await userCollection.findOne(query);
            if (existingUser) {
                return res.send({ message: "User already exist!", insertedId: null });
            }
            const result = await userCollection.insertOne(user);
            res.send(result);
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