import { Link } from 'react-router'

const Home = () => {
  return (
    <>
      <div className="container-lg position-relative">
        <img
          src="https://media.istockphoto.com/id/860627102/photo/collage-from-different-pictures-of-tasty-food-copy-space-for-your-text.jpg?s=1024x1024&w=is&k=20&c=Jq_OboVSwXlZWjdWFoNIRplm1CblorD-rfaKpzxBud8="
          alt="index"
          className="w-100"
        />
        <Link
          to="/productList"
          className="btn btn-primary-100 text-decoration-none border border-3 border-primary fs-2 p-4 rounded-pill position-absolute bottom-0 end-0 translate-middle"
        >
          立即前往選購
          <i className="bi bi-caret-right-fill"></i>
        </Link>
      </div>
    </>
  )
}

export default Home
