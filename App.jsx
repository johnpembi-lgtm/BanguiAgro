import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  onSnapshot, 
  doc, 
  updateDoc 
} from 'firebase/firestore';
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  LogOut, 
  CheckCircle, 
  Clock,
  Phone,
  ShieldCheck,
  Lock,
  ChevronRight,
  Info,
  MapPin,
  MessageCircle
} from 'lucide-react';

// --- CONFIGURATION FIREBASE ---
const firebaseConfig = typeof __firebase_config !== 'undefined' 
  ? JSON.parse(__firebase_config) 
  : { apiKey: "", authDomain: "", projectId: "bangui-agro-demo", storageBucket: "", messagingSenderId: "", appId: "" };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'bangui-agro-v1';

// --- DESIGN TOKENS (Brand colors based on image) ---
const COLORS = {
  primary: '#B91C1C', // Deep Red
  secondary: '#F59E0B', // Gold/Yellow
  dark: '#1F2937',
  light: '#F9FAFB'
};

export default function App() {
  const [view, setView] = useState('home'); 
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [clickCount, setClickCount] = useState(0);
  const [user, setUser] = useState(null);
  
  const [products] = useState([
    { id: '1', name: 'Maïs Local', sango: 'Djö ti Sese', price: 17500, unit: 'Sac 50kg', category: 'Céréales' },
    { id: '2', name: 'Arachides Coques', sango: 'Karako', price: 12000, unit: 'Grand Sac', category: 'Oléagineux' },
    { id: '3', name: 'Charbon Écologique', sango: 'Wâ ti propre', price: 3500, unit: 'Sac', category: 'Énergie' },
    { id: '4', name: 'Aliment Volaille', sango: 'Kobe ti kondo', price: 18500, unit: 'Sac 50kg', category: 'Élevage' },
    { id: '5', name: 'Miel Pur RCA', sango: 'Lanza ti nzoni', price: 4500, unit: 'Litre', category: 'Produit Fini' },
  ]);
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      try { 
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInAnonymously(auth); 
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) { 
        console.error("Auth error:", err); 
      }
    };
    initAuth();
    
    const unsubAuth = onAuthStateChanged(auth, (u) => setUser(u));

    const q = collection(db, 'artifacts', appId, 'public', 'data', 'orders');
    const unsubOrders = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setOrders(docs);
    }, (error) => console.error("Firestore error:", error));

    return () => {
      unsubAuth();
      unsubOrders();
    };
  }, []);

  // --- ADMIN PORTAL LOGIC ---
  const handleSecretClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    if (newCount === 5) {
      setView('login');
      setClickCount(0);
    }
    setTimeout(() => setClickCount(0), 3000);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const code = e.target.code.value;
    if (code === "236") {
      setIsAdmin(true);
      setView('admin');
      setLoginError('');
    } else {
      setLoginError('Code d\'accès non reconnu.');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setView('home');
  };

  const submitOrder = async (e) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    const formData = new FormData(e.target);
    const order = {
      clientName: formData.get('name'),
      phone: formData.get('phone'),
      details: formData.get('details'),
      status: 'pending',
      timestamp: Date.now()
    };
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'orders'), order);
      e.target.reset();
      // Custom Success Message (avoiding alerts)
      setView('success');
      setTimeout(() => setView('home'), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id, newStatus) => {
    const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'orders', id);
    await updateDoc(docRef, { status: newStatus });
  };

  const Navbar = () => (
    <nav className="bg-white sticky top-0 z-50 border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer select-none group" onClick={handleSecretClick}>
          <div className="w-10 h-10 bg-[#B91C1C] rounded-lg flex items-center justify-center text-white font-black shadow-lg transform group-hover:scale-110 transition">BA</div>
          <div>
            <span className="font-black text-xl text-gray-900 tracking-tighter block leading-none">BANGUI<span className="text-[#B91C1C]">AGRO</span></span>
            <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Solutions Agricoles</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {isAdmin && (
            <button 
              onClick={() => setView('admin')} 
              className="hidden sm:flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-xl font-bold text-sm"
            >
              <LayoutDashboard size={18} /> Dashboard
            </button>
          )}
          <a href="https://wa.me/23675000000" target="_blank" rel="noreferrer" className="bg-[#B91C1C] text-white px-6 py-2.5 rounded-full font-bold flex items-center gap-2 shadow-xl hover:shadow-[#B91C1C]/20 transition-all hover:-translate-y-0.5 text-sm">
            <MessageCircle size={18} /> Commander
          </a>
        </div>
      </div>
    </nav>
  );

  const HomeView = () => (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative pt-12 pb-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative z-10 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-[#B91C1C] font-bold text-xs uppercase tracking-widest border border-red-100">
              <ShieldCheck size={14} /> Leader en RCA
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-[0.95] tracking-tighter">
              Transformons la <span className="text-[#B91C1C]">Terre</span> en <span className="text-[#F59E0B]">Richesse</span>.
            </h1>
            <p className="text-gray-500 text-lg md:text-xl max-w-lg leading-relaxed">
              De la semence à la distribution, Bangui Agro accompagne les producteurs centrafricains avec des solutions innovantes et durables.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <a href="#catalogue" className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 group shadow-xl">
                Nos Produits <ChevronRight size={20} className="group-hover:translate-x-1 transition" />
              </a>
              <a href="#propos" className="bg-white text-gray-900 border-2 border-gray-100 px-8 py-4 rounded-2xl font-bold">
                À propos
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-red-600/5 rounded-full blur-3xl"></div>
            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-[8px] border-white">
              <img 
                src="https://images.unsplash.com/photo-1595841696662-508c04433257?q=80&w=1000&auto=format&fit=crop" 
                alt="Agriculture Centrafrique" 
                className="w-full h-[550px] object-cover"
              />
              <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-white/20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#F59E0B] rounded-xl flex items-center justify-center text-white font-bold text-xl">100%</div>
                  <div>
                    <h4 className="font-bold text-gray-900">Qualité Locale</h4>
                    <p className="text-xs text-gray-500 font-medium">Produit et transformé à Bangui</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog */}
      <section id="catalogue" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="mb-16">
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">Notre Catalogue</h2>
            <p className="text-gray-500 mt-2 font-medium">Des produits sélectionnés pour leur excellence</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map(p => (
              <div key={p.id} className="group bg-white rounded-[2rem] border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
                <div className="p-8 pb-0">
                  <div className="inline-block px-3 py-1 bg-gray-50 text-gray-400 rounded-lg text-[10px] font-bold uppercase tracking-widest mb-4">
                    {p.category}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{p.name}</h3>
                  <p className="text-[#B91C1C] text-sm font-bold opacity-70 mb-4 italic">{p.sango}</p>
                </div>
                <div className="px-8 pb-8 flex items-end justify-between">
                  <div>
                    <span className="block text-xs text-gray-400 font-bold mb-1 uppercase tracking-tighter">{p.unit}</span>
                    <span className="text-2xl font-black text-gray-900">{p.price.toLocaleString()} <span className="text-[10px] text-gray-400">FCFA</span></span>
                  </div>
                  <a href="#order" className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-[#B91C1C] group-hover:text-white transition-all shadow-sm">
                    <ShoppingBag size={20} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Order Form */}
      <section id="order" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-900 rounded-[3rem] p-8 md:p-16 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#B91C1C]/20 blur-3xl rounded-full"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-black text-white mb-2">Passez votre Commande</h2>
              <p className="text-gray-400 mb-12">Remplissez le formulaire, nous vous contacterons immédiatement.</p>
              
              <form onSubmit={submitOrder} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-white/60 text-xs font-bold uppercase ml-4">Nom Complet</label>
                    <input name="name" required placeholder="Ex: Jean Paul" className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-[#B91C1C] transition" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-white/60 text-xs font-bold uppercase ml-4">Téléphone / WhatsApp</label>
                    <input name="phone" required placeholder="+236 000 00 00" className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-[#B91C1C] transition" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-white/60 text-xs font-bold uppercase ml-4">Détails de la commande</label>
                  <textarea name="details" required placeholder="Quels produits souhaitez-vous ? Précisez les quantités." className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-[#B91C1C] transition h-32"></textarea>
                </div>
                <button disabled={loading} type="submit" className="w-full bg-[#B91C1C] text-white font-black py-5 rounded-2xl hover:brightness-110 shadow-lg shadow-red-900/40 transition-all text-lg uppercase tracking-widest">
                  {loading ? "Traitement..." : "Envoyer ma demande"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 pt-20 pb-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-[#B91C1C] rounded flex items-center justify-center text-white font-black text-sm">BA</div>
            <span className="font-black text-xl text-gray-900">BanguiAgro</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 text-sm font-bold text-gray-500 uppercase tracking-widest">
            <a href="#" className="hover:text-[#B91C1C]">Accueil</a>
            <a href="#catalogue" className="hover:text-[#B91C1C]">Boutique</a>
            <a href="https://wa.me/23672843913" className="hover:text-[#B91C1C]">WhatsApp</a>
            <a href="#" className="hover:text-[#B91C1C]">Contact</a>
          </div>
          <div className="h-px w-24 bg-gray-200 mb-8"></div>
          <p className="text-gray-400 text-xs font-medium">© 2024 Bangui Agro S.A.R.L - République Centrafricaine</p>
        </div>
      </footer>
    </div>
  );

  const LoginView = () => (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-gray-100 w-full max-w-md text-center">
        <div className="w-20 h-20 bg-red-50 text-[#B91C1C] rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
          <Lock size={40} />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Accès Sécurisé</h2>
        <p className="text-gray-400 mb-10 text-sm font-medium uppercase tracking-widest">Administration</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            autoFocus
            type="password" 
            name="code" 
            placeholder="Code PIN" 
            className="w-full p-6 bg-gray-50 border-2 border-transparent focus:border-[#B91C1C] rounded-[1.5rem] outline-none text-center text-4xl tracking-tighter font-black transition"
          />
          {loginError && <p className="text-red-500 text-xs font-black uppercase mt-2">{loginError}</p>}
          <div className="pt-4 space-y-3">
            <button type="submit" className="w-full bg-gray-900 text-white font-black py-6 rounded-2xl shadow-xl transition-all hover:bg-black uppercase tracking-widest">
              Déverrouiller
            </button>
            <button type="button" onClick={() => setView('home')} className="text-gray-400 text-xs font-black uppercase hover:text-gray-900 transition">
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const AdminView = () => (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-200 flex flex-col p-8 fixed h-full z-10">
        <div className="mb-12">
          <h2 className="text-lg font-black text-gray-900 tracking-tighter uppercase">Admin Panel</h2>
          <div className="h-1 w-8 bg-[#B91C1C] mt-1"></div>
        </div>
        <nav className="flex-1 space-y-4">
          <button className="w-full flex items-center gap-3 bg-red-50 text-[#B91C1C] p-4 rounded-2xl font-bold transition">
            <ShoppingBag size={20} /> Commandes
          </button>
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-3 text-red-500 font-bold p-4 hover:bg-red-50 rounded-2xl transition">
          <LogOut size={20} /> Déconnexion
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 p-12">
        <header className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Suivi des Commandes</h1>
          <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
            <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-bold text-gray-500">{orders.length} commandes au total</span>
          </div>
        </header>

        <div className="grid gap-4">
          {orders.length === 0 ? (
            <div className="bg-white p-20 rounded-[3rem] text-center border border-dashed border-gray-200">
              <Package size={48} className="mx-auto text-gray-200 mb-4" />
              <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Le carnet de commandes est vide</p>
            </div>
          ) : (
            orders.sort((a,b) => b.timestamp - a.timestamp).map(order => (
              <div key={order.id} className="bg-white p-8 rounded-3xl border border-gray-100 flex items-center justify-between hover:border-[#B91C1C]/30 transition-all shadow-sm">
                <div className="flex items-center gap-6 max-w-sm">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${order.status === 'pending' ? 'bg-orange-50 text-orange-500' : 'bg-emerald-50 text-emerald-500'}`}>
                    {order.status === 'pending' ? <Clock size={24} /> : <CheckCircle size={24} />}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{order.clientName}</h3>
                    <p className="text-[#B91C1C] font-black text-xs tracking-widest flex items-center gap-1 uppercase">
                      <Phone size={10} /> {order.phone}
                    </p>
                  </div>
                </div>
                
                <div className="flex-1 px-12">
                  <p className="text-gray-500 text-sm font-medium italic border-l-2 border-gray-100 pl-4">
                    "{order.details}"
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right mr-4 hidden sm:block">
                    <p className="text-[10px] uppercase font-black text-gray-300 tracking-widest">Date</p>
                    <p className="text-xs font-bold text-gray-500">{new Date(order.timestamp).toLocaleDateString('fr-FR')}</p>
                  </div>
                  {order.status === 'pending' ? (
                    <button 
                      onClick={() => updateOrderStatus(order.id, 'completed')}
                      className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg hover:bg-emerald-600 transition-colors"
                    >
                      Traiter
                    </button>
                  ) : (
                    <span className="text-emerald-500 text-xs font-black uppercase tracking-widest px-4 py-2 bg-emerald-50 rounded-lg">Terminé</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );

  const SuccessView = () => (
    <div className="min-h-[80vh] flex items-center justify-center p-6 text-center">
      <div className="animate-in zoom-in duration-300">
        <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle size={64} />
        </div>
        <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter">Singila mingi !</h2>
        <p className="text-gray-500 font-bold max-w-sm mx-auto">Votre commande a été envoyée avec succès. Notre équipe vous contactera dans les plus brefs délais.</p>
      </div>
    </div>
  );

  return (
    <div className="font-sans text-gray-900 selection:bg-[#B91C1C] selection:text-white bg-white">
      {view !== 'admin' && <Navbar />}
      <main className="animate-in fade-in duration-500">
        {view === 'home' && <HomeView />}
        {view === 'login' && <LoginView />}
        {view === 'admin' && isAdmin && <AdminView />}
        {view === 'success' && <SuccessView />}
      </main>
    </div>
  );