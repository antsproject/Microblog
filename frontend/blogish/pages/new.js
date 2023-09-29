import Layout from "../components/Layout";
import Lenta from "../components/Lenta";

export async function getServerSideProps(ctx) {
    const posts = [];
    return {
        props: {
            posts,
        },
    };
}

export default function Page() {
    return (
        <Layout>
            <div className="no-page-message-box">
                <h2>Новые посты</h2>
            </div>
            {/* <Lenta/> */}
        </Layout>
    );
}

