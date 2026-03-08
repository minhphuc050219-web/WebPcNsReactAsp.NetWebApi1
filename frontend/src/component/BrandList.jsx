

export default function BrandList({ brands }) {
     if (!brands || brands.length === 0) {
    return <p>Không có brand nào</p>;
  }
  return (
    <ul>
      {brands.map(b => (
        <li key={b.maBrand}>
          <strong>{b.maBrand}</strong>
          <strong>{b.tenBrand}</strong>
          <strong>{b.brandImages}</strong>
        </li>
      ))}
    </ul>
  );
}
