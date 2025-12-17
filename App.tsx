import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Map, Sparkles, MessageSquare, LayoutDashboard, 
  Menu, Plus, LogOut, User as UserIcon, History, ChevronRight, X,
  PanelLeftClose, PanelLeftOpen, ArrowRight, Grid, Search, Bookmark
} from 'lucide-react';
import { sendMessageToYelpAI } from './services/yelpAIService';
import { authService, savedBusinessesService } from './services/authService';
import { AppState, ChatMessage, MessageRole, IntelligenceType, IntelligenceData, User, ChatSession, Business } from './types';
import { MessageBubble } from './components/MessageBubble';
import IntelligencePanel, { BusinessCard } from './components/IntelligencePanel';

const INITIAL_INTELLIGENCE: IntelligenceData = {
  type: IntelligenceType.Idle
};

const INITIAL_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: MessageRole.Assistant,
  text: "Hello. I'm Spotlight. I can analyze local neighborhoods, compare businesses, and help you find exactly what you're looking for. Where should we start?",
  timestamp: Date.now()
};

// --- LANDING PAGE ---

const LandingPage = ({ onGetStarted }: { onGetStarted: () => void }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-x-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
      
      {/* Nav */}
      <nav className="w-full max-w-7xl mx-auto px-6 py-8 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
           <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-indigo-200 shadow-lg">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold text-slate-800 tracking-tight">Spotlight</span>
        </div>
        <button 
          onClick={onGetStarted} 
          className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
        >
          Login
        </button>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col justify-center items-center px-6 text-center z-10 max-w-4xl mx-auto py-12 md:py-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wide mb-6 border border-indigo-100">
           <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
           Powered by Yelp AI API
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 tracking-tight leading-tight">
          Decide faster with <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">AI-Powered Insights</span>
        </h1>
        <p className="text-lg text-slate-500 mb-10 max-w-2xl leading-relaxed">
          Powered by Yelp's AI API. Discover local businesses through intelligent conversations, get personalized recommendations, and make reservations instantly across thousands of locations.
        </p>
        <button 
          onClick={onGetStarted}
          className="group relative px-8 py-4 bg-slate-900 text-white rounded-full font-semibold text-lg hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center gap-3"
        >
          Launch Dashboard
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Feature Grid Preview */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
           {[
             { icon: Map, title: "Yelp AI Discovery", text: "Leverage Yelp's comprehensive business database for intelligent local insights." },
             { icon: Grid, title: "AI Comparisons", text: "Compare businesses using Yelp's AI-powered analysis and user reviews." },
             { icon: Search, title: "Smart Reservations", text: "Book tables instantly at thousands of restaurants across US & Canada." }
           ].map((item, i) => (
             <div key={i} className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-white shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-indigo-600 shadow-sm mb-4">
                  <item.icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-800 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.text}</p>
             </div>
           ))}
        </div>
      </main>
      
      <footer className="py-6 text-center text-slate-400 text-sm">
        &copy; 2024 Spotlight Intelligence. Powered by Yelp AI API.
      </footer>
    </div>
  );
};

// --- AUTH COMPONENT ---

const AuthScreen = ({ onLogin, onGuest, isLoading }: { onLogin: (name: string, email: string, password: string, isLogin: boolean) => void, onGuest: () => void, isLoading: boolean }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (!isLogin && !name)) {
      alert('Please fill in all required fields');
      return;
    }
    onLogin(name, email, password, isLogin);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 animate-in fade-in zoom-in duration-300">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-100 overflow-hidden my-auto">
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-indigo-200 shadow-lg">
              <Sparkles className="w-7 h-7" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">
            {isLogin ? 'Welcome back' : 'Create an account'}
          </h2>
          <p className="text-center text-slate-500 text-sm mb-8">
            Access your personal local intelligence dashboard.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  required 
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                required 
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                required 
              />
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium py-2.5 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              {isLoading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 flex items-center">
            <div className="flex-1 border-t border-slate-200"></div>
            <span className="px-4 text-xs text-slate-400 font-medium">OR</span>
            <div className="flex-1 border-t border-slate-200"></div>
          </div>

          <button 
            onClick={onGuest}
            className="w-full mt-6 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <UserIcon className="w-4 h-4" />
            Continue as Guest
          </button>
        </div>
        
        <div className="bg-slate-50 px-8 py-4 text-center text-sm text-slate-500 border-t border-slate-100">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-indigo-600 font-medium hover:underline">
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- PROFILE MODAL ---

const ProfileModal = ({ 
  user, 
  savedBusinesses, 
  onClose, 
  onLogout,
  onUnsave
}: { 
  user: User, 
  savedBusinesses: Business[], 
  onClose: () => void, 
  onLogout: () => void,
  onUnsave: (b: Business) => void
}) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-800">User Profile</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* User Info */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">{user.name}</h3>
              <p className="text-slate-500">{user.isGuest ? 'Guest User' : user.email}</p>
            </div>
            <button 
              onClick={onLogout}
              className="ml-auto flex items-center gap-2 text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>

          <hr className="border-slate-100 mb-8" />

          {/* Saved Places */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-indigo-600 fill-indigo-600" />
              Saved Places ({savedBusinesses.length})
            </h3>
            
            {savedBusinesses.length === 0 ? (
               <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                 <p className="text-slate-400">No saved places yet. Start chatting to find gems!</p>
               </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedBusinesses.map(biz => (
                  <div key={biz.id} className="h-[300px]">
                     <BusinessCard 
                       business={biz} 
                       isSaved={true} 
                       onToggleSave={() => onUnsave(biz)} 
                     />
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---

export default function App() {
  const [appState, setAppState] = useState<AppState>(() => {
    const savedUser = localStorage.getItem('spotlight_user');
    const savedSessions = localStorage.getItem('spotlight_sessions');
    const savedBusinesses = localStorage.getItem('spotlight_saved_businesses');
    
    // Determine initial view
    let initialView: 'landing' | 'auth' | 'app' = 'landing';
    if (savedUser && authService.isAuthenticated()) {
      initialView = 'app';
    }

    return {
      view: initialView,
      user: savedUser ? JSON.parse(savedUser) : null,
      sessions: savedSessions ? JSON.parse(savedSessions) : [],
      currentSessionId: null,
      isLoading: false,
      isSidebarOpen: true,
      showProfile: false,
      savedBusinesses: savedBusinesses ? JSON.parse(savedBusinesses) : []
    };
  });

  const [input, setInput] = useState('');
  const [activeMobileTab, setActiveMobileTab] = useState<'chat' | 'intelligence'>('chat');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load user data on app start if authenticated
  useEffect(() => {
    const loadUserData = async () => {
      if (authService.isAuthenticated() && appState.view === 'app' && !appState.user) {
        try {
          const [profileResponse, savedBusinessesResponse] = await Promise.all([
            authService.getProfile(),
            savedBusinessesService.getSavedBusinesses()
          ]);
          
          setAppState(prev => ({
            ...prev,
            user: profileResponse.user,
            savedBusinesses: savedBusinessesResponse.savedBusinesses
          }));
        } catch (error) {
          console.error('Failed to load user data:', error);
          authService.logout();
          setAppState(prev => ({ ...prev, view: 'landing', user: null }));
        }
      }
    };

    loadUserData();
  }, []);

  // Persistence Effects
  useEffect(() => {
    if (appState.user) {
      localStorage.setItem('spotlight_user', JSON.stringify(appState.user));
    } else {
      localStorage.removeItem('spotlight_user');
    }
  }, [appState.user]);

  useEffect(() => {
    localStorage.setItem('spotlight_sessions', JSON.stringify(appState.sessions));
  }, [appState.sessions]);

  useEffect(() => {
    localStorage.setItem('spotlight_saved_businesses', JSON.stringify(appState.savedBusinesses));
  }, [appState.savedBusinesses]);

  // Scroll to bottom
  useEffect(() => {
    if (appState.view === 'app') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [appState.sessions, appState.currentSessionId, activeMobileTab, appState.view]);

  const currentSession = appState.sessions.find(s => s.id === appState.currentSessionId);
  const currentMessages = currentSession ? currentSession.messages : [INITIAL_MESSAGE];
  const currentIntelligence = currentSession ? currentSession.intelligence : INITIAL_INTELLIGENCE;

  // --- Actions ---

  const handleLogin = async (name: string, email: string, password: string, isLogin: boolean) => {
    try {
      setAppState(prev => ({ ...prev, isLoading: true }));
      
      let response;
      if (isLogin) {
        response = await authService.login(email, password);
      } else {
        response = await authService.register(name, email, password);
      }

      // Load saved businesses from database
      const savedBusinessesResponse = await savedBusinessesService.getSavedBusinesses();
      
      setAppState(prev => ({
        ...prev,
        view: 'app',
        user: response.user,
        savedBusinesses: savedBusinessesResponse.savedBusinesses,
        isLoading: false
      }));
      
      createNewSession();
    } catch (error) {
      console.error('Authentication error:', error);
      alert(error.message || 'Authentication failed');
      setAppState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleGuest = () => {
    setAppState(prev => ({
      ...prev,
      view: 'app',
      user: { id: 'guest', name: 'Guest User', isGuest: true }
    }));
    createNewSession();
  };

  const handleLogout = () => {
    authService.logout();
    setAppState({
      view: 'landing',
      user: null,
      sessions: [],
      currentSessionId: null,
      isLoading: false,
      isSidebarOpen: true,
      showProfile: false,
      savedBusinesses: []
    });
  };

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Conversation',
      messages: [INITIAL_MESSAGE],
      intelligence: INITIAL_INTELLIGENCE,
      lastUpdated: Date.now()
    };
    
    setAppState(prev => ({
      ...prev,
      sessions: [newSession, ...prev.sessions],
      currentSessionId: newSession.id
    }));
    setActiveMobileTab('chat');
  };

  const switchSession = (sessionId: string) => {
    setAppState(prev => ({ ...prev, currentSessionId: sessionId }));
    setActiveMobileTab('chat');
  };

  const deleteSession = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    setAppState(prev => {
      const newSessions = prev.sessions.filter(s => s.id !== sessionId);
      const newCurrentId = prev.currentSessionId === sessionId 
        ? (newSessions[0]?.id || null) 
        : prev.currentSessionId;
      return {
        ...prev,
        sessions: newSessions,
        currentSessionId: newCurrentId
      };
    });
  };

  const handleSend = async () => {
    if (!input.trim() || appState.isLoading || !appState.currentSessionId) return;

    const userText = input;
    setInput('');
    setActiveMobileTab('chat');

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: MessageRole.User,
      text: userText,
      timestamp: Date.now()
    };

    setAppState(prev => {
      const updatedSessions = prev.sessions.map(s => {
        if (s.id === prev.currentSessionId) {
          return {
            ...s,
            title: s.messages.length === 1 ? userText.slice(0, 30) + (userText.length > 30 ? '...' : '') : s.title,
            messages: [...s.messages, userMessage],
            lastUpdated: Date.now()
          };
        }
        return s;
      });
      return { ...prev, sessions: updatedSessions, isLoading: true };
    });

    try {
      const historyForApi = currentMessages.slice(-10).map(m => ({
        role: m.role === MessageRole.User ? 'user' : 'model',
        text: m.text
      }));

      const response = await sendMessageToYelpAI(historyForApi, userText);

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: MessageRole.Assistant,
        text: response.message,
        timestamp: Date.now()
      };

      setAppState(prev => {
        const updatedSessions = prev.sessions.map(s => {
          if (s.id === prev.currentSessionId) {
            return {
              ...s,
              messages: [...s.messages, aiMessage],
              intelligence: {
                type: response.type,
                locationSummary: response.locationSummary,
                businesses: response.businesses,
                comparisonPoints: response.comparisonPoints,
                reservationDetails: response.reservationDetails
              },
              lastUpdated: Date.now()
            };
          }
          return s;
        });
        return { ...prev, sessions: updatedSessions, isLoading: false };
      });

    } catch (error) {
      console.error("Error", error);
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: MessageRole.Assistant,
        text: "Sorry, I encountered an error connecting to the intelligence network.",
        timestamp: Date.now()
      };
      setAppState(prev => {
         const updatedSessions = prev.sessions.map(s => {
          if (s.id === prev.currentSessionId) {
            return { ...s, messages: [...s.messages, errorMessage] };
          }
          return s;
        });
        return { ...prev, sessions: updatedSessions, isLoading: false };
      });
    }
  };

  const toggleSave = async (business: Business) => {
    if (!appState.user || appState.user.isGuest) {
      // For guest users, keep local storage behavior
      setAppState(prev => {
        const exists = prev.savedBusinesses.some(b => b.id === business.id);
        let newSaved;
        if (exists) {
          newSaved = prev.savedBusinesses.filter(b => b.id !== business.id);
        } else {
          newSaved = [...prev.savedBusinesses, business];
        }
        return { ...prev, savedBusinesses: newSaved };
      });
      return;
    }

    try {
      const exists = appState.savedBusinesses.some(b => b.id === business.id);
      
      if (exists) {
        await savedBusinessesService.removeSavedBusiness(business.id);
        setAppState(prev => ({
          ...prev,
          savedBusinesses: prev.savedBusinesses.filter(b => b.id !== business.id)
        }));
      } else {
        await savedBusinessesService.saveBusiness(business);
        setAppState(prev => ({
          ...prev,
          savedBusinesses: [...prev.savedBusinesses, business]
        }));
      }
    } catch (error) {
      console.error('Error toggling saved business:', error);
      alert('Failed to update saved business. Please try again.');
    }
  };

  // --- HELPER COMPONENT ---
  const QuickPrompt = ({ text, onClick }: { text: string, onClick: (t: string) => void }) => (
    <button 
      onClick={() => onClick(text)}
      className="text-xs bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-full hover:bg-slate-50 hover:border-indigo-300 transition-colors whitespace-nowrap shadow-sm"
    >
      {text}
    </button>
  );

  // --- RENDER LOGIC ---

  if (appState.view === 'landing') {
    return <LandingPage onGetStarted={() => setAppState(prev => ({ ...prev, view: 'auth' }))} />;
  }

  if (appState.view === 'auth') {
    return <AuthScreen onLogin={handleLogin} onGuest={handleGuest} isLoading={appState.isLoading} />;
  }

  // APP VIEW
  if (appState.sessions.length === 0) createNewSession();

  const savedIds = new Set(appState.savedBusinesses.map(b => b.id));

  return (
    <div className="flex h-[100dvh] w-full bg-slate-50 overflow-hidden font-sans">
      
      {/* 1. LEFT SIDEBAR (History) */}
      <div 
        className={`
          fixed inset-y-0 left-0 z-40 bg-slate-900 text-slate-300 transform transition-all duration-300 ease-in-out md:relative 
          ${appState.isSidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full md:w-0 md:translate-x-0'}
        `}
      >
        <div className={`flex flex-col h-full ${!appState.isSidebarOpen ? 'hidden' : 'flex'}`}>
          {/* Sidebar Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
             <button 
               onClick={createNewSession}
               className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium shadow-lg shadow-indigo-900/50"
             >
               <Plus className="w-4 h-4" />
               New Chat
             </button>
             {/* Mobile Close */}
             <button onClick={() => setAppState(prev => ({ ...prev, isSidebarOpen: false }))} className="md:hidden ml-2 text-slate-400">
               <X className="w-5 h-5" />
             </button>
          </div>

          {/* Session List */}
          <div className="flex-1 overflow-y-auto py-2 px-2 space-y-1">
             <h3 className="px-3 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">History</h3>
             {appState.sessions.map(session => (
               <div 
                 key={session.id}
                 onClick={() => switchSession(session.id)}
                 className={`
                   group flex items-center justify-between px-3 py-3 rounded-lg cursor-pointer transition-colors text-sm
                   ${session.id === appState.currentSessionId 
                     ? 'bg-slate-800 text-white font-medium' 
                     : 'hover:bg-slate-800/50 hover:text-white'}
                 `}
               >
                 <div className="flex items-center gap-3 overflow-hidden">
                   <MessageSquare className="w-4 h-4 shrink-0" />
                   <span className="truncate">{session.title}</span>
                 </div>
                 <button 
                   onClick={(e) => deleteSession(e, session.id)}
                   className={`opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-opacity ${session.id === appState.currentSessionId ? 'opacity-100' : ''}`}
                 >
                   <X className="w-3 h-3" />
                 </button>
               </div>
             ))}
          </div>

          {/* Sidebar Footer (User Profile) */}
          <div className="p-4 border-t border-slate-800 bg-slate-900">
            <button 
              onClick={() => setAppState(prev => ({ ...prev, showProfile: true }))}
              className="flex items-center gap-3 w-full hover:bg-slate-800 p-2 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                {appState.user?.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 overflow-hidden text-left">
                <p className="text-sm font-medium text-white truncate">{appState.user?.name}</p>
                <p className="text-xs text-slate-500 truncate">{appState.user?.isGuest ? 'Guest Mode' : appState.user?.email}</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {appState.isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setAppState(prev => ({ ...prev, isSidebarOpen: false }))}
        ></div>
      )}

      {/* 2. CENTER PANEL (Main Chat) - OPTIMIZED WIDTH */}
      <div 
        className={`
          flex-col h-full bg-white relative transition-all duration-300 border-r border-slate-200 z-10
          ${activeMobileTab === 'chat' ? 'flex w-full md:w-[35%] lg:w-[30%] shrink-0' : 'hidden md:flex md:w-[35%] lg:w-[30%] shrink-0'}
        `}
      >
        {/* Top Bar */}
        <div className="h-16 border-b border-slate-100 flex items-center justify-between px-4 bg-white shrink-0">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setAppState(prev => ({ ...prev, isSidebarOpen: !prev.isSidebarOpen }))} 
              className="text-slate-500 hover:text-indigo-600 p-1 rounded-md hover:bg-slate-50"
              title="Toggle Sidebar"
            >
              {appState.isSidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
            </button>
            <div className="flex flex-col">
              <span className="font-semibold text-slate-800 text-sm truncate max-w-[150px]">
                {currentSession?.title || 'New Chat'}
              </span>
            </div>
          </div>
          
          <div className="md:hidden flex items-center gap-2">
            <button 
              onClick={() => setActiveMobileTab('intelligence')}
              className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-lg"
            >
               <LayoutDashboard className="w-5 h-5" />
               {currentIntelligence.type !== IntelligenceType.Idle && (
                 <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full border border-white"></span>
               )}
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white scroll-smooth">
            {currentMessages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {appState.isLoading && (
              <div className="flex justify-start mb-4 fade-in">
                <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                  <div className="flex space-x-1.5">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-75"></div>
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white shrink-0 border-t border-slate-100 flex flex-col">
             
             {/* Quick Prompts - Show only if conversation is new */}
             {currentMessages.length <= 1 && (
                <div className="flex gap-2 overflow-x-scroll pb-3 mb-1 w-full" style={{ scrollbarWidth: 'thin' }}>
                   <QuickPrompt text="Best sushi in San Francisco" onClick={setInput} />
                   <QuickPrompt text="Find coffee shops in New York" onClick={setInput} />
                   <QuickPrompt text="Best pizza in Chicago" onClick={setInput} />
                   <QuickPrompt text="Compare gyms in Los Angeles" onClick={setInput} />
                   <QuickPrompt text="Top brunch spots in Seattle" onClick={setInput} />
                   <QuickPrompt text="Italian restaurants in Boston" onClick={setInput} />
                </div>
             )}

             <div className="relative flex items-center shadow-sm rounded-xl border border-slate-200 bg-slate-50 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  placeholder="Ask Spotlight..."
                  className="w-full bg-transparent border-none text-slate-800 pl-4 pr-12 py-3 text-sm focus:outline-none placeholder:text-slate-400"
                  disabled={appState.isLoading}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || appState.isLoading}
                  className={`absolute right-1.5 p-1.5 rounded-lg transition-all ${
                    input.trim() && !appState.isLoading
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-transparent text-slate-300'
                  }`}
                >
                  <Send className="w-4 h-4" />
                </button>
             </div>
        </div>
      </div>

      {/* 3. RIGHT SIDEBAR (Live Briefing) - TAKES REMAINING SPACE */}
      <div 
        className={`
          flex-col bg-slate-50 w-full transition-all flex-1
          ${activeMobileTab === 'intelligence' ? 'flex fixed inset-0 z-50 md:static' : 'hidden md:flex'}
        `}
      >
        {/* Mobile Header for Right Panel */}
        <div className="md:hidden h-16 border-b border-slate-200 flex items-center justify-between px-4 bg-white shrink-0">
          <button onClick={() => setActiveMobileTab('chat')} className="text-slate-500 flex items-center gap-1">
             <ChevronRight className="w-5 h-5 rotate-180" />
             Back to Chat
          </button>
          <span className="font-bold text-slate-800">Briefing</span>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:flex h-16 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center text-slate-500 gap-2">
             <Map className="w-4 h-4" />
             <span className="text-sm font-semibold uppercase tracking-wide">Live Briefing</span>
          </div>
          {appState.isLoading && (
            <span className="text-xs text-indigo-600 font-medium animate-pulse">Updating...</span>
          )}
        </div>

        {/* Panel Content */}
        <div className="flex-1 overflow-hidden relative">
          <IntelligencePanel 
            data={currentIntelligence} 
            isLoading={appState.isLoading}
            savedBusinessIds={savedIds}
            onToggleSave={toggleSave}
          />
        </div>
      </div>

      {/* Profile Modal */}
      {appState.showProfile && appState.user && (
        <ProfileModal 
          user={appState.user} 
          savedBusinesses={appState.savedBusinesses}
          onClose={() => setAppState(prev => ({ ...prev, showProfile: false }))}
          onLogout={handleLogout}
          onUnsave={toggleSave}
        />
      )}

    </div>
  );
}