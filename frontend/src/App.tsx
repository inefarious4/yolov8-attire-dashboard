import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import AddDataset from './pages/AddDataset';
import Home from './pages/Home';

const App: React.FC = () => (
  <>
    <Navbar />
    <main className="container">
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/add-dataset" component={AddDataset} />
      </Switch>
    </main>
  </>
);

export default App;