const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://anmolkhurana05:MongoDBanmol@cluster0.zf62wdr.mongodb.net/ExpresSit?retryWrites=true&w=majority"
const client = new MongoClient(uri);

async function connect() {
    try {
        await client.connect();
        console.log("Connected to MongoDB Atlas");
    } catch (e) {
        console.error(e);
    }
}

module.exports = { connect, client };
