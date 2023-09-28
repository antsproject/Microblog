import User from "../../components/User";
import Layout from "../../components/Layout";

export async function getServerSideProps(ctx) {
    const {userInfo} = ctx.query;
    return {
        props: {
            userInfo,
        },
    };
}

export default function Profile({userInfo}) {
    return (
        <Layout>
            <User userInfo={userInfo}/>
        </Layout>
    );
}

