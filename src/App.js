import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './Components/Login';
import MainComponent from './Components/MainComponent';


const App = () => {
 

    return (
      <>

      <Routes>
        <Route path="/" element={< Login />} />
        <Route path="/dashboard" element={<MainComponent/>} />
        <Route path="/login" element={< Login />} />
      </Routes>
       
        </>
    );
};

export default App;
