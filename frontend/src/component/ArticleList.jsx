export default function ArticleList({ articles }) {
     if (!articles || articles.length === 0) {
    return <p>Không có article nào</p>;
  }
  return (
    <ul>
      {articles.map(b => (
        <li key={b.maBV}>
          <strong>{b.maBV}</strong>
          <strong>{b.tenBV}</strong>  
          <strong>{b.tomTatBV}</strong>
          <strong>{b.noiDungBV}</strong>
          <strong>{b.maLoaiBV}</strong>
          <strong>{b.trangThaiBV}</strong>
          <strong>{b.bvImages}</strong>
          <strong>{b.maLoaiBVNavigation}</strong>
        </li>
      ))}
    </ul>
  );
}
