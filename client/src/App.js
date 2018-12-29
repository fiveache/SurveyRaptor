import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Header from './components/layout/Header.jsx';
import Footer from './components/layout/Footer.jsx';
import SurveyList from './components/SurveyList.jsx';
import SurveyBuilder from './components/SurveyBuilder.jsx';
import DeploymentOptions from './components/DeploymentOptions.jsx';
import NotFound from './components/NotFound';

const App = () => (
  <BrowserRouter>
    <div className="App">
      <Header />
      <Switch>
        <Route exact path="/" component={SurveyList} />
        <Route exact path="/build-survey" component={SurveyBuilder} />
        <Route component={NotFound} />
      </Switch>
      <Footer />
    </div>
  </BrowserRouter>
);

export default App;
