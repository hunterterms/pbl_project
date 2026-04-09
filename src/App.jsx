import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider, useDisclosure } from '@chakra-ui/react';

// Import your components
import Navbar from './components/Navbar';
import SellModal from './components/SellModal';
import Marketplace from './pages/Marketplace';
import ProductDetails from './pages/ProductDetails';
import Events from './pages/Events'; // 1. Import Events
import Groups from './pages/Groups'; // 2. Import Groups

function App() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <ChakraProvider>
      <Router>
        <Navbar onOpen={onOpen} />
        
        <Routes>
          <Route path="/" element={<Marketplace />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/events" element={<Events />} /> {/* 3. Add Events Route */}
          <Route path="/groups" element={<Groups />} /> {/* 4. Add Groups Route */}
        </Routes>

        <SellModal isOpen={isOpen} onClose={onClose} />
      </Router>
    </ChakraProvider>
  );
}

export default App;