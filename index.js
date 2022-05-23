const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// test
app.get("/", (req, res) => {
  res.send("Welcome to woodHouse");
});

//connection with mongoDB

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eqtr9.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const productsCollection = client.db("woodHouse").collection("products");
const reviewsCollection = client.db("woodHouse").collection("reviews");
const servicesCollection = client.db("woodHouse").collection("services");
const purchaseCollection = client.db("woodHouse").collection("purchase");
const run = async () => {
  try {
    await client.connect();
    // all products loaded
    app.get("/products", async (req, res) => {
      const products = await productsCollection.find({}).toArray();
      res.send(products);
    });

    // loaded single product by id
    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const product = await productsCollection.findOne(query);
      res.send(product);
    });

    // all reviews loaded
    app.get("/reviews", async (req, res) => {
      const reviews = await reviewsCollection.find({}).toArray();
      res.send(reviews);
    });

    // all services loaded
    app.get("/services", async (req, res) => {
      const reviews = await servicesCollection.find({}).toArray();
      res.send(reviews);
    });

    // Purchase products
    app.post("/purchase", async (req, res) => {
      const purchaseProduct = req.body;
      const result = await purchaseCollection.insertOne(purchaseProduct);
      res.send(result);
    });
  } finally {
  }
};
run().catch(console.dir);

app.listen(port, () => {
  console.log("port number", port);
});
