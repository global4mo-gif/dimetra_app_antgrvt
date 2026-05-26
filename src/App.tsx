import { useState } from 'react';
import { MobileFrame } from './components/MobileFrame';
import { BottomNav } from './components/BottomNav';
import type { TabType } from './components/BottomNav';
import { Dashboard } from './components/Dashboard';
import { Scanner } from './components/Scanner';
import { LabAnalyzer } from './components/LabAnalyzer';
import { StackManager } from './components/StackManager';
import { ActivityLog } from './components/ActivityLog';
import { CommunityProtocols } from './components/CommunityProtocols';
import { useAppStore } from './hooks/useAppStore';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

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

  const renderActiveScreen = () => {
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
      case 'scanner':
        return <Scanner addSupplement={addSupplement} />;
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
          />
        );
      case 'community':
        return <CommunityProtocols addSupplement={addSupplement} />;
      case 'activity':
        return (
          <ActivityLog
            supplements={supplements}
            adherence={adherence}
          />
        );
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
      <BottomNav currentTab={activeTab} setTab={setActiveTab} />
    </MobileFrame>
  );
}

export default App;
