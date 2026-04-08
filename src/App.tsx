import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProductExpertChat from './pages/ProductExpertChat';
import AuditTrail from './pages/AuditTrail';
import MeetingSchedule from './pages/MeetingSchedule';
import BattleCard from './pages/BattleCard';
import MicroTrainingQuiz from './pages/MicroTrainingQuiz';
import TrainingScorecard from './pages/TrainingScorecard';
import VoiceRecap from './pages/VoiceRecap';
import StructuredRecap from './pages/StructuredRecap';
import MeetingHistory from './pages/MeetingHistory';
import Notifications from './pages/Notifications';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<AppShell />}>
          <Route index element={<Dashboard />} />
          {/* Product Expert */}
          <Route path="product-expert" element={<Navigate to="/product-expert/chat" replace />} />
          <Route path="product-expert/chat" element={<ProductExpertChat />} />
          <Route path="product-expert/audit" element={<AuditTrail />} />
          {/* Pre-Meeting — specific routes before param-based */}
          <Route path="sales-companion/pre-meeting" element={<Navigate to="/sales-companion/pre-meeting/meetings" replace />} />
          <Route path="sales-companion/pre-meeting/meetings" element={<MeetingSchedule />} />
          <Route path="sales-companion/pre-meeting/quiz" element={<MicroTrainingQuiz />} />
          <Route path="sales-companion/pre-meeting/scorecards" element={<TrainingScorecard />} />
          <Route path="sales-companion/pre-meeting/:meetingId" element={<BattleCard />} />
          {/* Post-Meeting */}
          <Route path="sales-companion/post-meeting" element={<Navigate to="/sales-companion/post-meeting/history" replace />} />
          <Route path="sales-companion/post-meeting/history" element={<MeetingHistory />} />
          <Route path="sales-companion/post-meeting/recap" element={<VoiceRecap />} />
          <Route path="sales-companion/post-meeting/recap/:meetingId" element={<VoiceRecap />} />
          <Route path="sales-companion/post-meeting/structured-recap" element={<StructuredRecap />} />
          <Route path="sales-companion/post-meeting/:meetingId" element={<MeetingHistory />} />
          {/* Reports */}
          <Route path="reports" element={<Reports />} />
          {/* Notifications */}
          <Route path="notifications" element={<Notifications />} />
          {/* Settings */}
          <Route path="settings" element={<Settings />} />
          {/* Fallbacks */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
