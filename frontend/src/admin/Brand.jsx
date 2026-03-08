import { useEffect, useState } from "react";
import { getBrand } from "../api/brandAPI";
import BrandList from "../component/BrandList";
export default function Brand() {
  const [brand, setBrand] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    getBrand()
      .then(data => {
        setBrand(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
  return (
    <div>
      <h2>Đây là trang Brand</h2>
      <h3>Quản lý Brand</h3>
       <BrandList brands={brand} />
      <button>Thêm Brand</button>
    </div>
  )
}

