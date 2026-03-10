import { Link } from "react-router-dom";

const products = [
  {
    id: 1,
    name: "PC Gaming i3 12100F | RTX 3050",
    price: "12.990.000",
    img: "/pc1.png",
    tag: "HOT",
  },
  {
    id: 2,
    name: "PC Gaming i5 12400F | RTX 3060",
    price: "16.990.000",
    img: "/pc2.png",
    tag: "TẶNG MÀN HÌNH",
  },
  {
    id: 3,
    name: "PC Gaming i5 13400F | RTX 4060",
    price: "21.990.000",
    img: "/pc3.png",
    tag: "TẶNG MÀN HÌNH",
  },
  {
    id: 4,
    name: "PC Gaming Ryzen 5 | RTX 4060",
    price: "20.990.000",
    img: "/pc4.png",
    tag: "TẶNG MÀN HÌNH",
  },
  {
    id: 5,
    name: "PC Gaming Ryzen 7 | RTX 4070",
    price: "27.990.000",
    img: "/pc5.png",
    tag: "HOT",
  },
];

export default function Home() {
  return (
    <div className="bg-light">
      <div className="container">
        {/* BANNER */}
        <div className="row mt-3">
          <div className="col-md-15">
            <img src="/images/panelPC.jpg" className="img-fluid rounded" />
          </div>
        </div>

        {/* TITLE */}

        <div className="text-center mt-4">
          <h4 className="fw-bold text-primary">PC GAMING</h4>

          <div className="d-flex justify-content-center gap-5 mt-3">
            <div>
              <i className="bi bi-pc-display fs-3"></i>
              <p className="small">CHỌN THEO NHU CẦU</p>
            </div>

            <div>
              <i className="bi bi-cash-stack fs-3"></i>
              <p className="small">CHỌN THEO GIÁ</p>
            </div>

            <div>
              <i className="bi bi-cpu fs-3"></i>
              <p className="small">GAME ON AMD</p>
            </div>
          </div>
        </div>

        {/* FILTER */}

        <div className="mt-3 text-center">
          <button className="btn btn-outline-secondary btn-sm m-1">
            5 triệu - 15 triệu
          </button>
          <button className="btn btn-outline-secondary btn-sm m-1">
            15 triệu - 20 triệu
          </button>
          <button className="btn btn-outline-secondary btn-sm m-1">
            20 triệu - 30 triệu
          </button>
          <button className="btn btn-outline-secondary btn-sm m-1">
            30 triệu - 50 triệu
          </button>
          <button className="btn btn-outline-secondary btn-sm m-1">
            50 triệu - 100 triệu
          </button>
        </div>

        {/* SORT BAR */}

        <div className="d-flex justify-content-between mt-4 bg-white p-2 rounded">
          <div>
            <button className="btn btn-light btn-sm me-2">Giá tăng dần</button>
            <button className="btn btn-light btn-sm me-2">Giá giảm dần</button>
            <button className="btn btn-light btn-sm me-2">Tên A-Z</button>
          </div>

          <div>
            <i className="bi bi-grid fs-5 me-2"></i>
            <i className="bi bi-list fs-5"></i>
          </div>
        </div>

        {/* PRODUCT GRID */}

        <div className="row mt-3">
          {products.concat(products, products, products).map((p, index) => (
            <div className="col-lg-2 col-md-3 col-sm-6 mb-4" key={index}>
              <div className="card shadow-sm border-0 h-100 position-relative">
                {/* TAG */}

                <span
                  className={`badge position-absolute top-0 start-0 m-2 
${p.tag === "HOT" ? "bg-danger" : "bg-primary"}`}
                >
                  {p.tag}
                </span>

                <img src={p.img} className="card-img-top p-2" />

                <div className="card-body p-2">
                  <h6 className="small">{p.name}</h6>

                  <p className="text-danger fw-bold mb-1">{p.price} đ</p>

                  <p className="small text-muted">Sẵn hàng</p>

                  <button className="btn btn-primary btn-sm w-100">
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* PAGINATION */}

        <nav className="d-flex justify-content-center">
          <ul className="pagination">
            <li className="page-item active">
              <a className="page-link">1</a>
            </li>

            <li className="page-item">
              <a className="page-link">2</a>
            </li>

            <li className="page-item">
              <a className="page-link">3</a>
            </li>
          </ul>
        </nav>

      </div>
    </div>
  );
}
