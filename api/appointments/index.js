const mongoose = require("mongoose");
const ModelSchema = require("./model");

let cachedDb = null
async function connectToDatabase() {
    if (cachedDb) {
        return cachedDb
    }
    mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/appointment', { useUnifiedTopology: true, useNewUrlParser: true })
    // mongoose.Promise = global.Promise;
    cachedDb = ModelSchema
    return cachedDb
}
module.exports = async (req, res) => {
    const Model = await connectToDatabase();
    if (req.method == "POST") {
        try {
            const data = await Model.create(req.body);
            return res.json(data)
        } catch (e) {
            return res.status(500).json({ error: e.message || "uh oh " });
        }
    }
    try {
        const data = await Model.find({})
        return res.json(data)
    } catch (e) {
        return res.status(500).json({ error: e.message || "uh oh " });
    }
}