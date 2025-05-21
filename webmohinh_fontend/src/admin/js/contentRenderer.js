import Statistics from './statistics';
import Categories from './categories';
import Producer from './producer'
import Voucher from './voucher'


const ContentRenderer = ({ activeTab }) => {
    switch (activeTab) {
        case 'statistics':
            return <Statistics />;
        case 'categories':
            return <Categories />;
        case 'producer':
            return <Producer />;
        case 'voucher':
            return <Voucher />;
        // thêm các case khác nếu bạn có component tương ứng
        default:
            return <div>Select a section</div>;
    }

};

export default ContentRenderer;
