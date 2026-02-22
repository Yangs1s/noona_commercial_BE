const mongoose = require("mongoose");
const User = require("./User");
const Product = require("./Product");
const Schema = mongoose.Schema;

const orderSchema = Schema(
  {
    userId: {
      type: mongoose.ObjectId,
      ref: User,
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.ObjectId,
          ref: Product,
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
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "preparing",
    },
    contact: {
      type: Object,
      required: true,
    },
    shipTo: {
      type: Object,
      required: true,
    },
    orderNum: {
      type: String,
    },
  },
  { timestamps: true },
);

orderSchema.methods.toJSON = async function () {
  const obj = this.toObject();
  delete obj.createdAt;
  delete obj.updatedAt;
  delete obj.password;
  delete obj.__v;
  return obj;
};

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
