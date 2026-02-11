const EditOrder = ({
  editOrderRef,
  closeEditModal,
  updateOrder,
  newOrder,
  handleNewOrderChange,
  setNewOrder,
  errors,
  updateOrderQty,
  deleteProduct,
}) => {
  return (
    <div className="modal fade" ref={editOrderRef} tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5">編輯訂單</h1>
            <button type="button" className="btn-close" onClick={closeEditModal}></button>
          </div>

          <div className="modal-body">
            <form className="text-start">

              {/* 會員資訊 */}
              <h6 className="fw-bold">會員資訊</h6>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">姓名</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={newOrder.user?.name || ''}
                  onChange={e =>
                    setNewOrder({
                      ...newOrder,
                      user: { ...newOrder.user, name: e.target.value },
                    })}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={newOrder.user?.email || ''}
                  onChange={e =>
                    setNewOrder({
                      ...newOrder,
                      user: { ...newOrder.user, email: e.target.value },
                    })}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="tel" className="form-label">電話</label>
                <input
                  type="text"
                  className="form-control"
                  id="tel"
                  name="tel"
                  value={newOrder.user?.tel || ''}
                  onChange={e =>
                    setNewOrder({
                      ...newOrder,
                      user: { ...newOrder.user, tel: e.target.value },
                    })}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="address" className="form-label">地址</label>
                <input
                  type="text"
                  className="form-control"
                  id="address"
                  name="address"
                  value={newOrder.user?.address || ''}
                  onChange={e =>
                    setNewOrder({
                      ...newOrder,
                      user: { ...newOrder.user, address: e.target.value },
                    })}
                />
              </div>

              {/* 訂單留言 */}
              <div className="mb-3">
                <label htmlFor="message" className="form-label">訂單留言</label>
                <input
                  type="text"
                  className={`form-control ${errors.message ? 'is-invalid' : ''}`}
                  id="message"
                  name="message"
                  value={newOrder.message || ''}
                  onChange={handleNewOrderChange}
                />
                {errors.message && <div className="invalid-feedback">{errors.message}</div>}
              </div>

              {/* 付款狀態 */}
              <div className="form-check mb-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="is_paid"
                  checked={newOrder.is_paid}
                  onChange={e =>
                    setNewOrder({ ...newOrder, is_paid: e.target.checked })}
                />
                <label className="form-check-label" htmlFor="is_paid">
                  已付款
                </label>
              </div>

              <hr />

              {/* 訂單商品 */}
              <h6 className="fw-bold">訂單商品</h6>
              {Object.values(newOrder.products || {}).map((item, index) => (
                <div key={item.id} className="mb-3 border p-2 rounded">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <p className="mb-1">
                        <strong>商品:</strong>
                        {item.product?.title || item.product_id}
                        <br />
                        <strong>原價:</strong>
                        {item.product?.origin_price || item.product_id}
                        <strong className="ms-3">特價:</strong>
                        {item.product?.price || item.product_id}
                      </p>
                      <label htmlFor={`qty-${index}`} className="form-label">數量:</label>
                      <input
                        type="number"
                        className="form-control"
                        id={`qty-${index}`}
                        value={item.qty}
                        min="1"
                        onChange={e => updateOrderQty(item.id, e.target.value)}
                      />
                    </div>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => deleteProduct(item.id)}
                    >
                      刪除
                    </button>
                  </div>
                </div>
              ))}

            </form>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={closeEditModal}>取消</button>
            <button type="button" className="btn btn-primary" onClick={updateOrder}>儲存</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditOrder
