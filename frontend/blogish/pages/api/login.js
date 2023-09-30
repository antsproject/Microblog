import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../session/session";
import UsersStruct from "../../api/struct/Users";
import Microservices from "../../api/Microservices";
import Endpoints from "../../api/Endpoints";
import fetchJson, { FetchError } from "../../session/fetchJson";

export default withIronSessionApiRoute(async (req, res) => {
    const { email, password } = await req.body;
    let query = UsersStruct.login;
    query.email = email;
    query.password = password;
    try {
        let response = await fetchJson(Microservices.Users + '' + Endpoints.Users.Login, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(query),
        });
        req.session.id = response.id;
        req.session.refresh = response.refresh;
        req.session.token = response.access;
        if (response) {
            const user = await fetchJson(Microservices.Users + '' + Endpoints.Users.Get + '' + response.id + '/', {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });
            response = {
                response,
                user: user
            }
            req.session.user = user;
        }
        await req.session.save();
        console.debug("[API] Backend response: ", response);
        res.json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}, sessionOptions);