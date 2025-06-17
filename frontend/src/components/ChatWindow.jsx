import { useState, useEffect, useRef } from "react";
import InputForm from "./InputForm";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import 'katex/dist/katex.min.css'; // 👈 important



const ChatWindow = ({ user }) => {
    const [messages, setMessages] = useState([]);
    const [isThinking, setisThinking] = useState(false);
    const messagesEndRef = useRef(null);
    const hasLoadedFromStorage = useRef(false); // prevent overwriting

    const STORAGE_KEY = `chat_messages_${user?.uid}`;

    // Load messages from localStorage
    useEffect(() => {
        if (user && !hasLoadedFromStorage.current) {
            const savedMessages = localStorage.getItem(STORAGE_KEY);
            if (savedMessages) {
                setMessages(JSON.parse(savedMessages));
            }
            hasLoadedFromStorage.current = true;
        }
    }, [user]);

    // Save to localStorage only after loading
    useEffect(() => {
        if (user && hasLoadedFromStorage.current) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
        }
    }, [messages, user]);


    // Auto-scroll
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isThinking]);

    const handleAIResponse = (data) => {
        setisThinking(false);
        setMessages((prev) => [
            ...prev,
            { role: "ai", text: data?.text || "No response" },
        ]);
    };

    const handleUserInput = (input) => {
        setMessages((prev) => [
            ...prev,
            { role: "user", text: input },
        ]);
        setisThinking(true);
    };

    return (
        <div className="relative flex flex-col h-[calc(100vh-150px)] sm:h-[calc(100vh-200px)] w-full mx-auto md:pb-4 md:w-4/7 overflow-hidden no-scrollbar">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto sm:px-4 py-2 sm:py-6 space-y-4 flex flex-col no-scrollbar mb-2 md:mb-6">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`px-4 py-3 rounded-2xl max-w-[75%] text-justify text-white text-sm md:text-lg
                            animate-ease-out
                            ${msg.role === "user"
                                ? "self-end bg-pink-700 rounded-br-none animate-fade-left "
                                : "self-start bg-slate-700 rounded-bl-none animate-fade-right"
                            }`}
                        style={{ animationDelay: `${idx * 75}ms` }}
                    >
                        <ReactMarkdown
                            children={msg.text}
                            remarkPlugins={[remarkGfm, remarkMath]}
                            rehypePlugins={[rehypeRaw, rehypeHighlight, rehypeKatex]}
                            components={{
                                code({ node, inline, className, children, ...props }) {
                                    const match = /language-(\w+)/.exec(className || "");
                                    return !inline && match ? (
                                        <SyntaxHighlighter
                                            style={oneDark}
                                            language={match[1]}
                                            PreTag="div"
                                            className="rounded-lg text-sm my-2"
                                            {...props}
                                        >
                                            {String(children).replace(/\n$/, "")}
                                        </SyntaxHighlighter>
                                    ) : (
                                        <code className="bg-gray-800 text-pink-400 px-1 py-0.5 rounded">
                                            {children}
                                        </code>
                                    );
                                },
                                a: ({ href, children }) => (
                                    <a
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-400 underline"
                                    >
                                        {children}
                                    </a>
                                )
                            }}
                        />
                    </div>
                ))}

                {isThinking && (
                    <div className="self-start bg-slate-700 text-white text-sm md:text-lg px-4 py-3 rounded-2xl rounded-bl-none max-w-[75%] animate-pulse">
                        Thinking<span className="animate-bounce">...</span>
                    </div>
                )}

                {/* Scroll anchor */}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div>
                <InputForm user={user} onResponse={handleAIResponse} onUserInput={handleUserInput} />
            </div>
        </div>
    );
};

export default ChatWindow;
