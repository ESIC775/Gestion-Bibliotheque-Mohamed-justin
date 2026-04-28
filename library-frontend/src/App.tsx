import { useState, useEffect, type ElementType } from "react";
import {
  BookOpen,
  Users,
  UserCircle,
  Library,
  Search,
  User as UserIcon,
  Clock,
  LayoutDashboard,
  RefreshCcw,
  LogOut,
  CalendarDays,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "./api";
import "./App.css";

// Views
import BooksView from "./views/BooksView";
import AuthorsView from "./views/AuthorsView";
import UsersView from "./views/UsersView";
import LoansView from "./views/LoansView";
import LoginView from "./views/LoginView";
import ReservationsView from "./views/ReservationsView.tsx";

type View =
  | "dashboard"
  | "books"
  | "authors"
  | "users"
  | "loans"
  | "reservations";

interface AppUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}
interface Loan {
  id: number;
  status: "BORROWED" | "RETURNED";
  borrowedAt: string;
  dueDate: string;
  returnedAt: string | null;
  userId: number;
  bookId: number;
  user?: { firstName: string; lastName: string };
  book?: { title: string };
}
interface Reservation {
  id: number;
  status: "PENDING" | "CANCELLED" | "COMPLETED";
  reservedAt: string;
  userId: number;
  bookId: number;
  user?: { firstName: string; lastName: string };
  book?: { title: string };
}
interface AppData {
  books: {
    id: number;
    title: string;
    isbn: string;
    publishedYear: number;
    totalCopies: number;
    availableCopies: number;
    summary: string;
    categoryId: number;
    coverUrl?: string;
    category?: { name: string };
    authors?: { id: number; firstName: string; lastName: string }[];
  }[];
  authors: { id: number; firstName: string; lastName: string; bio: string }[];
  users: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    profile?: { address: string; phone: string; membershipNumber: string };
  }[];
  loans: Loan[];
  reservations: Reservation[];
  categories: { id: number; name: string }[];
}

function App() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const [data, setData] = useState<AppData>({
    books: [],
    authors: [],
    users: [],
    loans: [],
    reservations: [],
    categories: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    } else {
      autoLogin();
    }
    fetchData();
  }, []);

  const autoLogin = async () => {
    try {
      const response = await api.post("/auth/login", {
        email: "admin@admin.com",
        password: "admin123",
      });
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setUser(response.data.user);
    } catch (err) {
      console.error("Auto-login failed:", err);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [booksRes, authorsRes, usersRes, loansRes, resRes, catsRes] =
        await Promise.all([
          api.get("/books"),
          api.get("/authors"),
          api.get("/users"),
          api.get("/loans"),
          api.get("/reservations"),
          api.get("/categories"),
        ]);
      setData({
        books: booksRes.data,
        authors: authorsRes.data,
        users: usersRes.data,
        loans: loansRes.data,
        reservations: resRes.data,
        categories: catsRes.data,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  if (!user) {
    return <LoginView onLogin={(u) => setUser(u)} />;
  }

  const SidebarItem = ({
    id,
    icon: Icon,
    label,
  }: {
    id: View;
    icon: ElementType;
    label: string;
  }) => (
    <button
      onClick={() => setCurrentView(id)}
      className={`sidebar-item ${currentView === id ? "active" : ""}`}
    >
      <Icon size={20} />
      <span>{label}</span>
      {currentView === id && (
        <motion.div layoutId="active-pill" className="active-pill" />
      )}
    </button>
  );

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-container">
            <Library className="logo-icon" />
            <h1>Gestion de Bibliothèque</h1>
          </div>
        </div>

        <nav className="sidebar-nav">
          <SidebarItem
            id="dashboard"
            icon={LayoutDashboard}
            label="Tableau de Bord"
          />
          <div className="nav-divider">Gestion</div>
          <SidebarItem id="books" icon={BookOpen} label="Livres" />
          <SidebarItem id="authors" icon={UserCircle} label="Auteurs" />
          <SidebarItem id="users" icon={Users} label="Membres" />
          <SidebarItem id="loans" icon={Clock} label="Emprunts" />
          <SidebarItem
            id="reservations"
            icon={CalendarDays}
            label="Réservations"
          />
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-pill">
              <UserIcon size={16} />
              <span>{user.firstName}</span>
            </div>
            <button className="btn-logout" onClick={logout} title="Déconnexion">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="content-header">
          <h2>
            {currentView === "dashboard"
              ? "Tableau de Bord"
              : currentView === "books"
                ? "Gestion des Livres"
                : currentView === "authors"
                  ? "Gestion des Auteurs"
                  : currentView === "users"
                    ? "Gestion des Membres"
                    : currentView === "loans"
                      ? "Gestion des Emprunts"
                      : "Gestion des Réservations"}
          </h2>
          <div className="header-actions">
            <div className="search-bar">
              <Search size={18} />
              <input type="text" placeholder="Rechercher..." />
            </div>
            <button className="btn-primary" onClick={() => fetchData()}>
              <RefreshCcw size={18} />
              <span>Actualiser</span>
            </button>
          </div>
        </header>

        <div className="content-body">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="loader-container"
              >
                <div className="loader"></div>
              </motion.div>
            ) : (
              <motion.div
                key={currentView}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="view-container"
              >
                {currentView === "dashboard" && <DashboardView data={data} />}
                {currentView === "books" && (
                  <BooksView data={data} onRefresh={fetchData} />
                )}
                {currentView === "authors" && (
                  <AuthorsView data={data} onRefresh={fetchData} />
                )}
                {currentView === "users" && (
                  <UsersView data={data} onRefresh={fetchData} />
                )}
                {currentView === "loans" && (
                  <LoansView data={data} onRefresh={fetchData} />
                )}
                {currentView === "reservations" && (
                  <ReservationsView data={data} onRefresh={fetchData} />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

const DashboardView = ({ data }: { data: AppData }) => (
  <div className="dashboard-grid fade-in">
    <StatCard
      icon={BookOpen}
      label="Livres"
      count={data.books.length}
      color="#3b82f6"
    />
    <StatCard
      icon={Users}
      label="Membres"
      count={data.users.length}
      color="#10b981"
    />
    <StatCard
      icon={Clock}
      label="Emprunts en cours"
      count={data.loans.filter((l: Loan) => l.status === "BORROWED").length}
      color="#f59e0b"
    />
    <StatCard
      icon={LayoutDashboard}
      label="Retours effectués"
      count={data.loans.filter((l: Loan) => l.status === "RETURNED").length}
      color="#8b5cf6"
    />
    <StatCard
      icon={CalendarDays}
      label="Réservations"
      count={
        data.reservations.filter((r: any) => r.status === "PENDING").length
      }
      color="#ec4899"
    />
  </div>
);

const StatCard = ({
  icon: Icon,
  label,
  count,
  color,
}: {
  icon: ElementType;
  label: string;
  count: number;
  color: string;
}) => (
  <div className="stat-card">
    <div className="stat-icon" style={{ backgroundColor: `${color}15`, color }}>
      <Icon size={24} />
    </div>
    <div className="stat-info">
      <span className="stat-label">{label}</span>
      <span className="stat-count">{count}</span>
    </div>
  </div>
);

export default App;
