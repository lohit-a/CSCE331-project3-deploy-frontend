import './LogInPage.css';
import { SERVER_URL } from '../../constant';

function LogInPage() {

    const handleLogout = async () => {
        try {
            await fetch(SERVER_URL + "/api/logout", {
                method: "POST",
                credentials: "include"
            });


            window.location.href = "/login"; 
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    return (
        <div className="home-page">
            <button onClick={() => {
                window.location.href = SERVER_URL + "/oauth2/authorization/google";
            }}>
                Login with Google
            </button>

            <button onClick={handleLogout} style={{ marginLeft: '1rem' }}>
                Logout
            </button>
        </div>
    );
}

export default LogInPage;