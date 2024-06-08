import './App.css';
import { BrowserRouter as Router, Route, Switch, useNavigate } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './ProtectedRoute';
import { removeToken , isAuthenticated} from './auth';

function App() {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };
  return (
    <Router>
      <div className="app">
        <nav>
          <ul>
            <li><a href="/">Home</a></li>
            {!isAuthenticated() && <li><a href="/login">Login</a></li>}
            {!isAuthenticated() && <li><a href="/register">Register</a></li>}
            {!isAuthenticated() && <li><a href="/dashboard">Dashboard</a></li>}
            {!isAuthenticated() && <li><button onClick={handleLogout}>Logout</button></li>}
          </ul>
        </nav>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <ProtectedRoute path="/dashboard" component={Dashboard} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
