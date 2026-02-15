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

productController.getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = "createdAt",
      order = "desc",
    } = req.query;
    const maxLimit = Math.min(limit, 50);

    if (maxLimit < limit) {
      return res
        .status(400)
        .json({ status: "한 페이지당 최대 50개의 상품만 조회할 수 있습니다." });
    }

    const skip = page ? (page - 1) * limit : 0;
    const totalCount = await Product.countDocuments();
    const products = await Product.find().skip(skip).limit(limit);

    return res.status(200).json({
      status: "상품 조회 성공",
      data: products,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      itemsPerPage: limit,
    });
  } catch {
    res.status(400).json({ status: "상품 조회 실패", error: error.message });
  }
};
module.exports = productController;
