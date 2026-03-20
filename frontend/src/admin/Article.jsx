import { useEffect, useState } from "react";
import {getArticle } from "../api/articleAPI";
import ArticleList from "../component/ArticleList";
import "../admin/CSS/article.css";

export default function Article() {
   const [article, setArticle] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
      getArticle()
        .then(data => {
          setArticle(data);
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
              <h5 className="card-title fw-bold text-primary">Quản Lý Bài Viết</h5>
              <button className="btn btn-primary shadow-sm">
                + Thêm Bài Viết
              </button>
            </div>
             <div className="table-responsive">
               <table className="table table-hover table-bordered text-nowrap align-middle">
                 <thead>
                   <tr>
                    <th className="text-center">Mã Bài Viết</th>
                    <th className="text-center">Tên Bài Viết</th>
                    <th className="text-center">Tóm Tắt Bài Viết</th>
                    <th className="text-center">Nội Dung</th>
                    <th className="text-center">Mã Loại Bài Viết</th>
                    <th className="text-center">Trạng Thái Bài Viết</th>
                    <th className="text-center">Hình Ảnh</th>
                    <th className="text-center">Quản Lí</th>
                   </tr>
                 </thead>
                  <tbody>
                    <ArticleList articles={article}/>
                  </tbody>
               </table>
             </div>
          </div>
          <h2></h2>
        </div>
        </div>
  )
}
