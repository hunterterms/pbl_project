import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDisclosure } from '@chakra-ui/react';

// Import your components
import AuthProvider from './auth/AuthProvider';
import Navbar from './components/Navbar';
import SellModal from './components/SellModal';
import CreateEventModal from './components/CreateEventModal';
import StartGroupModal from './components/StartGroupModal';
import Marketplace from './pages/Marketplace';
import ProductDetails from './pages/ProductDetails';
import Events from './pages/Events'; // 1. Import Events
import Groups from './pages/Groups'; // 2. Import Groups
import Profile from './pages/Profile';
import useLocalStorage from './hooks/useLocalStorage';

function App() {
  const sellModal = useDisclosure();
  const eventModal = useDisclosure();
  const groupModal = useDisclosure();

  // The AWS API has no /events or /groups routes yet, so the ones you create are saved in the browser
  const [createdEvents, setCreatedEvents] = useLocalStorage('unihub-events', []);
  const [createdGroups, setCreatedGroups] = useLocalStorage('unihub-groups', []);

  // ChakraProvider (with the UniHub theme) is set up in main.jsx
  return (
    <AuthProvider>
      <Router>
        <Navbar
          onSellItem={sellModal.onOpen}
          onCreateEvent={eventModal.onOpen}
          onStartGroup={groupModal.onOpen}
        />

        <Routes>
          <Route path="/" element={<Marketplace />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/events" element={<Events createdEvents={createdEvents} onCreateEvent={eventModal.onOpen} />} /> {/* 3. Add Events Route */}
          <Route path="/groups" element={<Groups createdGroups={createdGroups} onStartGroup={groupModal.onOpen} />} /> {/* 4. Add Groups Route */}
          <Route
            path="/profile"
            element={
              <Profile
                createdEvents={createdEvents}
                createdGroups={createdGroups}
                onCreateEvent={eventModal.onOpen}
                onStartGroup={groupModal.onOpen}
              />
            }
          />
        </Routes>

        <SellModal isOpen={sellModal.isOpen} onClose={sellModal.onClose} />
        <CreateEventModal
          isOpen={eventModal.isOpen}
          onClose={eventModal.onClose}
          onCreate={(event) => setCreatedEvents((prev) => [event, ...prev])}
        />
        <StartGroupModal
          isOpen={groupModal.isOpen}
          onClose={groupModal.onClose}
          onCreate={(group) => setCreatedGroups((prev) => [group, ...prev])}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;