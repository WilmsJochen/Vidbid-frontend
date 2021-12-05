import React from "react";
import 'semantic-ui-css/semantic.min.css'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import styled from 'styled-components'
import MainMenu from "./common/MainMenu";
import HomePage from "./pages/HomePage";
import UploadPage from "./pages/UploadPage";
import img from './images/greyBackgount.jpg';

const GlobalStyle = styled.div`
  background-image: url(${img});
  background-repeat: repeat-y;
  height: 100%;
`


function App() {
  return (
      <Router>
          <GlobalStyle>
              <MainMenu>
                  <Routes>
                      <Route exact path="/" element={<HomePage/>} />
                      <Route exact path="/VidBid" element={<HomePage/>} />
                      <Route exact path="/upload" element={<UploadPage/>} />
                  </Routes>
              </MainMenu>
          </GlobalStyle>
      </Router>
  );
}

export default App;
