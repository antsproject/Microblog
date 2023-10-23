import Layout from "../components/Layout";
import Microservices from "../api/Microservices";
import Endpoints from "../api/Endpoints";
import {withIronSessionSsr} from "iron-session/next";
import {sessionOptions} from "../session/session";
import SubscriptionsPostsLenta from "../components/SubscribersPosts";
import React from "react";
import {useSelector} from "react-redux";

export const getServerSideProps = withIronSessionSsr(async function ({req}) {
    const res = await fetch(Microservices.Posts_server + Endpoints.Posts.Get);
    const resCat = await fetch(`${Microservices.Posts_server}${Endpoints.Category.Get}`);

    if (!res.ok) {
        throw new Error('Request failed with status ' + res.status);
    }
    if (!resCat.ok) {
        throw new Error('Request failed with status ' + resCat.status);
    }

    const posts = await res.json();
    const categories = await resCat.json();
    const results = posts.results;
    const resultsCat = categories.results;

    return {
        props: {
            results,
            resultsCat,
        },
    };
}, sessionOptions);

export default function Page({results, resultsCat}) {
    const currentUser = useSelector((state) => state.user.value);

    return (
        <Layout>
            {currentUser && currentUser.id ? (
                <SubscriptionsPostsLenta/>
            ) : (
                <div className="no-page-message-box">
                    <h2>Войдите в аккаунт!</h2>
                    <p>Вы увидите здесь ваши подписки!</p>
                </div>
            )}
        </Layout>

    );
}
