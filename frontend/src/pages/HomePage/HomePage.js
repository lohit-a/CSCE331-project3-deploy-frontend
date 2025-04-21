import './HomePage.css';
import { useContext } from 'react';
import { UserContext } from '../../contexts/UserProvider';

function HomePage() {
    const { user, loading } = useContext(UserContext);

    //if (loading) return <div className="home-page">Loading...</div>;

    const role = user?.roles?.[0]?.replace("ROLE_", "").toLowerCase();

    return (
        <div className="home-page">
            <h1>Welcome to the Home Page!</h1>
            <p>Your role: <strong>{role || "unknown"}</strong></p>
        </div>
    );
}

export default HomePage;