import Statistics from './statistics';
import Categories from './categories';
import Producer from './producer'
import Voucher from './voucher'
import Products from './products'
import Sale from './sale'
import SasaleProducts from './saleProducts'

const ContentRenderer = ({ tab }) => {
    switch (tab) {
        case 'statistics':
            return <Statistics />;
        case 'categories':
            return <Categories />;
        case 'producer':
            return <Producer />;
        case 'voucher':
            return <Voucher />;
        case 'products':
            return <Products />;
        case 'sale':
            return <Sale />;
        case 'add_sale_Products':
            return <SasaleProducts />;
        // thêm các case khác nếu bạn có component tương ứng
        default:
            return <div>Select a section</div>;
    }
};

export default ContentRenderer;
