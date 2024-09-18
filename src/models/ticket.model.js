import mongoose from 'mongoose';

mongoose.pluralize(null);

const collection = 'ticket';

const schema = new mongoose.Schema({

    code: {type: String, required: true, unique: true},
    purchase_datetime: { type: String, required: true},
    amount: { type: Number, required: true},
    purchaser: { type: String, required: true}
});

const model = mongoose.model(collection, schema);

export default model;