const QRCode = require('qrcode');
const Table = require('../models/Table');

// Generate QR code for table
const generateQRCode = async (req, res) => {
  try {
    const { id } = req.params;

    const table = await Table.findById(id);
    if (!table) {
      return res.status(404).json({
        success: false,
        message: 'Table not found'
      });
    }

    // Generate QR code URL
    const qrUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/m/${table.qrSlug}`;
    
    // Generate QR code as data URL
    const qrCodeDataURL = await QRCode.toDataURL(qrUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    res.json({
      success: true,
      data: {
        qrCode: qrCodeDataURL,
        qrUrl,
        table: {
          id: table._id,
          number: table.number,
          qrSlug: table.qrSlug
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate QR code',
      error: error.message
    });
  }
};

// Get table by QR slug (public route)
const getTableBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const table = await Table.findOne({ qrSlug: slug, isActive: true });
    if (!table) {
      return res.status(404).json({
        success: false,
        message: 'Table not found or inactive'
      });
    }

    res.json({
      success: true,
      data: {
        table: {
          id: table._id,
          number: table.number,
          qrSlug: table.qrSlug,
          capacity: table.capacity,
          location: table.location
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch table',
      error: error.message
    });
  }
};

// Get all tables (Admin only)
const getTables = async (req, res) => {
  try {
    const { page = 1, limit = 20, active } = req.query;

    const filter = {};
    if (active !== undefined) {
      filter.isActive = active === 'true';
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [tables, totalCount] = await Promise.all([
      Table.find(filter)
        .sort({ number: 1 })
        .skip(skip)
        .limit(limitNum)
        .select('-__v'),
      Table.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(totalCount / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;

    res.json({
      success: true,
      data: {
        tables,
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
      message: 'Failed to fetch tables',
      error: error.message
    });
  }
};

// Get single table (Admin only)
const getTable = async (req, res) => {
  try {
    const { id } = req.params;

    const table = await Table.findById(id).select('-__v');

    if (!table) {
      return res.status(404).json({
        success: false,
        message: 'Table not found'
      });
    }

    res.json({
      success: true,
      data: {
        table
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch table',
      error: error.message
    });
  }
};

// Create table (Admin only)
const createTable = async (req, res) => {
  try {
    const { number, capacity, location } = req.body;

    // Check if table number already exists
    const existingTable = await Table.findOne({ number });
    if (existingTable) {
      return res.status(400).json({
        success: false,
        message: 'Table with this number already exists'
      });
    }

    const table = new Table({
      number,
      capacity,
      location
    });

    await table.save();

    res.status(201).json({
      success: true,
      message: 'Table created successfully',
      data: {
        table
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create table',
      error: error.message
    });
  }
};

// Update table (Admin only)
const updateTable = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if updating number and it already exists
    if (updateData.number) {
      const existingTable = await Table.findOne({ 
        number: updateData.number, 
        _id: { $ne: id } 
      });
      if (existingTable) {
        return res.status(400).json({
          success: false,
          message: 'Table with this number already exists'
        });
      }
    }

    const table = await Table.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!table) {
      return res.status(404).json({
        success: false,
        message: 'Table not found'
      });
    }

    res.json({
      success: true,
      message: 'Table updated successfully',
      data: {
        table
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update table',
      error: error.message
    });
  }
};

// Delete table (Admin only)
const deleteTable = async (req, res) => {
  try {
    const { id } = req.params;

    const table = await Table.findByIdAndDelete(id);

    if (!table) {
      return res.status(404).json({
        success: false,
        message: 'Table not found'
      });
    }

    res.json({
      success: true,
      message: 'Table deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete table',
      error: error.message
    });
  }
};

// Toggle table active status (Admin only)
const toggleTableStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const table = await Table.findById(id);
    if (!table) {
      return res.status(404).json({
        success: false,
        message: 'Table not found'
      });
    }

    table.isActive = !table.isActive;
    await table.save();

    res.json({
      success: true,
      message: `Table ${table.isActive ? 'activated' : 'deactivated'} successfully`,
      data: {
        table
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to toggle table status',
      error: error.message
    });
  }
};

// Bulk generate QR codes for all tables (Admin only)
const bulkGenerateQRCodes = async (req, res) => {
  try {
    const tables = await Table.find({ isActive: true }).select('number qrSlug');

    const qrCodes = await Promise.all(
      tables.map(async (table) => {
        const qrUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/m/${table.qrSlug}`;
        const qrCodeDataURL = await QRCode.toDataURL(qrUrl, {
          width: 200,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });

        return {
          tableId: table._id,
          tableNumber: table.number,
          qrSlug: table.qrSlug,
          qrUrl,
          qrCode: qrCodeDataURL
        };
      })
    );

    res.json({
      success: true,
      data: {
        qrCodes
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate QR codes',
      error: error.message
    });
  }
};

module.exports = {
  generateQRCode,
  getTableBySlug,
  getTables,
  getTable,
  createTable,
  updateTable,
  deleteTable,
  toggleTableStatus,
  bulkGenerateQRCodes
};

