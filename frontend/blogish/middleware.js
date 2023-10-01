import { NextResponse } from "next/server";
import { getIronSession } from "iron-session/edge";
import { sessionOptions } from "./session/session";
import { setUser, setToken } from "./redux/features/userSlice";
import { useDispatch } from "react-redux";

// export async function middleware(request) {

//     let res = NextResponse.next();
//     // const dispath = useDispatch();
//     const session = await getIronSession(request, res, sessionOptions);
//     // const session = await getIronSession(req, res, sessionOptions);
//     // const { user } = session;
//     // setUser(session.user);
//     // setToken(session.token);
//     // res.locals.session = session;
//     // console.debug("Next.js Auth Middleware");
//     // return NextResponse.redirect(new URL('/home', request.url))
//     return res;
// }


export default async function middleware(req, ev) {
    // console.log({ req, ev });
}

export const config = {
    matcher: ['/', '/user/:path*']
}