const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

// console.log(process.env.DB_USER);
// console.log(process.env.DB_PASSWORD);


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.sjqbtzt.mongodb.net/?retryWrites=true&w=majority`;


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


        const toyDatabase = client.db("toyMarketPlaceDB");
        const toyCollection = toyDatabase.collection("toys");


        // indexing
        const indexKeys={toyName:1};
        const indexOptions={name:"toyName"};
        const result=await toyCollection.createIndex(indexKeys,indexOptions);


       


        app.post('/toys', async (req, res) => {
            const toy = req.body;
            // const price=parseInt(body.price);
            // body.price=price;
            // body.createdAt=new Date();

            const result = await toyCollection.insertOne(toy);
            res.send(result);

        })

        app.get('/toys',async(req,res)=>{

            const cursor = toyCollection.find();
            const result = await cursor.toArray();
            res.send(result);

        })


        // app.get('/toySearchByToyName/:text',async(req,res)=>{
        //     const searchText=req.params.text;

        //     const cursor=await toyCollection.find({
        //         $or:[
        //             {toyName:{$regex:searchText,$options:'i'}}
        //         ]
        //     });
        //     const result = await cursor.toArray();
        //     res.send(result);

        // })

        app.get('/myToy/:email', async (req, res) => {
           
            console.log(req.params.email);
            // let query = {}
            // if (req.query?.email) {
            //     params = { email: req.query.email }
            // }

            const cursor = toyCollection.find({email: req.params.email});
            const result = await cursor.toArray();
            res.send(result);

        })

        app.get('/toys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await toyCollection.findOne(query);
            res.send(result)


        })

        app.get('/allToys/:text', async (req, res) => {
            console.log(req.params.text);
            if (req.params.text == "disneyPrincess" || req.params.text == "frozenDolls" || req.params.text == "mickeyMouseDolls") {
                const cursor = toyCollection.find({ subCategory: req.params.text });

                const result = await cursor.toArray();
                return res.send(result)
            }
            const cursor = toyCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })




        // const cursor=toyCollection.find({subCategory:req.params.text});
        // const sorting=cursor.sort({createdAt: 1});

        // const result=await sorting.toArray();





        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('toy-marketplace is running')
})

app.listen(port, () => {
    console.log(`toy-marketplace app listening on port ${port}`, port);
})