import User from "../../../components/User";
import Layout from "../../../components/Layout";

export async function getServerSideProps(ctx) {
    const {userInfo} = ctx.query;
    return {
        props: {
            userInfo,
        },
    };
}

export default function Settings({userInfo}) {
    return (
        <Layout>
            {/* <div>
                <User userInfo={userInfo}/>
            </div> */}
            <div className="no-page-message-box">
                <h2>Настройки вашего профиля</h2>
            </div>
        </Layout>
    );
}
