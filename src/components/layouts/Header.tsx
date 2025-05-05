import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTableColumns } from '@fortawesome/free-solid-svg-icons'
import { useConfiguration } from '@/providers/configuration/ConfigurationProvider';
import ProfileDropdown from '@/components/shared/ProfileDropdown';
import classNames from 'classnames';
import { useAppSelector } from '@/app/store';
import { UserData } from '@/interfaces/auth/UserData';

const Header = () => {
  const profile: UserData = useAppSelector(state => state.auth.user) || {};
  const { viewTitle } = useConfiguration();
  return (
    <header className={classNames(
      `bg-background dark:bg-backgrounddark border-b border-gray-200 dark:border-gray-800 px-4 py-2 flex items-center justify-between min-h-14`,
      "dark:border-gray-800 dark:text-white"
    )}>
      <div className="ml-2 flex items-center gap-4">
        <FontAwesomeIcon icon={faTableColumns} className="text-gray-500" />
        <span className="text-lg font-medium">{viewTitle}</span>
      </div>
      <div className={classNames(
        "flex items-center gap-4",
        "rounded-sm"
      )}>
        <ProfileDropdown user={{
          name: `${profile?.firstName || ''} ${profile?.lastName || ''}`,
          email: profile?.email || '',
          profile: profile?.roleName || '',
        }} />
      </div>
    </header>
  );
};

export default Header;
