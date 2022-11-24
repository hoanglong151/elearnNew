import React from 'react';
import ReactDOM from 'react-dom';
import { useForm } from "react-hook-form";

import styles from '~components/Login/Login.module.scss';

import { yupResolver } from '@hookform/resolvers';
import * as Yup from "yup";

const schema = Yup.object().shape({
  phone: Yup.number()
    .typeError('Invalid phone number')
    .integer('Invalid phone number')
    .required('Phone is not empty'),
  password: Yup.string()
    .required('Password is not empty')
    .min(6, "Password must at least 6 characters")
});

const Login = () => {
  const { register, handleSubmit, errors, setValue, control } = useForm({
    resolver: yupResolver(schema)
  });
  const onSubmit = data => console.log(data)

  return <form className="login100-form validate-form" autoComplete="off"
    onSubmit={handleSubmit(onSubmit)} >
    <span className="login100-form-title">Login</span>
    <div className="wrap-input100 validate-input">
      <input className="input100" type="text" name="phone" placeholder="Phone"
        ref={register} />
      <span className="focus-input100" />
      <span className="symbol-input100">
        <i className="fa fa-phone" aria-hidden="true" />
      </span>
    </div>
    {
      errors.phone && <span className="text-danger d-block mb-2">{errors.phone.message}</span>
    }
    <div className="wrap-input100 validate-input" data-validate="Password is required">
      <input className="input100" type="password" name="password" placeholder="Password"
        ref={register} />
      <span className="focus-input100" />
      <span className="symbol-input100">
        <i className="fa fa-lock" aria-hidden="true" />
      </span>
    </div>
    {
      errors.password && <span className="text-danger d-block mb-2">{errors.password.message}</span>
    }
    <div className="container-login100-form-btn">
      <button type="submit" className="login100-form-btn">Login</button>
    </div>
    <div className="text-center p-t-12">
      <span className="txt1">Forgot</span>{" "}
      <a className="txt2 text-hl" href="forgotpassword.html">Password?</a>
    </div>
    <div className="text-center p-t-136">
      <a className="txt2 text-hl" href="signup.html">
        Create your Account
    <i className="fa fa-long-arrow-right m-l-5" aria-hidden="true" />
      </a>
    </div>
  </form>
}

ReactDOM.render(<Login />, document.getElementById('login'));