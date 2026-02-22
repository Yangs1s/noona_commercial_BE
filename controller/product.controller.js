const productController = {};
const Product = require("../model/Product");
const paginate = require("../utils/paginate");
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
      limit = 1,
      sort = "createdAt",
      order = "desc",
      query = "",
    } = req.query;

    const cond = query ? { name: { $regex: query, $options: "i" } } : {};
    const { skip, totalCount, maxLimit } = await paginate(
      Product,
      page,
      limit,
      cond,
    );

    let queryBuilder = Product.find(cond);
    queryBuilder = queryBuilder
      .skip(skip)
      .limit(maxLimit)
      .sort({ [sort]: order === "asc" ? 1 : -1 });

    const products = await queryBuilder.exec();
    return res.status(200).json({
      status: "상품 조회 성공",
      data: products,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      itemsPerPage: maxLimit,
    });
  } catch (error) {
    res.status(400).json({ status: "상품 조회 실패", error: error.message });
  }
};

// 고객이 상품을 조회할 때 사용하는 컨트롤러
// 분리한 이유는 보여지는 리스폰스 내용이 다르기에
productController.getProductsByCustomer = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 1,
      sort = "createdAt",
      order = "desc",
      query = "",
    } = req.query;

    const cond = query
      ? { status: "active", name: { $regex: query, $options: "i" } }
      : { status: "active" };
    const { skip, totalCount, maxLimit } = await paginate(
      Product,
      page,
      limit,
      cond,
    );

    let queryBuilder = Product.find(cond);
    queryBuilder = queryBuilder
      .skip(skip)
      .limit(maxLimit)
      .sort({ [sort]: order === "asc" ? 1 : -1 });

    const products = await queryBuilder.exec();
    return res.status(200).json({
      status: "상품 조회 성공",
      data: products,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      itemsPerPage: limit,
    });
  } catch (error) {
    res.status(400).json({ status: "상품 조회 실패", error: error.message });
  }
};
productController.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    return res.status(200).json({ status: "상품 삭제 성공" });
  } catch (error) {
    res.status(400).json({ status: "상품 삭제 실패", error: error.message });
  }
};

productController.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, image, category, stock, status } =
      req.body;
    await Product.findByIdAndUpdate(
      { _id: id },
      {
        name,
        price,
        description,
        image,
        category,
        stock,
        status,
      },
      { new: true },
    );
    return res.status(200).json({ status: "상품 수정 성공" });
  } catch (error) {
    res.status(400).json({ status: "상품 수정 실패", error: error.message });
  }
};

productController.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      throw new Error("상품을 찾을 수 없습니다.");
    }
    return res.status(200).json({ status: "상품 조회 성공", product });
  } catch (error) {
    res.status(400).json({ status: "상품 조회 실패", error: error.message });
  }
};

productController.checkStock = async (item) => {
  // 내가사려는 아이템의 실제 재고
  const product = await Product.findById(item.productId);
  // qty,재고 비교
  if (product.stock[item.size] < item.quantity) {
    return {
      isVerify: false,
      message: `${product.name}의 ${item.size} 사이즈는 재고가 부족합니다.`,
    };
  }
  const newStock = { ...product.stock };
  newStock[item.size] -= item.quantity;

  await product.save();

  return {
    isVerify: true,
  };
  // 재고 불충하면, 불충분 메시지와 함께 데이터 반환
};

productController.checkItemStock = async (itemList) => {
  try {
    const insufficientStock = [];
    // 재고 확인 로직

    await Promise.all(
      itemList.map(async (item) => {
        const stockCheck = await productController.checkStock(item);
        if (!stockCheck.isVerify) {
          insufficientStock.push({ item, message: stockCheck.message });
        }

        return stockCheck;
      }),
    );

    return insufficientStock;
  } catch (error) {
    throw new Error("상품 재고 확인 실패", error.message);
  }
};

module.exports = productController;
