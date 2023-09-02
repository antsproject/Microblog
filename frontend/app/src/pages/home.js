import { Link } from "react-router-dom";
import Post from "../components/post"

const Home = () => {
  return (
    <>
      <div class="newscontainer">
        <div class="newscontainer-title">Новости редакции</div>
        <div class="newscontainer-line">
          <Link to="#">Убыточный вьетнамский производитель электромобилей VinFast стал третьим по капитализации автопроизводителем в мире</Link>
        </div>
        <div class="newscontainer-line">
          <Link to="#">Убыточный вьетнамский производитель электромобилей VinFast стал третьим по капитализации автопроизводителем в мире</Link>
        </div>
        <div class="newscontainer-line">
          <Link to="#">Убыточный вьетнамский производитель электромобилей VinFast стал третьим по капитализации автопроизводителем в мире</Link>
        </div>
        <div class="newscontainer-more">
          <Link to="#">Показать еще...</Link>
        </div>
      </div>

      <Post />
      <Post />
      <Post />
      <Post />
      <Post />
      <Post />
    </>
  )
};

export default Home;