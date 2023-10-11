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
    
    console.debug(Microservices.Users_server + Endpoints.Users.Login);
    console.debug(Microservices.Users_server + Endpoints.Users.Get + "1" + '/');

    try {
        let response = await fetchJson(Microservices.Users_server + Endpoints.Users.Login, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(query),
        });
        console.debug("[API][LOGIN] Response: ", response);
        req.session.id = response.id;
        req.session.refresh = response.refresh;
        req.session.token = response.access;
        if (response) {
            const user = await fetchJson(Microservices.Users_server + Endpoints.Users.Get + response.id + '/', {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });
            console.debug("[API][LOGIN] Response: ", user);
            response = {
                response,
                user: user
            }
            req.session.user = user;
        }
        await req.session.save();
        // console.debug("[API] Backend response: ", response);
        res.json(response);
    } catch (error) {
        console.error('[API][LOGIN] An error occurred:', error.message);
        res.status(500).json({ message: error.message });
    }
}, sessionOptions);