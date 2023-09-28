import Layout from "../components/Layout";
import Image from 'next/image';

export default function Page() {
    return (
        <Layout>
            <div className="no-page-message-box">
                <h2>Добавьте интересный вам пост в Избранное!</h2>
                <p>Вы всегда сможете вернуться сюда за ним!</p>
                <div className="btn-red no-page-fav-btn">
                    Добавить в избранное
                </div>
            </div>
        </Layout>
    );
}

