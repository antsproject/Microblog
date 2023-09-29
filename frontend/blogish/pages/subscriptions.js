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
                <h2> Подпишитесь на кого-нибудь!</h2>
                <p>Что бы увидеть здесь посты тех, кто вам интересен!</p>
                <div className="btn-red inline">Подписаться</div>
            </div>
        </Layout>
    );
}

