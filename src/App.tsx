/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Sparkles } from 'lucide-react';
import { useAuth, authHeaders } from './context/AuthContext';
import { AuthModal } from './components/AuthModal';
import { CARS_DATASET } from './data/cars';
import { calculateRecommendations } from './lib/recommendationEngine';
import { 
  Car, 
  UserPreferences, 
  ScoredCar, 
  AIRecommendationResponse, 
  MatchScoreBreakdown 
} from './types';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { AiFinderWizard } from './components/AiFinderWizard';
import { AiProcessingScreen } from './components/AiProcessingScreen';
import { RecommendationResults } from './components/RecommendationResults';
import { CarExplorer } from './components/CarExplorer';
import { UserDashboard } from './components/UserDashboard';
import { CarDetailsModal } from './components/CarDetailsModal';
import { ComparisonView } from './components/ComparisonView';
import { OwnershipStudio } from './components/OwnershipStudio';
import { AiChatDrawer } from './components/AiChatDrawer';
import { EmiModal } from './components/EmiModal';
import { OnRoadPriceModal } from './components/OnRoadPriceModal';
import { EvBreakEvenModal } from './components/EvBreakEvenModal';

export default function App() {
  // Auth state
  const { user } = useAuth();
  const isSignedIn = Boolean(user);
  const wasSignedInRef = useRef<boolean | null>(null);

  // Auth modal
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<'sign-in' | 'sign-up'>('sign-in');
  const openAuthModal = (view: 'sign-in' | 'sign-up' = 'sign-in') => {
    setAuthModalView(view);
    setIsAuthModalOpen(true);
  };

  // Navigation State
  const [activeTab, setActiveTab] = useState<'discover' | 'recommendations' | 'explore' | 'compare' | 'ownership' | 'dashboard'>('discover');

  // Modals & Drawers
  const [isFinderOpen, setIsFinderOpen] = useState(false);
  const [isProcessingAi, setIsProcessingAi] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isEmiModalOpen, setIsEmiModalOpen] = useState(false);
  const [isOnRoadModalOpen, setIsOnRoadModalOpen] = useState(false);
  const [isEvBreakEvenModalOpen, setIsEvBreakEvenModalOpen] = useState(false);
  const [chatInitialPrompt, setChatInitialPrompt] = useState('');
  const [selectedCarForDetails, setSelectedCarForDetails] = useState<Car | null>(null);

  // Recommendations & User Preferences
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(() => {
    try {
      const saved = localStorage.getItem('driveai_user_preferences');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [scoredCars, setScoredCars] = useState<ScoredCar[]>([]);
  const [aiExplanation, setAiExplanation] = useState<AIRecommendationResponse | null>(null);
  const [isLoadingAiExplanation, setIsLoadingAiExplanation] = useState(false);

  // Compare List & Favorites
  const [comparedCars, setComparedCars] = useState<Car[]>(() => {
    try {
      const saved = localStorage.getItem('driveai_compared_cars');
      return saved ? JSON.parse(saved) : [CARS_DATASET[0], CARS_DATASET[1]];
    } catch {
      return [CARS_DATASET[0], CARS_DATASET[1]];
    }
  });

  const [favoriteCars, setFavoriteCars] = useState<Car[]>(() => {
    try {
      const saved = localStorage.getItem('driveai_favorite_cars');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Exploration Filters & Target Ownership Car
  const [initialCategoryFilter, setInitialCategoryFilter] = useState<string>('');
  const [ownershipTargetCar, setOwnershipTargetCar] = useState<Car>(CARS_DATASET[0]);

  // After a user signs up / signs in, land them on their dashboard (once per session)
  useEffect(() => {
    if (wasSignedInRef.current === false && isSignedIn) {
      setActiveTab('dashboard');
    }
    wasSignedInRef.current = isSignedIn;
  }, [isSignedIn]);

  // Sync user data with backend on login
  useEffect(() => {
    if (!user) return;
    let isMounted = true;

    async function loadCloudUserData() {
      try {
        const headers = { 'Content-Type': 'application/json', ...authHeaders() };

        // 1. Favorites
        const favRes = await fetch('/api/user/favorites', { headers });
        if (favRes.ok) {
          const { carIds } = await favRes.json();
          if (isMounted && Array.isArray(carIds) && carIds.length > 0) {
            const cloudCars = CARS_DATASET.filter((c) => carIds.includes(c.id));
            setFavoriteCars((prev) => {
              const merged = [...cloudCars];
              prev.forEach((localCar) => {
                if (!merged.some((c) => c.id === localCar.id)) {
                  merged.push(localCar);
                  fetch('/api/user/favorites', {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({ carId: localCar.id, action: 'add' })
                  }).catch(() => {});
                }
              });
              return merged;
            });
          } else if (favoriteCars.length > 0) {
            favoriteCars.forEach((c) => {
              fetch('/api/user/favorites', {
                method: 'POST',
                headers,
                body: JSON.stringify({ carId: c.id, action: 'add' })
              }).catch(() => {});
            });
          }
        }

        // 2. Comparisons
        const compRes = await fetch('/api/user/comparisons', { headers });
        if (compRes.ok) {
          const { carIds } = await compRes.json();
          if (isMounted && Array.isArray(carIds) && carIds.length > 0) {
            const cloudCompCars = CARS_DATASET.filter((c) => carIds.includes(c.id));
            if (cloudCompCars.length > 0) {
              setComparedCars(cloudCompCars);
            }
          }
        }

        // 3. Preferences
        const prefRes = await fetch('/api/user/preferences', { headers });
        if (prefRes.ok) {
          const { preferences } = await prefRes.json();
          if (isMounted && preferences) {
            setUserPreferences(preferences);
          }
        }
      } catch (err) {
        console.error('Error syncing cloud user data:', err);
      }
    }

    loadCloudUserData();

    return () => {
      isMounted = false;
    };
  }, [user]);

  // Persist Favorites & Compare
  useEffect(() => {
    try {
      localStorage.setItem('driveai_favorite_cars', JSON.stringify(favoriteCars));
    } catch (e) {
      console.error(e);
    }
  }, [favoriteCars]);

  useEffect(() => {
    try {
      localStorage.setItem('driveai_compared_cars', JSON.stringify(comparedCars));
    } catch (e) {
      console.error(e);
    }
  }, [comparedCars]);

  // If userPreferences exist on mount, calculate initial scored cars
  useEffect(() => {
    if (userPreferences) {
      const ranked = calculateRecommendations(userPreferences, CARS_DATASET);
      setScoredCars(ranked);
    }
  }, [userPreferences]);

  // Match score map for Explorer
  const matchScoresMap = useMemo(() => {
    const map: Record<string, MatchScoreBreakdown> = {};
    if (scoredCars.length > 0) {
      scoredCars.forEach((sc) => {
        map[sc.car.id] = sc.scores;
      });
    }
    return map;
  }, [scoredCars]);

  // Favorites & Compare toggle handlers
  const handleToggleFavorite = (car: Car) => {
    setFavoriteCars((prev) => {
      const exists = prev.some((c) => c.id === car.id);
      if (user) {
        fetch('/api/user/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...authHeaders() },
          body: JSON.stringify({ carId: car.id, action: exists ? 'remove' : 'add' })
        }).catch(() => {});
      }
      if (exists) {
        return prev.filter((c) => c.id !== car.id);
      } else {
        return [...prev, car];
      }
    });
  };

  const handleToggleCompare = (car: Car) => {
    setComparedCars((prev) => {
      const exists = prev.some((c) => c.id === car.id);
      let updated: Car[];
      if (exists) {
        updated = prev.filter((c) => c.id !== car.id);
      } else {
        if (prev.length >= 4) {
          updated = [...prev.slice(1), car]; // Max 4 cars
        } else {
          updated = [...prev, car];
        }
      }
      if (user) {
        fetch('/api/user/comparisons', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...authHeaders() },
          body: JSON.stringify({ carIds: updated.map((c) => c.id) })
        }).catch(() => {});
      }
      return updated;
    });
  };

  const handleRemoveComparedCar = (carId: string) => {
    setComparedCars((prev) => {
      const updated = prev.filter((c) => c.id !== carId);
      if (user) {
        fetch('/api/user/comparisons', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...authHeaders() },
          body: JSON.stringify({ carIds: updated.map((c) => c.id) })
        }).catch(() => {});
      }
      return updated;
    });
  };

  const handleAddComparedCar = (car: Car) => {
    if (!comparedCars.some((c) => c.id === car.id) && comparedCars.length < 4) {
      setComparedCars((prev) => {
        const updated = [...prev, car];
        if (user) {
          fetch('/api/user/comparisons', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...authHeaders() },
            body: JSON.stringify({ carIds: updated.map((c) => c.id) })
          }).catch(() => {});
        }
        return updated;
      });
    }
  };

  // Flow when submitting AI Finder Wizard
  const handleWizardSubmit = async (prefs: UserPreferences) => {
    setUserPreferences(prefs);
    try {
      localStorage.setItem('driveai_user_preferences', JSON.stringify(prefs));
    } catch (e) {
      console.error(e);
    }
    if (user) {
      fetch('/api/user/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ preferences: prefs })
      }).catch(() => {});
    }

    // Step 1: Calculate deterministic multi-factor scored rankings immediately
    const ranked = calculateRecommendations(prefs, CARS_DATASET);
    setScoredCars(ranked);
    setIsFinderOpen(false);
    setIsProcessingAi(true);

    // Fetch rich Gemini AI explanation in the background
    setIsLoadingAiExplanation(true);
    fetch('/api/ai/recommend-explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        preferences: prefs,
        rankedCars: ranked.slice(0, 4)
      })
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.topPickId) {
          setAiExplanation(data);
        }
      })
      .catch((err) => {
        console.warn('Using default AI explanation:', err);
        if (ranked.length > 0) {
          const top = ranked[0].car;
          setAiExplanation({
            topPickId: top.id,
            topPickReasoning: `The ${top.brand} ${top.model} best matches your ₹${prefs.budgetMinLakh}-${prefs.budgetMaxLakh}L budget with top-tier safety, robust fuel economy, and practical family cabin space.`,
            prosForUser: top.pros.slice(0, 3),
            tradeOffs: top.cons.slice(0, 2),
            runnerUps: ranked.slice(1, 3).map((r) => ({
              carId: r.car.id,
              reason: `Alternative offering distinctive ${r.car.brand} engineering and practical value.`
            })),
            expertAdvice: 'Take a test drive on your typical daily route to confirm suspension ride quality and cabin insulation.'
          });
        }
      })
      .finally(() => {
        setIsLoadingAiExplanation(false);
      });
  };

  // Natural Language Search prompt (e.g., "Safe 7-seater SUV under 18 Lakhs")
  const handleNaturalLanguageSearch = async (promptText: string) => {
    setIsProcessingAi(true);
    try {
      const res = await fetch('/api/ai/extract-requirements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText, textQuery: promptText })
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const prefs: UserPreferences = await res.json();
      setUserPreferences(prefs);
      if (user) {
        fetch('/api/user/preferences', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...authHeaders() },
          body: JSON.stringify({ preferences: prefs })
        }).catch(() => {});
      }
      const ranked = calculateRecommendations(prefs, CARS_DATASET);
      setScoredCars(ranked);
    } catch (err) {
      console.error('Extraction error:', err);
      // Fallback sensible prefs
      const fallbackPrefs: UserPreferences = {
        budgetMinLakh: 8,
        budgetMaxLakh: 20,
        familySize: 5,
        primaryUsage: 'City Commute',
        monthlyKm: 1200,
        preferredFuel: ['Petrol', 'Electric', 'Strong Hybrid'],
        preferredBodyTypes: [],
        preferredTransmission: 'Any',
        priorities: {
          safety: 5,
          mileage: 4,
          performance: 3,
          comfortSpace: 4,
          lowMaintenance: 4,
          featuresTech: 4
        }
      };
      setUserPreferences(fallbackPrefs);
      const ranked = calculateRecommendations(fallbackPrefs, CARS_DATASET);
      setScoredCars(ranked);
    }
  };

  const handleProcessingComplete = () => {
    setIsProcessingAi(false);
    setActiveTab('recommendations');
  };

  const handleAskAiAboutCar = (carName: string) => {
    setChatInitialPrompt(`Is the ${carName} a good choice for my driving needs, and what are its main competitors in India?`);
    setIsChatOpen(true);
  };

  const handleAskAiGeneral = (prompt: string) => {
    setChatInitialPrompt(prompt);
    setIsChatOpen(true);
  };

  const handleOpenFullOwnership = (car: Car) => {
    setOwnershipTargetCar(car);
    setActiveTab('ownership');
  };

  const handleCategorySelect = (category: string) => {
    setInitialCategoryFilter(category);
    setActiveTab('explore');
  };

  return (
    <div className="min-h-screen bg-[#e8edf4] dark:bg-[#0a1020] text-[#101624] dark:text-[#eef2fb] flex flex-col font-['Hanken_Grotesk',system-ui,sans-serif] selection:bg-[#ff5a1f]/20 selection:text-[#ff5a1f]">
      {/* Top Main Navigation */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          if (tab === 'finder') {
            setIsFinderOpen(true);
          } else if (tab === 'cars') {
            setActiveTab('explore');
          } else {
            setActiveTab(tab);
          }
        }}
        onOpenFinder={() => setIsFinderOpen(true)}
        onOpenFavorites={() => {
          setInitialCategoryFilter('favorites');
          setActiveTab('explore');
        }}
        savedCarsCount={favoriteCars.length}
        compareCount={comparedCars.length}
        onOpenChat={() => setIsChatOpen(true)}
        hasRecommendations={scoredCars.length > 0}
        onOpenAuthModal={openAuthModal}
        onOpenEmiCalculator={() => setIsEmiModalOpen(true)}
        onOpenOnRoadPrice={() => setIsOnRoadModalOpen(true)}
        onOpenEvBreakEven={() => setIsEvBreakEvenModalOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {/* VIEW 1: Discover / Landing Page */}
        {activeTab === 'discover' && (
          <LandingPage
            cars={CARS_DATASET}
            favoriteCarIds={favoriteCars.map((c) => c.id)}
            comparedCarIds={comparedCars.map((c) => c.id)}
            onStartFinder={() => setIsFinderOpen(true)}
            onExploreCars={() => setActiveTab('explore')}
            onViewCarDetails={(car) => setSelectedCarForDetails(car)}
            onToggleFavorite={handleToggleFavorite}
            onToggleCompare={handleToggleCompare}
          />
        )}

        {/* VIEW 2: Recommendations Screen */}
        {activeTab === 'recommendations' && (
          <div>
            {scoredCars.length > 0 && userPreferences ? (
              <RecommendationResults
                scoredCars={scoredCars}
                userPreferences={userPreferences}
                aiExplanation={aiExplanation}
                isLoadingAi={isLoadingAiExplanation}
                onViewCarDetails={(car) => setSelectedCarForDetails(car)}
                onCompareCars={(carsToCompare) => {
                  setComparedCars(carsToCompare);
                  setActiveTab('compare');
                }}
                onOpenOwnership={(car) => handleOpenFullOwnership(car)}
                onAskAiAboutCar={handleAskAiAboutCar}
                onResetFinder={() => setIsFinderOpen(true)}
              />
            ) : (
              <div className="py-20 text-center space-y-4 max-w-md mx-auto px-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-600">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 font-['Manrope']">No Recommendations Yet</h3>
                <p className="text-xs text-slate-500">
                  Run the 5-step AI Car Finder or enter a quick prompt to compute your personalized car recommendations.
                </p>
                <button
                  onClick={() => setIsFinderOpen(true)}
                  className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/25 cursor-pointer"
                >
                  Start AI Car Finder
                </button>
              </div>
            )}
          </div>
        )}

        {/* VIEW 2.5: Signed-in User Dashboard */}
        {activeTab === 'dashboard' && (
          <UserDashboard
            favoriteCars={favoriteCars}
            comparedCars={comparedCars}
            scoredCars={scoredCars}
            userPreferences={userPreferences}
            onToggleFavorite={handleToggleFavorite}
            onToggleCompare={handleToggleCompare}
            onViewCarDetails={(car) => setSelectedCarForDetails(car)}
            onStartFinder={() => setIsFinderOpen(true)}
            onExploreCars={() => setActiveTab('explore')}
            onOpenCompare={() => setActiveTab('compare')}
            onViewRecommendations={() => setActiveTab('recommendations')}
            onOpenOwnership={(car) => handleOpenFullOwnership(car)}
          />
        )}

        {/* VIEW 3: Explore All Cars */}
        {activeTab === 'explore' && (
          <CarExplorer
            cars={CARS_DATASET}
            matchScoresMap={matchScoresMap}
            favoriteCarIds={favoriteCars.map((c) => c.id)}
            comparedCarIds={comparedCars.map((c) => c.id)}
            onToggleFavorite={handleToggleFavorite}
            onToggleCompare={handleToggleCompare}
            onViewDetails={(car) => setSelectedCarForDetails(car)}
            onOpenFinder={() => setIsFinderOpen(true)}
            initialCategoryFilter={initialCategoryFilter}
          />
        )}

        {/* VIEW 4: Comparison View */}
        {activeTab === 'compare' && (
          <ComparisonView
            cars={comparedCars}
            allCars={CARS_DATASET}
            onRemoveCar={handleRemoveComparedCar}
            onAddCar={handleAddComparedCar}
            onViewCarDetails={(car) => setSelectedCarForDetails(car)}
            onAskAi={handleAskAiGeneral}
          />
        )}

        {/* VIEW 5: 5-Year TCO Ownership Studio */}
        {activeTab === 'ownership' && (
          <OwnershipStudio
            initialCar={ownershipTargetCar}
            allCars={CARS_DATASET}
            onAskAi={handleAskAiGeneral}
          />
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-[#101624]/10 dark:border-white/10 bg-[#e8edf4]/90 dark:bg-[#0a1020]/90 py-8 text-xs text-[#556078] dark:text-[#9aa6c0] mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-[#101624] dark:bg-white flex items-center justify-center font-bold text-white dark:text-[#101624] text-[10px]">
              <span className="text-[#ff5a1f]">C</span>
            </div>
            <span className="font-['Unbounded',sans-serif] font-bold text-[#101624] dark:text-[#eef2fb]">
              Car<b className="text-[#ff5a1f]">Suggest</b>
            </span>
            <span>— The right car for Indian roads</span>
          </div>

          <div className="flex items-center gap-4 text-[#556078] dark:text-[#9aa6c0]">
            <span>Verified Indian Market Specs (2025-2026)</span>
            <span>•</span>
            <span>Bharat NCAP & ARAI Standards</span>
          </div>
        </div>
      </footer>

      {/* Floating AI Chat Assistant Trigger Button */}
      {!isChatOpen && (
        <button
          id="floating-ai-chat-btn"
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-40 px-5 py-3 rounded-full bg-[#101624] dark:bg-[#eef2fb] hover:bg-black dark:hover:bg-white text-white dark:text-[#101624] font-bold text-xs shadow-2xl hover:shadow-[0_12px_32px_-6px_#ff5a1f] hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-[#ff5a1f]" />
          <span>Ask CarSuggest AI</span>
        </button>
      )}

      {/* AI 5-Step Guided Wizard Modal */}
      <AiFinderWizard
        isOpen={isFinderOpen}
        onClose={() => setIsFinderOpen(false)}
        onSubmit={handleWizardSubmit}
        initialPreferences={userPreferences || undefined}
      />

      {/* AI Processing Animation Screen */}
      {isProcessingAi && (
        <AiProcessingScreen onComplete={handleProcessingComplete} />
      )}

      {/* Car Detailed Specifications Modal */}
      <CarDetailsModal
        car={selectedCarForDetails}
        onClose={() => setSelectedCarForDetails(null)}
        isFavorite={favoriteCars.some((c) => c.id === selectedCarForDetails?.id)}
        isCompared={comparedCars.some((c) => c.id === selectedCarForDetails?.id)}
        onToggleFavorite={handleToggleFavorite}
        onToggleCompare={handleToggleCompare}
        onAskAi={handleAskAiAboutCar}
        onOpenFullOwnership={handleOpenFullOwnership}
      />

      {/* AI Conversational Assistant Drawer */}
      <AiChatDrawer
        isOpen={isChatOpen}
        onClose={() => {
          setIsChatOpen(false);
          setChatInitialPrompt('');
        }}
        allCars={CARS_DATASET}
        initialPrompt={chatInitialPrompt}
        onViewCarDetails={(car) => {
          setSelectedCarForDetails(car);
          setIsChatOpen(false);
        }}
      />

      {/* Car Loan & EMI Calculator Modal */}
      <EmiModal
        isOpen={isEmiModalOpen}
        onClose={() => setIsEmiModalOpen(false)}
      />

      {/* State-Wise On-Road Price Estimator Modal */}
      <OnRoadPriceModal
        isOpen={isOnRoadModalOpen}
        onClose={() => setIsOnRoadModalOpen(false)}
      />

      {/* EV vs Petrol Break-Even Simulator Modal */}
      <EvBreakEvenModal
        isOpen={isEvBreakEvenModalOpen}
        onClose={() => setIsEvBreakEvenModalOpen(false)}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialView={authModalView}
      />
    </div>
  );
}
