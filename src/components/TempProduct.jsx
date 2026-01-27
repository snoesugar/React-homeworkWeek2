import { Collapse } from 'bootstrap'

const TempProduct = ({ tempProduct, modalRef, closeModal }) => {
  if (!tempProduct) return null

  const collapseId = `collapse-${tempProduct.id}`
  const accordionId = `accordion-${tempProduct.id}`

  return (
    <div className="modal fade" ref={modalRef} tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header border-0 bg-primary-100">
            <h5 className="modal-title">
              {tempProduct.title}
              <span className="badge rounded-pill bg-primary ms-2">
                {tempProduct.category}
              </span>
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={closeModal}
              aria-label="Close"
            >
            </button>
          </div>
          <div className="card border-0">
            <img
              src={tempProduct.imageUrl}
              className="card-img-top primary-image rounded-0"
              alt="主圖"
            />
            <div className="card-body bg-primary-100">
              <p className="card-text">
                商品描述：
                {tempProduct.content}
              </p>
              <p className="card-text">
                商品內容：
                {tempProduct.description}
              </p>
              <div className="d-flex justify-content-end mb-3">
                <p className="card-text text-secondary">
                  <del>{tempProduct.origin_price}</del>
                </p>
                元 /
                {tempProduct.price}
                元
              </div>
            </div>
            <div className="accordion" id={accordionId}>
              <div className="accordion-item border-0">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed product-images"
                    type="button"
                    onClick={() => {
                      const el = document.getElementById(collapseId)
                      if (!el) return
                      const instance = Collapse.getOrCreateInstance(el)
                      instance.toggle()
                    }}
                  >
                    更多圖片
                  </button>
                </h2>
                <div id={collapseId} className="accordion-collapse collapse">
                  <div className="accordion-body">
                    {tempProduct.imagesUrl?.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        className="images me-3 mb-3"
                        alt={`副圖 ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TempProduct
