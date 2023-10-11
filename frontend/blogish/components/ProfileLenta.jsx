import Post from './Post';

const ProfileLenta = ({posts}) => {
    return (
    <>
        {posts.map((post) => <Post key={post.id} item={post} />)}
    </>
    )  
    
};

export default ProfileLenta;
