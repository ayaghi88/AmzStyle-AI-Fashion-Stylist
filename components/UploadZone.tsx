
import React, { useRef, useState } from 'react';

interface UploadZoneProps {
  onImagesSelected: (urls: string[], prompt: string) => void;
  isLoading: boolean;
}

const UploadZone: React.FC<UploadZoneProps> = ({ onImagesSelected, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [prompt, setPrompt] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (files.length === 0) return;

    const readers = files.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then(urls => onImagesSelected(urls, prompt));
  };

  return (
    <div className="w-full space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-stone-700 ml-1">Optional: Tell us about the occasion</label>
        <textarea 
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. For a destination wedding in Italy, or a minimalist office look..."
          className="w-full h-32 p-4 rounded-2xl border border-stone-200 focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none transition-all resize-none text-stone-800 placeholder:text-stone-300 bg-white"
          disabled={isLoading}
        />
      </div>

      <div 
        onClick={() => !isLoading && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed border-stone-200 rounded-3xl p-10 text-center transition-all cursor-pointer hover:border-stone-400 hover:bg-white/50 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input 
          type="file" 
          multiple 
          accept="image/*" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
        />
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 mb-3 rounded-full bg-stone-50 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-stone-900">Upload Reference Photos</h3>
          <p className="text-stone-400 text-sm mt-1">Upload yourself or style inspirations</p>
          <div className="mt-6">
            <button 
              disabled={isLoading}
              className="bg-stone-900 text-white px-8 py-3 rounded-full font-semibold hover:bg-stone-800 transition-all shadow-lg shadow-stone-100 disabled:bg-stone-300"
            >
              {isLoading ? 'Styling in progress...' : 'Get Styled'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadZone;
