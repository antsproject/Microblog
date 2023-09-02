import React from "react";
import axios from "axios";
import {BrowserRouter, Routes, Link, Route} from 'react-router-dom'
import LoginForm from "./components/auth";
import Cookies from "universal-cookie/lib";
import {Button} from "react-bootstrap";
import RegisterForm from "./components/register";

const pageNotFound404 = ({location}) => {
    return (
        <h1>Page at '{location.pathname}' not found</h1>
    )
}


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            'users': [],
            'projects': [],
        }
    }

    logout() {
        this.setToken('');
    }
    register(first_name, last_name, username, email, password, password2) {
        axios.post('http://127.0.0.1:8000/api/register/', {first_name: first_name, last_name: last_name, username: username, email: email, password: password,
        password2: password2}).then(response => {
        }).catch(error => alert('Что то пошло не так'))
        alert('Done!')};

    getToken(username, password) {
        axios.post('http://127.0.0.1:8000/api/jwt-token/', {username: username, password: password})
            .then(response => {
                this.setToken(response.data['access'], username)
            }).catch(error => alert('Неверный логин или пароль'))

    }

    getTokenFromStorage() {
        const cookies = new Cookies()
        const token = cookies.get('token')
        const username = cookies.get('username')
        this.setState({'token': token, 'username': username}, () => this.loadData())
    }

    setToken(token, username) {
        const cookies = new Cookies()
        cookies.set('token', token)
        cookies.set('username', username)
        this.setState({token: token, username: username}, () => this.loadData())
    }

    loadData() {
        const headers = this.getHeaders()
        axios.get('http://127.0.0.1:8000/swagger/', {headers}).catch(error => console.log(error))
    }

    getHeaders() {
        let headers = {
            'Content-Type': 'application/json'
        }
        if (this.isAuthenticated()) {
            headers['Authorization'] = `Bearer ${this.state.token}`
        }
        return headers
    }

    isAuthenticated() {
        return this.state.token !== '';
    }
    componentDidMount() {
        this.getTokenFromStorage();
    }

    render() {
        return (
            <div className="App">
                <BrowserRouter>
                   <nav className="navbar navbar-expand-md navbar-dark sticky-top bg-dark">
                        <div className="container-fluid">
                            <Link className="navbar-brand" to="/">UsersMicroService</Link>
                            <div className="collapse navbar-collapse" id="navbarCollapse">
                                <ul className="navbar-nav me-auto mb-2 mb-md-0">
                                    <li className="nav-item">
                                        <Link className="nav-link active" aria-current="page" to="http://127.0.0.1:8000/swagger/">Swagger</Link>
                                    </li>
                                </ul>
                                {this.isAuthenticated() ?
                                    <Button onClick={() => this.logout()}
                                            onMouseOver={(event) => event.target.textContent = 'Logout'}
                                            onMouseOut={(event) => event.target.textContent = this.state.username}>{this.state.username}</Button> :
                                    <Link to="/login" className="btn btn-success">Login</Link>}<br/>
                                    <Link to="/registration" className="btn btn-success">Registration</Link>
                            </div>
                        </div>
                    </nav>
                    <Routes>
                    <Route exact path='/login' element={<LoginForm
                            getToken={(username, password) => this.getToken(username, password)}/>}/>

                    <Route exact path='/registration' element={<RegisterForm
                    register={(first_name, last_name, username, email, password, password2) =>
                    this.register(first_name, last_name, username, email, password, password2)}/>}/>

                    <Route element={pageNotFound404}/>
                    </Routes>
                </BrowserRouter>
            </div>
        )
    }
}

export default App;