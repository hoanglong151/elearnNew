import React from 'react';
import { Route, Switch } from 'react-router-dom'

import BlogDetail from '../../components/BlogDetail/BlogDetail'
import BookedLesson from '../../components/BookedLesson/bookedLesson'
import Faq from '../../components/Faq/Faq'
import Feedback from '../../components/Feedback/Feedback'
import LessonDetail from '../../components/LessonDetail/LessonDetail'
import LessonHistory from '../../components/LessonHistory/lessonHistory'
import Login from '../../components/Login/Login'
import Notification from '../../components/Notification/Notification'
import Signup from '../../components/Signup/Signup'
import BookingLesson from '../../components/StudentBooking/BookingLesson'
import StudentDashboard from '../../components/StudentDashboard/studentDashboard'
import StudentProfile from '../../components/StudentProfile/studentProfile'
import TeacherDetail from '../../components/TeacherDetail/TeacherDetail'

const studentRoutes = [{
    path: 'blogDetail.html',
    exact: true,
    main: () => <BlogDetail />
},
{
    path: 'bookedLesson.html',
    exact: true,
    main: () => <BookedLesson />
},
{
    path: 'faq.html',
    exact: true,
    main: () => <Faq />
},
{
    path: 'feedback.html',
    exact: true,
    main: () => <Feedback />
},
{
    path: 'lessonDetail.html',
    exact: true,
    main: () => <LessonDetail />
},
{
    path: 'lessonHistory.html',
    exact: true,
    main: () => <LessonHistory />
},
{
    path: 'login.html',
    exact: true,
    main: () => <Login />
},
{
    path: 'notification.html',
    exact: true,
    main: () => <Notification />
},
{
    path: 'signup.html',
    exact: true,
    main: () => <Signup />
},
{
    path: 'bookingLesson.html',
    exact: true,
    main: () => <BookingLesson />
},
{
    path: 'studentDashboard.html',
    exact: true,
    main: () => <StudentDashboard />
},
{
    path: 'studentProfile.html',
    exact: true,
    main: () => <StudentProfile />
},
{
    path: 'teacherDetail.html',
    exact: true,
    main: () => <TeacherDetail />
}
];


showContentMenus = (studentRoutes) => {
    var result = null;
    result = studentRoutes.map((route, index) => {
        return <Route
            key={index}
            path={route.path}
            exact={route.exact}
            component={route.main} />
    })
    return <Switch>
        {result}
    </Switch>
}

export default showContentMenus;