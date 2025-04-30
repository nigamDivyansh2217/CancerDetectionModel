import React from 'react';


import { useState } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import { useSession } from './components/SessionContext.jsx';
function Home() {
  const [fileQueue, setFileQueue] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState([]); // array of { original, mask }
  const { addToHistory } = useSession();

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const queued = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      status: 'pending',
      result: null,
    }));
    setFileQueue(prev => [...prev, ...queued]);
  };

  const processNext = async () => {
    const nextIndex = fileQueue.findIndex(f => f.status === 'pending');
    if (nextIndex === -1) return;

    const fileObj = fileQueue[nextIndex];
    fileQueue[nextIndex].status = 'uploading';
    setFileQueue([...fileQueue]);

    const formData = new FormData();
    formData.append('image', fileObj.file);

    try {
      const res = await axios.post('http://localhost:5000/upload', formData);
      const maskUrl = res.data.maskUrl;

      fileQueue[nextIndex].status = 'done';
      fileQueue[nextIndex].result = maskUrl;
      setFileQueue([...fileQueue]);

      setResults(prev => [...prev, { original: fileObj.preview, mask: maskUrl }]);
      addToHistory(fileObj.preview, maskUrl);
    } catch (err) {
      fileQueue[nextIndex].status = 'error';
      setFileQueue([...fileQueue]);
      alert('Error processing image');
    } finally {
      processNext(); // recursively process next image
    }
  };

  const handleStart = () => {
    if (!processing) {
      setProcessing(true);
      processNext();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-10">
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h2 className="text-xl font-bold text-center mb-6">Upload Ultrasound Images</h2>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="block w-full file:mr-4 file:py-2 file:px-4 file:border-0
                       file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700
                       hover:file:bg-blue-100 mb-4"
          />

          <button
            onClick={handleStart}
            disabled={processing || fileQueue.length === 0}
            className={`w-full py-2 px-4 rounded-lg text-white font-semibold transition ${
              processing
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {processing ? 'Processing Images...' : 'Start Processing'}
          </button>
        </div>

        {fileQueue.length > 0 && (
          <div className="mt-10 space-y-10">
            {fileQueue.map((item, idx) => (
              <div key={idx} className="bg-white shadow rounded-lg p-4 md:flex gap-6 items-center">
                <div className="w-full md:w-1/2">
                  <h4 className="text-sm font-semibold mb-2 text-center">Uploaded Image</h4>
                  <img src={item.preview} alt={`Upload ${idx}`} className="w-full rounded border" />
                </div>
                <div className="w-full md:w-1/2">
                  <h4 className="text-sm font-semibold mb-2 text-center">Predicted Mask</h4>
                  {item.status === 'done' ? (
                    <img src={item.result} alt={`Mask ${idx}`} className="w-full rounded border" />
                  ) : item.status === 'uploading' ? (
                    <p className="text-center text-blue-600 font-medium">Processing...</p>
                  ) : item.status === 'error' ? (
                    <p className="text-center text-red-500">Error</p>
                  ) : (
                    <p className="text-center text-gray-400 italic">Pending</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;
