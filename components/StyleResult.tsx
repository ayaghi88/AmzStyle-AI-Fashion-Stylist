
import React from 'react';
import { StyleAnalysis, StyledItem } from '../types';

interface StyleResultProps {
  analysis: StyleAnalysis;
  onAddToOutfit: (item: StyledItem) => void;
  selectedIds: string[];
}

const StyleResult: React.FC<StyleResultProps> = ({ analysis, onAddToOutfit, selectedIds }) => {
  const handleDownload = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `my-style-look-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hero: Identity Preservation View */}
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="relative group rounded-[3rem] overflow-hidden bg-stone-100 shadow-2xl">
          {analysis.fullLookImageUrl ? (
            <img 
              src={analysis.fullLookImageUrl} 
              className="w-full aspect-[3/4] object-cover" 
              alt="Your styled look" 
            />
          ) : (
            <div className="w-full aspect-[3/4] flex items-center justify-center text-stone-300">
              Generating your visualization...
            </div>
          )}
          <div className="absolute top-6 left-6 flex items-center space-x-2">
            <div className="bg-stone-900/60 backdrop-blur-xl px-4 py-2 rounded-full text-[10px] text-white font-bold uppercase tracking-[0.2em] border border-white/10">
              AI Powered Visualization
            </div>
          </div>
          
          {analysis.fullLookImageUrl && (
            <button 
              onClick={() => handleDownload(analysis.fullLookImageUrl!)}
              className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm text-stone-900 p-3 rounded-full shadow-lg hover:bg-white transition-colors group-hover:scale-110 duration-300"
              title="Download your look"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent">
             <h3 className="text-white text-3xl font-serif font-bold">Your Proposed Look</h3>
             <p className="text-stone-300 text-sm mt-2">Integrating your reference photos with Amazon curated pieces.</p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <div className="inline-block px-3 py-1 rounded-full bg-stone-100 text-stone-600 text-[10px] font-bold uppercase tracking-widest">
              Stylist Analysis
            </div>
            <h2 className="text-5xl font-serif font-bold text-stone-900 leading-tight">
              The {analysis.identifiedStyle} Aesthetic
            </h2>
            <p className="text-xl text-stone-500 font-light leading-relaxed">
              {analysis.vibeDescription}
            </p>
          </div>

          <div className="p-8 bg-white border border-stone-100 rounded-[2rem] shadow-sm space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Why this works for you</h4>
            <p className="text-stone-800 leading-relaxed italic text-sm">
              "{analysis.summary}"
            </p>
            <div className="pt-4 flex flex-wrap gap-2">
              {analysis.colorPalette.map((color, idx) => (
                <div key={idx} className="flex items-center space-x-2 bg-stone-50 rounded-full px-4 py-1.5 text-[10px] text-stone-600 font-bold uppercase tracking-tighter">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                  <span>{color}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations Grid */}
      <div className="space-y-8">
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <h3 className="text-2xl font-serif font-bold text-stone-900">Recommended Additions</h3>
            <p className="text-stone-400 text-sm">Curated from Amazon to complete your silhouette</p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {analysis.recommendations.map((item) => {
            const isSelected = selectedIds.includes(item.id);
            return (
              <div 
                key={item.id} 
                onClick={() => onAddToOutfit(item)}
                className={`group cursor-pointer bg-white rounded-[2rem] overflow-hidden border transition-all duration-300 ${
                  isSelected ? 'border-stone-900 ring-2 ring-stone-900/5 shadow-2xl scale-[1.02]' : 'border-stone-100 shadow-sm hover:shadow-xl hover:-translate-y-1'
                }`}
              >
                <div className="aspect-[4/5] bg-stone-50 relative overflow-hidden">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" alt={item.name} />
                  ) : (
                    <div className="w-full h-full amazon-gradient opacity-10" />
                  )}
                  <div className="absolute top-4 right-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isSelected ? 'bg-stone-900 text-white shadow-lg' : 'bg-white/90 backdrop-blur-sm text-stone-400'
                    }`}>
                      {isSelected ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                      )}
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  <div className="flex justify-between items-start">
                    <h4 className="text-lg font-bold text-stone-800 line-clamp-1">{item.name}</h4>
                  </div>
                  <p className="text-stone-400 text-xs leading-relaxed line-clamp-2">
                    {item.reasoning}
                  </p>
                  <div className="pt-3 border-t border-stone-50 flex items-center justify-between">
                    <span className="text-stone-500 text-[10px] font-bold uppercase tracking-widest">{item.priceRange}</span>
                    <a 
                      href={item.amazonSearchUrl} 
                      target="_blank" 
                      onClick={(e) => e.stopPropagation()}
                      rel="noopener noreferrer"
                      className="text-stone-900 font-bold text-[10px] uppercase tracking-widest hover:underline"
                    >
                      Amazon Link
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StyleResult;
