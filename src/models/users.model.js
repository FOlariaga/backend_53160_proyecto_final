import mongoose from 'mongoose';

mongoose.pluralize(null);

const collection = 'users';
// const collection = 'adoptme_users';

const schema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true,},
    age: {type: Number, required: true},
    email: { type: String, required: true, index: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'premium', 'user'], default: 'user' },
    documents : {type : []},
    last_connection: {type: Date},
    status: {type: Boolean, default: true}

});

const model = mongoose.model(collection, schema);

export default model;