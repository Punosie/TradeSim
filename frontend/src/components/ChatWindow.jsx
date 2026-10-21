import { useState, useEffect, useRef } from "react";
import InputForm from "./InputForm";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";
import "highlight.js/styles/github-dark.css";

const remarkPlugins = [remarkGfm, remarkMath];
const rehypePlugins = [rehypeRaw, rehypeHighlight, rehypeKatex];

const markdownComponents = {
    pre: ({ children }) => (
        <pre className="rounded-lg text-sm my-2 overflow-x-auto">{children}</pre>
    ),
    code({ className, children, ...props }) {
        // Fenced blocks are highlighted by rehype-highlight; style inline code only
        if (/language-|hljs/.test(className || "")) {
            return <code className={className} {...props}>{children}</code>;
        }
        return (
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
    ),
};

const SAVE_DELAY_MS = 500;

const loadMessages = (key) => {
    try {
        return JSON.parse(localStorage.getItem(key)) ?? [];
    } catch {
        return [];
    }
};

const newMessage = (role, text) => ({ id: crypto.randomUUID(), role, text });

const ChatWindow = ({ user }) => {
    const storageKey = `chat_messages_${user.uid}`;
    const [messages, setMessages] = useState(() => loadMessages(storageKey));
    const [isThinking, setIsThinking] = useState(false);
    const messagesEndRef = useRef(null);

    // Persist history, debounced so rapid updates write once
    useEffect(() => {
        const timer = setTimeout(
            () => localStorage.setItem(storageKey, JSON.stringify(messages)),
            SAVE_DELAY_MS
        );
        return () => clearTimeout(timer);
    }, [messages, storageKey]);

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isThinking]);

    const clearHistory = () => {
        localStorage.removeItem(storageKey);
        setMessages([]);
    };

    const handleAIResponse = (data) => {
        setIsThinking(false);
        if (data) {
            setMessages((prev) => [...prev, newMessage("ai", data.text || "No response")]);
        }
    };

    const handleUserInput = (input) => {
        setMessages((prev) => [...prev, newMessage("user", input)]);
        setIsThinking(true);
    };

    return (
        <div className="relative flex flex-col h-[calc(100vh-150px)] sm:h-[calc(100vh-200px)] w-full mx-auto md:pb-4 md:w-4/7 overflow-hidden no-scrollbar">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto sm:px-4 py-2 sm:py-6 space-y-4 flex flex-col no-scrollbar mb-2 md:mb-6">
                {messages.map((msg, idx) => (
                    <div
                        key={msg.id ?? idx}
                        className={`px-4 py-3 rounded-2xl max-w-[75%] text-justify text-white text-sm md:text-lg
                            animate-ease-out
                            ${msg.role === "user"
                                ? "self-end bg-pink-700 rounded-br-none animate-fade-left "
                                : "self-start bg-slate-700 rounded-bl-none animate-fade-right"
                            }`}
                    >
                        <ReactMarkdown
                            remarkPlugins={remarkPlugins}
                            rehypePlugins={rehypePlugins}
                            components={markdownComponents}
                        >
                            {msg.text}
                        </ReactMarkdown>
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
                <InputForm onResponse={handleAIResponse} onUserInput={handleUserInput} clearHistory={clearHistory} />
            </div>
        </div>
    );
};

export default ChatWindow;
