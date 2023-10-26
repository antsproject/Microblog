// pages/activation/[token].js

import { useRouter } from 'next/router';
import ActivationComplete from '../../components/Activation';
import Layout from '../../components/Layout';

const ActivationPage = () => {
    const router = useRouter();
    const { token } = router.query;

    return (
        <Layout>
            <ActivationComplete token={token} />
        </Layout>
    );
};

export default ActivationPage;