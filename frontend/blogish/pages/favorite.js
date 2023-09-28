import Layout from "../components/Layout";

export default function Page() {
    return (
        <Layout>
            <div className="no-page-message-box">
                <h2>Добавьте интересный вам пост в Избранное!</h2>
                <p>Вы всегда сможете вернуться сюда за ним!</p>
                <div className="btn-red inline ">
                    Добавить в избранное
                </div>
            </div>
        </Layout>
    );
}

