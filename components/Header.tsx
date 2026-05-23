
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 amazon-gradient rounded-lg flex items-center justify-center text-white font-bold">A</div>
          <span className="text-xl font-serif font-bold tracking-tight text-stone-900">AmzStyle</span>
        </div>
        <nav className="hidden md:flex space-x-8 text-sm font-medium text-stone-600">
          <a href="#" className="hover:text-stone-900 transition-colors">How it works</a>
          <a href="#" className="hover:text-stone-900 transition-colors">Trends</a>
          <a href="#" className="hover:text-stone-900 transition-colors">My Wardrobe</a>
        </nav>
        <div className="flex items-center space-x-4">
          <button className="text-sm font-semibold px-4 py-2 rounded-full border border-stone-300 hover:bg-stone-50 transition-colors">
            Sign In
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
