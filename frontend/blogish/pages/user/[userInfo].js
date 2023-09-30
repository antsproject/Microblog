import User from "../../components/User";
import Layout from "../../components/Layout";
// import {withSessionRoute} from "../../session/withSession";
// import {withIronSessionSsr} from "iron-session/next";
import {sessionOptions} from "../../session/session";
import {getIronSession} from "iron-session";
import {error} from "next/dist/build/output/log";

export async function getServerSideProps(req, res) {
    const {userInfo} = req.query;

    try {

        const session = await getIronSession(req, res, sessionOptions);
        // const user = req.session.user ? req.session.user : null;
        const user = req.session.get('user') || null;
        return {
            props: {
                userInfo,
                user
            },
        };

    } catch (error) {
        console.error("Iron Session Error:", error.message);
        return {
            props: {
                error: error.message,
            },
        };
    }
}

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

export default function Profile({userInfo, user}) {
    return (
        <Layout user={user}>
            <User userInfo={userInfo}/>
            {error && (
                <div className="no-page-message-box">
                    {error.message}
                    Ошибка Iron Сессии
                </div>
            )}
        </Layout>
    );
}