import './LogInPage.css';

function LogInPage() {

    const handleLogout = async () => {
        try {
            await fetch("http://localhost:8081/api/logout", {
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
                window.location.href = "http://localhost:8081/oauth2/authorization/google";
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