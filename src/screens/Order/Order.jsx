import { useState, useEffect } from 'react';
import './Order.css';
import { assets } from '../../assets/assets';
import axios from 'axios';

const Order = ({ url }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(url + "/api/order/list");
      setOrders(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const statusHandler = async(e,orderId)=>
  {
    try {
      const response = await axios.post(url+"/api/order/status",{orderId,status:e.target.value})
      await fetchAllOrders()
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className="screen order">
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.map((order, index) => (
          <div key={index} className="order-item">
            <img src={assets.parcel_icon} alt="" />

            <p className="order-item-food">
              {order.items.map((item, itemIndex) =>
                itemIndex === order.items.length - 1
                  ? `${item.name} x ${item.quantity}`
                  : `${item.name} x ${item.quantity}, `
              )}
            </p>

            <div className="order-user-details">
              <p className="order-item-name">
                {order.address.first_name} {order.address.last_name}
              </p>
              <p className="order-item-address">
                {order.address.street}, {order.address.city}, {order.address.country}, {order.address.zip_code}
              </p>
            </div>

            <p className="order-item-phone">{order.address.phone}</p>
            <p className="order-item-count">Items: {order.items.length}</p>
            <p className="order-item-price">₹{order.amount}</p>

            <select  onChange={(e)=>statusHandler(e,order._id)} value={order.status} className="order-item-select">
              <option value="Food Processing">Food Processing</option>
              <option value="Out For Delivery">Out For Delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Order;
