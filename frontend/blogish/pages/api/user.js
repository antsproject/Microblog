import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../session/session";

export default withIronSessionApiRoute(userRoute, sessionOptions);

async function userRoute(req, res) {
    if (req.session.user) {
        res.json({
            'user': req.session.user,
            isLoggedIn: true,
        });
    } else {
        res.json({
            'user': null,
            isLoggedIn: false
        });
    }
}