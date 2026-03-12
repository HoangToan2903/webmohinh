import Statistics from './statistics';
import Categories from './categories';
import Producer from './producer'
import Voucher from './voucher'
import Products from './products'
import Sale from './sale'
import SasaleProducts from './saleProducts'
import OrderAdmin from './orderAdmin';
import CreateOder from './createOrder';
import Staff from './staff';
import Customer from './customer'
const ContentRenderer = ({ tab }) => {
    switch (tab) {
        case 'statistics':
            return <Statistics />;
        case 'orderAdmin':
            return <OrderAdmin />;
        case 'createOder':
            return <CreateOder />;
        case 'categories':
            return <Categories />;
        case 'producer':
            return <Producer />;
        case 'voucher':
            return <Voucher />;
        case 'products':
            return <Products />;
        case 'customer':
            return <Customer />;
        case 'sale':
            return <Sale />;
        case 'staff':
            return <Staff />;
        case 'add_sale_Products':
            return <SasaleProducts />;
        // thêm các case khác nếu bạn có component tương ứng
        default:
            return <div>Select a section</div>;
    }
};

export default ContentRenderer;
