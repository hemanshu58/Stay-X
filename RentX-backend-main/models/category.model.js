const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    iconImage: {
        type: String,
        required: true
    },
    facilities: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Facility',
        required: true
    }]
});

const Category = mongoose.model('Category', CategorySchema);
module.exports = Category;
