const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = Schema(
  {
    sku: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    category: {
      type: Array,
      required: true,
      default: [],
    },
    stock: {
      type: Object,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "active",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

productSchema.methods.toJSON = function () {
  const obj = this.toObject();

  delete obj.createdAt;
  delete obj.updatedAt;
  delete obj.__v;
  return obj;
};

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
