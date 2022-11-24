import React from 'react';
import ReactDOM from 'react-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import * as Yup from 'yup';

import styles from '~components/Login/Login.module.scss';

const schema = Yup.object().shape({
	phone: Yup.number()
		.typeError('Invalid phone number')
		.integer('Invalid phone number')
		.required('Phone is not empty'),
	newPassword: Yup.string()
		.required('Password is not empty')
		.min(6, 'Password must at least 6 characters'),
});

const ForgotPassword = () => {
	const { register, handleSubmit, errors, setValue, control } = useForm({
		resolver: yupResolver(schema),
	});
	const onSubmit = data => console.log(data);

	return (
		<form
			className="login100-form validate-form"
			autoComplete="off"
			onSubmit={handleSubmit(onSubmit)}
		>
			<span className="login100-form-title">Reset password</span>
			<div className="wrap-input100 validate-input">
				<input
					className="input100"
					type="text"
					name="phone"
					placeholder="Phone"
					ref={register}
				/>
				<span className="focus-input100" />
				<span className="symbol-input100">
					<i className="fa fa-phone" aria-hidden="true" />
				</span>
			</div>
			{errors.phone && (
				<span className="text-danger d-block mb-2">{errors.phone.message}</span>
			)}
			<div
				className="wrap-input100 validate-input"
				data-validate="Password is required"
			>
				<input
					className="input100"
					type="password"
					name="newPassword"
					placeholder="New password"
					ref={register}
				/>
				<span className="focus-input100" />
				<span className="symbol-input100">
					<i className="fa fa-lock" aria-hidden="true" />
				</span>
			</div>
			{errors.newPassword && (
				<span className="text-danger d-block mb-2">
					{errors.newPassword.message}
				</span>
			)}
			<div className="container-login100-form-btn">
				<button type="submit" className="login100-form-btn">
					Send
				</button>
			</div>
		</form>
	);
};

ReactDOM.render(<ForgotPassword />, document.getElementById('forgotpassword'));
