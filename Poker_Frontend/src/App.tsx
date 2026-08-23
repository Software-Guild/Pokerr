import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Hero } from './Hero';
import { FeaturesSection } from './sections/FeaturesSection';
import { PlayModesSection } from './sections/PlayModesSection';
import { PokerRulesSection } from './sections/PokerRulesSection';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] selection:bg-white/20 text-white font-sans relative">
      <Navbar />
      <Hero />
      <FeaturesSection />
      <PlayModesSection />
      <PokerRulesSection />
      <Footer />
    </div>
  );
}

export default App;
