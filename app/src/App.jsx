import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ContactIndexProvider } from './context/ContactIndexContext'
import Executive from './pages/Executive'
import OperationsOverview from './pages/OperationsOverview'
import Agent from './pages/Agent'
import ContactSearch from './pages/ContactSearch'
import QualityAnalysis from './pages/QualityAnalysis'

export default function App() {
  return (
    <ContactIndexProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Executive />} />
          <Route path="/quality" element={<QualityAnalysis />} />
          <Route path="/operations" element={<OperationsOverview />} />
          <Route path="/teamlead" element={<Navigate to="/operations" replace />} />
          <Route path="/ccm" element={<Navigate to="/operations" replace />} />
          <Route path="/agent" element={<Agent />} />
          <Route path="/agent/:agentSlug" element={<Agent />} />
          <Route path="/search" element={<ContactSearch />} />
        </Routes>
      </BrowserRouter>
    </ContactIndexProvider>
  )
}
