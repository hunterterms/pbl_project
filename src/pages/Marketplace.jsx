import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Image,
  Text,
  Stack,
  Badge,
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  useColorModeValue,
  Spinner, // Added Spinner for loading state
} from '@chakra-ui/react';
import { Search, Filter, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Marketplace = () => {
  // 1. New State for Cloud Data
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');

    const cardBg = useColorModeValue('white', 'gray.800');
  // 2. Fetch Data from AWS DynamoDB
  useEffect(() => {
    const fetchItems = async () => {
      try {
        // Using the same URL you put in your SellModal
        const API_URL = 'https://h7dv27961g.execute-api.us-east-1.amazonaws.com/items';
        const response = await fetch(API_URL);
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setIsLoading(false); // Stop loading regardless of success/fail
      }
    };

    fetchItems();
  }, []);

  // 3. Filter Logic (now uses 'items' state instead of static 'ITEMS')
  const filteredItems = items.filter((item) => {
    const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'All' || item.category === category;
    return matchesSearch && matchesCategory;
  });



  // 4. Show a loading screen while fetching from AWS
  if (isLoading) {
    return (
      <Flex minH="100vh" align="center" justify="center" direction="column" gap={4}>
        <Spinner size="xl" color="blue.500" thickness="4px" />
        <Text color="gray.500">Loading items from cloud...</Text>
      </Flex>
    );
  }

  return (
    <Box minH="100vh" py={8} bg={useColorModeValue('gray.50', 'gray.900')}>
      <Container maxW="container.xl">
        
        {/* Header Section */}
        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align="center" mb={8} gap={4}>
          <Heading size="lg">Campus Marketplace</Heading>
          
          {/* Search & Filter Controls */}
          <Flex gap={2} w={{ base: '100%', md: 'auto' }}>
            <InputGroup maxW="300px">
              <InputLeftElement pointerEvents="none">
                <Search size={18} color="gray" />
              </InputLeftElement>
              <Input 
                placeholder="Search items..." 
                bg={cardBg} 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
            
            <Select 
              w="150px" 
              bg={cardBg} 
              icon={<Filter size={16} />}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Books">Books</option>
              <option value="Furniture">Furniture</option>
            </Select>
          </Flex>
        </Flex>

        {/* Product Grid */}
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
          {filteredItems.map((item) => (
            <Box
              key={item.id}
              bg={cardBg}
              rounded="lg"
              shadow="sm"
              overflow="hidden"
              borderWidth="1px"
              transition="all 0.2s"
              _hover={{ transform: 'translateY(-4px)', shadow: 'md' }}
            >
              {/* Image Link */}
              <Box h="200px" position="relative" as={Link} to={`/product/${item.id}`}>
                <Image 
                  src={item.image || 'https://via.placeholder.com/400?text=No+Image'} 
                  alt={item.title} 
                  w="100%" 
                  h="100%" 
                  objectFit="cover" 
                />
                <Badge 
                  position="absolute" 
                  top={2} 
                  right={2} 
                  colorScheme={item.category === 'Electronics' ? 'blue' : 'green'}
                >
                  {item.category}
                </Badge>
              </Box>

              <Box p={4}>
                <Stack spacing={1} mb={3}>
                  <Text fontSize="sm" color="gray.500">{item.condition || 'Good'}</Text>
                  
                  {/* Title Link */}
                  <Heading 
                    size="md" 
                    noOfLines={1} 
                    as={Link} 
                    to={`/product/${item.id}`}
                    _hover={{ color: 'blue.500', textDecoration: 'underline' }}
                  >
                    {item.title}
                  </Heading>
                  
                  <Text fontSize="lg" fontWeight="bold" color="blue.600">
                    ₹{item.price}
                  </Text>
                </Stack>

                <Flex justify="space-between" align="center">
                  <Text fontSize="xs" color="gray.400">
                    {/* Safe navigation with ?. in case seller doesn't exist */}
                    Seller: {item.seller?.name || 'Student'}
                  </Text>
                  <Button size="sm" colorScheme="blue" variant="outline" leftIcon={<ShoppingCart size={16} />}>
                    Buy
                  </Button>
                </Flex>
              </Box>
            </Box>
          ))}
        </SimpleGrid>

        {filteredItems.length === 0 && (
          <Flex justify="center" align="center" h="200px" direction="column">
            <Text fontSize="xl" color="gray.500">No items found.</Text>
          </Flex>
        )}

      </Container>
    </Box>
  );
};

export default Marketplace;