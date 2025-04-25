import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTableColumns } from '@fortawesome/free-solid-svg-icons'

const Header = () => {
  return (
    <header className="bg-[#f5f5f5] border-b border-gray-200 p-4 flex items-center justify-between">
      <div>
        <FontAwesomeIcon icon={faTableColumns} color='gray' />
      </div>
      <div></div>
    </header>
  );
};

export default Header;
