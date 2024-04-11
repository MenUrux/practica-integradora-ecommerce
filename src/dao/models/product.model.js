import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  code: { type: String, required: true },
  stock: { type: Number, required: true },
  images: {
    type: [String], // Suponiendo que las imágenes se almacenan como URLs
    validate: {
      validator: function (v) {
        return v.length <= 3; // Establece el límite de imágenes aquí
      },
      message: props => `El producto no puede tener más de ${props.value.length} imágenes`
    }
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ownerName: { type: String, required: false }
}, { timestamps: true });


/* images: [{ type: String }], */



ProductSchema.plugin(mongoosePaginate);

export default mongoose.model('Product', ProductSchema);
