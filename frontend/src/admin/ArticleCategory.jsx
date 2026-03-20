import { useEffect, useState } from "react";
import { getArticleCategory } from "../api/articleCategoryAPI";
import ArticleCategoryList from "../component/ArticleCategoryList";
import "../admin/CSS/articlecategory.css";
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
    <div className="container-fluid min-vh-100 d-flex flex-column">
        <div className="card shadow-lg border-0 flex-grow-1">
          <div className="card-body">
             <div className="d-flex justify-content-between align-items-center mb-3 header-line">
              <h5 className="card-title fw-bold text-primary">Quản Lý Loại Bài Viết</h5>
              <button className="btn btn-primary shadow-sm">
                + Thêm Loại Bài Viết
              </button>
            </div>
             <div className="table-responsive">
               <table className="table table-hover table-bordered text-nowrap align-middle">
                 <thead>
                   <tr>
                    <th className="text-center">Mã Loại Bài Viết</th>
                    <th className="text-center">Tên Loại Bài Viết</th>
                    <th className="text-center">Thứ Tự Bài Viết</th>
                    <th className="text-center">Quản Lí</th>
                   </tr>
                 </thead>
                  <tbody>
                      <ArticleCategoryList articlecategorys={articlecategory}/>
                  </tbody>
               </table>
             </div>
          </div>
          <h2></h2>
        </div>
        </div>
  )
}
