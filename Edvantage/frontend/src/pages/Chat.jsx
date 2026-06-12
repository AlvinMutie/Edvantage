import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';

const Chat = () => {
    const [conversations, setConversations] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);

    // Fetch conversations on mount
    useEffect(() => {
        fetchConversations();
    }, []);

    // Fetch messages when a user is selected
    useEffect(() => {
        if (selectedUser) {
            fetchMessages(selectedUser.id);
            // Set up polling for new messages every 5 seconds
            const interval = setInterval(() => {
                fetchMessages(selectedUser.id);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [selectedUser]);

    // Scroll to bottom of chat
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const fetchConversations = async () => {
        try {
            const res = await api.get('/messages/conversations');
            setConversations(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch conversations', err);
            setLoading(false);
        }
    };

    const fetchMessages = async (userId) => {
        try {
            const res = await api.get(`/messages/${userId}`);
            setMessages(res.data);
        } catch (err) {
            console.error('Failed to fetch messages', err);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUser) return;

        try {
            const res = await api.post('/messages/', {
                receiver_id: selectedUser.id,
                content: newMessage
            });
            setMessages([...messages, res.data]);
            setNewMessage('');
        } catch (err) {
            console.error('Failed to send message', err);
        }
    };

    return (
        <div className="flex h-[calc(100vh-6rem)] bg-gray-100 rounded-lg overflow-hidden shadow-lg border border-gray-200 mt-4">
            {/* Sidebar - Contact List */}
            <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <h2 className="text-lg font-semibold text-gray-700">Messages</h2>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="p-4 text-gray-500">Loading contacts...</div>
                    ) : conversations.length === 0 ? (
                        <div className="p-4 text-gray-500 italic">No contacts found.</div>
                    ) : (
                        conversations.map(contact => (
                            <div
                                key={contact.id}
                                onClick={() => setSelectedUser(contact)}
                                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-blue-50 transition-colors ${selectedUser?.id === contact.id ? 'bg-blue-100 border-l-4 border-l-blue-500' : ''}`}
                            >
                                <div className="font-medium text-gray-800">{contact.username}</div>
                                <div className="text-xs text-gray-500 uppercase">{contact.role}</div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col bg-white">
                {selectedUser ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center shadow-sm">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">{selectedUser.username}</h3>
                                <div className="text-xs text-green-600 flex items-center">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span> Online
                                </div>
                            </div>
                        </div>

                        {/* Messages List */}
                        <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-3">
                            {messages.length === 0 ? (
                                <div className="text-center text-gray-400 mt-10">Start the conversation...</div>
                            ) : (
                                messages.map((msg, idx) => {
                                    const isMe = msg.sender_id !== selectedUser.id; // Basic check, better to check vs current user ID
                                    return (
                                        <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[70%] rounded-lg p-3 shadow-sm ${isMe
                                                    ? 'bg-blue-600 text-white rounded-br-none'
                                                    : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                                                }`}>
                                                <p>{msg.content}</p>
                                                <div className={`text-[10px] mt-1 text-right ${isMe ? 'text-blue-200' : 'text-gray-400'}`}>
                                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message Input */}
                        <div className="p-4 border-t border-gray-200 bg-white">
                            <form onSubmit={handleSendMessage} className="flex gap-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type your message..."
                                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                                >
                                    Send
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                        <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <p className="text-lg">Select a contact to start messaging</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chat;
