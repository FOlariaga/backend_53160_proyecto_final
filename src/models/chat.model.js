import mongoose from 'mongoose';

mongoose.pluralize(null);

const collection = 'messages';

const schema = new mongoose.Schema({

    user: {type: String, required: true},
    messages: {type: String, required: true}

});

const model = mongoose.model(collection, schema);

export default model;