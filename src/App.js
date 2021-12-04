import React from "react";
import 'semantic-ui-css/semantic.min.css'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import SidebarMenu from "./common/SidebarMenu";
import MainMenu from "./common/MainMenu";
import HomePage from "./pages/HomePage";
import UploadPage from "./pages/UploadPage";

function App() {
  return (
      <Router basename={process.env.PUBLIC_URL}>
          <MainMenu>
              <Routes>
                      <Route exact path="/" component={HomePage} />
                      <Route exact path="/home" component={HomePage} />
                      <Route exact path="/upload" component={UploadPage} />
              </Routes>
          </MainMenu>
      </Router>
  );
}

export default App;
