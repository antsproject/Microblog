import Layout from "../components/Layout";

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
        </Layout>
    );
}

