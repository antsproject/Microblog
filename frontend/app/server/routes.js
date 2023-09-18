import Layout from '../src/pages/Layout/Layout.jsx';
import User from '../src/pages/User/User.jsx';

module.exports = [
    {
        path: '/',
        exact: true,
        component: Layout,
    },
    {
        path: '/user',
        exact: true,
        component: User,
    }
];
