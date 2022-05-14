import category from '../store/adminStore/category';
import users from '../store/adminStore/users';
import cart from '../store/adminStore/cart';
import address from '../store/adminStore/address';
import adminProducts from '../store/adminStore/product';
import adminOrders from '../store/adminStore/order'
import merchantProducts from '../store/merchantStore/products';
import merchantOrders from '../store/merchantStore/order';

const rootReducer = {
  category,
  users,
  cart,
  address,
  adminProducts,
  adminOrders,
  merchantProducts,
  merchantOrders
}

export default rootReducer;
