import { useEffect, useState } from "react";
import { getArticleCategory } from "../api/articleCategoryAPI";
import ArticleCategoryList from "../component/ArticleCategoryList";

export default function ActicleCategory() {
  const [articlecategory, setArticleCategory] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      useEffect(() => {
        getArticleCategory()
          .then(data => {
            setArticleCategory(data);
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
      <h2>Đây là trang Acticle Category</h2>
      <h3>Quản lý Loai Bai Viet</h3>
      <ArticleCategoryList articlecategorys={articlecategory} />
      <button>Thêm Loai Bai Viet</button>
    </div>
  )
}
