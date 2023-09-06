// import React from "react";
// import {Button} from "react-bootstrap";

// class RegisterForm extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             "first_name": "",
//             "last_name": "",
//             'username': "",
//             'email': "",
//             'password': "",
//             'password2': ""
//         }
//     }
//     handlerOnChange(event) {
//         this.setState({
//             [event.target.name]: event.target.value
//         })
//     }
//     handlerOnSubmit(event) {
//         this.props.register(
//         this.state.first_name, this.state.last_name,
//         this.state.username, this.state.email,
//         this.state.password, this.state.password2);
//         event.preventDefault();
//     }
//     render() {
//         return (
//             <form className="container-fluid align-items-center form-control w-25"
//             onSubmit={(event) => this.handlerOnSubmit(event)}>
//                 <h1 className="h3 mb-3 fw-normal">Registration</h1>
//                 <div className="form-floating">
//                     <label htmlFor="floatingInput">First Name  </label>
//                     <input type="text" className="form-control" id="floatingInputName" name="first_name"
//                            placeholder="Имя" onChange={(event => this.handlerOnChange(event))}/>
//                 </div>
//                 <div className="form-floating">
//                     <label htmlFor="floatingInput">Last Name  </label>
//                     <input type="text" className="form-control" id="floatingInputLastName" name="last_name"
//                            placeholder="Фамилия" onChange={(event => this.handlerOnChange(event))}/>
//                 </div>
//                 <div className="form-floating">
//                 <label htmlFor="floatingInput">Username  </label>
//                     <input type="text" className="form-control" id="floatingInputUsername" name="username"
//                            placeholder="Имя пользователя" onChange={(event => this.handlerOnChange(event))}/>
//                 </div>
//                 <div className="form-floating">
//                     <label htmlFor="floatingInput">Email  </label>
//                     <input type="text" className="form-control" id="floatingInputEmail" name="email"
//                            placeholder="Почта" onChange={(event => this.handlerOnChange(event))}/>
//                 </div>
//                 <div className="form-floating">
//                     <label htmlFor="floatingPassword">Password  </label>
//                     <input type="password" className="form-control" id="floatingPassword" name="password"
//                            placeholder="Пароль" onChange={(event => this.handlerOnChange(event))}/>
//                 </div>
//                 <div className="form-floating">
//                     <label htmlFor="floatingPassword">Confirm Password  </label>
//                     <input type="password" className="form-control" id="floatingPassword2" name="password2"
//                            placeholder="Подтверждение пароля" onChange={(event => this.handlerOnChange(event))}/>
//                 </div>
//                 <Button className="w-100 btn btn-lg btn-primary" type="submit">Registration</Button>
//             </form>
//     )
//     }
// }
// export default RegisterForm;
