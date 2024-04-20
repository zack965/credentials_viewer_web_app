import { BrowserRouter, Routes, Route } from "react-router-dom";
import PageNotFound from './Screens/Errors/PageNotFound';
import ListCredentials from './Screens/Credentials/ListCredentials';
import Home from './Screens/Home/Home';
import Login from './Screens/Auth/Login';
import Register from './Screens/Auth/Register';
import ProtectedRoute from './Components/Auth/ProtectedRoute';

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
        </Route> */}
   
          <Route path="credential-list" element={<ProtectedRoute children={<ListCredentials />} /> } />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="/" element={<Home />} />
    
          <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes