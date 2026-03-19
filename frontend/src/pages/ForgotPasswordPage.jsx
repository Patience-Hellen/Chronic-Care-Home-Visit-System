import { useState } from "react";
import { ChronoCareLogo } from "../components/ChronoCareLogo";
import "./ForgotPasswordPage.css";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="page">
            <div className="forgot-wrapper">
                <div className="header">
                    <ChronoCareLogo />
                    <h1>Forgot Password</h1>
                    <p>Enter your email to receive a password reset link</p>
                </div>

                <form className="form-container" onSubmit={handleSubmit}>
                    <label>Email</label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button className="submit-btn" type="submit">Send Reset Link</button>

                    {submitted && (
                        <p className="confirmation">
                            A reset link has been sent to {email}. Check your inbox.
                        </p>
                    )}
                </form>

                <div className="footer">
                    <p>
                        Back to <a href="/">Login</a>
                    </p>
                </div>
            </div>
        </div>
    );
}