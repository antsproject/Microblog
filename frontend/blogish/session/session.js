// this file is a wrapper with defaults to be used in both API routes and `getServerSideProps` functions
export const sessionOptions = {
    password: "Vy5BgXoqEM8C5kWf0KDK9rpPWccpdgJRTFkYZAbQ",
    cookieName: "blogish",
    cookieOptions: {
        secure: process.env.NODE_ENV === "production",
    },
};
