const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get user cart
// @route   GET /api/cart
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      select: 'title price images stock isActive',
    });

    if (!cart) {
      return res.json({ success: true, cart: { items: [], totalItems: 0, totalPrice: 0 } });
    }

    // Filter out inactive products
    const activeItems = cart.items.filter((item) => item.product && item.product.isActive);

    const totalPrice = activeItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const totalItems = activeItems.reduce((acc, item) => acc + item.quantity, 0);

    res.json({
      success: true,
      cart: {
        _id: cart._id,
        items: activeItems,
        totalItems,
        totalPrice,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, size = '', color = '' } = req.body;

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ success: false, message: 'Insufficient stock' });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId && item.size === size && item.color === color
    );

    if (existingItem) {
      existingItem.quantity += quantity;
      if (existingItem.quantity > product.stock) {
        existingItem.quantity = product.stock;
      }
    } else {
      cart.items.push({ product: productId, quantity, size, color });
    }

    await cart.save();
    await cart.populate({ path: 'items.product', select: 'title price images stock isActive' });

    const totalPrice = cart.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const totalItems = cart.items.reduce((acc, item) => acc + item.quantity, 0);

    res.json({
      success: true,
      message: 'Item added to cart',
      cart: { _id: cart._id, items: cart.items, totalItems, totalPrice },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    const item = cart.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found in cart' });

    if (quantity <= 0) {
      cart.items.pull(req.params.itemId);
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    await cart.populate({ path: 'items.product', select: 'title price images stock isActive' });

    const totalPrice = cart.items.reduce((acc, i) => acc + i.product.price * i.quantity, 0);
    const totalItems = cart.items.reduce((acc, i) => acc + i.quantity, 0);

    res.json({
      success: true,
      cart: { _id: cart._id, items: cart.items, totalItems, totalPrice },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    cart.items.pull(req.params.itemId);
    await cart.save();
    await cart.populate({ path: 'items.product', select: 'title price images stock isActive' });

    const totalPrice = cart.items.reduce((acc, i) => acc + i.product.price * i.quantity, 0);
    const totalItems = cart.items.reduce((acc, i) => acc + i.quantity, 0);

    res.json({
      success: true,
      cart: { _id: cart._id, items: cart.items, totalItems, totalPrice },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
    res.json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };