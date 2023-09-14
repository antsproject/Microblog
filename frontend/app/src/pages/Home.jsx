import { Link } from 'react-router-dom';
import Post from '../components/Post/Post';

const Home = () => {
  return (
    <>
      <div className="newscontainer">
        <div className="newscontainer-title">Новости редакции</div>
        <div className="newscontainer-line">
          <Link to="#">
            Убыточный вьетнамский производитель электромобилей VinFast стал третьим по капитализации
            автопроизводителем в мире
          </Link>
        </div>
        <div className="newscontainer-line">
          <Link to="#">
            Убыточный вьетнамский производитель электромобилей VinFast стал третьим по капитализации
            автопроизводителем в мире
          </Link>
        </div>
        <div className="newscontainer-line">
          <Link to="#">
            Убыточный вьетнамский производитель электромобилей VinFast стал третьим по капитализации
            автопроизводителем в мире
          </Link>
        </div>
        <div className="newscontainer-more">
          <Link to="#">Показать еще...</Link>
        </div>
      </div>

      <Post />
    </>
  );
};

export default Home;
