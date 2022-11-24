import React, { useState } from 'react';
import TeacherInformation from './TeacherInformation';
import TeacherIntroduce from './TeacherIntroduce';
import TeacherExperience from './TeacherExperience';
import Sidebar from './Sidebar';
import { Tab, Nav } from 'react-bootstrap';
import styles from './ProfileInfor.module.scss'

const ProfileInfor = () => {
    const [activePage, setActivePage] = useState('profile')

    return (
        <>
            <div className="card card-custom">
                <div className="">
                    <div className="tab-navigation">
                        <ul className="list-tab" id="js-list-tab">
                            <li className="tab-item">
                                <span className={`tab-link ${activePage === 'profile' && 'active'}`} onClick={() => setActivePage('profile')}><i className="far fa-id-card"></i> Basic Information</span>
                            </li>
                            <li className="tab-item">
                                <span className={`tab-link ${activePage === 'introduce' && 'active'}`} onClick={() => setActivePage('introduce')}><i className="fab fa-youtube"></i> Introduction video</span>
                            </li>
                            <li className="tab-item">
                                <span className={`tab-link ${activePage === 'experience' && 'active'}`} onClick={() => setActivePage('experience')}><i className="fas fa-certificate"></i> Experience & Certificate</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="card-body">
                    <div className="teacher__info-wrap">
                        <Tab.Container
                            activeKey={activePage}
                            defaultActiveKey={activePage}
                        >
                            <Tab.Content>
                                <Tab.Pane eventKey="profile">
                                    <TeacherInformation />
                                </Tab.Pane>
                                <Tab.Pane eventKey="introduce">
                                    <TeacherIntroduce />
                                </Tab.Pane>
                                <Tab.Pane eventKey="experience">
                                    <TeacherExperience />
                                </Tab.Pane>
                            </Tab.Content>
                            {/* <TeacherInformation />
                                <TeacherIntroduce />
                                <TeacherExperience /> */}
                        </Tab.Container>
                    </div>

                </div>

            </div>
        </>
    )
}


export default ProfileInfor;