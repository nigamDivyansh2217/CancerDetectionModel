import React from 'react';
import { useSession } from './components/SessionContext';
import Navbar from './components/Navbar';

function HistoryPage() {
  const { history } = useSession();

  return (
    <div className="min-h-screen bg-gray-100">
    <Navbar />

    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-center mb-10">
        Uploaded Images & Prediction Results
      </h2>

      {history.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No images uploaded yet.</p>
      ) : (
        <div className="space-y-10">
          {history.map((item, idx) => (
            <div
              key={idx}
              className="bg-white shadow-md rounded-lg p-6 flex flex-col md:flex-row gap-6 items-center"
            >
              {/* Original Image */}
              <div className="w-full md:w-1/2">
                <h4 className="text-center text-sm font-semibold mb-2 text-gray-700">
                  Uploaded Image
                </h4>
                <img
                  src={item.original}
                  alt={`Original ${idx}`}
                  className="w-full rounded-lg border"
                />
              </div>

              {/* Predicted Mask */}
              <div className="w-full md:w-1/2">
                <h4 className="text-center text-sm font-semibold mb-2 text-gray-700">
                  Predicted Mask
                </h4>
                <img
                  src={item.mask}
                  alt={`Mask ${idx}`}
                  className="w-full rounded-lg border"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
  );
}

export default HistoryPage;
