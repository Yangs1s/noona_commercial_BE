const orderController = {};
const Order = require("../model/Order");
const Cart = require("../model/Cart");
const Product = require("../model/Product");
const productController = require("./product.controller");
const randomStringGenerator = require("../utils/randomStringGenerator");
orderController.createOrder = async (req, res) => {
  try {
    const { userId } = req;
    const { items, contact, shipTo, totalPrice } = req.body;
    // 재고 확인 & 재고 업데이트
    const insufficientStock = await productController.checkItemStock(items);

    // 재고가 충분하지 않으면, 불충분 메시지와 함께 데이터 반환
    if (insufficientStock.length > 0) {
      const errorMessage = insufficientStock.reduce(
        (total, item) => (total += item.message),
        "",
      );

      throw new Error(errorMessage);
    }

    const order = new Order({
      items,
      contact,
      shipTo,
      totalPrice,
      userId,
      orderNum: randomStringGenerator(),
    });
    await order.save();
    // save후에 카트를 비운다.
    res.status(200).json({
      status: "주문 생성 성공",
      orderNumber: order.orderNum,
    });
  } catch (error) {
    res.status(400).json({ status: "주문 생성 실패", error: error.message });
  }
};

orderController.getOrder = async (req, res) => {
  try {
    const { userId } = req;
    const { cursor, period } = req.query;
    // 날짜 기준 정렬
    const query = { userId };
    if (cursor) {
      query.createdAt = { $lt: cursor };
    }
    if (period) {
      const date = new Date();
      const month = period === "1m" ? 1 : 3;
      date.setMonth(date.getMonth() - month);
      query.createdAt = { ...query.createdAt, $gte: date };
    }
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("items.productId");

    res.status(200).json({
      status: "주문 목록 조회 성공",
      data: orders,
      nextCursor:
        orders.length > 0 ? orders[orders.length - 1].createdAt : null,
    });
  } catch (error) {
    res
      .status(400)
      .json({ status: "주문 목록 조회 실패", error: error.message });
  }
};

orderController.getAdminOrder = async (req, res) => {
  try {
    const { page = 1, limit = 10, query = "" } = req.query;
    const pageNum = Number(page);
    const limitNum = Number(limit);
    // 상품명 검색 조건
    const searchProductCond = query
      ? { name: { $regex: query, $options: "i" } }
      : {};
    const searchProduct = await Product.find(searchProductCond);
    const productIds = searchProduct.map((product) => product._id);

    // 주문번호 OR 상품명으로 검색
    const searchConditions = query
      ? [
          { orderNum: { $regex: query, $options: "i" } },
          ...(productIds.length > 0
            ? [{ "items.productId": { $in: productIds } }]
            : []),
        ]
      : [];
    const cond = searchConditions.length > 0 ? { $or: searchConditions } : {};

    const skip = (pageNum - 1) * limitNum;
    const order = await Order.find(cond)
      .skip(skip)
      .limit(limitNum)
      .populate("items.productId");
    const totalCount = await Order.countDocuments(cond);

    res.status(200).json({
      status: "주문 목록 조회 성공",
      data: order,
      currentPage: pageNum,
      totalPages: Math.ceil(totalCount / limitNum),
      totalCount,
    });
  } catch (error) {
    res
      .status(400)
      .json({ status: "주문 목록 조회 실패", error: error.message });
  }
};

orderController.changeOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await Order.findByIdAndUpdate(id, { status }, { new: true });

    return res.status(200).json({ status: "배송 상태 수정 성공" });
  } catch (error) {
    res
      .status(400)
      .json({ status: "주문상태 변경 실패", error: error.message });
  }
};
module.exports = orderController;
