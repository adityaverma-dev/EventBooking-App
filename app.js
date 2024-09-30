const express = require('express')
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const isAuth = require('./middlware/is-auth');

const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolver/index');

const app = express();


app.use(bodyParser.json());
app.use((req,res,next) => {
res.setHeader('Access-Control-Allow-Origin', '*')
res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
if(req.method === 'OPTIONS') {
    return res.sendStatus(200);
}
next();
});
app.use(isAuth);


const events = eventIds => {
    return Event.find({_id: {$in: eventIds}})
    .then(events => {
        return events.map(event => {
            return {...event._doc, 
                _id: event.id, 
                creator: user.bind(this, event._doc.creator)}
        })
    })
    .catch(err => {
        throw err
    });
}

const user = userId => {
    return User.findById(userId)
    .then(user => {
        return {...user._doc, 
            _id: user.id, 
            createdEvents: events.bind(this, user._doc.createdEvents) }
    })
    .catch(err => {
        throw err;
    });
};

//! means it can't be null (! means something must be there)

app.use('/graphql', graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true,
})
);

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster2.cyeeb.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority&appName=Cluster2`)
    .then(() => {
        console.log('Connected to MongoDB successfully!');
        app.listen(8000, () => {
            console.log('Server is running on port 8000');
        });
    })
    .catch(err => {
        console.error('Failed to connect to MongoDB:', err);
    });

