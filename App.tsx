
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import UploadZone from './components/UploadZone';
import StyleResult from './components/StyleResult';
import Collection from './components/Collection';
import { analyzeStyle, generateOutfitPreview } from './services/geminiService';
import { StyleAnalysis, StyledItem, SavedOutfit } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<'styling' | 'collection'>('styling');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [analysis, setAnalysis] = useState<StyleAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedItems, setSelectedItems] = useState<StyledItem[]>([]);
  const [outfitName, setOutfitName] = useState("");
  const [savedOutfits, setSavedOutfits] = useState<SavedOutfit[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('amz_outfits');
    if (stored) setSavedOutfits(JSON.parse(stored));
  }, []);

  const handleImagesSelected = async (urls: string[], prompt: string) => {
    setSelectedImages(urls);
    setLoading(true);
    setError(null);
    setSelectedItems([]);
    try {
      const result = await analyzeStyle(urls, prompt);
      setAnalysis(result);
    } catch (err: any) {
      console.error(err);
      setError('Our stylist is temporarily unavailable. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const toggleItemSelection = (item: StyledItem) => {
    setSelectedItems(prev => {
      const exists = prev.find(i => i.id === item.id);
      if (exists) return prev.filter(i => i.id !== item.id);
      return [...prev, item];
    });
  };

  const saveOutfit = async () => {
    if (!outfitName.trim() || selectedItems.length === 0 || selectedImages.length === 0) return;
    
    setSaving(true);
    try {
      // Generate the preview of the USER wearing the combined look (Ref images + Selected items)
      const previewUrl = await generateOutfitPreview(
        selectedImages, 
        selectedItems, 
        analysis?.identifiedStyle || "custom"
      );

      const newOutfit: SavedOutfit = {
        id: Math.random().toString(36).substr(2, 9),
        name: outfitName,
        items: selectedItems,
        outfitImageUrl: previewUrl,
        createdAt: Date.now()
      };

      const updated = [newOutfit, ...savedOutfits];
      setSavedOutfits(updated);
      localStorage.setItem('amz_outfits', JSON.stringify(updated));
      
      setOutfitName("");
      setSelectedItems([]);
      setView('collection');
    } catch (e) {
      console.error(e);
      alert("Failed to render your outfit preview. Saving without image.");
    } finally {
      setSaving(false);
    }
  };

  const deleteOutfit = (id: string) => {
    const updated = savedOutfits.filter(o => o.id !== id);
    setSavedOutfits(updated);
    localStorage.setItem('amz_outfits', JSON.stringify(updated));
  };

  const reset = () => {
    setSelectedImages([]);
    setAnalysis(null);
    setError(null);
    setSelectedItems([]);
  };

  return (
    <div className="min-h-screen flex flex-col pb-20">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 mt-8 flex justify-center">
        <div className="bg-stone-100 p-1 rounded-full flex">
          <button 
            onClick={() => setView('styling')}
            className={`px-8 py-2 rounded-full text-sm font-bold transition-all ${view === 'styling' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-400 hover:text-stone-600'}`}
          >
            New Style
          </button>
          <button 
            onClick={() => setView('collection')}
            className={`px-8 py-2 rounded-full text-sm font-bold transition-all ${view === 'collection' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-400 hover:text-stone-600'}`}
          >
            My Collection ({savedOutfits.length})
          </button>
        </div>
      </div>

      <main className="flex-grow max-w-7xl mx-auto px-4 py-12 w-full">
        {view === 'styling' ? (
          <>
            {!analysis && !loading && (
              <div className="text-center mb-16 space-y-6">
                <h1 className="text-5xl md:text-8xl font-serif font-bold text-stone-900 tracking-tighter leading-[0.9]">
                  Personal <span className="text-stone-300 italic">Style</span> <br/>
                  Engineered.
                </h1>
                <p className="text-xl text-stone-400 max-w-2xl mx-auto font-light">
                  Upload photos and describe your vision. Gemini will curate a unique look with direct Amazon links for every piece.
                </p>
              </div>
            )}

            {!analysis && (
              <div className="max-w-4xl mx-auto space-y-8">
                <UploadZone onImagesSelected={handleImagesSelected} isLoading={loading} />
                {loading && (
                  <div className="space-y-6 py-12 text-center">
                    <div className="flex justify-center space-x-3">
                      <div className="w-2 h-12 bg-stone-900 animate-pulse [animation-delay:-0.4s] rounded-full"></div>
                      <div className="w-2 h-12 bg-stone-900 animate-pulse [animation-delay:-0.2s] rounded-full"></div>
                      <div className="w-2 h-12 bg-stone-900 animate-pulse rounded-full"></div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-stone-900 font-serif text-2xl font-bold">Crafting your aesthetic...</p>
                      <p className="text-stone-400 text-sm">Gemini is analyzing your features and searching Amazon.</p>
                    </div>
                  </div>
                )}
                {error && <div className="bg-red-50 text-red-600 p-6 rounded-3xl text-center border border-red-100">{error}</div>}
              </div>
            )}

            {analysis && (
              <div className="space-y-12">
                <div className="flex items-center justify-between border-b border-stone-100 pb-8 mb-8">
                  <button onClick={reset} className="flex items-center text-stone-400 hover:text-stone-900 transition-colors font-bold uppercase text-[10px] tracking-widest">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                    Start Over
                  </button>
                  <div className="flex -space-x-3">
                    {selectedImages.slice(0, 3).map((url, i) => (
                      <img key={i} className="inline-block h-12 w-12 rounded-full ring-4 ring-white object-cover shadow-sm" src={url} alt="" />
                    ))}
                  </div>
                </div>
                <StyleResult 
                  analysis={analysis} 
                  onAddToOutfit={toggleItemSelection} 
                  selectedIds={selectedItems.map(i => i.id)}
                />
              </div>
            )}
          </>
        ) : (
          <Collection outfits={savedOutfits} onDelete={deleteOutfit} />
        )}
      </main>

      {/* Outfit Builder Dock */}
      {selectedItems.length > 0 && view === 'styling' && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl bg-stone-900 text-white p-6 rounded-[2.5rem] shadow-2xl z-[100] animate-in slide-in-from-bottom-10">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex -space-x-3 flex-shrink-0">
              {selectedItems.map((item, i) => (
                <div key={i} className="w-12 h-12 rounded-full border-2 border-stone-800 bg-white overflow-hidden">
                   {item.imageUrl ? <img src={item.imageUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-stone-700" />}
                </div>
              ))}
            </div>
            <div className="flex-grow w-full">
              <input 
                type="text" 
                value={outfitName}
                onChange={(e) => setOutfitName(e.target.value)}
                placeholder="Name this look (e.g. Summer Brunch)"
                className="w-full bg-stone-800 border-none rounded-2xl px-4 py-2 text-sm focus:ring-1 focus:ring-stone-500 outline-none"
                disabled={saving}
              />
            </div>
            <button 
              onClick={saveOutfit}
              disabled={!outfitName.trim() || saving}
              className="bg-white text-stone-900 px-8 py-3 rounded-full font-bold text-sm uppercase tracking-tighter hover:bg-stone-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex items-center"
            >
              {saving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-stone-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Rendering Look...
                </>
              ) : 'Save Outfit'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
