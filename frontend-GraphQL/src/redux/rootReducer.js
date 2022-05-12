import category from '../pages/admin/category/store';
import users from '../pages/admin/users/store';
import cart from '../pages/admin/cart/store';
import address from '../pages/admin/address/store';
import adminProducts from '../pages/admin/products/store';
import adminOrders from '../pages/admin/order/store'
import merchantProducts from '../pages/merchant/products/store';
import merchantOrders from '../pages/merchant/order/store';

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
