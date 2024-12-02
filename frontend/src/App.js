import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import RecentlyViewed from './pages/RecentlyViewed';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <PrivateRoute exact path="/products" component={ProductList} />
            <PrivateRoute path="/products/:productId" component={ProductDetail} />
            <PrivateRoute path="/recently-viewed" component={RecentlyViewed} />
          </Switch>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;