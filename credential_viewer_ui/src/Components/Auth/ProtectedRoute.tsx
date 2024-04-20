import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }: { children: ReactNode }) {
    const isAuthenticated = localStorage.getItem("credential_access_token");
    if (!isAuthenticated) {
        return <Navigate to={"/not_authorized"} replace={true} />
    }
    return children;
}

export default ProtectedRoute