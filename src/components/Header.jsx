import React from 'react';

export const Header = () => {
  return (
    <header className="shadow-lg text-gray-700 p-4 flex justify-between items-center">
      <div className="flex items-center">
        <img
          src="/images/48_48.png"
          alt="Logo"
          width="48px"
          height="48px"
          className="mr-2"
        />
        <h1 className="text-xl font-bold">RiffRepeater</h1>
      </div>
    </header>
  );
};