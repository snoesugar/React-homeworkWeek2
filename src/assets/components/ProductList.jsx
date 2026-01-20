const ProductList = ({ products, openModal, deleteProduct, setNewProduct, openEditModal }) => {
  return (
    <>
      {products && products.length > 0
        ? (
          products.map(item => (
            <tr key={item.id} className="align-middle">
              <td>{item.title}</td>
              <td>{item.origin_price}</td>
              <td>{item.price}</td>
              <td>
                {item.is_enabled
                  ? (<span className="badge bg-success">啟用</span>)
                  : <span className="badge bg-danger">未啟用</span>}
              </td>
              <td>
                <button
                  className="btn btn-primary"
                  disabled={!item.is_enabled}
                  onClick={() => openModal(item)}
                >
                  查看細節
                </button>
              </td>
              <td>
                <div className="btn-group">
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => {
                      setNewProduct(item) // 填入要編輯的資料
                      openEditModal() // 開啟編輯 modal
                    }}
                  >
                    編輯
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => deleteProduct(item.id)}
                  >
                    刪除
                  </button>
                </div>
              </td>
            </tr>
          ))
        )
        : (
          <tr>
            <td colSpan="5">尚無產品資料</td>
          </tr>
        )}
    </>
  )
}

export default ProductList
