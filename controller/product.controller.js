const productController = {};
const Product = require("../model/Product");

productController.createProduct = async (req, res) => {
  try {
    const { sku, name, price, description, image, category, stock, status } =
      req.body;
    const product = new Product({
      name,
      price,
      description,
      image,
      category,
      stock,
      sku,
      status,
    });

    await product.save();

    return res.status(200).json({ status: "상품 생성 성공", product: product });
  } catch (error) {
    res.status(400).json({ status: "상품 생성 실패", error: error.message });
  }
};
module.exports = productController;
