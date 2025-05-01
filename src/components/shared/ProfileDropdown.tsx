import React, { useState } from 'react';
import { UserCircle, LogOut, Settings, User, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/providers/Authenticate/AuthProvider';
import { useRouter } from '@/navigation';
import classNames from 'classnames';

interface ProfileDropdownProps {
  user?: {
    name: string;
    email?: string;
    profile?: string;
  };
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ user }) => {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();
  const router = useRouter();


  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    router.push('/authenticate/login');
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <UserCircle className="w-6 h-6" />
        <div className='ml-2'>
          <span className="hidden md:block text-sm text-left">{user?.name || t('profile')}</span>
          <span className="hidden md:block text-xs text-gray-500 text-left">{user?.profile || t('profile')}</span>
        </div>
        <ChevronDown className="w-4 h-4 ml-2" />
      </button>

      {isOpen && (
        <div
          className={classNames(
            "absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg border border-gray-200 z-50",
            `p-2 rounded-sm`
          )}
          onMouseLeave={closeDropdown}
        >
          <div className="py-1">
            <Link
              href="/profile"
              className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              <User className="w-4 h-4" />
              <span>{t('profile')}</span>
            </Link>
            <Link
              href="/settings"
              className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              <Settings className="w-4 h-4" />
              <span>{t('settings')}</span>
            </Link>
            <button
              onClick={() => {
                handleLogout();
              }}
              className="flex items-center gap-3 w-full px-4 py-2 text-red-600 hover:bg-gray-100"
            >
              <LogOut className="w-4 h-4" />
              <span>{t('logout')}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
