import React, { useState, useEffect, useRef } from 'react';
import apiAxios from '../api/axios';
import {
    Send,
    Search,
    MoreVertical,
    Phone,
    Video,
    Image as ImageIcon,
    Paperclip,
    Trash2,
    Edit2,
    X,
    Check,
    CheckCheck
} from 'lucide-react';

// Material 3 Design Tokens
const M3 = {
    Surface: "bg-[#141218]",
    SurfaceContainer: "bg-[#1D1B20]",
    SurfaceContainerHigh: "bg-[#2B2930]",
    Primary: "bg-[#D0BCFF] text-[#381E72] hover:bg-[#E8DEF8]",
    PrimaryContainer: "bg-[#4F378B] text-[#EADDFF]",
    OnSurface: "text-[#E6E0E9]",
    OnSurfaceVariant: "text-[#CAC4D0]",
    Outline: "border-[#49454F]",
    Error: "text-[#F2B8B5]",
};

const Chat = () => {
    const [conversations, setConversations] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingMsgId, setEditingMsgId] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [showCallOverlay, setShowCallOverlay] = useState(false);
    const [callType, setCallType] = useState(null);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        if (selectedUser) {
            setConversations(prev => prev.map(c =>
                c.id === selectedUser.id ? { ...c, unread_count: 0 } : c
            ));

            fetchMessages(selectedUser.id);
            const interval = setInterval(() => {
                fetchMessages(selectedUser.id);
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [selectedUser]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const fetchConversations = async () => {
        try {
            const res = await apiAxios.get('/messages/conversations');
            setConversations(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch conversations', err);
            setLoading(false);
        }
    };

    const fetchMessages = async (userId) => {
        try {
            // Updated route to avoid collision with DELETE /<id>
            const res = await apiAxios.get(`/messages/history/${userId}`);

            if (!editingMsgId) {
                setMessages(res.data);
            }
        } catch (err) {
            console.error('Failed to fetch messages', err);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if ((!newMessage.trim()) || !selectedUser) return;

        try {
            const res = await apiAxios.post('/messages/', {
                receiver_id: selectedUser.id,
                content: newMessage
            });
            setMessages([...messages, res.data]);
            setNewMessage('');
        } catch (err) {
            console.error('Failed to send message', err);
        }
    };

    const handleDeleteMessage = async (e, msgId) => {
        e.stopPropagation();
        if (!window.confirm("Delete this message?")) return;
        try {
            await apiAxios.delete(`/messages/${msgId}`);
            setMessages(messages.filter(m => m.id !== msgId));
        } catch (err) {
            console.error('Failed to delete message', err);
            // If 404 (Not Found), it means message is already gone (stale ID). remove it anyway.
            if (err.response && err.response.status === 404) {
                setMessages(messages.filter(m => m.id !== msgId));
            } else {
                alert('Could not delete message.');
            }
        }
    };

    const startEditing = (e, msg) => {
        e.stopPropagation();
        setEditingMsgId(msg.id);
        setEditContent(msg.content);
    };

    const submitEdit = async () => {
        try {
            const res = await apiAxios.put(`/messages/${editingMsgId}`, {
                content: editContent
            });
            // Update local state
            setMessages(messages.map(m => m.id === editingMsgId ? res.data : m));
            setEditingMsgId(null);
            setEditContent('');
        } catch (err) {
            console.error("Failed to edit", err);
            alert("Failed to edit (Time limit might be exceeded)");
            setEditingMsgId(null);
        }
    };

    const canEdit = (timestamp) => {
        const diff = new Date() - new Date(timestamp);
        return diff < 3 * 60 * 1000; // 3 minutes
    };

    const handleCall = (type) => {
        setCallType(type);
        setShowCallOverlay(true);
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file || !selectedUser) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            // Upload first
            const uploadRes = await apiAxios.post('/messages/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // Then send message with attachment
            const res = await apiAxios.post('/messages/', {
                receiver_id: selectedUser.id,
                content: '', // Optional content
                attachment_url: uploadRes.data.url
            });

            setMessages([...messages, res.data]);
        } catch (err) {
            console.error("Upload failed", err);
            alert('Failed to send image');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const MessageStatus = ({ isRead, isDelivered }) => {
        if (isRead) {
            return (
                <div className="flex -space-x-1.5" title="Read">
                    <CheckCheck size={16} className="text-[#B3E5FC]" strokeWidth={2.5} />
                    <Check size={16} className="text-[#B3E5FC]" strokeWidth={2.5} />
                </div>
            );
        }
        if (isDelivered) {
            return (
                <div className="flex -space-x-1.5" title="Delivered">
                    <CheckCheck size={16} className="text-gray-400" />
                </div>
            );
        }
        return <Check size={16} className="text-gray-500" title="Sent" />;
    };

    const filteredConversations = conversations.filter(c =>
        c.username?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={`flex h-[calc(100vh-8rem)] ${M3.Surface} rounded-[28px] overflow-hidden shadow-2xl border ${M3.Outline} relative`}>

            {/* Call Overlay */}
            {showCallOverlay && (
                <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in">
                    <div className="bg-slate-900 border border-slate-700 p-8 rounded-3xl flex flex-col items-center shadow-2xl">
                        <div className="h-24 w-24 rounded-full bg-slate-800 flex items-center justify-center border-4 border-slate-700 mb-6 animate-pulse">
                            {callType === 'voice' ? <Phone size={40} className="text-white" /> : <Video size={40} className="text-white" />}
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Calling {selectedUser?.username}...</h3>
                        <p className="text-slate-400 mb-8">Connecting secure line</p>
                        <button
                            onClick={() => setShowCallOverlay(false)}
                            className="bg-red-500 hover:bg-red-600 text-white rounded-full p-4 transition-colors"
                        >
                            <Phone size={24} className="rotate-[135deg]" />
                        </button>
                    </div>
                </div>
            )}

            {/* Sidebar */}
            <div className={`w-80 ${M3.SurfaceContainer} border-r ${M3.Outline} flex flex-col md:flex`}>
                <div className="p-4 pt-6">
                    <div className={`relative ${M3.SurfaceContainerHigh} rounded-full`}>
                        <Search className={`absolute left-4 top-1/2 -translate-y-1/2 ${M3.OnSurfaceVariant}`} size={20} />
                        <input
                            type="text"
                            placeholder="Search contacts"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`w-full pl-12 pr-4 py-3 bg-transparent focus:outline-none ${M3.OnSurface} placeholder-[#CAC4D0] text-base`}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-3 space-y-1">
                    {loading ? (
                        <div className={`p-4 text-center ${M3.OnSurfaceVariant}`}>Loading conversations...</div>
                    ) : (
                        filteredConversations.map(contact => (
                            <div
                                key={contact.id}
                                onClick={() => setSelectedUser(contact)}
                                className={`p-4 rounded-full cursor-pointer transition-colors flex items-center gap-4 ${selectedUser?.id === contact.id ? M3.SurfaceContainerHigh : 'hover:bg-[#2B2930]'}`}
                            >
                                <div className={`h-12 w-12 rounded-full ${M3.PrimaryContainer} flex items-center justify-center font-medium text-lg`}>
                                    {contact.username[0].toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline">
                                        <h3 className={`${M3.OnSurface} font-medium truncate`}>{contact.username}</h3>
                                        <span className="text-xs text-slate-500">12:30 PM</span>
                                    </div>
                                    <div className="flex justify-between items-center mt-1">
                                        <p className={`${M3.OnSurfaceVariant} text-sm truncate pr-2`}>{contact.role}</p>
                                        {contact.unread_count > 0 && (
                                            <span className={`${M3.Primary} text-xs font-bold h-6 min-w-[24px] px-1.5 rounded-full flex items-center justify-center`}>
                                                {contact.unread_count}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Area */}
            {selectedUser ? (
                <div className={`flex-1 flex flex-col ${M3.Surface}`}>
                    {/* Header */}
                    <div className={`p-4 flex items-center justify-between ${M3.SurfaceContainer} border-b ${M3.Outline}`}>
                        <div className="flex items-center gap-4">
                            <div className={`h-10 w-10 rounded-full ${M3.PrimaryContainer} flex items-center justify-center`}>
                                {selectedUser.username[0].toUpperCase()}
                            </div>
                            <div>
                                <h2 className={`${M3.OnSurface} text-lg font-medium`}>{selectedUser.username}</h2>
                                <p className="text-emerald-400 text-xs font-medium">Online</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => handleCall('voice')} className={`p-3 rounded-full hover:${M3.SurfaceContainerHigh} ${M3.OnSurfaceVariant} transition-colors`}>
                                <Phone size={24} />
                            </button>
                            <button onClick={() => handleCall('video')} className={`p-3 rounded-full hover:${M3.SurfaceContainerHigh} ${M3.OnSurfaceVariant} transition-colors`}>
                                <Video size={24} />
                            </button>
                            <button className={`p-3 rounded-full hover:${M3.SurfaceContainerHigh} ${M3.OnSurfaceVariant} transition-colors`}>
                                <MoreVertical size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {messages.map((msg, idx) => {
                            const isMe = msg.sender_id !== selectedUser.id;
                            const isEditingThis = editingMsgId === msg.id;

                            return (
                                <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group`}>
                                    <div className={`max-w-[70%] relative ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                                        <div className={`px-5 py-3 rounded-[20px] shadow-sm text-[15px] leading-6 ${isMe
                                            ? `${M3.PrimaryContainer} rounded-br-[4px]`
                                            : `${M3.SurfaceContainerHigh} ${M3.OnSurface} rounded-bl-[4px]`
                                            }`}>
                                            {isEditingThis ? (
                                                <div className="flex flex-col gap-2 min-w-[200px]">
                                                    <input
                                                        value={editContent}
                                                        onChange={(e) => setEditContent(e.target.value)}
                                                        className="bg-black/20 text-white p-2 rounded border border-white/20 focus:outline-none"
                                                        autoFocus
                                                    />
                                                    <div className="flex justify-end gap-2">
                                                        <button onClick={() => setEditingMsgId(null)} className="p-1 hover:bg-white/10 rounded"><X size={14} /></button>
                                                        <button onClick={submitEdit} className="p-1 hover:bg-white/10 rounded"><Check size={14} /></button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col">
                                                    {msg.attachment_url && (
                                                        <img
                                                            src={msg.attachment_url}
                                                            alt="Attachment"
                                                            className="rounded-lg mb-2 max-w-full h-auto object-cover max-h-60 border border-white/10"
                                                        />
                                                    )}
                                                    <span>
                                                        {msg.content}
                                                        {msg.is_edited && <span className="text-[10px] opacity-60 italic ml-2">(edited)</span>}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2 mt-1.5 px-1 bg-opacity-0">
                                            <span className={`text-[11px] ${M3.OnSurfaceVariant}`}>
                                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            {isMe && (
                                                <MessageStatus isRead={msg.is_read} isDelivered={msg.is_delivered} />
                                            )}
                                            {isMe && !isEditingThis && (
                                                <>
                                                    {canEdit(msg.timestamp) && (
                                                        <button
                                                            onClick={(e) => startEditing(e, msg)}
                                                            className={`opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-700 rounded-full text-slate-400 ml-2`}
                                                            title="Edit message"
                                                        >
                                                            <Edit2 size={12} />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={(e) => handleDeleteMessage(e, msg.id)}
                                                        className={`opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-500/20 rounded-full text-red-400`}
                                                        title="Delete message"
                                                    >
                                                        <Trash2 size={12} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 pt-2">
                        <form onSubmit={handleSendMessage} className={`flex items-center gap-3 ${M3.SurfaceContainer} p-2 rounded-full border ${M3.Outline}`}>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                onChange={handleFileUpload}
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                type="button"
                                disabled={isUploading}
                                className={`p-3 rounded-full hover:${M3.SurfaceContainerHigh} ${M3.OnSurfaceVariant} transition-colors disabled:opacity-50`}
                            >
                                <ImageIcon size={24} />
                            </button>
                            <input
                                type="text"
                                placeholder={isUploading ? "Uploading image..." : "Message"}
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                className={`flex-1 bg-transparent focus:outline-none ${M3.OnSurface} text-base px-2 placeholder-[#CAC4D0]`}
                            />
                            {newMessage.trim() ? (
                                <button type="submit" className={`${M3.Primary} p-3 rounded-full transition-transform hover:scale-105 shadow-md`}>
                                    <Send size={20} />
                                </button>
                            ) : (
                                <button type="button" onClick={() => fileInputRef.current?.click()} className={`p-3 rounded-full hover:${M3.SurfaceContainerHigh} ${M3.OnSurfaceVariant} transition-colors`}>
                                    <Paperclip size={24} />
                                </button>
                            )}
                        </form>
                    </div>

                </div>
            ) : (
                <div className={`flex-1 flex flex-col items-center justify-center ${M3.Surface}`}>
                    <div className={`w-32 h-32 ${M3.SurfaceContainerHigh} rounded-[32px] flex items-center justify-center mb-6`}>
                        <Send size={48} className="text-[#D0BCFF]" />
                    </div>
                    <h2 className={`${M3.OnSurface} text-2xl font-normal`}>Welcome to Chat</h2>
                    <p className={`${M3.OnSurfaceVariant} mt-2`}>Select a conversation to start messaging</p>
                </div>
            )}
        </div>
    );
};

export default Chat;
