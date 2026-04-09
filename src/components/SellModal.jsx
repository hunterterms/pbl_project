import React, { useState } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  Button, FormControl, FormLabel, Input, Select, Textarea, useToast
} from '@chakra-ui/react';

export default function SellModal({ isOpen, onClose }) {
  const toast = useToast();
  
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [description, setDescription] = useState(''); // Added state
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title || !price || !description) {
      toast({ title: "Error", description: "Please fill in all fields.", status: "error" });
      return;
    }

    setIsLoading(true);

    const itemData = { title, price, category, description }; // Added description

    try {
      const API_URL = 'https://h7dv27961g.execute-api.us-east-1.amazonaws.com/items'; 
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData)
      });

      if (!response.ok) throw new Error('Network response was not ok');

      toast({
        title: "Item Listed!",
        description: "Your item is now live.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Reset Form
      setTitle('');
      setPrice('');
      setCategory('Electronics');
      setDescription('');
      onClose();
      window.location.reload(); 

    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to post item.", status: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Sell an Item</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={4} isRequired>
            <FormLabel>Item Title</FormLabel>
            <Input placeholder="e.g. Calculus Textbook" value={title} onChange={(e) => setTitle(e.target.value)} />
          </FormControl>

          <FormControl mb={4} isRequired>
            <FormLabel>Price ($)</FormLabel>
            <Input type="number" placeholder="45" value={price} onChange={(e) => setPrice(e.target.value)} />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Category</FormLabel>
            <Select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="Books">Books</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Furniture">Furniture</option>
            </Select>
          </FormControl>

          <FormControl mb={4} isRequired>
            <FormLabel>Description</FormLabel>
            <Textarea 
              placeholder="Tell us about the item's condition..." 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>Cancel</Button>
          <Button colorScheme="blue" onClick={handleSubmit} isLoading={isLoading}>Post Item</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}