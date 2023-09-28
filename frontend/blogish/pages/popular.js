import Layout from "../components/Layout";
import Lenta from "../components/Lenta";

export default function Page() {
    return (
        <Layout>
            <div className="no-page-message-box">
                <h2>Популярные посты</h2>
            </div>
            <Lenta/>
        </Layout>
    );
}

