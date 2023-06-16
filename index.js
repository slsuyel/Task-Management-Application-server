const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://taskManagment:SbfQLkj6NLCymLtw@cluster0.37kn8jw.mongodb.net/?retryWrites=true&w=majority`;

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
    //await client.connect();
    // Send a ping to confirm a successful connection
    const taskCollection = client.db("taskDb").collection("taskCollection");

    app.get("/alltasks", async (req, res) => {
      const cursor = taskCollection.find().limit(20);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/alltasks", async (req, res) => {
      const toys = req.body;
      // console.log(bookings)
      const result = await taskCollection.insertOne(toys);
      res.send(result);
    });

    app.patch("/alltasks/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const update = {
        $set: {
          title: req.body.title,
          description: req.body.description,
          status: req.body.status,
        },
      };
      try {
        const result = await taskCollection.updateOne(filter, update);
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send("Error updating task");
      }
    });

    app.delete("/alltasks/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await taskCollection.deleteOne(query);
      res.send(result);
    });

    app.put("/alltasks/:id", async (req, res) => {
      const id = req.params.id;
      const { status } = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          status: status,
        },
      };
      const result = await taskCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("welcome to tasks managment app");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
