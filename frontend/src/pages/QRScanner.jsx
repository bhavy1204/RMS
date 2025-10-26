import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const QRScanner = () => {
  const navigate = useNavigate();
  const [slug, setSlug] = useState('');

  const handleManualEntry = (e) => {
    e.preventDefault();
    if (slug.trim()) {
      navigate(`/table/${slug.trim()}`);
    } else {
      toast.error('Please enter a table slug');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-12 h-12 text-orange-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0v.01M12 12h.01M12 18h.01M6 14h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Scan Table QR Code</h1>
          <p className="text-gray-600">Point your camera at the QR code or enter the table slug</p>
        </div>

        <form onSubmit={handleManualEntry} className="space-y-4">
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
              Table Slug
            </label>
            <input
              id="slug"
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g., table-1"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
            />
            <p className="text-sm text-gray-500 mt-2">
              The table slug is displayed on the QR code at your table
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition"
          >
            Continue to Menu
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/menu')}
            className="text-sm text-gray-600 hover:text-orange-500 transition"
          >
            Skip to General Menu
          </button>
        </div>

        <div className="mt-8 p-4 bg-orange-50 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">How to use:</h3>
          <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
            <li>Find the QR code at your table</li>
            <li>Scan it with your camera or enter the table slug above</li>
            <li>Browse and order from the digital menu</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;

