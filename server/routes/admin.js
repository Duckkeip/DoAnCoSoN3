const express = require("express");
const { ObjectId } = require("mongodb");
const db = require("../config/db");

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { mainCat, subCat } = req.body;
    const dir = path.join(__dirname, `../../web/public/images/${mainCat}/${subCat}`);
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

/* ========== USER MANAGEMENT ========== */

// 1. Lấy danh sách user (Lấy đầy đủ thông tin trừ password)
router.get("/users", async (req, res) => {
    try {
        const database = await db();
        const users = await database.collection("users")
            .find({})
            .project({ password: 0 }) // Không gửi mật khẩu về client
            .sort({ ngayTao: -1 })    // Mới nhất lên đầu
            .toArray();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Lỗi lấy danh sách người dùng" });
    }
});

// 2. Cập nhật trạng thái và xác thực (Gộp chung vào một API cho gọn)
router.put("/users/:id/status", async (req, res) => {
    try {
        const database = await db();
        const { tinhtrang, verified } = req.body; // Lấy dữ liệu từ client
        
        const updateDoc = {};
        if (tinhtrang !== undefined) updateDoc.tinhtrang = tinhtrang;
        if (verified !== undefined) updateDoc.verified = verified;

        const result = await database.collection("users").updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: updateDoc }
        );

        if (result.matchedCount === 0) return res.status(404).json({ message: "Không tìm thấy user" });
        res.json({ message: "Cập nhật thông tin thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server" });
    }
});

// 3. Xóa người dùng
router.delete("/users/:id", async (req, res) => {
    try {
        const database = await db();
        await database.collection("users").deleteOne({ _id: new ObjectId(req.params.id) });
        res.json({ message: "Đã xóa tài khoản vĩnh viễn" });
    } catch (error) {
        res.status(500).json({ message: "Không thể xóa người dùng" });
    }
});
  
/* ===== PRODUCT ===== */

router.get("/products", async (req, res) => {
  const database = await db();

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const { category, brand, minPrice, maxPrice } = req.query;

  let filter = {};

  if (category) {
    filter.category = { $in: category.split(",") };
  }

  if (brand) {
    filter.brand = { $in: brand.split(",") };
  }

  if (minPrice || maxPrice) {
    filter.gia = {};
    if (minPrice) filter.gia.$gte = Number(minPrice);
    if (maxPrice) filter.gia.$lte = Number(maxPrice);
  }

  try {
    const total = await database.collection("products").countDocuments(filter);

    const products = await database.collection("products")
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

// API Thêm sản phẩm
router.post("/products", upload.single('image'), async (req, res) => {
  try {
    const database = await db();
    
    const { 
      tenSanPham, category, tenDanhMuc, brand, 
      tenThuongHieu, gia, soLuong, moTa, trangThai,
      mainCat, subCat 
    } = req.body;

    const fileName = req.file ? req.file.filename : "default.png";

    const newProduct = {
      tenSanPham,
      category,
      tenDanhMuc,
      brand,
      tenThuongHieu,
      gia: Number(gia),
      soLuong: Number(soLuong),
      hinhAnh: [`/images/${mainCat}/${subCat}/${fileName}`],
      anhDaiDien: `/images/${mainCat}/${subCat}/${fileName}`,
      moTa,
      trangThai: trangThai || "dang-ban",
      createdAt: new Date()
    };

    await database.collection("products").insertOne(newProduct);
    res.json({ message: "Thêm sản phẩm thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi lưu sản phẩm" });
  }
});

// ✅ API CẬP NHẬT (ĐÃ FIX FORM DATA + IMAGE)
router.put("/products/:id", upload.single('image'), async (req, res) => {
  try {
    const database = await db();
    const updateData = { ...req.body };

    // Nếu có ảnh mới thì cập nhật
    if (req.file) {
      const { mainCat, subCat } = req.body;
      const fileName = req.file.filename;
      updateData.anhDaiDien = `/images/${mainCat}/${subCat}/${fileName}`;
      updateData.hinhAnh = [`/images/${mainCat}/${subCat}/${fileName}`];
    }

    // Convert kiểu dữ liệu (vì FormData gửi string)
    if (updateData.gia) updateData.gia = Number(updateData.gia);
    if (updateData.soLuong) updateData.soLuong = Number(updateData.soLuong);

    await database.collection("products").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updateData }
    );

    res.json({ message: "Cập nhật sản phẩm thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi cập nhật" });
  }
});

// Xóa sản phẩm
router.delete("/products/:id", async (req, res) => {
  const database = await db();
  await database.collection("products").deleteOne({ _id: new ObjectId(req.params.id) });
  res.json({ message: "Xóa sản phẩm thành công" });
});

module.exports = router;