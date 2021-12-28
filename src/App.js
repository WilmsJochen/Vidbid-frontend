import React from "react";
import 'semantic-ui-css/semantic.min.css'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import CombinedProvider from "./contextProviders/CombinedProvider";
import MainMenu from "./common/MainMenu";
import HomePage from "./pages/HomePage";
import MyVidBidPage from "./pages/MyVidBid";
import TeamPage from "./pages/Team";
import FaqPage from "./pages/Faq";
import RoadMapPage from "./pages/RoadMap";
// eslint-disable-next-line no-unused-vars
import globalCss from './css/globalStyle.css';


function App() {
    return (
    <CombinedProvider>
        <Router>
            <MainMenu>
                <Routes>
                    <Route exact path="/" element={<HomePage showRoadmap={false}/>} />
                    <Route exact path="/vidbid" element={<HomePage/>} />
                    <Route exact path="/myvidbid" element={<MyVidBidPage/>} />
                    <Route exact path="/team" element={<TeamPage/>} />
                    <Route exact path="/faq" element={<FaqPage/>} />
                    <Route exact path="/roadmap" element={<RoadMapPage/>} />
                </Routes>
            </MainMenu>
        </Router>
    </CombinedProvider>
  );
}

export default App;
