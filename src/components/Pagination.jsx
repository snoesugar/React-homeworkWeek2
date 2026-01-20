const Pagination = ({ pagination, changePage }) => {
  return (
    <nav>
      <ul className="pagination">

        {/* 上一頁 */}
        <li className={`page-item ${!pagination.has_pre && 'disabled'}`}>
          <button
            className="page-link"
            onClick={() => changePage(pagination.current_page - 1)}
          >
            &laquo;
          </button>
        </li>

        {/* 頁碼 */}
        {[...Array(pagination.total_pages)].map((_, index) => (
          <li
            key={index}
            className={`page-item ${
              pagination.current_page === index + 1 ? 'active' : ''
            }`}
          >
            <button
              className="page-link"
              onClick={() => changePage(index + 1)}
            >
              {index + 1}
            </button>
          </li>
        ))}

        {/* 下一頁 */}
        <li className={`page-item ${!pagination.has_next && 'disabled'}`}>
          <button
            className="page-link"
            onClick={() => changePage(pagination.current_page + 1)}
          >
            &raquo;
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default Pagination
