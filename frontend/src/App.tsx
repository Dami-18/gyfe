import React, { useState, useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { UserContext } from "./app-context/user-context";
import "./styles/App.scss";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Electives from "./components/Electives";
import MultiForm from "./components/MultiForm";
import About from "./components/About";
import Modal from "./components/Modal";

const App: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const { user } = useContext(UserContext);

  // const [isLoggedIn, setLogin] = useState<boolean>(() => {
  //   const savedLoginstate = sessionStorage.getItem('loginStatus');
  //   return savedLoginstate == 'true'; // by default false if session not stored
  // });

  // useEffect(() => {
  //   sessionStorage.setItem('loginStatus',isLoggedIn.toString());
  // }, [isLoggedIn]);

  // const updateStatus = () => {  // Prop to control login status
  //   setLogin(true);
  // }

  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/login" element={<MultiForm />} />
          <Route
            path="/"
            element={
              !!sessionStorage.getItem("ssoToken") ? (
                <Electives />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
        <About setOpenModal={setOpenModal} />
        {openModal && <Modal closeModal={setOpenModal} />}
        <Footer />
      </div>
    </Router>
  );
};

export default App;
