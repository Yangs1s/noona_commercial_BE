const cartController = {};
const Cart = require("../model/Cart");
cartController.createCart = async (req, res) => {
  try {
    const { userId } = req;
    const { productId, quantity, size } = req.body;

    let cart = await Cart.findOne({ userId });
    // 기존 카트가 없으면 새로 생성
    if (!cart) {
      cart = new Cart({ userId, items: [] });
      await cart.save();
    }

    const existItem = cart.items.find(
      (item) => item.productId.equals(productId) && item.size === size,
    );
    if (existItem) {
      throw new Error("이미 카트에 존재하는 상품입니다.");
    }

    // 카트에 상품을 추가한다.
    cart.items = [...cart.items, { productId, quantity, size }];
    // 카트를 저장한다.

    await cart.save();
    res.status(200).json({
      status: "장바구니에 추가되었습니다.!",
      data: cart.items,
      cartQty: cart.items.length,
    });
  } catch (error) {
    res
      .status(400)
      .json({ status: "장바구니 생성 실패", error: error.message });
  }
};

cartController.getCart = async (req, res) => {
  try {
    const { userId } = req;
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    res.status(200).json({ status: "장바구니 조회 성공", data: cart.items });
  } catch (error) {
    res
      .status(400)
      .json({ status: "장바구니 조회 실패", error: error.message });
  }
};

cartController.updateCart = async (req, res) => {
  try {
    const { userId } = req;
    const { productId, quantity, size } = req.body;

    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart) {
      throw new Error("장바구니를 찾을 수 없습니다.");
    }

    const existItem = cart.items.find(
      (item) => item.productId.equals(productId) && item.size === size,
    );
    if (!existItem) {
      throw new Error("장바구니에 존재하지 않는 상품입니다.");
    }

    existItem.quantity = quantity;
    await cart.save();

    res.status(200).json({
      status: "장바구니 수량이 업데이트되었습니다.",
      data: cart.items,
      cartQty: cart.items.length,
    });
  } catch (error) {
    res
      .status(400)
      .json({ status: "장바구니 업데이트 실패", error: error.message });
  }
};

cartController.deleteCart = async (req, res) => {
  try {
    const { userId } = req;
    const { id } = req.params;
    const cart = await Cart.findOneAndUpdate(
      { userId },
      { $pull: { items: { _id: id } } },
      { new: true },
    ).populate("items.productId");
    if (!cart) {
      throw new Error("장바구니를 찾을 수 없습니다.");
    }
    res.status(200).json({
      status: "장바구니 삭제 성공",
      data: cart.items,
      cartQty: cart.items.length,
    });
  } catch (error) {
    res
      .status(400)
      .json({ status: "장바구니 삭제 실패", error: error.message });
  }
};

module.exports = cartController;
