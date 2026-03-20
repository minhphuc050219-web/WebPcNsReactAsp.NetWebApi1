export default function CategoryList({categorys}){
    // Ensure categorys is always an array
    const categoryList = Array.isArray(categorys) ? categorys : [];
    
    if(!categoryList || categoryList.length === 0){
        return (
      <tr>
        <td colSpan="5" className="text-center">
          Không có category nào
        </td>
      </tr>
    );
    }
    return (
    <>
      {categoryList.map((lsp) => (
        <tr key={lsp.maLoai}>
          <td className="text-center fw-semibold">{lsp.maLoai}</td>
          <td className="text-center">{lsp.tenLoai}</td>
          <td className="text-center">
            {lsp.loaiImages && (
              <img
                src={`http://localhost:5226/public/imagesCategory/${lsp.loaiImages}`}
                alt={lsp.tenLoai}
                width="80"
              />
            )}
          </td>

          <td className="text-center">{lsp.maBrand}</td>

          <td className="text-center">
            <button className="btn btn-danger">Xóa</button>{" "}
            <button className="btn btn-success">Sửa</button>
          </td>
        </tr>
      ))}
    </>
  );
}