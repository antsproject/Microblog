import Layout from "../components/Layout";
import dynamic from 'next/dynamic';

export default function Page() {
    const CreatePost = dynamic(import('../components/CreatePost'), {ssr: false})
    return (
        <Layout>
            <CreatePost/>
        </Layout>
    );
}

