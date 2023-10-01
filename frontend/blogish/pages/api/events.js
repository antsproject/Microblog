import { withIronSessionApiRoute } from "iron-session/next";
// import { sessionOptions } from "lib/session";
import { sessionOptions } from "../../session/session";

export default withIronSessionApiRoute(eventsRoute, sessionOptions);

async function eventsRoute(req, res) {
    const user = req.session.user;

    if (!user) {
        res.status(401).end();
        return;
    }

    try {
        const { data: events } = {};
        res.json(events);
    }
    catch (error) {
        res.status(200).json([]);
    }
}