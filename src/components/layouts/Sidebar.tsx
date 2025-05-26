"use client"

import type React from "react"
import { useState, useEffect, useRef, createRef, createContext, useContext } from "react"
import Link from "next/link"
import Image from 'next/image'
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
import classNames from "classnames"

interface NavItem {
  title: string;
  href: string;
  icon: any;
  submenu?: boolean;
  submenuItems?: { title: string; href: string }[];
}

// Define the navigation items
const mainNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  // {
  //   title: "Labels",
  //   href: "/labels",
  //   icon: Users,
  //   submenu: true,
  //   submenuItems: [
  //     { title: "All Labels", href: "/labels" },
  //     { title: "Create Label", href: "/labels/create" }
  //   ]
  // },
  // {
  //   title: "Sents",
  //   href: "/sents",
  //   icon: FileText,
  // },
  {
    title: "Schedules",
    href: "/schedules",
    icon: Calendar,
    submenu: true,
    submenuItems: [
      { title: "View Schedule", href: "/schedules" },
      // { title: "Create Schedule", href: "/schedules/create" }
    ]
  },
]

const settingsNavItems: NavItem[] = [
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    submenu: true,
    submenuItems: [
      { title: "General", href: "/settings/general" },
      { title: "Profile", href: "/settings/profile" }
    ]
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
      divRefs.current[item.title] = divRefs.current[item.title] || createRef();
    });
    // settingsNavItems.forEach(item => {
    //   linkRefs.current[item.title] = linkRefs.current[item.title] || createRef();
    // });
  }, []);

  // Check if we're on mobile and set collapsed state accordingly
  useEffect(() => {
    // const handleResize = () => {
    //   setCollapsed(window.innerWidth < 1024)
    // }

    // // Set initial state
    // handleResize()

    // window.addEventListener("resize", handleResize)
    // return () => window.removeEventListener("resize", handleResize)
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
    let mode = document.documentElement.classList.toggle("dark");
    mode
      ? (localStorage.theme = "dark")
      : (localStorage.theme = "light");
    // setTheme(theme === 'dark' ? 'light' : 'dark');
    setTheme(mode ? 'light' : 'dark')
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
            className={`block py-2 text-sm ${isActive(item.href) ? "text-white font-medium" : "text-gray-600 hover:text-white"
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
        className="fixed left-16 bg-[#a5b7ff] rounded-md shadow-lg border border-gray-200 py-2 w-40"
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
        if (parentRef?.current) {
          const rect = parentRef.current.getBoundingClientRect();
          setPosition(rect.top);
        }
      };

      if (parentRef?.current) {
        updatePosition();
        window.addEventListener('scroll', updatePosition);
        return () => window.removeEventListener('scroll', updatePosition);
      }
    }, [parentRef]);

    if (!parentRef?.current) return null;

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
        className={`fixed shadow-inner-right-md inset-y-0 left-0 z-10 flex flex-col bg-[#222D32] dark:bg-[#202025] border-r 
          border-[#2a383e] dark:border-gray-800 transition-all duration-300 ${collapsed ? "w-16" : "w-64"}
          text-[0.5rem]
          `}
      >
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-800">
          {!collapsed ? (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <div className="relative w-8 h-8 rounded-full flex items-center justify-center">
                  <img src="/globe.svg" alt="" className="w-6 h-6 text-white invert" />
                </div>
                <span className="ml-2 text-lg font-semibold text-white">EDI HUB</span>
              </div>
              <button onClick={() => setCollapsed(true)}>
                <MoreVertical className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center w-full">
              <img src="/globe.svg" width={16} height={16} className="w-6 h-6 text-white invert" />
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto overflow-x-visible">
          {/* Main Navigation */}
          <div className={classNames(
            "py-4 mt-5",
            {
              'px-3': collapsed,
              'px-5': !collapsed
            }
          )}>
            {!collapsed && <div className="mb-2 text-xs font-semibold text-white">MAIN</div>}
            {/* {collapsed && <div className="mb-2 text-xs font-semibold text-gray-500 text-center">MAIN</div>} */}
            <nav className="space-y-1">
              {mainNavItems.map((item) => (
                <div key={item.title} className="relative group">
                  {/* Main nav item */}
                  <div
                    ref={!item.submenu ? divRefs.current[item.title] : null}
                    className={`flex items-center px-2 py-2 text-sm font-medium rounded-md cursor-pointer ${isActive(item.href)
                      ? "bg-[#1E282C] dark:bg-gray-800 text-white"
                      : "text-white hover:bg-gray-800 hover:text-white"
                      }`}
                    onClick={() => (item.submenu && !collapsed ? toggleSubmenu(item.title) : null)}
                    data-item={item.title}
                  >
                    <item.icon className={`${collapsed ? "mx-auto" : "mr-3"} h-5 w-5 text-white`} />
                    {!collapsed && (
                      <>
                        <span className="flex-1 dark:text-white">{item.title}</span>
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
          <div className={classNames(
            "py-4 mt-5",
            {
              'px-3': collapsed,
              'px-5': !collapsed
            }
          )}>
            {/* {!collapsed && <div className="mb-2 text-xs font-semibold text-gray-500">SETTINGS</div>} */}
            {/* {collapsed && <div className="mb-2 text-xs font-semibold text-gray-500 text-center">SETTINGS</div>} */}
            {/* <nav className="space-y-1">
              {settingsNavItems.map((item) => (
                <div key={item.title} className="relative group">
                  <Link
                    ref={linkRefs.current[item.title]}
                    href={item.href}
                    className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive(item.href)
                      ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
                      }`}
                  >
                    <item.icon className={`${collapsed ? "mx-auto" : "mr-3"} h-5 w-5 text-gray-500 dark:text-white`} />
                    {!collapsed && <span className="dark:text-white">{item.title}</span>} */}

            {/* Tooltip for collapsed mode */}
            {/* {collapsed && (
                      <Tooltip title={item.title} parentRef={linkRefs.current[item.title]!} />
                    )}
                  </Link>
                </div>
              ))}
            </nav> */}
          </div>
        </div>

        {/* Theme Toggle */}
        {/* <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          {!collapsed ? (
            <div className="flex items-center justify-between">
              <button
                onClick={toggleTheme}
                className={`px-3 py-1.5 text-sm font-medium rounded-md ${theme === "light" ? "bg-gray-100 text-gray-900" : "text-gray-600"
                  }`}
              >
                <div className="flex items-center">
                  <Sun className="w-4 h-4 mr-2" />
                  <span>Light</span>
                </div>
              </button>
              <button
                onClick={toggleTheme}
                className={`px-3 py-1.5 text-sm font-medium rounded-md ${theme === "dark" ? "bg-gray-100 text-gray-900" : "text-gray-600"
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
        </div> */}

        {/* Toggle Button */}
        <button
          className="absolute -right-3 top-5 bg-white border border-gray-200 rounded-full p-1 shadow-md hidden lg:block"
          onClick={() => setCollapsed(!collapsed)}
        >
          <ChevronRight className={`w-4 h-4 text-gray-600 transition-transform ${collapsed ? "" : "rotate-180"}`} />
        </button>
      </aside>
    </div>
  )
}
