import './User.css'
import { ReactComponent as Avatar } from './images/avatar.svg'
import { ReactComponent as PlusButton } from './images/plus.svg'

const User = () => {
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
                <p className="profile-group">Редактор</p>
                <p className="profile-status">Сегодня покажут Bloodborne для ПК, проверяй.</p>
            </div>
            <div className="profile-subscribe">
            {/* deactivate */}
                <a className="btn-red" href="#"><PlusButton /> Подписаться</a>
                <div className="profile-subscribe__stats">
                    <span>34632</span> подписчиков
                </div>
            </div>
        </div>
        <div className="profile-controls">
            <div className="profile-filters">
                <a href="#">Статьи</a>
                <a href="#">Комментарии</a>
            </div>
            <p>На проекте с 2 апр 2020</p>
        </div>
    </div>
    <div className="profile-posts__controls">
        <a href="#">Популярное</a>
        <a href="#" className="active">Свежее</a>
    </div>
    
    </>;
};

export default User;