import './User.css'
import { ReactComponent as Avatar } from './images/avatar.svg'
import { ReactComponent as PlusButton } from './images/plus.svg'

const User = () => {
    return <>
    <div class="whitebox profile-main">
        <div class="profile-columns">
            <div class="profile-avatar">
                <Avatar />
                <p class="profile-rating">+890973</p>
                <p>Рейтинг</p>
            </div>
            <div class="profile-info">
                <h1>Владимир Желнов</h1>
                <p class="profile-group">Редактор</p>
                <p class="profile-status">Сегодня покажут Bloodborne для ПК, проверяй.</p>
            </div>
            <div class="profile-subscribe">
            {/* deactivate */}
                <a class="btn-red" href="#"><PlusButton /> Подписаться</a>
                <div class="profile-subscribe__stats">
                    <span>34632</span> подписчиков
                </div>
            </div>
        </div>
        <div class="profile-controls">
            <div class="profile-filters">
                <a href="#">Статьи</a>
                <a href="#">Комментарии</a>
            </div>
            <p>На проекте с 2 апр 2020</p>
        </div>
    </div>
    <div class="profile-posts__controls">
        <a href="#">Популярное</a>
        <a href="#" class="active">Свежее</a>
    </div>
    
    </>;
};

export default User;