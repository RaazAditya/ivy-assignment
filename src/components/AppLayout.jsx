import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Building2, Heart, Key, LayoutGrid, LogOut, Menu, X ,LineChart, } from "lucide-react";
import { useState } from "react";

const navItems = [
  { name: "Listings", path: "/listings", icon: LayoutGrid },
  { name: "Favourites", path: "/favourites", icon: Heart },
  { name: "Rentals", path: "/rentals", icon: Key },
  { name: "Projects", path: "/projects", icon: Building2 },
  {
    name: "Insights",
    path: "/insights",
    icon: LineChart,
  },
];

function AppLayout() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  function handleLogout() {
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-[#EFEAE0] text-[#16231D]">
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col bg-[#16231D] lg:flex">
        <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#A9793C] text-[#16231D]">
            <Building2 size={21} />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-[#FBF8F2]">Ivy Homes</h1>
            <p className="text-xs text-[#A9793C]">Find your next home</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2 px-4 py-6">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-[#7A8079]">
            Menu
          </p>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-[#A9793C] text-[#16231D] shadow-sm"
                      : "text-[#9CA39C] hover:bg-white/5 hover:text-[#FBF8F2]"
                  }`
                }
              >
                <Icon size={19} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#9CA39C] transition hover:bg-[#A6432E]/10 hover:text-[#D98A78]"
          >
            <LogOut size={19} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[#DED2B0] bg-[#16231D] px-4 lg:hidden">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#A9793C] text-[#16231D]">
              <Building2 size={19} />
            </div>
            <span className="font-semibold text-[#FBF8F2]">Ivy Homes</span>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-lg p-2 text-[#FBF8F2] hover:bg-white/10"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </header>

        {isMobileMenuOpen && (
          <div className="border-b border-[#DED2B0] bg-[#16231D] p-4 lg:hidden">
            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${
                        isActive
                          ? "bg-[#A9793C] text-[#16231D]"
                          : "text-[#9CA39C] hover:bg-white/5"
                      }`
                    }
                  >
                    <Icon size={19} />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}

              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#D98A78] hover:bg-[#A6432E]/10"
              >
                <LogOut size={19} />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        )}

        <main className="min-h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;