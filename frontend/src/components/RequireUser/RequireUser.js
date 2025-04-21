import { useLocation, Navigate, Outlet } from "react-router-dom";
import useUser from "../../hooks/useUser";

const RequireUser = ({ allowedRoles }) => {
    const { user } = useUser();
    const location = useLocation();

    const userRole = user?.roles?.[0]?.replace("ROLE_", "").toLowerCase();

    return (
        userRole && allowedRoles.includes(userRole)
            ? <Outlet />
            : user?.email
                ? <Navigate to="/unauthorized" state={{ from: location }} replace />
                : <Navigate to="/login" state={{ from: location }} replace />
    );
};

export default RequireUser;