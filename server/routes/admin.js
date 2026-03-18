const express = require("express");
const { ObjectId } = require("mongodb");
const db = require("../config/db");
const bcrypt = require("bcrypt");

const multer = require("multer");
const path = require("path");
const fs = require("fs");

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

router.get("/users", async (req, res) => {
  try {
    const database = await db();
    const users = await database
      .collection("users")
      .find({})
      .project({ password: 0 })
      .sort({ ngayTao: -1 })
      .toArray();

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy danh sách người dùng" });
  }
});

router.post("/users", async (req, res) => {
  try {
    const database = await db();
    const { username, email, password, role, SDT, address } = req.body;

    const existing = await database.collection("users").findOne({ email });
    if (existing) return res.status(400).json({ message: "Email đã tồn tại" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      username,
      email,
      password: hashedPassword,
      role: role || "user",
      SDT: SDT || "",
      address: address || "",
      tinhtrang: "active",
      verified: req.body.verified === true || req.body.verified === "true",
      ngayTao: new Date()
    };

    await database.collection("users").insertOne(newUser);
    res.json({ message: "Thêm người dùng thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

router.put("/users/:id", async (req, res) => {
  try {
    const database = await db();
    const updateData = { ...req.body };

    delete updateData._id;

    const result = await database.collection("users").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Không tìm thấy user" });
    }

    res.json({ message: "Cập nhật thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    const database = await db();
    await database.collection("users").deleteOne({
      _id: new ObjectId(req.params.id)
    });

    res.json({ message: "Đã xóa tài khoản vĩnh viễn" });
  } catch (error) {
    res.status(500).json({ message: "Không thể xóa người dùng" });
  }
});

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

    const products = await database
      .collection("products")
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

router.post("/products", upload.single("image"), async (req, res) => {
  try {
    const database = await db();

    const {
      tenSanPham,
      category,
      tenDanhMuc,
      brand,
      tenThuongHieu,
      gia,
      soLuong,
      moTa,
      trangThai,
      mainCat,
      subCat
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

router.put("/products/:id", upload.single("image"), async (req, res) => {
  try {
    const database = await db();
    const updateData = { ...req.body };

    if (req.file) {
      const { mainCat, subCat } = req.body;
      const fileName = req.file.filename;

      updateData.anhDaiDien = `/images/${mainCat}/${subCat}/${fileName}`;
      updateData.hinhAnh = [`/images/${mainCat}/${subCat}/${fileName}`];
    }

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

router.delete("/products/:id", async (req, res) => {
  try {
    const database = await db();

    await database.collection("products").deleteOne({
      _id: new ObjectId(req.params.id)
    });

    res.json({ message: "Xóa sản phẩm thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

module.exports = router;