import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'

// 收貨人 input 元件
const UserInput = ({ register, errors, id, labelText, type, rules }) => {
  return (
    <div className="row mb-3 justify-content-center">
      <label
        htmlFor={id}
        className="col-2 col-form-label"
      >
        {labelText}
      </label>

      <div className="col-5">
        <input
          type={type}
          className={`form-control ${errors[id] ? 'is-invalid' : ''}`}
          id={id}
          {...register(id, rules)}
        />
        {errors[id] && (
          <div className="text-start invalid-feedback">
            {errors?.[id]?.message}
          </div>
        )}
      </div>
    </div>
  )
}

const CheckOut = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    mode: 'onTouched',
  })

  const onSubmit = (data) => {
    console.log(data)
  }

  const watchForm = useWatch({
    control,
  })

  useEffect(() => {
    console.log(watchForm)
  }, [watchForm])

  return (
    <div className="container-lg mt-5">
      <form className="bg-white p-4 rounded shadow-sm needs-validation" onSubmit={handleSubmit(onSubmit)}>
        <h2 className="mb-4">收貨人資訊</h2>

        {/* 姓名 */}
        <UserInput
          register={register}
          errors={errors}
          id="username"
          labelText="姓名"
          type="text"
          rules={{ required: {
            value: true,
            message: '姓名是必填的' },
          }}
        />

        {/* Email */}
        <UserInput
          register={register}
          errors={errors}
          id="email"
          labelText="Email"
          type="email"
          rules={{ required: {
            value: true,
            message: 'Email 是必填的',
          },
          pattern: {
            value: /^\S+@\S+$/i,
            message: 'Email 格式不正確',
          },
          }}
        />

        {/* 電話 */}
        <UserInput
          register={register}
          errors={errors}
          id="tel"
          labelText="電話"
          type="tel"
          rules={{ required: {
            value: true,
            message: '電話是必填的',
          },
          minLength: {
            value: 6,
            message: '電話不少於 6 碼',
          },
          maxLength: {
            value: 12,
            message: '電話不大於 12 碼',
          },
          }}
        />

        {/* 地址 */}
        <UserInput
          register={register}
          errors={errors}
          id="address"
          labelText="地址"
          type="text"
          rules={{ required: {
            value: true,
            message: '地址是必填的' },
          }}
        />

        {/* 留言 */}
        <div className="row mb-3 justify-content-center">
          <label
            className="col-2 col-form-label"
            htmlFor="comment"
          >
            留言
          </label>
          <div className="col-5">
            <textarea
              className="form-control"
              placeholder=""
              id="comment"
              {...register('comment')}
            >
            </textarea>
          </div>
        </div>

        {/* 送出 */}
        <div className="row align-items-center justify-content-center">
          <div className="col-7">
            <button className="btn btn-primary" type="submit">
              送出
            </button>
          </div>
        </div>

      </form>
    </div>
  )
}

export default CheckOut
