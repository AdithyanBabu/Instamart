const { MongoClient } = require('mongodb');
const state = {
    db: null
};

const uri = "mongodb+srv://adithyanbabu98:xqYIP4AEmF48N19q@cluster0.qhvzo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// const uri='mongodb://localhost:27017'

module.exports.connect = function(done) {
    const dbname = 'cart';

    // Create a new MongoClient
    const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    // Connect to the MongoDB server
    client.connect((err, clientInstance) => {
        if (err) {
            return done(err);
        }

        // Store the database instance in the state object
        state.db = clientInstance.db(dbname);
        done();
    });
};

module.exports.get = function() {
    return state.db;
};

