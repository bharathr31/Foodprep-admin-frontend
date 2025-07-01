// src/admin/src/screens/Add/Add.jsx
import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import './Add.css'
import { assets } from '../../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'

const Add = ({ url }) => {
  const [image, setImage] = useState(null)
  const [data, setData] = useState({
    name: '',
    desc: '',
    price: '',
    category: 'Salad'
  })

  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0]
    setImage(Object.assign(file, {
      preview: URL.createObjectURL(file)
    }))
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*',
    multiple: false
  })

  const onchangeHandler = e => {
    const { name, value } = e.target
    setData(d => ({ ...d, [name]: value }))
  }

  const onsubmitHandler = async e => {
    e.preventDefault()
    if (!image) {
      toast.error('Please add an image')
      return
    }

    const formdata = new FormData()
    formdata.append('name', data.name)
    formdata.append('description', data.desc)
    formdata.append('price', Number(data.price))
    formdata.append('category', data.category)
    formdata.append('image', image)

    try {
      const response = await axios.post(`${url}/api/food/add`, formdata)
      toast.success(response.data.message)
      setData({ name: '', desc: '', price: '', category: 'Salad' })
      setImage(null)
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }

  return (
    <div className='screen'>
      <div className="container">
        <form onSubmit={onsubmitHandler} className='flex-col'>

          <div className="add-img-upload flex-col">
            <p>Upload Image</p>
            <div {...getRootProps()} className="dropzone">
              <input {...getInputProps()} />
              {isDragActive
                ? <p>Drop it like it’s hot…</p>
                : image
                  ? <img src={image.preview} alt="preview" className="thumb" />
                  : <img src={assets.upload_area} alt="upload placeholder" />
              }
            </div>
          </div>

          <div className="add-product-name flex-col">
            <p>Product's Name</p>
            <input
              value={data.name}
              onChange={onchangeHandler}
              type="text"
              name='name'
              placeholder='Type here'
              required
            />
          </div>

          <div className="add-product-desc flex-col">
            <p>Product Description</p>
            <textarea
              value={data.desc}
              onChange={onchangeHandler}
              name="desc"
              rows='6'
              placeholder='Write content here'
              required
            />
          </div>

          <div className="add-category-price">
            <div className="add-category flex-col">
              <p>Category</p>
              <select
                value={data.category}
                onChange={onchangeHandler}
                name="category"
              >
                <option>Salad</option>
                <option>Deserts</option>
                <option>Rolls</option>
                <option>Sandwich</option>
                <option>Cake</option>
                <option>Pure Veg</option>
                <option>Pasta</option>
                <option>Noodles</option>
              </select>
            </div>

            <div className="add-price flex-col">
              <p>Product Price</p>
              <input
                value={data.price}
                onChange={onchangeHandler}
                type="number"
                name='price'
                placeholder='₹150'
                required
              />
            </div>
          </div>

          <button type='submit' className='add-btn'>ADD</button>
        </form>
      </div>
    </div>
  )
}

export default Add
