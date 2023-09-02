import { Outlet, Link } from "react-router-dom";
import { ReactComponent as BellImg } from "../images/bell.svg"
import { ReactComponent as MenuImg } from "../images/menu.svg"
import { ReactComponent as LogoutImg } from "../images/logout.svg"
import { ReactComponent as PlusImg } from "../images/plus.svg"
import { ReactComponent as ClockImg } from "../images/clock.svg"
import { ReactComponent as RocketImg } from "../images/rocket-02.svg"
import { ReactComponent as ZapfastImg } from "../images/zap-fast.svg"
import { ReactComponent as BookmarkImg } from "../images/bookmark-check.svg"
import { ReactComponent as AdvImg } from "../images/adv.svg"

const Layout = () => {
  return (
    <>
      <div class="header">
        <div class="header-left">
          <MenuImg /> <Link to="/">ANTs</Link>
        </div>
        <div class="header-center">
          <input type="text" placeholder="Поиск"></input>
          <button><PlusImg /> Написать</button>
        </div>
        <div class="header-right">
          <BellImg />
          <LogoutImg /> Войти
        </div>
      </div>

      <div class="wrapper">
        <div class="wrapper-left">
          <Link href="#" class="wrapper-left__link hovered">
            <RocketImg /> Популярное
          </Link>
          <Link to="/user" class="wrapper-left__link">
            <ClockImg /> Свежее
          </Link>
          <Link to="/subscriptions" class="wrapper-left__link">
            <ZapfastImg /> Подписки
          </Link>
          <Link to="/favorite" class="wrapper-left__link">
            <BookmarkImg /> Избранное
          </Link>
          <div class="wrapper-left__bottom">
            <Link href="#">Заказать рекламу</Link>
            <Link href="#">О проекте</Link>
            <Link href="#">Вакансии</Link>
          </div>
        </div>
        <div class="wrapper-center">
          <Outlet />
        </div>
        <div class="wrapper-right">
          <AdvImg />
        </div>
      </div>
    </>
  )
};

export default Layout;