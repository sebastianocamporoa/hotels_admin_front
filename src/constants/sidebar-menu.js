import DashboardIcon from '../assets/icons/dashboard.svg';
import ShippingIcon from '../assets/icons/shipping.svg';
import ProductIcon from '../assets/icons/product.svg';

const sidebar_menu = [
    {
        id: 1,
        icon: DashboardIcon,
        path: '/',
        title: 'Hoteles',
    },
    {
        id: 2,
        icon: ProductIcon,
        path: '/room-types',
        title: 'Tipos de habitaciones',
    },
    {
        id: 3,
        icon: ShippingIcon,
        path: '/accommodations',
        title: 'Acomodaciones',
    }
]

export default sidebar_menu;