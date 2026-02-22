const orderController = {};
const Order = require("../model/Order");
const Cart = require("../model/Cart");
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
    await Cart.findOneAndUpdate({ userId }, { items: [] });
    res.status(200).json({
      status: "주문 생성 성공",
      orderNumber: order.orderNum,
    });
  } catch (error) {
    res.status(400).json({ status: "주문 생성 실패", error: error.message });
  }
};

module.exports = orderController;
