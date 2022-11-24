import React, { useState, useEffect, useReducer } from 'react';
import ReactDOM from 'react-dom';
import { useForm, Controller } from 'react-hook-form';

import { getProfile } from '~src/api/studentAPI';
import { updateProfileAPI } from '~src/api/studentAPI';
import { updatePassAPI } from '~src/api/optionAPI';
import { getTimeZoneAPI } from '~src/api/optionAPI';
import { uploadImageToServer } from '~src/api/optionAPI';
import { getListTargetAPI } from '~src/api/optionAPI';
import { getListLanguageAPI } from '~src/api/optionAPI';
import { appSettings } from '~src/config';

import SkeletonStudentForm from '~components/common/Skeleton/SkeletonStudentForm';

import { yupResolver } from '@hookform/resolvers';
import * as Yup from 'yup';

import Flatpickr from 'react-flatpickr';
import Select from 'react-select';

import { toast } from 'react-toastify';
import 'react-toastify/scss/main.scss';
import { toastInit, convertDDMMYYYYtoMMDDYYYY } from '~src/utils';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import common_en from '../../public/static/locales/en/language.json';
import common_vi from '../../public/static/locales/vi/language.json';
i18next.init({
	interpolation: { escapeValue: false },
});
i18next.init({
	interpolation: { escapeValue: false },
	lng: 'vi',
	resources: {
		en: {
			common: common_en,
		},
		vi: {
			common: common_vi,
		},
	},
});
import {
	FETCH_ERROR,
	CHANGE_PASSWORD_SUCCESS,
	FILL_PASSWORD,
	INCORRECT_PASSWORD,
	DIFFERENT_PASSWORD,
	CONFIRM_PASSWORD,
	UPDATE_PROFILE_SUCCESS,
} from '~components/common/Constant/toast';

const schema = Yup.object().shape({
	FullName: Yup.string().required('Họ tên không được để trống'),
	Phone: Yup.string()
		.required('Số điện thoại không được để trống'),
	Email: Yup.string()
		.required('Email không được để trống')
		.email('Email không hợp lệ'),
	BirthDay: Yup.string().required('Ngày sinh không được để trống'),
	SelectTarget: Yup.string()
		.nullable()
		.required('Mục tiêu không được để trống'),
	Address: Yup.string().required('Địa chỉ không được để trống'),
	PersonalPreference: Yup.string().required('Sở thích không được để trống'),
	RequestWithTeacher: Yup.string().required(
		'Yêu cầu với giáo viên không được để trống',
	),
	Language: Yup.string().matches(/[^0]+/g, 'Ngôn ngữ không được để trống'),
	TimeZoneID: Yup.string().matches(/[^0]+/g, 'Múi giờ không được để trống'),
	SkypeID: Yup.string().required('SkypeID không được để trống'),
});
const RenderListTimeZone = ({ list }) => {
	return (
		!!list &&
		list.length > 0 &&
		list.map((item, index) => (
			<option key={index} value={item.ID}>
				{item.TimeZoneName}
			</option>
		))
	);
};
const RenderListLanguage = ({ list }) => {
	return (
		!!list &&
		list.length > 0 &&
		list.map((item, index) => (
			<option key={index} value={item.ID}>
				{item.LanguageName}
			</option>
		))
	);
};
const convertTargetNumToString = (listNum, map) => {
	let z = [];
	if (listNum.length > 0) {
		for (let i = 0; i < listNum.length; i++) {
			for (let j = 0; j < map.length; j++) {
				if (map[j].ID == listNum[i]) {
					z.push(map[j].TargetName);
					break;
				}
			}
		}
	}
	return z;
};
const convertTargetStringToNum = (listString, map) => {
	let z = [];
	for (let i = 0; i < listString.length; i++) {
		for (let j = 0; j < map.length; j++) {
			if (listString[i] === map[j].TargetName) {
				z.push(map[j].ID);
				break;
			}
		}
	}
	return z;
};

const StudentForm = ({ tabDisplay }) => {
	const [profile, setProfile] = useState({});
	const [loadingProfile, setLoadingProfile] = useState(true);
	const [loadingUpdateProfile, setLoadingUpdateProfile] = useState(false);
	const [listLanguage, setListLanguage] = useState([]);
	const [listTimeZone, setListTimeZone] = useState([]);
	const [listTarget, setListTarget] = useState([]);
	const [selectedTarget, setSelectedTarget] = useState(null);
	const [avatar, setAvatar] = useState('');
	const [loadingAvatar, setLoadingAvatar] = useState(false);

	const updateProfileToastSuccess = () =>
		toast.success(UPDATE_PROFILE_SUCCESS, toastInit);
	const updateProfileToastFail = () => toast.error(FETCH_ERROR, toastInit);

	const {
		register,
		handleSubmit,
		errors,
		getValues,
		setValue,
		control,
	} = useForm({
		resolver: yupResolver(schema),
	});

	const onSubmit = data => {
		const array = data.SelectTarget.split(',');
		let z = convertTargetStringToNum(array, listTarget);

		console.log(data.BirthDay);
		console.log(moment(data.BirthDay).format('DD/MM/YYYY'));

		console.log(typeof data.BirthDay);

		const newProfile = {
			...data,
			Avatar: avatar,
			BirthDay:
				data.BirthDay.length > 20
					? moment(data.BirthDay).format('DD/MM/YYYY')
					: moment(convertDDMMYYYYtoMMDDYYYY(data.BirthDay)).format(
							'DD/MM/YYYY',
					  ),
			Target: z.join(','),
		};
		onUpdateProfileAPI(newProfile);
	};
	const getAPI = async () => {
		try {
			setLoadingProfile(true);
			const resProfile = await getProfile();
			if (resProfile.Code === 1) {
				setProfile({
					...resProfile.Data,
				});
				setAvatar(resProfile.Data.Avatar);
			}
			setLoadingProfile(false);

			const resTarget = await getListTargetAPI();
			if (resTarget.Code === 1 && resTarget.Data.length > 0) {
				setListTarget(resTarget.Data);
			}

			let arrayProfile = [];

			if (resProfile.Data && resProfile.Data.Target) {
				arrayProfile = resProfile.Data.Target.split(',');
			}

			let z = convertTargetNumToString(arrayProfile, resTarget.Data);
			setSelectedTarget(z);
		} catch {}
	};
	const getTimeZone = async () => {
		const res = await getTimeZoneAPI();
		if (res.Code === 1 && res.Data.length > 0) {
			setListTimeZone(res.Data);
		}
	};
	const getLanguage = async () => {
		const res = await getListLanguageAPI();
		if (res.Code === 1 && res.Data.length > 0) {
			setListLanguage(res.Data);
		}
	};
	const { t, i18n } = useTranslation('common');
	const onUpdateProfileAPI = async params => {
		setLoadingUpdateProfile(true);
		const res = await updateProfileAPI(params);
		if (res.Code === 1) {
			updateProfileToastSuccess();
		} else {
			updateProfileToastFail();
		}
		setLoadingUpdateProfile(false);
	};
	const renderTarget = options => {
		return options.map(item => item.TargetName);
	};
	const handleUploadImage = async e => {
		setLoadingAvatar(true);
		let files = e.target.files;
		if (!files) {
			setLoadingAvatar(false);
			return;
		} else {
			const res = await uploadImageToServer(files);
			if (res.Code === 1) {
				//Upload Avatar success
				const avatar = res.Data[0].UrlIMG;
				setAvatar(avatar);
				let output = document.getElementById('avatar');
				output.src = URL.createObjectURL(files[0]);
				output.onload = function() {
					URL.revokeObjectURL(output.src);
				};
			}
			setLoadingAvatar(false);
		}
	};
	useEffect(() => {
		var language = window.localStorage.getItem('language');

		if (language.includes('en')) {
			i18next.init({
				interpolation: { escapeValue: false },
				lng: 'en',
				compatibilityJSON: 'v2',
				resources: {
					en: {
						common: common_en,
					},
					vi: {
						common: common_vi,
					},
				},
			});
		} else if (language.includes('vi')) {
			i18next.init({
				interpolation: { escapeValue: false },
				lng: 'vi',
				compatibilityJSON: 'v2',
				resources: {
					en: {
						common: common_en,
					},
					vi: {
						common: common_vi,
					},
				},
			});
		}
		getAPI();
		getTimeZone();
		getLanguage();
	}, []);

	return tabDisplay === 1 ? (
		loadingProfile ? (
			<SkeletonStudentForm />
		) : !!profile && Object.keys(profile).length > 0 ? (
			<>
				<form
					id="form-account-profile"
					className="metronic-form"
					onSubmit={handleSubmit(onSubmit)}
				>
					<div className="form-account">
						<div className="row">
							<div className="col-12">
								<div className="form-row align-items-center ">
									<div className="form-group col-sm-3 col-label-fixed">
										<p className="mg-b-0 tx-medium ">{t('avt')}: </p>
									</div>
									<div className="form-group col-sm-9">
										<div className="student-avatar">
											<div className="upload-container">
												<div
													className={`${loadingAvatar ? '' : 'd-none'} overlay`}
												>
													<div className="lds-ellipsis">
														<div></div>
														<div></div>
														<div></div>
														<div></div>
													</div>
												</div>
												<label className="upload-avatar">
													<input
														type="file"
														accept="image/*"
														className="upload-box hidden d-none upload-file"
														onChange={handleUploadImage}
													/>
													<img
														id="avatar"
														alt="Avatar"
														src={
															profile.Avatar
																? profile.Avatar
																: '../assets/img/default-avatar.png'
														}
														onError={e => {
															e.target.onerror = null;
															e.target.src = '../assets/img/default-avatar.png';
														}}
													/>
												</label>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="col-md-6">
								<div className="form-row align-items-center">
									<div className="form-group col-sm-3 col-label-fixed">
										<p className="mg-b-0 tx-medium">{t('studentid')}:</p>
									</div>
									<div className="form-group col-sm-9">
										<input
											type="text"
											className="form-control"
											placeholder=""
											disabled={true}
											name="UID"
											required
											defaultValue={profile.UID}
											ref={register}
										/>
									</div>
								</div>
								<div className="form-row align-items-center">
									<div className="form-group col-sm-3 col-label-fixed">
										<p className="mg-b-0 tx-medium">{t('telephone')}:</p>
									</div>
									<div className="form-group col-sm-9">
										<input
											type="text"
											className="form-control"
											placeholder="0123456789"
											name="Phone"
											ref={register()}
											defaultValue={profile.Phone}
										/>
										{errors.Phone && (
											<span className="text-danger d-block mt-2">
												{errors.Phone.message}
											</span>
										)}
									</div>
								</div>
								<div className="form-row align-items-center">
									<div className="form-group col-sm-3 col-label-fixed">
										<p className="mg-b-0 tx-medium">{t('dateofbirth')}:</p>
									</div>
									<div className="form-group col-sm-9">
										<Controller
											as={
												<Flatpickr
													placeholder="dd/mm/yyyy"
													options={{
														dateFormat: 'd/m/Y',
														static: true,
													}}
													className="form-control"
												/>
											}
											control={control}
											defaultValue={
												!!profile.BirthDay
													? moment(profile.BirthDay).format('DD/MM/YYYY')
													: ''
											}
											name="BirthDay"
										/>
										{errors.BirthDay && (
											<span className="text-danger d-block mt-2">
												{errors.BirthDay.message}
											</span>
										)}
									</div>
								</div>
								<div className="form-row align-items-center">
									<div className="form-group col-sm-3 col-label-fixed">
										<p className="mg-b-0 tx-medium">{t('language')}:</p>
									</div>
									<div className="form-group col-sm-9">
										{!!listLanguage && listLanguage.length > 0 && (
											<select
												name="Language"
												ref={register}
												defaultValue={profile.Language ? profile.Language : '0'}
												className="form-control"
											>
												<option value="0">{t('language')}</option>
												<RenderListLanguage list={listLanguage} />
											</select>
										)}
										{errors.Language && (
											<span className="text-danger d-block mt-2">
												{errors.Language.message}
											</span>
										)}
									</div>
								</div>
							</div>
							<div className="col-md-6">
								<div className="form-row align-items-center">
									<div className="form-group col-sm-3 col-label-fixed">
										<p className="mg-b-0 tx-medium">{t('hvt')}:</p>
									</div>
									<div className="form-group col-sm-9">
										<input
											type="text"
											className="form-control"
											placeholder="Họ và tên"
											ref={register()}
											defaultValue={profile.FullName}
											name="FullName"
										/>
										{errors.FullName && (
											<span className="text-danger d-block mt-2">
												{errors.FullName.message}
											</span>
										)}
									</div>
								</div>
								<div className="form-row align-items-center">
									<div className="form-group col-sm-3 col-label-fixed">
										<p className="mg-b-0 tx-medium">Email:</p>
									</div>
									<div className="form-group col-sm-9">
										<input
											type="email"
											className="form-control"
											name="Email"
											ref={register()}
											defaultValue={profile.Email}
											placeholder="Ex:example@domain.com"
										/>
										{errors.Email && (
											<span className="text-danger d-block mt-2">
												{errors.Email.message}
											</span>
										)}
									</div>
								</div>
								<div className="form-row align-items-center">
									<div className="form-group col-sm-3 col-label-fixed">
										<p className="mg-b-0 tx-medium">{t('sex')}:</p>
									</div>
									<div className="form-group col-sm-9">
										<select
											className="form-control"
											name="Gender"
											ref={register}
											defaultValue={profile.Gender}
										>
											<option value="1">{t('men')}</option>
											<option value="2">{t('women')}</option>
											<option value="3">{t('khac')}</option>
										</select>
									</div>
								</div>
								<div className="form-row align-items-center">
									<div className="form-group col-sm-3 col-label-fixed">
										<p className="mg-b-0 tx-medium">{t('overtime')}:</p>
									</div>
									<div className="form-group col-sm-9">
										{!!listTimeZone && listTimeZone.length > 0 && (
											<select
												name="TimeZoneID"
												ref={register}
												defaultValue={
													profile.TimeZoneID ? profile.TimeZoneID : '0'
												}
												className="form-control"
											>
												<option value="0">Chọn Múi Giờ</option>
												<RenderListTimeZone list={listTimeZone} />
											</select>
										)}
										{errors.TimeZoneID && (
											<span className="text-danger d-block mt-2">
												{errors.TimeZoneID.message}
											</span>
										)}
									</div>
								</div>
							</div>
							<div className="col-12">
								<div className="form-row  align-items-center ">
									<div className="form-group col-sm-3 col-label-fixed">
										<p className="mg-b-0 tx-medium ">{t('address')}:</p>
									</div>
									<div className="form-group col-sm-9">
										<input
											type="text"
											className="form-control"
											placeholder="Your address"
											name="Address"
											ref={register()}
											defaultValue={profile.Address}
										/>
										{errors.Address && (
											<span className="text-danger d-block mt-2">
												{errors.Address.message}
											</span>
										)}
									</div>
								</div>
							</div>
							<div className="col-12">
								<div className="form-row  align-items-center ">
									<div className="form-group col-sm-3 col-label-fixed">
										<p className="mg-b-0 tx-medium ">
											{t('purposeoflearningenglish')}:
										</p>
									</div>
									<div className="form-group col-sm-9 select-checkbox">
										{Array.isArray(selectedTarget) && (
											<>
												<Controller
													as={
														<Select
															isMulti
															options={renderTarget(listTarget)}
															getOptionLabel={label => label}
															getOptionValue={value => value}
															styles={appSettings.selectStyle}
															className="basic-multi-select"
															placeholder="Chọn Mục Tiêu"
															classNamePrefix="select"
															onChange={val => setValue('SelectTarget', val)}
														/>
													}
													control={control}
													defaultValue={selectedTarget}
													name="SelectTarget"
												/>
												{errors.SelectTarget && (
													<span className="text-danger d-block mt-2">
														{errors.SelectTarget.message}
													</span>
												)}
											</>
										)}
									</div>
								</div>
							</div>
							<div className="col-12">
								<div className="form-row  align-items-center ">
									<div className="form-group col-sm-3 col-label-fixed">
										<p className="mg-b-0 tx-medium ">SkypeID:</p>
									</div>
									<div className="form-group col-sm-9">
										<input
											type="text"
											placeholder="SkypeID"
											className="form-control"
											name="SkypeID"
											ref={register()}
											defaultValue={profile.SkypeID}
										/>
										{errors.SkypeID && (
											<span className="text-danger d-block mt-2">
												{errors.SkypeID.message}
											</span>
										)}
									</div>
								</div>
							</div>
							<div className="col-12">
								<div className="form-row  align-items-center ">
									<div className="form-group col-sm-3 col-label-fixed">
										<p className="mg-b-0 tx-medium ">{t('bobby')}:</p>
									</div>
									<div className="form-group col-sm-9">
										<input
											type="text"
											placeholder="Sở thích"
											className="form-control"
											name="PersonalPreference"
											ref={register()}
											defaultValue={profile.PersonalPreference}
										/>
										{errors.PersonalPreference && (
											<span className="text-danger d-block mt-2">
												{errors.PersonalPreference.message}
											</span>
										)}
									</div>
								</div>
							</div>
							<div className="col-12">
								<div className="form-row  align-items-center ">
									<div className="form-group col-sm-3 col-label-fixed">
										<p className="mg-b-0 tx-medium ">
											{t('requesttoteacher')}:
										</p>
									</div>
									<div className="form-group col-sm-9">
										<textarea
											id=""
											rows="3"
											className="form-control"
											placeholder="Yêu cầu với giáo viên"
											name="RequestWithTeacher"
											ref={register()}
											defaultValue={profile.RequestWithTeacher}
										></textarea>
										{errors.RequestWithTeacher && (
											<span className="text-danger d-block mt-2">
												{errors.RequestWithTeacher.message}
											</span>
										)}
									</div>
								</div>
							</div>
							<div className="col-12">
								<div className="form-row  align-items-center ">
									<div className="form-group col-sm-3 col-label-fixed"></div>
									<div className="form-group col-sm-9 mg-b-0-f">
										<button
											type="submit"
											disabled={loadingUpdateProfile ? true : ''}
											className="btn btn-primary rounded"
											style={{
												width: loadingUpdateProfile ? '120px' : 'auto',
												color: '#fff',
											}}
										>
											{loadingUpdateProfile ? (
												<i className="fa fa-spinner fa-spin"></i>
											) : (
												'Lưu Thông Tin'
											)}
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</form>
			</>
		) : (
			!loadingProfile && (
				<div className="text-center">
					<span className="d-block text-center tx-danger tx-medium">
						Đã có lỗi xảy ra, xin vui lòng thử lại
					</span>
					<img
						src="../assets/img/error.svg"
						alt="image"
						className="wd-200 mg-b-15"
					/>
				</div>
			)
		)
	) : (
		<PasswordForm />
	);
};

const PasswordForm = () => {
	const [oldPassword, setOldPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [displayPassword, setDisplayPassword] = useState(false);
	const [error, setError] = useState(null);
	const [loadingPassword, setLoadingPassword] = useState(false);
	const { t, i18n } = useTranslation('common');
	const updatePassToastSuccess = () =>
		toast.success(CHANGE_PASSWORD_SUCCESS, toastInit);
	const updatePassToastFail = () => toast.error(FETCH_ERROR, toastInit);

	const _onSubmit = e => {
		e.preventDefault();

		if (oldPassword === '' || newPassword === '' || confirmPassword === '') {
			setError(FILL_PASSWORD);
			return;
		}

		if (oldPassword === newPassword) {
			setError(DIFFERENT_PASSWORD);
			return;
		}
		if (newPassword !== confirmPassword) {
			setError(CONFIRM_PASSWORD);
			return;
		}
		setError(null);
		_handleSubmitPassword();
	};

	const _handleSubmitPassword = async () => {
		setLoadingPassword(true);
		const res = await updatePassAPI({
			OldPass: oldPassword,
			NewPass: newPassword,
		});
		setLoadingPassword(false);
		if (res.Code === 0) {
			setError(INCORRECT_PASSWORD);
			return;
		} else if (res.Code === 1) {
			setError(null);
			updatePassToastSuccess();
			setOldPassword('');
			setNewPassword('');
			setConfirmPassword('');
		} else updatePassToastFail();
	};

	return (
		<form className="metronic-form change-password-form" onSubmit={_onSubmit}>
			{error && error !== '' && (
				<div className="alert alert-danger mg-b-10" role="alert">
					{error}
				</div>
			)}
			<div className="form-account">
				<div className="row">
					<div className="col-12">
						<div className="form-row align-items-center ">
							<div className="form-group col-sm-3 col-label-fixed">
								<p className="mg-b-0 tx-medium">{t('currentpassword')}</p>
							</div>
							<div className="form-group col-sm-9 col-password">
								<input
									type={displayPassword ? 'text' : 'password'}
									autoComplete="off"
									className="form-control"
									name="OldPass"
									onChange={e => setOldPassword(e.target.value)}
									value={oldPassword}
								/>
							</div>
						</div>
					</div>
					<div className="col-12">
						<div className="form-row align-items-center ">
							<div className="form-group col-sm-3 col-label-fixed">
								<p className="mg-b-0 tx-medium">{t('newpassword')}</p>
							</div>
							<div className="form-group col-sm-9 col-password">
								<input
									type={displayPassword ? 'text' : 'password'}
									autoComplete="off"
									className="form-control"
									name="NewPass"
									onChange={e => setNewPassword(e.target.value)}
									value={newPassword}
								/>
							</div>
						</div>
					</div>
					<div className="col-12">
						<div className="form-row align-items-center ">
							<div className="form-group col-sm-3 col-label-fixed">
								<p className="mg-b-0 tx-medium">{t('confirmpassword')}</p>
							</div>
							<div className="form-group col-sm-9 col-password">
								<input
									type={displayPassword ? 'text' : 'password'}
									autoComplete="off"
									className="form-control"
									name="OldPass"
									onChange={e => setConfirmPassword(e.target.value)}
									value={confirmPassword}
								/>
							</div>
						</div>
					</div>
					<div className="col-12">
						<div className="form-group pd-l-2">
							<div className="custom-control custom-checkbox">
								<input
									type="checkbox"
									className="custom-control-input"
									id="displaypassword"
									onChange={() => setDisplayPassword(!displayPassword)}
								/>
								<label
									className="custom-control-label"
									htmlFor="displaypassword"
								>
									{t('displaypassword')}
								</label>
							</div>
						</div>
					</div>
					<div className="col-12">
						<div className="form-row align-items-center ">
							<div className="form-group col-sm-3 col-label-fixed"></div>
							<div className="form-group col-sm-9 mg-b-0-f">
								<button
									type="submit"
									disabled={loadingPassword ? true : ''}
									className="btn btn-primary rounded"
									style={{
										width: loadingPassword ? '115px' : 'auto',
										color: '#fff',
									}}
								>
									{loadingPassword ? (
										<i className="fa fa-spinner fa-spin"></i>
									) : (
										'Đổi Mật Khẩu'
									)}
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</form>
	);
};

export default StudentForm;
