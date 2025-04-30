import React from 'react';
import { useState } from 'react';
import { useSession } from './SessionContext';
import { Link } from 'react-router-dom';
function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { history } = useSession();

  return (
    <header className="bg-blue-600 text-white py-4 shadow-md relative z-50">
  <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
    {/* Left Side: Logo or Title */}
    <Link to="/" className="text-2xl font-semibold hover:underline">
      Breast Cancer Detection System
    </Link>

    {/* Right Side: Buttons */}
    <div className="flex items-center gap-4">
      {/* Home Button */}
      <Link
        to="/"
        className="bg-white text-blue-600 px-4 py-1 rounded-full font-medium text-sm hover:bg-gray-200 transition"
      >
        Home
      </Link>

      {/* Avatar Dropdown */}
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-10 h-10 rounded-full bg-white text-blue-600 font-bold flex items-center justify-center hover:bg-gray-200 transition"
        >
          📁
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white text-black rounded shadow-lg p-4">
            <h2 className="text-sm font-semibold mb-2">Session History</h2>
            {history.length === 0 ? (
              <p className="text-gray-500 text-sm">No uploads yet.</p>
            ) : (
              history.slice(0, 3).map((item, idx) => (
                <div key={idx} className="mb-4 border-b pb-2">
                  <div className="flex justify-between gap-2">
                    <img src={item.original} alt="Original" className="w-20 h-20 object-cover rounded" />
                    <img src={item.mask} alt="Mask" className="w-20 h-20 object-cover rounded" />
                  </div>
                </div>
              ))
            )}

            {history.length > 0 && (
              <Link
                to="/history"
                className="block text-center mt-3 text-blue-600 font-medium hover:underline"
              >
                View All
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  </div>
</header>

  );
}

  
  export default Navbar;
  