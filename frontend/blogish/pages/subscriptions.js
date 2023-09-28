import Layout from "../components/Layout";

export default function Page() {
    return (
        <Layout>
            <div className="no-page-message-box">
                <h2> Подпишитесь на кого-нибудь!</h2>
                <p>Что бы увидеть здесь посты тех, кто вам интересен!</p>
                <div className="btn-red no-page-sub-btn">Подписаться</div>
            </div>
        </Layout>
    );
}

