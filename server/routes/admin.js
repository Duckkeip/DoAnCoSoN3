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
    // Tạo đường dẫn: public/images/caulong/vot
    const dir = path.join(__dirname, `../../web/public/images/${mainCat}/${subCat}`);
    
    // Tạo thư mục nếu chưa có
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
/* ========== USER ========== */

// Lấy danh sách user
router.get("/users", async (req, res) => {
    const database = await db();
    const users = await database.collection("users").find({}, { projection: { password: 0 } }).toArray();
    res.json(users);
  });
  // Cập nhật trạng thái user
router.put("/users/:id/status", async (req, res) => {
    const { status } = req.body; // active | block
    await db.collection("users").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { status } }
    );
    res.json({ message: "Cập nhật trạng thái thành công" });
  });
  
/* ===== PRODUCT ===== */

router.get("/products", async (req, res) => {
  const database = await db();

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const { category, brand, minPrice, maxPrice } = req.query;

  let filter = {};

  // Lọc category
  if (category) {
    filter.category = { $in: category.split(",") };
  }

  // Lọc brand
  if (brand) {
    filter.brand = { $in: brand.split(",") };
  }

  // Lọc giá
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
    
    // Lấy dữ liệu từ req.body (đã được Multer giải mã)
    const { 
      tenSanPham, category, tenDanhMuc, brand, 
      tenThuongHieu, gia, soLuong, moTa, trangThai,
      mainCat, subCat 
    } = req.body;

    // Tên file thực tế do Multer tạo ra
    const fileName = req.file ? req.file.filename : "default.png";

    const newProduct = {
      tenSanPham,
      category,
      tenDanhMuc,
      brand,
      tenThuongHieu,
      gia: Number(gia),
      soLuong: Number(soLuong),
      // Cấu trúc đường dẫn chuẩn: /images/caulong/vot/vot1.png
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

router.put("/products/:id", async (req, res) => {
  const database = await db();
  await database.collection("products").updateOne(
    { _id: new ObjectId(req.params.id) },
    { $set: req.body }
  );
  res.json({ message: "Cập nhật sản phẩm thành công" });
});

router.delete("/products/:id", async (req, res) => {
  const database = await db();
  await database.collection("products").deleteOne({ _id: new ObjectId(req.params.id) });
  res.json({ message: "Xóa sản phẩm thành công" });
});

module.exports = router;
