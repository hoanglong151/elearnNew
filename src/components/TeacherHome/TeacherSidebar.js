import React, { useState, useEffect } from 'react';
import { getTeacherInfo } from '~src/api/teacherAPI';
import Skeleton from 'react-loading-skeleton';
import { Modal, Button } from 'react-bootstrap';
import { updatePassAPI } from '~src/api/optionAPI';
import { toastInit } from "~src/utils"
const initialState = {
    FullName: 'Hoang Uyen Than',
    Address: "Hồ Chí Minh",
    Gender: 1,
    BirthDay: "2020-07-10T09:52:14.5215882+07:00",
    SkypeID: "live:shockdie1995",
    Phone: "0909090909",
    Username: "thaivietdat",
    Email: "thaivietdat@gmail.com",
}

const SummaryBlock = ({ imageUrl, title, value, isLoading }) => {
    return (
        <div className="d-flex align-items-center mg-b-15">
            {!isLoading ? (<span className="bg-gray-100 wd-50 ht-50 rounded-circle d-inline-flex align-items-center justify-content-center">
                <img className="wd-30 ht-30 object-fit" src={imageUrl || '../assets/img/teacher.jpg'} />
            </span>) : (<Skeleton circle={true} width={30} height={30} />)}

            <div className="mg-l-10">
                <p className="mg-b-0 tx-medium tx-20 tx-primary">{!isLoading ? (value) : (<Skeleton width={25} />)} </p>
                <p className="tx-gray-500 mg-b-0">{!isLoading ? (title) : (<Skeleton width={25} />)}</p>
            </div>
        </div>
    )
}

const ModalChangePass = ({ error, showPassword, hideChangePasswordForm, _onSubmitPassword }) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const _onSubmit = (e) => {
        e.preventDefault();
        _onSubmitPassword({ oldPassword, newPassword });
    }

    return (
        <Modal
            show={showPassword}
            onHide={hideChangePasswordForm}
            size="sm"
        >
            <Modal.Header closeButton>
                <Modal.Title>Change password</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="form-group">
                    <div className="input-float">
                        <input type="password" className="form-control" placeholder="Job title" onChange={(e) => setOldPassword(e.target.value)} defaultValue={''} />
                        <label>Old password</label>
                    </div>
                </div>
                <div className="form-group">
                    <div className="input-float">
                        <input type="password" className="form-control" placeholder="Job title" onChange={(e) => setNewPassword(e.target.value)} defaultValue={''} />
                        <label>New password</label>
                    </div>
                </div>
                {error && error !== '' && (<span className="tx-danger">{error}</span>)}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={_onSubmit}>
                    Change
           </Button>
                <Button variant="secondary" onClick={hideChangePasswordForm}>
                    Close
           </Button>
            </Modal.Footer>
        </Modal>
    )
}

const TeacherSidebar = () => {
    const [state, setState] = useState(initialState);
    const [isLoading, setIsLoading] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const showChangePasswordForm = () => {
        setShowPassword(true);
    }

    const hideChangePasswordForm = () => {
        setShowPassword(false);
    }

    const _onSubmitPassword = async (formData) => {
        const { oldPassword, newPassword } = formData;
        if (oldPassword === '' || newPassword === '') {
            setError('Password field must not empty !!');
            return;
        }
        setError(null);
        const res = await updatePassAPI({
            UID: state.UID,
            OldPass: oldPassword,
            NewPass: newPassword
        });
        if (res.Code === 0) {
            setError('Old password is not correct');
            return;
        } else if (res.Code === 1) {
            setError(null);
            hideChangePasswordForm();
            toast.success("Change password successful!", toastInit);
        }

    }

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const res = await getTeacherInfo();
            if (res.Code === 1) {
                setState({
                    ...state,
                    Avatar: res.Data?.AvatarThumnail ?? '',
                    FullName: res.Data?.FullName ?? '',
                    Address: "Hồ Chí Minh",
                    Gender: 1,
                    BirthDay: "2020-07-10T09:52:14.5215882+07:00",
                    SkypeID: res.Data?.SkypeID ?? '',
                    Phone: res.Data?.Phone ?? '',
                    Username: "thaivietdat",
                    Email: res.Data?.Email ?? '',
                    TotalClass: res.Data?.TotalClass ?? 0,
                    TotalDaysExperience: res.Data?.TotalDaysExperience ?? 0,
                    TotalStudent: res.Data?.TotalStudent ?? 0,
                });
            }
        } catch (error) {
            
        }
     
        setIsLoading(false);
    }

    useEffect(() => {
        fetchData();
    }, [])

    return (
        <>
            {/* <div className="mg-sm-r-30 mg-lg-r-0 d-sm-flex d-lg-block">
                <div className="mg-b-20 mg-sm-x-30 mg-lg-x-0">
                    <div className="avatar avatar-xxl avatar-online"><img src="../assets/img/default-avatar.png" className="rounded-circle" alt="" /></div>
                    <h5 className="mg-b-2 tx-spacing--1 mg-t-15">{!isLoading ? state.FullName || '' : <Skeleton width={50} />}</h5>
                    <div className="d-flex mg-b-25 mg-t-15">
                        <a className="btn btn-xs btn-primary mg-r-10" href={`teacherProfile.html`}><i className="far fa-id-card mg-r-5"></i> profile</a>
                        <button type="button" className="btn btn-xs btn-primary " onClick={showChangePasswordForm}><i className="fas fa-key mg-r-5" ></i> Change password</button>
                    </div>
                </div>
                <div >
                    <label className="tx-sans tx-10 tx-semibold tx-uppercase tx-color-01 tx-spacing-1 mg-b-15">Contact Information</label>
                    <ul className="list-unstyled profile-info-list mg-b-10">
                        <li><i data-feather="phone" /><a href="tel:0987654321">{!isLoading ? state.Phone || '' : <Skeleton width={50} />}</a></li>
                        <li><i data-feather="mail" /><a href={`mailto:${state.Email || ''}`}>{!isLoading ? state.Email || '' : <Skeleton width={50} />}</a>
                        </li>
                    </ul>
                </div>
            </div>
            <div >
                <label className="tx-sans tx-10 tx-semibold tx-uppercase tx-color-01 tx-spacing-1 mg-b-15">Summary</label>
                <div className="list-unstyled">
                    <SummaryBlock imageUrl='../assets/img/time-in-class.png' title="Hours Classes" value="32" isLoading={isLoading} />
                    <SummaryBlock imageUrl='../assets/img/student.png' title="Student Members" value="172" isLoading={isLoading} />
                    <SummaryBlock imageUrl='../assets/img/exp.png' title="Days Experience" value="122" isLoading={isLoading} />

                </div>
            </div> */}
            <div className="card card-custom gutter-b wd-100p">
                {/*begin::Body*/}
                <div className="card-body card-body-thin">
                    {/*begin::Wrapper*/}
                    <div className="d-flex justify-content-between flex-column h-100">
                        {/*begin::Container*/}
                        <div className="">
                            {/*begin::Header*/}
                            <div className="d-flex flex-column flex-center  tx-center">
                                {/*begin::Symbol*/}
                                <div className="symbol symbol-120 symbol-circle symbol-success overflow-hidden mg-b-15">
                                    <span className="symbol-label">
                                      {!state.isLoading ? <img src={`${state?.Avatar ?? "/assets/img/default-avatar.png"}`} className="avatar-xxl align-self-end object-fit rounded-5" alt="Avatar Teacher" /> : <Skeleton width={100} height={100}/>}
                                        
                                    </span>
                                </div>
                                {/*end::Symbol*/}
                                {/*begin::Username*/}
                                <a href="/ElearnTeacher/Profile" className="card-title tx-primary tx-bolder tx-16">{!isLoading ? state.FullName || '' : <Skeleton width={50} />}</a>
                                {/*end::Username*/}
                                {/*begin::Info*/}
                                <div className="d-flex justify-content-between align-items-center mg-b-5">
                                    <span className="tx-medium">Skype ID:</span>
                                    <span className="tx-gray-400">{!isLoading ? state.SkypeID || '' : <Skeleton width={50} />}</span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center mg-b-15">
                                    <span className="tx-medium">Email:</span>
                                    <a href={`mailto:${state.Email || ''}`} className="tx-gray-400">{!isLoading ? state.Email || '' : <Skeleton width={50} />}</a>
                                </div>
                                
                                {/*end::Info*/}
                            </div>
                            {/*end::Header*/}
                            {/*begin::Body*/}
                            <div className="pt-1">
        
                                {/*begin::Item*/}
                                <div className="d-flex align-items-center pd-b-15">
                                    {/*begin::Symbol*/}
                                    <div className="symbol symbol-45 symbol-light mr-4">
                                        <span className="align-items-center bg-primary-light d-flex ht-45 justify-content-center rounded-5 symbol-label wd-45">
                                            <span className="svg-icon svg-icon-2x svg-icon-dark-50">
                                                <i data-feather="user" className="tx-gray-400"></i>
                                            </span>
                                        </span>
                                    </div>
                                    {/*end::Symbol*/}
                                    {/*begin::Text*/}
                                    <div className="d-flex flex-column flex-grow-1">
                                        <span className="tx-dark text-hover-primary mb-1 font-size-lg tx-medium">Students</span>
                                        {/* <span className="text-muted tx-gray-400 tx-normal">Student booked</span> */}
                                    </div>
                                    {/*end::Text*/}
                                    {/*begin::label*/}
                                    <span className="badge bg-gray-200 pd-y-10 tx-14 wd-35 mg-l-15">{state?.TotalStudent ?? 0}</span>
                                    {/*end::label*/}
                                </div>
                                {/*end::Item*/}
                                {/*begin::Item*/}
                                <div className="d-flex align-items-center pd-b-15">
                                    {/*begin::Symbol*/}
                                    <div className="symbol symbol-45 symbol-light mr-4">
                                        <span className="align-items-center bg-primary-light d-flex ht-45 justify-content-center rounded-5 symbol-label wd-45">
                                            <span className="svg-icon svg-icon-2x svg-icon-dark-50">
                                                {/*begin::Svg Icon | path:/metronic/theme/html/demo7/dist/assets/media/svg/icons/Layout/Layout-4-blocks.svg*/}
                                                <i data-feather="calendar" className="tx-gray-400"></i>
                                                {/*end::Svg Icon*/}
                                            </span>
                                        </span>
                                    </div>
                                    {/*end::Symbol*/}
                                    {/*begin::Text*/}
                                    <div className="d-flex flex-column flex-grow-1">
                                        <span className="tx-dark text-hover-primary mb-1 font-size-lg tx-medium">Finished classes</span>
                                        {/* <span className="text-muted tx-gray-400 tx-normal">Finished classes</span> */}
                                    </div>
                                    {/*end::Text*/}
                                    {/*begin::label*/}
                                    <span className="badge bg-gray-200 pd-y-10 tx-14 wd-35 mg-l-15">{state?.TotalClass ?? 0}</span>
                                    {/*end::label*/}
                                </div>
                                {/*end::Item*/}
                                {/*begin::Item*/}
                                <div className="d-flex align-items-center">
                                    {/*begin::Symbol*/}
                                    <div className="symbol symbol-45 symbol-light mr-4">
                                        <span className="align-items-center bg-primary-light d-flex ht-45 justify-content-center rounded-5 symbol-label wd-45">
                                            <span className="svg-icon svg-icon-2x svg-icon-dark-50">
                                                {/*begin::Svg Icon | path:/metronic/theme/html/demo7/dist/assets/media/svg/icons/Home/Globe.svg*/}
                                                <i data-feather="briefcase" className="tx-gray-400"></i>
                                                {/*end::Svg Icon*/}
                                            </span>
                                        </span>
                                    </div>
                                    {/*end::Symbol*/}
                                    {/*begin::Text*/}
                                    <div className="d-flex flex-column flex-grow-1">
                                        <span className="tx-dark text-hover-primary mb-1 font-size-lg tx-medium">Days experience</span>
                                        {/* <span className="text-muted tx-gray-400 tx-normal">Days Experience</span> */}
                                    </div>
                                    {/*end::Text*/}
                                    {/*begin::label*/}
                                    <span className="badge bg-gray-200 pd-y-10 tx-14 wd-35 mg-l-15">{state?.TotalDaysExperience ?? 0}</span>
                                    {/*end::label*/}
                                </div>
                                {/*end::Item*/}
                            </div>
                            {/*end::Body*/}
                        </div>
                        {/*eng::Container*/}
                     
                    </div>
                    {/*end::Wrapper*/}
                </div>
                {/*end::Body*/}
            </div>


            <ModalChangePass
                error={error}
                showPassword={showPassword}
                _onSubmitPassword={_onSubmitPassword}
                hideChangePasswordForm={hideChangePasswordForm}
            />
        </>
    )
}


export default TeacherSidebar
