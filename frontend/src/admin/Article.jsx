import { useEffect, useState } from "react";
import {getArticle } from "../api/articleAPI";
import ArticleList from "../component/ArticleList";

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
    <div>
      <h2>Đây là trang Acticle</h2>
      <h3>Quản lý Bai Viet</h3>
      <ArticleList articles={article} />
      <button>Thêm Bai Viet</button>
    </div>
  )
}
