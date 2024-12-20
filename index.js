const express = require("express");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kkyxc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const craftItemsCollection = client
      .db("craftItemDB")
      .collection("craftItem");

    app.post("/craftItems", async (req, res) => {
      const craftItem = req.body;
      console.log(craftItem);
      const result = await craftItemsCollection.insertOne(craftItem);
      res.send(result);
    });

    app.get("/craftItems", async (req, res) => {
      const cursor = craftItemsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/craftItems/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await craftItemsCollection.findOne(query);
      res.send(result);
    });

    app.get("/items/:email", async (req, res) => {
      const email = req.params.email;
      const query = { "user.email": email };
      const result = await craftItemsCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/update/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await craftItemsCollection.findOne(query);
      res.send(result);
    });

    app.put("/update/:id", async (req, res) => {
      const id = req.params.id;
      const updateData = req.body;
    //   console.log(updateData);
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          ...updateData
        },
      };
      const result = await craftItemsCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

      app.delete("/craftItems/:id", async (req, res) => {
          const id = req.params.id;
          const query = { _id: new ObjectId(id) };
          const result = await craftItemsCollection.deleteOne(query);
          res.send(result)
    })  
      
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("PANTING AND DRAWING SERVER IS RUNNING!");
});

app.listen(port, () => {
  console.log(`PANTING AND DRAWING SERVER ON PORT ${port}`);
});
