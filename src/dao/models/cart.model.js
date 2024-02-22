import mongoose from 'mongoose';

//Nuevo cart para poder vincularlo a cada usuario
const CartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        quantity: Number
    }]
});

export default mongoose.model('Cart', CartSchema);
