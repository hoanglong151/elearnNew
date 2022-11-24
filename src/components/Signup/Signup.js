import React from 'react';
import ReactDOM from 'react-dom';
import { useForm } from "react-hook-form";

import styles from '~components/Login/Login.module.scss';

import { yupResolver } from '@hookform/resolvers';
import * as Yup from "yup";

const schema = Yup.object().shape({
  name: Yup.string()
    .required('Name is must not empty'),
  phone: Yup.number()
    .typeError('Invalid phone number')
    .integer('Invalid phone number')
    .required('Phone is must not empty'),
  password: Yup.string()
    .required('Password is must not empty')
    .min(6, "Password must at least 6 characters"),
  passwordConfirm: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
});

const Signup = () => {
  const { register, handleSubmit, errors, setValue, control } = useForm({
    resolver: yupResolver(schema)
  });
  const onSubmit = data => console.log(data)

  return <form className="login100-form validate-form" autoComplete="off"
    onSubmit={handleSubmit(onSubmit)}>
    <span className="login100-form-title">Signup</span>
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
    <div className="wrap-input100 validate-input">
      <input className="input100" type="text" name="name" placeholder="Name"
        ref={register} />
      <span className="focus-input100" />
      <span className="symbol-input100">
        <i className="fa fa-user" aria-hidden="true" />
      </span>
    </div>
    {
      errors.name && <span className="text-danger d-block mb-2">{errors.name.message}</span>
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
    <div className="wrap-input100 validate-input" data-validate="Password is required">
      <input className="input100" type="password" name="passwordConfirm" placeholder="Confirm password"
        ref={register} />
      <span className="focus-input100" />
      <span className="symbol-input100">
        <i className="fa fa-lock" aria-hidden="true" />
      </span>
    </div>
    {
      errors.passwordConfirm && <span className="text-danger d-block mb-2">{errors.passwordConfirm.message}</span>
    }
    <div className="container-login100-form-btn">
      <button type="submit" className="login100-form-btn">Signup</button>
    </div>
    <div className="text-center p-t-136">
      <span className="txt2">
        Already have account? <a className="txt2 text-hl" href="login.html">Login</a>
        <i className="fa fa-long-arrow-right m-l-5" aria-hidden="true" />
      </span>
    </div>
  </form >
}

ReactDOM.render(<Signup />, document.getElementById('signup'));