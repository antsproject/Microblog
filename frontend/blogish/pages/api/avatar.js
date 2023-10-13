import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../session/session";

export default withIronSessionApiRoute(userAvatar, sessionOptions);

async function userAvatar(req, res) {
    if (req.session.user) {
        const { avatar } = await req.body;
        req.session.user.avatar = avatar;
        await req.session.save();
        const data = {
            'user': req.session.user,
            isLoggedIn: true,
        };
        console.log('!!!!!!!!!!!!!', data)
        res.json(
            data
        );
    } else {
        res.json({
            'user': null,
            isLoggedIn: false
        });
    }
}