"use client"

import type React from "react"
import { useState, useEffect, useRef, createRef, createContext, useContext } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { routes, Sitemap } from '@/data/sitemap';
import {
  LayoutDashboard,
  Users,
  FileText,
  Calendar,
  BarChart3,
  Bell,
  Settings,
  Sun,
  Moon,
  ChevronDown,
  ChevronRight,
  MoreVertical,
} from "lucide-react"
import { useSidebar } from "@/context/SidebarContext"

// Define the navigation items
const mainNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Audience",
    href: "/audience",
    icon: Users,
    submenu: false,
  },
  {
    title: "Posts",
    href: "/posts",
    icon: FileText,
  },
  {
    title: "Schedules",
    href: "/schedules",
    icon: Calendar,
  },
  {
    title: "Income",
    href: "/income",
    icon: BarChart3,
    submenu: true,
    submenuItems: [
      { title: "Earnings", href: "/income/earnings" },
      { title: "Refunds", href: "/income/refunds" },
      { title: "Declines", href: "/income/declines" },
      { title: "Payouts", href: "/income/payouts" },
    ],
  },
]

const settingsNavItems = [
  {
    title: "Notification",
    href: "/notification",
    icon: Bell,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    submenu: false,
  },
]

export default function Sidebar() {
  const { collapsed, setCollapsed } = useSidebar()
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
  const [activeSubmenuDropdown, setActiveSubmenuDropdown] = useState<string | null>(null)
  const [theme, setTheme] = useState("light")
  const pathname = usePathname()

  // Create refs for menu items
  const divRefs = useRef<{ [key: string]: React.RefObject<HTMLDivElement> }>({});
  const linkRefs = useRef<{ [key: string]: React.RefObject<HTMLAnchorElement> }>({});

  // Initialize refs for menu items
  useEffect(() => {
    mainNavItems.forEach(item => {
      if (!item.submenu) {
        divRefs.current[item.title] = createRef();
      }
    });
    settingsNavItems.forEach(item => {
      linkRefs.current[item.title] = createRef();
    });
  }, []);

  // Check if we're on mobile and set collapsed state accordingly
  useEffect(() => {
    const handleResize = () => {
      setCollapsed(window.innerWidth < 1024)
    }

    // Set initial state
    handleResize()

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Toggle submenu
  const toggleSubmenu = (title: string) => {
    if (openSubmenu === title) {
      setOpenSubmenu(null)
    } else {
      setOpenSubmenu(title)
    }
  }

  // Toggle dropdown for collapsed mode
  const toggleDropdown = (e: React.MouseEvent, title: string) => {
    e.stopPropagation()
    if (activeSubmenuDropdown === title) {
      setActiveSubmenuDropdown(null)
    } else {
      setActiveSubmenuDropdown(title)
    }
  }

  // Toggle theme
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  // Check if a nav item is active
  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/")
  }

  // Render submenu items
  const renderSubmenuItems = (items: { title: string; href: string }[], parentTitle: string) => {
    return (
      <div className="pl-12 space-y-1">
        {items.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className={`block py-2 text-sm ${
              isActive(item.href) ? "text-gray-900 font-medium" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {item.title}
          </Link>
        ))}
      </div>
    )
  }

  // Render dropdown for collapsed mode
  const renderDropdown = (items: { title: string; href: string }[], parentTitle: string) => {
    if (activeSubmenuDropdown !== parentTitle) return null;

    const parentElement = document.querySelector(`[data-item="${parentTitle}"]`);
    const parentRect = parentElement?.getBoundingClientRect();
    const topPosition = parentRect ? parentRect.top : 'auto';

    return (
      <div 
        className="fixed left-16 bg-white rounded-md shadow-lg border border-gray-200 py-2 w-40"
        style={{ top: typeof topPosition === 'number' ? `${topPosition}px` : 'auto' }}
      >
        {items.map((item) => (
          <Link 
            key={item.title} 
            href={item.href} 
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            {item.title}
          </Link>
        ))}
      </div>
    );
  };

  // Add this new function near the top with other functions
  const Tooltip = ({ title, parentRef }: { title: string; parentRef: React.RefObject<HTMLElement> }) => {
    const [position, setPosition] = useState(0);

    useEffect(() => {
      const updatePosition = () => {
        if (parentRef.current) {
          const rect = parentRef.current.getBoundingClientRect();
          setPosition(rect.top);
        }
      };

      updatePosition();
      window.addEventListener('scroll', updatePosition);
      return () => window.removeEventListener('scroll', updatePosition);
    }, [parentRef]);

    return (
      <div 
        className="fixed ml-2 left-16 px-2 py-1 text-sm text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity"
        style={{ top: `${position}px` }}
      >
        {title}
      </div>
    );
  };

  return (
    <div className="relative">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-10 flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-gray-200">
          {!collapsed ? (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </div>
                <span className="ml-2 text-lg font-semibold">Logoipsum</span>
              </div>
              <button onClick={() => setCollapsed(true)}>
                <MoreVertical className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center w-full">
              <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto overflow-x-visible">
          {/* Main Navigation */}
          <div className="px-3 py-4">
            {!collapsed && <div className="mb-2 text-xs font-semibold text-gray-500">MAIN</div>}
            {/* {collapsed && <div className="mb-2 text-xs font-semibold text-gray-500 text-center">MAIN</div>} */}
            <nav className="space-y-1">
              {mainNavItems.map((item) => (
                <div key={item.title} className="relative group">
                  {/* Main nav item */}
                  <div
                    ref={!item.submenu ? divRefs.current[item.title] : null}
                    className={`flex items-center px-2 py-2 text-sm font-medium rounded-md cursor-pointer ${
                      isActive(item.href)
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                    onClick={() => (item.submenu && !collapsed ? toggleSubmenu(item.title) : null)}
                    data-item={item.title}
                  >
                    <item.icon className={`${collapsed ? "mx-auto" : "mr-3"} h-5 w-5 text-gray-500`} />
                    {!collapsed && (
                      <>
                        <span className="flex-1">{item.title}</span>
                        {item.submenu && (
                          <button onClick={(e) => toggleSubmenu(item.title)} className="focus:outline-none">
                            {openSubmenu === item.title ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </>
                    )}

                    {/* Tooltip for collapsed mode */}
                    {collapsed && !item.submenu && (
                      <Tooltip title={item.title} parentRef={divRefs.current[item.title]!} />
                    )}

                    {/* Dropdown trigger for collapsed mode with submenu */}
                    {collapsed && item.submenu && (
                      <button
                        onClick={(e) => toggleDropdown(e, item.title)}
                        className="absolute inset-0 w-full h-full cursor-pointer z-[9998]"
                      />
                    )}
                  </div>

                  {/* Submenu for expanded mode */}
                  {!collapsed &&
                    item.submenu &&
                    openSubmenu === item.title &&
                    renderSubmenuItems(item.submenuItems!, item.title)}

                  {/* Dropdown for collapsed mode */}
                  {collapsed && item.submenu && renderDropdown(item.submenuItems!, item.title)}
                </div>
              ))}
            </nav>
          </div>

          {/* Settings Navigation */}
          <div className="px-3 py-4 mt-5">
            {!collapsed && <div className="mb-2 text-xs font-semibold text-gray-500">SETTINGS</div>}
            {/* {collapsed && <div className="mb-2 text-xs font-semibold text-gray-500 text-center">SETTINGS</div>} */}
            <nav className="space-y-1">
              {settingsNavItems.map((item) => (
                <div key={item.title} className="relative group">
                  <Link
                    ref={linkRefs.current[item.title]}
                    href={item.href}
                    className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive(item.href)
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <item.icon className={`${collapsed ? "mx-auto" : "mr-3"} h-5 w-5 text-gray-500`} />
                    {!collapsed && <span>{item.title}</span>}

                    {/* Tooltip for collapsed mode */}
                    {collapsed && (
                      <Tooltip title={item.title} parentRef={linkRefs.current[item.title]!} />
                    )}
                  </Link>
                </div>
              ))}
            </nav>
          </div>
        </div>

        {/* Theme Toggle */}
        <div className="p-4 border-t border-gray-200">
          {!collapsed ? (
            <div className="flex items-center justify-between">
              <button
                onClick={toggleTheme}
                className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                  theme === "light" ? "bg-gray-100 text-gray-900" : "text-gray-600"
                }`}
              >
                <div className="flex items-center">
                  <Sun className="w-4 h-4 mr-2" />
                  <span>Light</span>
                </div>
              </button>
              <button
                onClick={toggleTheme}
                className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                  theme === "dark" ? "bg-gray-100 text-gray-900" : "text-gray-600"
                }`}
              >
                <div className="flex items-center">
                  <Moon className="w-4 h-4 mr-2" />
                  <span>Dark</span>
                </div>
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-100">
                {theme === "light" ? (
                  <Sun className="w-5 h-5 text-gray-600" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </div>
          )}
        </div>

        {/* Toggle Button */}
        <button
          className="absolute -right-3 top-20 bg-white border border-gray-200 rounded-full p-1 shadow-md hidden lg:block"
          onClick={() => setCollapsed(!collapsed)}
        >
          <ChevronRight className={`w-4 h-4 text-gray-600 transition-transform ${collapsed ? "" : "rotate-180"}`} />
        </button>
      </aside>
    </div>
  )
}
