import React from 'react';
import './App.css';
import EmployeeList from './components/EmployeeList';
import profilePic from './Images/My_Profile_Pic.jpeg';

function App() {
  return (
    <div className="App">
      {/* <header className="App-header">
        <div className="header-container">
          <h1>Employee Management System</h1>
        </div>
      </header> */}

      <header className="my-App-header">
        <h1>Employee Management System</h1>
        <div className="my-profile-container">
          <img src={profilePic} alt="Developer" className="my-profile-photo" />
          <span className="my-developer-name">Srinivasa T K</span>
        </div>
      </header>
      <EmployeeList />
    </div>
  );
}

export default App;
