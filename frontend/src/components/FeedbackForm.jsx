import { useState } from "react";
import emailjs from "@emailjs/browser";

const TEMPLATE_ID = import.meta.env.VITE_TEMPLATE_ID;
const SERVICE_ID = import.meta.env.VITE_SERVICE_ID;
const PUBLIC_KEY = import.meta.env.VITE_PUBLIC_KEY;

const FeedbackForm = () => {
    const [feedback, setFeedback] = useState({
        name: "",
        email: "",
        message: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFeedback((prev) => ({
            ...prev,
            [name]: value,
        }));
        setError("");
        setSuccess("");
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const { name, email, message } = feedback;

        if (!name || !email || !message) {
            setError("Please fill in all fields.");
            return;
        }

        // Send email using EmailJS
        emailjs
            .send(
                SERVICE_ID,
                TEMPLATE_ID,
                feedback,
                PUBLIC_KEY
            )
            .then(
                (response) => {
                    if (response.status === 200) {
                        setSuccess("Thank you for your feedback!");
                        setFeedback({
                            name: "",
                            email: "",
                            message: "",
                        });
                    } else {
                        setError("Unexpected response. Please try again.");
                        console.warn("EmailJS unexpected response:", response);
                    }
                },
                (err) => {
                    console.error("Email sending error:", err);
                    setError("Failed to send feedback. Please try again later.");
                }
            );
    };

    return (
        <div className="md:mt-10 px-4 max-w-3xl mx-auto text-slate-100">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-pink-500 mb-6">
                Share Your Feedback
            </h2>
            <form
                onSubmit={handleSubmit}
                className="space-y-6 animate-fade-up animate-duration-[1500ms] animate-ease-out bg-gradient-to-b from-pink-950/40 to-slate-900/10 border border-pink-500/10 backdrop-blur-md p-6 rounded-xl shadow-xl"
            >
                <div>
                    <label htmlFor="name" className="block mb-1 text-sm">
                        Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={feedback.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        className="w-full px-4 py-2 rounded-md bg-slate-950 text-slate-100 border border-pink-500/20 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block mb-1 text-sm">
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={feedback.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className="w-full px-4 py-2 rounded-md bg-slate-950 text-slate-100 border border-pink-500/20 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                </div>

                <div>
                    <label htmlFor="message" className="block mb-1 text-sm">
                        Message
                    </label>
                    <textarea
                        name="message"
                        value={feedback.message}
                        onChange={handleChange}
                        rows="5"
                        placeholder="Type your message here..."
                        className="w-full px-4 py-2 rounded-md bg-slate-950 text-slate-100 border border-pink-500/20 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    ></textarea>
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}
                {success && <p className="text-emerald-400 text-sm">{success}</p>}

                <button
                    type="submit"
                    className="w-full bg-pink-600 hover:bg-pink-700 transition-colors duration-300 text-white font-semibold py-2 px-4 rounded-md"
                >
                    Submit Feedback
                </button>
            </form>
        </div>
    );
};

export default FeedbackForm;