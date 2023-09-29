import Lenta from "../components/Lenta";
import Layout from "../components/Layout";
import Endpoints from "../api/Endpoints";
import Microservices from "../api/Microservices";
import Post from "../components/Post";

export async function getServerSideProps(ctx) {
    const res = await fetch(`${Microservices.Posts}/${Endpoints.Posts.Get}`);
    const posts = await res.json();
    const results = posts.results;
    // console.debug(results);

    return {
        props: {
            results,
        },
    };
}

export default function Home({ results }) {
    return (
        <Layout>
            {/* <Lenta posts={results} /> */}
            {results.map((post) => (
                <Post item={post} />
            ))}
        </Layout>
    );
}
