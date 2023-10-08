import User from "../../components/User";
import Layout from "../../components/Layout";
import { withIronSessionSsr } from "iron-session/next";
// import {withSessionRoute} from "../../session/withSession";
// import {withIronSessionSsr} from "iron-session/next";
import {sessionOptions} from "../../session/session";
import {error} from "next/dist/build/output/log";


export const getServerSideProps = withIronSessionSsr(async function ({ req, query }) {
    return {
        props: {
            userInfo: query.userInfo,
            token: req.session.token ? req.session.token : null,
            user: req.session.user ? req.session.user : null,
        },
    };
}, sessionOptions);

//     Попробовал решить проблему с сессией:
//     return withIronSessionSsr(async ({req, res}) => {
//         const {userInfo} = req.query;
//
//         const session = await getIronSession({
//             req,
//             res,
//             ...sessionOptions,
//         });
//
//         const user = session.get('user') || null;
//
//         return {
//             props: {
//                 userInfo,
//                 user,
//             },
//         };
//     })(req);
// }

export default function Profile({userInfo, user, token}) {
    return (
        <Layout>
            <User userInfo={userInfo} user={user} token={token}/>
            {error && (
                <div className="no-page-message-box">
                    {error.message}
                    Ошибка Iron Сессии
                </div>
            )}
        </Layout>
    );
}