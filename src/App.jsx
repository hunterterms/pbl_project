import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider, useDisclosure } from '@chakra-ui/react';

// Import your components
import Navbar from './components/Navbar';
import SellModal from './components/SellModal';
import CreateEventModal from './components/CreateEventModal';
import StartGroupModal from './components/StartGroupModal';
import Marketplace from './pages/Marketplace';
import ProductDetails from './pages/ProductDetails';
import Events from './pages/Events'; // 1. Import Events
import Groups from './pages/Groups'; // 2. Import Groups
import useLocalStorage from './hooks/useLocalStorage';

function App() {
  const sellModal = useDisclosure();
  const eventModal = useDisclosure();
  const groupModal = useDisclosure();

  // The AWS API has no /events or /groups routes yet, so the ones you create are saved in the browser
  const [createdEvents, setCreatedEvents] = useLocalStorage('unihub-events', []);
  const [createdGroups, setCreatedGroups] = useLocalStorage('unihub-groups', []);

  return (
    <ChakraProvider>
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
    </ChakraProvider>
  );
}

export default App;