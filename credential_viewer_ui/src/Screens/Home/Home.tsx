import { Navigate } from 'react-router-dom';

function Home() {
  const access_token: string | null = localStorage.getItem("credential_access_token");
  const navLink = access_token ? (
    <Navigate to="/credential-list" replace={true} />
  ) : (
    <Navigate to="/login" replace={true} />
  );


  return (
    <div>
      {navLink}
    </div>
  )
}

export default Home