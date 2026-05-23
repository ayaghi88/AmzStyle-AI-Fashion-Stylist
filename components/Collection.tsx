
import React from 'react';
import { SavedOutfit } from '../types';

interface CollectionProps {
  outfits: SavedOutfit[];
  onDelete: (id: string) => void;
}

const Collection: React.FC<CollectionProps> = ({ outfits, onDelete }) => {
  const handleDownload = (url: string, name: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${name.toLowerCase().replace(/\s+/g, '-')}-look.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (outfits.length === 0) {
    return (
      <div className="text-center py-24 space-y-4">
        <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-10 h-10 text-stone-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        </div>
        <h3 className="text-xl font-serif font-bold text-stone-800">Your wardrobe is empty</h3>
        <p className="text-stone-400 max-w-xs mx-auto text-sm">Start by styling some photos and saving your favorite combinations.</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-10">
      {outfits.map((outfit) => (
        <div key={outfit.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-stone-100 flex flex-col md:flex-row h-full group">
          {/* Main Identity Preview */}
          <div className="md:w-1/2 aspect-[3/4] bg-stone-50 overflow-hidden relative">
            {outfit.outfitImageUrl ? (
              <img src={outfit.outfitImageUrl} className="w-full h-full object-cover" alt={outfit.name} />
            ) : (
              <div className="w-full h-full flex items-center justify-center amazon-gradient text-white/20">
                <span className="text-sm font-bold uppercase tracking-widest">No Preview</span>
              </div>
            )}
            <div className="absolute top-4 left-4 bg-stone-900/40 backdrop-blur-md px-3 py-1 rounded-full text-[10px] text-white font-bold uppercase tracking-widest">
              AI Render
            </div>

            {outfit.outfitImageUrl && (
              <button 
                onClick={() => handleDownload(outfit.outfitImageUrl!, outfit.name)}
                className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm text-stone-900 p-2.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-white"
                title="Download this look"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
            )}
          </div>

          {/* Details & Items */}
          <div className="md:w-1/2 p-8 flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div className="space-y-1">
                <h4 className="text-2xl font-serif font-bold text-stone-900">{outfit.name}</h4>
                <p className="text-[10px] text-stone-400 uppercase tracking-widest">{new Date(outfit.createdAt).toLocaleDateString()}</p>
              </div>
              <button 
                onClick={() => onDelete(outfit.id)}
                className="text-stone-300 hover:text-red-400 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>

            <div className="flex-grow space-y-4">
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Outfit Pieces</p>
              <div className="space-y-3">
                {outfit.items.map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-3 group/item">
                    <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-stone-50 border border-stone-100">
                      {item.imageUrl ? <img src={item.imageUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full amazon-gradient opacity-10" />}
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="text-xs font-bold text-stone-800 truncate">{item.name}</p>
                      <a href={item.amazonSearchUrl} target="_blank" className="text-[10px] text-stone-400 hover:text-stone-900 underline">Shop Item</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-stone-50">
               <button className="w-full bg-stone-50 text-stone-900 text-[10px] font-bold uppercase tracking-widest py-3 rounded-xl hover:bg-stone-100 transition-colors">
                 Full Look Details
               </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Collection;
