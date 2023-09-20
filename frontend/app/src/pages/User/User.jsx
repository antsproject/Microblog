import './User.css'
import { useParams } from 'react-router-dom';
import { ReactComponent as Avatar } from './images/avatar.svg'
import { ReactComponent as PlusButton } from './images/plus.svg'
import { Link } from 'react-router-dom';


const User = () => {
    let { userInfo } = useParams();
    const userId = userInfo.split('-', 1)
    const userSlug = userInfo.split('-').slice(1).join('-')

    return <>
        <div className="whitebox profile-main">
            <div className="profile-columns">
                <div className="profile-avatar">
                    <Avatar />
                    <p className="profile-rating">+890973</p>
                    <p>Рейтинг</p>
                </div>
                <div className="profile-info">
                    <h1>Владимир Желнов</h1> 
                    <p>userId: { userId }, userSlug: { userSlug }</p>
                    <p className="profile-group">Редактор</p>
                    <p className="profile-status">Сегодня покажут Bloodborne для ПК, проверяй.</p>
                </div>
                <div className="profile-subscribe">
                    {/* deactivate */}
                    <Link className="btn-red" to="#"><PlusButton /> Подписаться</Link>
                    <div className="profile-subscribe__stats">
                        <span>34632</span> подписчиков
                    </div>
                </div>
            </div>
            <div className="profile-controls">
                <div className="profile-filters">
                    <Link to="#">Статьи</Link>
                    <Link to="#">Комментарии</Link>
                </div>
                <p>На проекте с 2 апр 2020</p>
            </div>
        </div>
        <div className="profile-posts__controls">
            <Link to="#">Популярное</Link>
            <Link to="#" className="active">Свежее</Link>
        </div>

    </>;
};

export default User;