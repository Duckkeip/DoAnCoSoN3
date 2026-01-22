import React from "react";
import { useParams, useLocation } from "react-router-dom";
import "./detail.css";

function DetailF(props) {
  const { pid } = useParams();
  const location = useLocation();
  const user_id = location.state?.user_id || JSON.parse(localStorage.getItem("user"))?.id;

  if (!pid) return <p>Sản phẩm không tồn tại</p>;
  return <Detail {...props} id={pid} user_id={user_id} />;
}

class Detail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      product_data: {},
      quantity: 1,
      activeTab: "description",
      selectedImage: null,
      relatedProducts: [],
      cartCount: 0,
    };
  }

  componentDidMount() {
    this.getDetailProduct(this.props.id);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.id !== this.props.id) {
      this.getDetailProduct(this.props.id);
    }
  }
getDetailProduct = (id) => {
  fetch(`http://localhost:5000/api/products/${id}`)
    .then((res) => res.json())
    .then((data) => {
      const product = data.product;
      if (!product) return;

      // 1. Lấy mảng hình ảnh (nếu hinhAnh rỗng thì dùng tạm anhDaiDien)
      const imagesArray = product.hinhAnh && product.hinhAnh.length > 0 
        ? product.hinhAnh 
        : [product.anhDaiDien];

      this.setState({
        product_data: product,
        images: imagesArray,
        selectedImage: product.anhDaiDien, // Dùng trường anhDaiDien làm ảnh mặc định
        quantity: 1,
      });

      // 2. Gọi sản phẩm liên quan (Dùng trường 'category' cho khớp với Document của bạn)
      this.getRelatedProducts(product.category); 
    })
    .catch((err) => console.error("Lỗi fetch chi tiết:", err));
};


      getRelatedProducts = (type) => {
        if (!type) return;
         fetch(`http://localhost:5000/api/products/byType/${type}`)
          .then((res) => res.json())
          .then((data) => {
             this.setState({ relatedProducts: data.products || [] });
          })
          .catch((err) => console.error(err));
      };

  onChangeTabChange = (tab) => this.setState({ activeTab: tab });
  onChangeImageSelect = (img) => this.setState({ selectedImage: img });
  onChangeQuantity = (e) => {
    const value = Number(e.target.value);
    if (value > 0) this.setState({ quantity: value });
  };

  onClickBuyNow = () => alert(`Đặt mua ${this.state.quantity} sản phẩm thành công!`);

  onClickAddToCart = async () => {
    const { user_id } = this.props;
    const { product_data, quantity, selectedImage } = this.state;
    
    // Đồng bộ object product gửi lên giỏ hàng
    const product = {
      product_id: product_data._id,
      name: product_data.tenSanPham,
      price: product_data.gia,
      image: selectedImage, // Lưu ảnh đang được chọn làm ảnh đại diện trong giỏ
      quantity: quantity,
    };

    try {
      const res = await fetch("http://localhost:5000/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id, product }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || "Đã thêm vào giỏ hàng!");
      }
    } catch (err) {
      console.error(err);
      alert("💥 Lỗi khi thêm vào giỏ hàng");
    }
  };

  onClickSelectedId = (id) => (window.location.href = `/detail/${id}`);

  render() {
    const { product_data, selectedImage,  quantity, activeTab, relatedProducts } = this.state;

    if (!product_data.tenSanPham) return <div className="container mt-5">Đang tải...</div>;

    return (
      <div className="product-detail-container container mt-4">
        <h3 className="mb-4">{product_data.tenSanPham}</h3>

        <div className="row">
          <div className="col-md-6">
            <div className="main-image-container border rounded p-2 mb-3 bg-white">
              <img
                src={selectedImage}
                alt={product_data.tenSanPham}
                className="img-fluid"
                style={{ width: "100%", height: "400px", objectFit: "contain" }}
                onError={(e) => { e.target.src = "/no-image.png"; }}
              />
            </div>
          </div>

          <div className="col-md-6">
            <p className="text-muted">Thương hiệu: <strong>{product_data.tenThuongHieu}</strong></p>
            <div className="price-box mb-3">
               <h4 className="fw-bold text-danger">
                {product_data.gia ? `${product_data.gia.toLocaleString("vi-VN")}₫` : "Liên hệ"}
              </h4>
            </div>
            
            <div className="mb-4">
               <p><strong>Tình trạng:</strong> {product_data.soLuong > 0 ? `Còn hàng (${product_data.soLuong})` : "Hết hàng"}</p>
               <p className="product-short-desc">{product_data.moTa}</p>
            </div>

            <div className="d-flex align-items-center mb-4 gap-3">
              <div className="quantity-group d-flex align-items-center border rounded">
                <button className="btn btn-light" onClick={() => this.onChangeQuantity({target: {value: quantity - 1}})}>-</button>
                <input
                  type="number"
                  className="form-control border-0 text-center"
                  value={quantity}
                  min="1"
                  style={{ width: "60px" }}
                  onChange={this.onChangeQuantity}
                />
                <button className="btn btn-light" onClick={() => this.onChangeQuantity({target: {value: quantity + 1}})}>+</button>
              </div>
              
              <div className="d-flex gap-2 w-100">
                <button className="btn btn-outline-danger flex-grow-1 py-2" onClick={this.onClickBuyNow}>
                  MUA NGAY
                </button>
                <button className="btn btn-danger flex-grow-1 py-2" onClick={this.onClickAddToCart}>
                  THÊM VÀO GIỎ
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Chi tiết */}
        <ul className="nav nav-tabs mt-5">
          <li className="nav-item">
            <button className={`nav-link ${activeTab === "description" ? "active" : ""}`} onClick={() => this.onChangeTabChange("description")}>Mô tả sản phẩm</button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${activeTab === "related" ? "active" : ""}`} onClick={() => this.onChangeTabChange("related")}>Sản phẩm liên quan</button>
          </li>
        </ul>

        <div className="border border-top-0 p-4 bg-white mb-5">
          {activeTab === "description" && (
            <div className="description-content">
              <h5>Thông tin chi tiết</h5>
              <p>{product_data.moTa}</p>
              <table className="table table-bordered mt-3" style={{maxWidth: "400px"}}>
                <tbody>
                  <tr>
                    <td className="bg-light w-50">Thương hiệu</td>
                    <td>{product_data.tenThuongHieu}</td>
                  </tr>
                  <tr>
                    <td className="bg-light">Danh mục</td>
                    <td>{product_data.tenDanhMuc}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "related" && (
            <div className="row related-products">
              {relatedProducts.length === 0 && <p>Đang cập nhật sản phẩm liên quan...</p>}
              {relatedProducts.map((item) => (
          <div key={item._id} className="col-md-3 mb-3">
            <div className="card h-100" onClick={() => this.onClickSelectedId(item._id)}>
              <img 
                src={item.anhDaiDien} // Lấy trực tiếp trường anhDaiDien bên ngoài
                alt={item.tenSanPham} 
                className="card-img-top p-2" 
                style={{ height: "180px", objectFit: "contain" }} 
              />
              <div className="card-body text-center">
                <h6>{item.tenSanPham}</h6>
                <p className="text-danger fw-bold">{item.gia?.toLocaleString("vi-VN")}₫</p>
              </div>
            </div>
          </div>
        ))}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default DetailF;