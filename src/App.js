import React from "react";
import 'semantic-ui-css/semantic.min.css'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import CombinedProvider from "./contextProviders/CombinedProvider";
import MainMenu from "./common/MainMenu";
import HomePage from "./pages/HomePage";
import MyVidBidPage from "./pages/MyVidBid";
import globalCss from './css/globalStyle.css';


function App() {
  return (
    <CombinedProvider>
        <Router>
            <MainMenu>
                <Routes>
                    <Route exact path="/" element={<HomePage/>} />
                    <Route exact path="/VidBid" element={<HomePage/>} />
                    <Route exact path="/MyVidBid" element={<MyVidBidPage/>} />
                </Routes>
            </MainMenu>
        </Router>
    </CombinedProvider>
  );
}

export default App;
