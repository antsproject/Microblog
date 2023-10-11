module.exports = {
    images: {
        domains: [
            'localhost',
            'localhost:8080',
        ],
    },
    env: {
        MAIL_MICROSERVICE_URL: process.env.MAIL_MICROSERVICE_URL,
        USERS_MICROSERVICE_URL: process.env.USERS_MICROSERVICE_URL,
        POSTS_MICROSERVICE_URL: process.env.POSTS_MICROSERVICE_URL,
        COMMENTS_MICROSERVICE_URL: process.env.COMMENTS_MICROSERVICE_URL,
        SUPPORT_MICROSERVICE_URL: process.env.SUPPORT_MICROSERVICE_URL,
    }
}