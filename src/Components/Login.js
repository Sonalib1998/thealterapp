import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const clientId = "623777165547-dqv4sj6vvcrtkti8nbtduiq8jdd7v6v2.apps.googleusercontent.com";

function Login() {
    const navigate = useNavigate();

    const handleLoginSuccess = (response) => {
        console.log("Login Successful! Credential: ", response.credential);
        navigate("/dashboard");
    };

    const handleLoginFailure = () => {
        console.error("Login Failed!");
    };

    return (
        <GoogleOAuthProvider clientId={clientId}>
            <div className="login-container">
                <div className="card">
                    <h2>Login</h2>
                    {/* Dummy comments section */}
                    <div className="dummy-comments">
                        <h3>Recent Comments</h3>
                        <div className="comment">
                            <p><strong>Jane Doe:</strong> This is a great app! I love the new features.</p>
                            <small>Posted 2 hours ago</small>
                        </div>
                        <div className="comment">
                            <p><strong>John Smith:</strong> Looking forward to the upcoming updates. Keep up the good work!</p>
                            <small>Posted 1 day ago</small>
                        </div>
                        <div className="comment">
                            <p><strong>Emily Johnson:</strong> Can anyone help me with an issue I'm facing? I can't seem to find the settings page.</p>
                            <small>Posted 3 days ago</small>
                        </div>
                    </div>
                    {/* Instructions for users before signing in */}
                    <p>Please sign in using your Google account to access the dashboard. This helps us to securely authenticate you and provide a personalized experience.</p>
                    <p>After signing in, you will be redirected to your dashboard where you can manage your comments and view the latest updates.</p>
                    {/* Google Login button */}
                    <GoogleLogin
                        onSuccess={handleLoginSuccess}
                        onError={handleLoginFailure}
                    />
                </div>
            </div>
        </GoogleOAuthProvider>
    );
}

export default Login;
