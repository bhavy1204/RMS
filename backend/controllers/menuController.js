const MenuCategory = require('../models/MenuCategory');
const MenuItem = require('../models/MenuItem');

// Get all menu categories
const getCategories = async (req, res) => {
  try {
    const categories = await MenuCategory.find({ active: true })
      .sort({ displayOrder: 1 })
      .select('-__v');

    res.json({
      success: true,
      data: {
        categories
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message
    });
  }
};

// Get menu items with filtering, search, and pagination
const getMenuItems = async (req, res) => {
  try {
    const {
      search,
      category,
      sort = 'name',
      page = 1,
      limit = 20,
      availability = 'true',
      tags,
      minPrice,
      maxPrice
    } = req.query;

    // Build filter object
    const filter = {};

    // Availability filter
    if (availability === 'true') {
      filter.availability = true;
    }

    // Category filter
    if (category) {
      filter.categoryId = category;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Tags filter
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim().toLowerCase());
      filter.tags = { $in: tagArray };
    }

    // Search filter
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Sort options
    const sortOptions = {};
    switch (sort) {
      case 'price-asc':
        sortOptions.price = 1;
        break;
      case 'price-desc':
        sortOptions.price = -1;
        break;
      case 'popularity':
        sortOptions.popularityScore = -1;
        break;
      case 'name':
      default:
        sortOptions.name = 1;
        break;
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const [items, totalCount] = await Promise.all([
      MenuItem.find(filter)
        .populate('categoryId', 'name displayOrder')
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .select('-__v'),
      MenuItem.countDocuments(filter)
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;

    res.json({
      success: true,
      data: {
        items,
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
      message: 'Failed to fetch menu items',
      error: error.message
    });
  }
};

// Get single menu item
const getMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await MenuItem.findById(id)
      .populate('categoryId', 'name displayOrder')
      .select('-__v');

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    res.json({
      success: true,
      data: {
        item
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch menu item',
      error: error.message
    });
  }
};

// Create menu category (Admin only)
const createCategory = async (req, res) => {
  try {
    const { name, displayOrder, description, imageUrl } = req.body;

    const category = new MenuCategory({
      name,
      displayOrder,
      description,
      imageUrl
    });

    await category.save();

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: {
        category
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create category',
      error: error.message
    });
  }
};

// Update menu category (Admin only)
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const category = await MenuCategory.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: {
        category
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update category',
      error: error.message
    });
  }
};

// Delete menu category (Admin only)
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if category has items
    const itemCount = await MenuItem.countDocuments({ categoryId: id });
    if (itemCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with existing items'
      });
    }

    const category = await MenuCategory.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete category',
      error: error.message
    });
  }
};

// Create menu item (Admin only)
const { getFileUrl, deleteFile } = require('../utils/fileUpload');

const createMenuItem = async (req, res) => {
  try {
    const menuItemData = req.body;
    if (req.file) {
      menuItemData.imageUrl = getFileUrl(req.file.filename);
    }

    const menuItem = new MenuItem(menuItemData);
    await menuItem.save();

    // Populate category info
    await menuItem.populate('categoryId', 'name displayOrder');

    res.status(201).json({
      success: true,
      message: 'Menu item created successfully',
      data: {
        item: menuItem
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create menu item',
      error: error.message
    });
  }
};

// Update menu item (Admin only)
const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    if (req.file) {
      updateData.imageUrl = getFileUrl(req.file.filename);
    }

    const menuItem = await MenuItem.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('categoryId', 'name displayOrder');

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    res.json({
      success: true,
      message: 'Menu item updated successfully',
      data: {
        item: menuItem
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update menu item',
      error: error.message
    });
  }
};

// Delete menu item (Admin only)
const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    const menuItem = await MenuItem.findByIdAndDelete(id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    res.json({
      success: true,
      message: 'Menu item deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete menu item',
      error: error.message
    });
  }
};

// Toggle item availability (Admin/Staff only)
const toggleAvailability = async (req, res) => {
  try {
    const { id } = req.params;

    const menuItem = await MenuItem.findById(id);
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    menuItem.availability = !menuItem.availability;
    await menuItem.save();

    res.json({
      success: true,
      message: `Item ${menuItem.availability ? 'enabled' : 'disabled'} successfully`,
      data: {
        item: menuItem
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to toggle availability',
      error: error.message
    });
  }
};

// Get menu analytics (Admin only)
const getMenuAnalytics = async (req, res) => {
  try {
    const [
      totalItems,
      availableItems,
      totalCategories,
      popularItems
    ] = await Promise.all([
      MenuItem.countDocuments(),
      MenuItem.countDocuments({ availability: true }),
      MenuCategory.countDocuments({ active: true }),
      MenuItem.find({ availability: true })
        .sort({ popularityScore: -1 })
        .limit(5)
        .select('name popularityScore price')
    ]);

    res.json({
      success: true,
      data: {
        analytics: {
          totalItems,
          availableItems,
          totalCategories,
          popularItems
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch menu analytics',
      error: error.message
    });
  }
};

module.exports = {
  getCategories,
  getMenuItems,
  getMenuItem,
  createCategory,
  updateCategory,
  deleteCategory,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleAvailability,
  getMenuAnalytics
};


