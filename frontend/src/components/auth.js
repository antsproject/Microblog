import React from "react";
import {Button} from "react-bootstrap";

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            'username': "",
            'password': ""
        }
    }
    handlerOnChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handlerOnSubmit(event) {
        this.props.getToken(this.state.username, this.state.password);
        event.preventDefault();
    }

    render() {
        return (
            <form className="container-fluid align-items-center form-control w-25"
                  onSubmit={(event) => this.handlerOnSubmit(event)}>
                <h1 className="h3 mb-3 fw-normal">Please sign in</h1>
                <div className="form-floating">
                    <input type="text" className="form-control" id="floatingInput" name="username"
                           placeholder="username" onChange={(event => this.handlerOnChange(event))}/>
                    <label htmlFor="floatingInput">Username</label>
                </div>
                <div className="form-floating">
                    <input type="password" className="form-control" id="floatingPassword" name="password"
                           placeholder="password" onChange={(event => this.handlerOnChange(event))}/>
                    <label htmlFor="floatingPassword">Password</label>
                </div>
                <Button className="w-100 btn btn-lg btn-primary" type="submit">Sign in</Button>
            </form>
    )
    }

}

export default LoginForm;