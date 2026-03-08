export default function ArticleCategoryList({ articlecategorys }) {
     if (!articlecategorys || articlecategorys.length === 0) {
    return <p>Không có article category nào</p>;
  }
  return (
    <ul>
      {articlecategorys.map(b => (
        <li key={b.maLoaiBV}>
          <strong>{b.maLoaiBV}</strong>
          <strong>{b.tenLoaiBV}</strong>  
          <strong>{b.thuTuBV}</strong>
        </li>
      ))}
    </ul>
  );
}
