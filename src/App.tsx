import { useState } from 'react';
import { MobileFrame } from './components/MobileFrame';
import { BottomNav } from './components/BottomNav';
import type { TabType } from './components/BottomNav';
import { Dashboard } from './components/Dashboard';
import { Scanner } from './components/Scanner';
import { LabAnalyzer } from './components/LabAnalyzer';
import { StackManager } from './components/StackManager';
import { CalendarView } from './components/CalendarView';
import { DigitalTwin } from './components/DigitalTwin';
import { useAppStore } from './hooks/useAppStore';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const {
    supplements,
    labs,
    profile,
    adherence,
    addSupplement,
    deleteSupplement,
    toggleSupplementActive,
    completeDose,
    uncompleteDose,
    addLabTest
  } = useAppStore();

  const handleTabClick = (tab: TabType) => {
    // If they click the center FAB (stack/scanner), we could open scanner directly or open stack
    // Let's open Stack tab, but you can also use isScannerOpen state if you want it to be a modal
    setActiveTab(tab);
  };

  const renderActiveScreen = () => {
    // If scanner modal is forced open
    if (isScannerOpen) {
      return <Scanner addSupplement={addSupplement} onClose={() => setIsScannerOpen(false)} />;
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            supplements={supplements}
            labs={labs}
            profile={profile}
            adherence={adherence}
            completeDose={completeDose}
            uncompleteDose={uncompleteDose}
          />
        );
      case 'calendar':
        return <CalendarView supplements={supplements} adherence={adherence} />;
      case 'labs':
        return (
          <LabAnalyzer
            labs={labs}
            addLabTest={addLabTest}
            addSupplement={addSupplement}
          />
        );
      case 'stack':
        return (
          <StackManager
            supplements={supplements}
            addSupplement={addSupplement}
            deleteSupplement={deleteSupplement}
            toggleSupplementActive={toggleSupplementActive}
            onOpenScanner={() => setIsScannerOpen(true)}
          />
        );
      case 'twin':
        return <DigitalTwin profile={profile} labs={labs} />;
      default:
        return (
          <Dashboard
            supplements={supplements}
            labs={labs}
            profile={profile}
            adherence={adherence}
            completeDose={completeDose}
            uncompleteDose={uncompleteDose}
          />
        );
    }
  };

  return (
    <MobileFrame>
      {renderActiveScreen()}
      <BottomNav currentTab={activeTab} setTab={handleTabClick} />
    </MobileFrame>
  );
}

export default App;
