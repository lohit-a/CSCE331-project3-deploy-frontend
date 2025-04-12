import './LogInpage.css';

function LogInPage() {
    return (
        <div className="home-page">
            <button onClick={() => {
                window.location.href = "http://localhost:8081/oauth2/authorization/google";
                }}>
                Login with google
                </button>
        </div>
        
            
    );
}

export default LogInPage;