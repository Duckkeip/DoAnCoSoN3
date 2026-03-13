const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const db = require("../config/db");
const moment = require("moment");
const crypto = require("crypto");
const qs = require("qs");
let config = require("config");

const { PayOS } = require("@payos/node");

const payos = new PayOS(
  "87ef075f-9c12-44d1-b483-8e0dab0a374d", 
  "04efac8d-b0d7-4f6a-8e5d-ccf5cab60bb8", 
  "fccc1b99c91a2fc49f953f1bb3fc220142a597f2e99c9f7b1ed09f3028997b29"
);
// Hàm sắp xếp object theo key
function sortObject(obj) {
    const sorted = {};
    Object.keys(obj).sort().forEach(key => {
        sorted[key] = obj[key];
    });
    return sorted;
}

// ======================= TẠO ĐƠN HÀNG =======================
router.post("/create", async (req, res) => {
  try {
    const database = await db();
    const { user, chitietdonhang, tongtien, thanhtoan, status, address } = req.body;

    if (!user || !chitietdonhang || !tongtien) {
      return res.status(400).json({ success: false, message: "Thiếu thông tin đơn hàng" });
    }

    const newOrder = {
      user,
      chitietdonhang,
      tongtien,
      thanhtoan: thanhtoan || false,
      status: status || "dangcho",
      address: address || "",
      createdAt: new Date(),
    };

    const result = await database.collection("donhang").insertOne(newOrder);
    const order = await database.collection("donhang").findOne({ _id: result.insertedId });

    res.json({ success: true, order });
  } catch (err) {
    console.error("💥 Lỗi tạo đơn hàng:", err);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
});

// ======================= HỦY ĐƠN =======================
router.put("/:orderId/cancel", async (req, res) => {
  try {
    const database = await db();
    const { orderId } = req.params;
    await database.collection("donhang").updateOne(
      { _id: new ObjectId(orderId) },
      { $set: { status: "huy" } }
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

// ======================= THANH TOÁN THỦ CÔNG =======================
router.put("/:orderId/pay", async (req, res) => {
  try {
    const database = await db();
    const { orderId } = req.params;
    await database.collection("donhang").updateOne(
      { _id: new ObjectId(orderId) },
      { $set: { thanhtoan: true, status: "dathanhtoan" } }
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

// ======================= TẠO URL THANH TOÁN PAYOS =======================
router.post("/create-payos-checkout", async (req, res) => {
  try {
    const { orderId, amount, description, items } = req.body;

    if (!orderId || !amount) {
      return res.status(400).json({ success: false, message: "Thiếu thông tin thanh toán" });
    }

    // PayOS yêu cầu orderCode là kiểu Number
    // Giải pháp: Lấy 6-9 số cuối của timestamp để đảm bảo tính duy nhất và là số
    const orderCode = Number(String(Date.now()).slice(-9));

    const body = {
      orderCode: orderCode,
      amount: Number(amount),
      description: (description || "Thanh toan DH").slice(0,25),
      items: items || [],
      returnUrl: `http://localhost:5173/payment-success`, // Trang FE khi thành công
      cancelUrl: `http://localhost:5173/cart`,          // Trang FE khi hủy
    };

    const paymentLink = await payos.paymentRequests.create(body);

    // Lưu lại orderCode của PayOS vào đơn hàng trong DB để đối soát sau này
    const database = await db();
    await database.collection("donhang").updateOne(
      { _id: new ObjectId(orderId) },
      { $set: { payosOrderCode: orderCode } }
    );

    res.json({
      success: true,
      checkoutUrl: paymentLink.checkoutUrl
    });

  } catch (err) {
    console.error("💥 Lỗi tạo link PayOS:", err);
    res.status(500).json({ success: false, message: "Lỗi kết nối PayOS" });
  }
});

// ======================= WEBHOOK PAYOS (Xử lý kết quả tự động) =======================
// Thay thế cho IPN của VNPAY
router.post("/payos-webhook", async (req, res) => {
  const { code, data } = req.body;

  if (code === "00" && data.status === "PAID") {
    const database = await db();
    
    // Tìm đơn hàng dựa trên orderCode đã lưu
    const order = await database.collection("donhang").findOne({ 
      payosOrderCode: data.orderCode 
    });

    if (order) {
      // Cập nhật trạng thái đã thanh toán
      await database.collection("donhang").updateOne(
        { _id: order._id },
        { $set: { thanhtoan: true, status: "dathanhtoan" } }
      );

      // Xóa giỏ hàng của user
      await database.collection("giohang").deleteOne({ user_id: order.user });
    }
  }

  res.json({ success: true });
});

module.exports = router;
