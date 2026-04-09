import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider, useDisclosure } from '@chakra-ui/react';

// Import your components
import Navbar from './components/Navbar';
import SellModal from './components/SellModal';
import Marketplace from './pages/Marketplace';
import ProductDetails from './pages/ProductDetails'; // 1. UNCOMMENTED THIS

function App() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <ChakraProvider>
      <Router>
        <Navbar onOpen={onOpen} />
        
        <Routes>
          <Route path="/" element={<Marketplace />} />
          {/* 2. UNCOMMENTED THIS LINE BELOW */}
          <Route path="/product/:id" element={<ProductDetails />} />
        </Routes>

        <SellModal isOpen={isOpen} onClose={onClose} />
      </Router>
    </ChakraProvider>
  );
}

export default App;