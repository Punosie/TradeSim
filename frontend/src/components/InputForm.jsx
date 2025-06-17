import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { IoSend } from "react-icons/io5";

const API_URL = import.meta.env.VITE_API_URL;
const COOLDOWN_MS = 3000; // 3 seconds

const InputForm = ({ user, model = "gemini-2.0-flash", onResponse, onUserInput }) => {
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [cooldown, setCooldown] = useState(false);
    const textareaRef = useRef(null);

    useEffect(() => {
        if (cooldown) {
            const timer = setTimeout(() => setCooldown(false), COOLDOWN_MS);
            return () => clearTimeout(timer);
        }
    }, [cooldown]);

    const handleOnchange = (e) => {
        setInput(e.target.value);
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    };

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading || cooldown) return;

        const prompt = input.trim();
        setInput('');
        setLoading(true);
        setCooldown(true);
        setError('');

        onUserInput?.(prompt);

        try {
            const IDToken = await user.getIdToken();
            const payload = { model, prompt };

            const response = await axios.post(`${API_URL}/ask-ai`, payload, {
                headers: {
                    Authorization: `Bearer ${IDToken}`,
                },
            });

            onResponse?.(response.data);
        } catch (err) {
            console.error("Error:", err);
            setError("Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleOnSubmit} className="flex gap-2 items-end">
            {error && <div className="text-red-500 text-sm">{error}</div>}
            {cooldown && (
                <div className="text-yellow-400 text-xs absolute -top-6">
                    Please wait before sending another message...
                </div>
            )}
            <textarea
                ref={textareaRef}
                value={input}
                onChange={handleOnchange}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleOnSubmit(e);
                    }
                }}
                placeholder="Type your question here..."
                className="flex-grow resize-none overflow-y-auto no-scrollbar text-sm md:text-lg px-4 py-3 rounded-lg sm:rounded-2xl bg-slate-700 text-slate-200 focus:outline-none leading-6 sm:leading-7 max-h-[7.5rem]"
                rows={1}
                autoCorrect="off"
                autoComplete="off"
                spellCheck="false"
                disabled={loading || cooldown}
            />
            <button
                type="submit"
                className="p-3 sm:p-4 text-xl bg-pink-700 hover:bg-pink-600 text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading || cooldown}
            >
                <IoSend />
            </button>
        </form>
    );
};

export default InputForm;
