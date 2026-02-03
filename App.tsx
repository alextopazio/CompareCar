
import React, { useState, useEffect, useCallback } from 'react';
import { CarSpecs, ComparisonInsight, AppState } from './types';
import { fetchCarSpecs, fetchComparisonInsights } from './services/geminiService';
import { CarCard } from './components/CarCard';
import { ComparisonGrid } from './components/ComparisonGrid';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedCars, setSelectedCars] = useState<CarSpecs[]>([]);
  const [insight, setInsight] = useState<ComparisonInsight | null>(null);
  const [status, setStatus] = useState<AppState>(AppState.IDLE);
  const [error, setError] = useState<string | null>(null);

  const handleAddCar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    if (selectedCars.length >= 3) {
      setError('Você pode comparar no máximo 3 carros.');
      return;
    }

    setStatus(AppState.LOADING_CAR);
    setError(null);
    try {
      const carData = await fetchCarSpecs(query);
      if (carData) {
        setSelectedCars(prev => [...prev, carData]);
        setQuery('');
      }
    } catch (err: any) {
      console.error(err);
      setError('Não foi possível encontrar informações para este carro. Tente ser mais específico (Ex: Toyota Corolla Hybrid 2024).');
    } finally {
      setStatus(AppState.IDLE);
    }
  };

  const removeCar = (index: number) => {
    setSelectedCars(prev => prev.filter((_, i) => i !== index));
    setInsight(null);
  };

  const getInsights = async () => {
    if (selectedCars.length < 2) return;
    setStatus(AppState.LOADING_INSIGHTS);
    try {
      const data = await fetchComparisonInsights(selectedCars);
      setInsight(data);
    } catch (err) {
      setError('Erro ao gerar insights da IA.');
    } finally {
      setStatus(AppState.IDLE);
    }
  };

  useEffect(() => {
    // Auto-clear insights if car list changes
    if (selectedCars.length < 2) {
      setInsight(null);
    }
  }, [selectedCars]);

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      {/* Header */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-car-side text-white"></i>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Compara<span className="text-blue-500">Car</span></span>
          </div>
          <div className="text-sm text-slate-400 font-medium hidden md:block">
            {selectedCars.length}/3 carros selecionados
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 pt-12">
        {/* Search Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
            Compare carros com <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">IA & Imagens</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg mb-10">
            Adicione até três modelos. Nossa inteligência artificial gera as imagens e analisa as fichas técnicas para você.
          </p>

          <form onSubmit={handleAddCar} className="max-w-2xl mx-auto relative">
            <input 
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ex: Honda Civic 2024, BYD Seal, Corolla Cross..."
              className="w-full bg-slate-800 border-2 border-slate-700 rounded-2xl py-5 px-6 pr-16 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all shadow-2xl"
              disabled={status === AppState.LOADING_CAR}
            />
            <button 
              type="submit"
              disabled={status === AppState.LOADING_CAR || !query.trim()}
              className="absolute right-3 top-3 bottom-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white px-6 rounded-xl font-bold transition-all flex items-center gap-2"
            >
              {status === AppState.LOADING_CAR ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <i className="fa-solid fa-plus"></i>
                  <span className="hidden sm:inline">Adicionar</span>
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-4 text-red-400 text-sm flex items-center justify-center gap-2">
              <i className="fa-solid fa-circle-exclamation"></i>
              {error}
            </div>
          )}
        </section>

        {/* Selected Cars Display */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {selectedCars.map((car, idx) => (
            <CarCard key={idx} car={car} onRemove={() => removeCar(idx)} />
          ))}
          
          {selectedCars.length < 3 && status !== AppState.LOADING_CAR && (
            <div className="border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center p-12 text-slate-600 min-h-[400px]">
              <i className="fa-solid fa-plus text-3xl mb-4"></i>
              <p className="text-sm font-medium">Adicione outro veículo</p>
            </div>
          )}
        </div>

        {/* Comparison Actions */}
        {selectedCars.length >= 2 && !insight && (
          <div className="flex justify-center mt-8">
            <button 
              onClick={getInsights}
              disabled={status === AppState.LOADING_INSIGHTS}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 px-10 rounded-2xl shadow-xl shadow-blue-900/20 transition-all flex items-center gap-3"
            >
              {status === AppState.LOADING_INSIGHTS ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Analisando dados...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-wand-magic-sparkles"></i>
                  Gerar Análise com IA
                </>
              )}
            </button>
          </div>
        )}

        {/* AI Insights Section */}
        {insight && (
          <div className="mt-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 border border-blue-500/30 shadow-2xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center">
                  <i className="fa-solid fa-robot text-blue-400 text-2xl"></i>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Veredito da IA</h2>
                  <p className="text-slate-400 text-sm">Análise baseada em custo-benefício e performance</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="bg-slate-950/40 p-6 rounded-2xl border border-slate-700">
                  <h3 className="text-green-400 font-bold mb-4 flex items-center gap-2">
                    <i className="fa-solid fa-circle-check"></i> Prós do Comparativo
                  </h3>
                  <ul className="space-y-3">
                    {insight.pros.map((pro, i) => (
                      <li key={i} className="text-slate-300 text-sm flex items-start gap-3">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 flex-shrink-0"></span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-950/40 p-6 rounded-2xl border border-slate-700">
                  <h3 className="text-red-400 font-bold mb-4 flex items-center gap-2">
                    <i className="fa-solid fa-circle-xmark"></i> Pontos de Atenção
                  </h3>
                  <ul className="space-y-3">
                    {insight.cons.map((con, i) => (
                      <li key={i} className="text-slate-300 text-sm flex items-start gap-3">
                        <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5 flex-shrink-0"></span>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-blue-600/10 p-6 rounded-2xl border border-blue-500/20 mb-6">
                <div className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-2">Público Ideal</div>
                <p className="text-slate-200">{insight.targetAudience}</p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-700">
                <div className="text-xs text-slate-500 font-bold uppercase mb-2">Conclusão Final</div>
                <p className="text-slate-300 leading-relaxed italic">
                  "{insight.verdict}"
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Detailed Grid */}
        {selectedCars.length > 0 && <ComparisonGrid cars={selectedCars} />}
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-900 py-10 text-center">
        <p className="text-slate-600 text-sm">
          ComparaCar &copy; {new Date().getFullYear()} - Imagens e dados técnicos gerados via Gemini API.
        </p>
      </footer>
    </div>
  );
};

export default App;
