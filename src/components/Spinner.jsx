import { ThreeDots } from 'react-loader-spinner'

const Spinner = () => {
  return (
    <ThreeDots
      height="80"
      width="80"
      radius="9"
      color="#244a38"
      ariaLabel="three-dots-loading"
      wrapperClass="custom-loader"
      visible={true}
    />
  )
}

export default Spinner
