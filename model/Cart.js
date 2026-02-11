const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const cartSchema = Schema(
  {
    userId: {
      type: mongoose.ObjectId,
      ref: "User",
      required: true,
    },
    itmes: {
      productId: {
        type: mongoose.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
      size: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true },
);

cartSchema.methods.toJSON = () => {
  const obj = this._id;
  delete obj.createdAt;
  delete obj.updatedAt;
  delete obj.password;
  delete obj.__v;
  return obj;
};

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
