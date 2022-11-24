import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import ProfileInfor from './ProfileInfor';
import TeacherIntroduce from './TeacherIntroduce';
import TeacherExperience from './TeacherExperience';
import Sidebar from './Sidebar';
import { Tab, Nav } from 'react-bootstrap';
import styles from './teacherProfile.module.scss'
import ChangePassword from './ChangePassword';
import PaymentInfo from './PaymentInfo';
import {ToastContainer} from 'react-toastify';
import {Provider as ProfileProvider} from '~src/context/ProfileContext'; 

const TeacherProfile = () => {
    const [activePage, setActivePage] = useState('profile');

    const handleActivePage = page => {
        setActivePage(page);
    }


    return (
        <>
            <ProfileProvider>
           {/*  <h3 className="mg-b-30">Profile</h3> */}
            <div className="d-flex flex-wrap flex-lg-nowrap">
                <div className="wd-lg-350 wd-100p flex-shrink-0 mg-b-30 mg-lg-b-0 mg-lg-r-30">
                    <Sidebar setActive={handleActivePage} activePage={activePage}/>
                </div>
                <div className="flex-grow-1">
                    <div className="teacher__detail" >
                        <div className="teacher-body mg-t-0-f pd-t-0-f">
                            <div className="teacher__info-wrap">
                                <Tab.Container
                                    activeKey={activePage}
                                    defaultActiveKey={activePage}
                                >
                                    <Tab.Content>
                                        <Tab.Pane eventKey="profile">
                                            <ProfileInfor />
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="password">
                                            <ChangePassword />
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="payment">
                                            <PaymentInfo />
                                        </Tab.Pane>
                                    </Tab.Content>
                                </Tab.Container>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            </ProfileProvider>
        </>
    )
}


const domContainer = document.getElementById('react-teacher-form');
ReactDOM.render(<TeacherProfile />, domContainer);