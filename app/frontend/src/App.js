import React from 'react';
import Details from './Components/Detail';
import Login from './Components/Login';
import PageTemplate from './Components/PageTemplate';
import Home from './Components/Home';
import SignUp from './Components/SignUp';
import Dashboard from './Components/Dashboard';
import Courses from './Components/Courses';
import TutorProfileStudentView from './Pages/TutorProfileStudentView'
import Footer from './Components/Footer';
import { BrowserRouter as Router, Routes, Route, Navigate, Switch, useLocation } from 'react-router-dom';
import CourseDetailsStudentView from './Pages/CourseDetailsStudentView';
import TutorProfileTutorView from './Pages/TutorProfileTutorView';
import EditTutorProfile from './Pages/EditTutorProfile';
import CourseDetailsTutorView from './Pages/CourseDetailsTutorView';
import EditCourseDetails from './Pages/EditCourseDetails';
import AddCourseDetails from './Pages/AddCourseDetails';


function App() {
  return (
    <Router>
        <Routes>
          <Route path = '/' element = { <PageTemplate><Home /></ PageTemplate> } />
          <Route exact path = '/login' element = { <Login /> } />
          <Route exact path = '/signup' element = { <SignUp /> } />
          <Route exact path = '/detail' element = { <PageTemplate><Details /></PageTemplate> } />
          <Route exact path = '/dashboard' element = { <PageTemplate><Dashboard /></PageTemplate> } />
          <Route exact path = '/courses' element = { <PageTemplate><Courses /></ PageTemplate> } />
         
          <Route path = '/coursesv' element = { <PageTemplate><CourseDetailsStudentView /></ PageTemplate> } />
          <Route path = '/coursetv' element = { <PageTemplate><CourseDetailsTutorView /></ PageTemplate> } />
          <Route path = '/tutorsv' element = { <PageTemplate><TutorProfileStudentView /></ PageTemplate> } />
          <Route path = '/tutortv' element = { <PageTemplate><TutorProfileTutorView /></ PageTemplate> } />
          <Route path = '/editTutor' element = { <PageTemplate><EditTutorProfile /></ PageTemplate> } />
          <Route path = '/editCourse' element = { <PageTemplate><EditCourseDetails /></ PageTemplate> } />
          <Route path = '/addCourse' element = { <PageTemplate><AddCourseDetails /></ PageTemplate> } />
        </Routes>
    </Router>
  );
}

export default App;
