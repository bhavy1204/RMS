const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const Table = require('../models/Table');

// Create new order
const createOrder = async (req, res) => {
  try {
    const { tableId, items, specialInstructions, paymentMethod = 'cash' } = req.body;
    const customerId = req.user ? req.user.id : null;

    // Verify table exists and is active
    const table = await Table.findById(tableId);
    if (!table || !table.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or inactive table'
      });
    }

    // Validate and get menu items
    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItemId);
      if (!menuItem) {
        return res.status(400).json({
          success: false,
          message: `Menu item with ID ${item.menuItemId} not found`
        });
      }

      if (!menuItem.availability) {
        return res.status(400).json({
          success: false,
          message: `Item "${menuItem.name}" is currently unavailable`
        });
      }

      const itemTotal = menuItem.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        menuItemId: menuItem._id,
        quantity: item.quantity,
        note: item.note || '',
        price: menuItem.price
      });

      // Update popularity score
      menuItem.popularityScore += item.quantity;
      await menuItem.save();
    }

    // Calculate tax (assuming 10% tax rate)
    const taxRate = 0.10;
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    // Create order
    const order = new Order({
      tableId,
      customerId,
      items: orderItems,
      subtotal,
      tax,
      total,
      specialInstructions,
      paymentMethod
    });

    await order.save();

    // Populate order with details
    await order.populate([
      { path: 'tableId', select: 'number qrSlug capacity location' },
      { path: 'customerId', select: 'name email' },
      { path: 'items.menuItemId', select: 'name price' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: {
        order
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
};

// Get orders (Staff and Admin)
const getOrders = async (req, res) => {
  try {
    const {
      status,
      table,
      page = 1,
      limit = 20,
      sort = 'createdAt',
      order = 'desc'
    } = req.query;

    // Build filter
    const filter = {};
    if (status) filter.status = status;
    if (table) filter.tableId = table;

    // Sort options
    const sortOptions = {};
    sortOptions[sort] = order === 'desc' ? -1 : 1;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [orders, totalCount] = await Promise.all([
      Order.find(filter)
        .populate('tableId', 'number qrSlug')
        .populate('customerId', 'name email')
        .populate('items.menuItemId', 'name price')
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum),
      Order.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(totalCount / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalItems: totalCount,
          itemsPerPage: limitNum,
          hasNextPage,
          hasPrevPage
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
};

// Get single order
const getOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate('tableId', 'number qrSlug capacity location')
      .populate('customerId', 'name email')
      .populate('items.menuItemId', 'name description price imageUrl');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check permissions
    const user = req.user;
    if (user.role === 'customer' && order.customerId && order.customerId._id.toString() !== user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: {
        order
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message
    });
  }
};

// Update order status (Staff and Admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, estimatedReadyTime } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Validate status transition
    const validTransitions = {
      'placed': ['preparing', 'canceled'],
      'preparing': ['ready', 'canceled'],
      'ready': ['served'],
      'served': [],
      'canceled': []
    };

    if (!validTransitions[order.status].includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change status from ${order.status} to ${status}`
      });
    }

    // Update order
    order.status = status;
    if (estimatedReadyTime) {
      order.estimatedReadyTime = new Date(estimatedReadyTime);
    }

    await order.save();

    // Populate order details
    await order.populate([
      { path: 'tableId', select: 'number qrSlug' },
      { path: 'customerId', select: 'name email' },
      { path: 'items.menuItemId', select: 'name price' }
    ]);

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: {
        order
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message
    });
  }
};

// Get customer's orders
const getMyOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const customerId = req.user.id;

    const filter = { customerId };
    if (status) filter.status = status;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [orders, totalCount] = await Promise.all([
      Order.find(filter)
        .populate('tableId', 'number qrSlug')
        .populate('items.menuItemId', 'name price')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Order.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(totalCount / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalItems: totalCount,
          itemsPerPage: limitNum,
          hasNextPage,
          hasPrevPage
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch your orders',
      error: error.message
    });
  }
};

// Cancel order (Customer only)
const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const customerId = req.user.id;

    const order = await Order.findOne({ _id: id, customerId });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (!['placed', 'preparing'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be canceled at this stage'
      });
    }

    order.status = 'canceled';
    await order.save();

    res.json({
      success: true,
      message: 'Order canceled successfully',
      data: {
        order
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order',
      error: error.message
    });
  }
};

// Get order analytics (Admin only)
const getOrderAnalytics = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalOrders,
      todayOrders,
      pendingOrders,
      revenueToday,
      revenueTotal
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ createdAt: { $gte: today } }),
      Order.countDocuments({ status: { $in: ['placed', 'preparing'] } }),
      Order.aggregate([
        { $match: { createdAt: { $gte: today }, status: { $ne: 'canceled' } } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]),
      Order.aggregate([
        { $match: { status: { $ne: 'canceled' } } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ])
    ]);

    // Get status distribution
    const statusDistribution = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Get top items
    const topItems = await Order.aggregate([
      { $unwind: '$items' },
      { $group: { _id: '$items.menuItemId', totalQuantity: { $sum: '$items.quantity' } } },
      { $lookup: { from: 'menuitems', localField: '_id', foreignField: '_id', as: 'item' } },
      { $unwind: '$item' },
      { $project: { name: '$item.name', totalQuantity: 1 } },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      success: true,
      data: {
        analytics: {
          totalOrders,
          todayOrders,
          pendingOrders,
          revenueToday: revenueToday[0]?.total || 0,
          revenueTotal: revenueTotal[0]?.total || 0,
          statusDistribution,
          topItems
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order analytics',
      error: error.message
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  getMyOrders,
  cancelOrder,
  getOrderAnalytics
};

