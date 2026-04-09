import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Box, Container, Stack, Text, Image, Flex, VStack, Button, Heading,
  SimpleGrid, StackDivider, useColorModeValue, Avatar, Badge, Breadcrumb,
  BreadcrumbItem, BreadcrumbLink, Spinner, useToast
} from '@chakra-ui/react';
import { MessageCircle, Share2, Heart, ChevronRight } from 'lucide-react';

export default function ProductDetails() {
  const { id } = useParams();
  const toast = useToast();
  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const API_URL = 'https://h7dv27961g.execute-api.us-east-1.amazonaws.com/items';
        const response = await fetch(API_URL);
        const data = await response.json();
        const foundItem = data.find((p) => String(p.id).trim() === String(id).trim());
        setItem(foundItem);

        // Check if item was already saved in LocalStorage
        const saved = JSON.parse(localStorage.getItem('favorites') || '[]');
        setIsSaved(saved.includes(id));

      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const handleShare = async () => {
    try {
      await navigator.share({ title: item.title, url: window.location.href });
    } catch (err) {
      navigator.clipboard.writeText(window.location.href);
      toast({ title: "Link copied!", status: "info", duration: 2000 });
    }
  };

  const handleSave = () => {
    const saved = JSON.parse(localStorage.getItem('favorites') || '[]');
    let updated;
    if (isSaved) {
      updated = saved.filter(favId => favId !== id);
      toast({ title: "Removed from favorites", status: "warning" });
    } else {
      updated = [...saved, id];
      toast({ title: "Saved to favorites", status: "success" });
    }
    localStorage.setItem('favorites', JSON.stringify(updated));
    setIsSaved(!isSaved);
  };

  // Helper function to format the date to DD/MM/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    const date = new Date(dateString);
    
    // Fallback just in case the string isn't a valid date format
    if (isNaN(date.getTime())) return dateString; 

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  if (isLoading) return <Flex minH="100vh" align="center" justify="center"><Spinner size="xl" /></Flex>;
  if (!item) return <Container py={20} textAlign="center"><Heading>Item not found</Heading></Container>;

  return (
    <Container maxW={'7xl'} py={10}>
      <Breadcrumb spacing="8px" separator={<ChevronRight size={14} />} mb={6}>
        <BreadcrumbItem><BreadcrumbLink as={RouterLink} to="/">Home</BreadcrumbLink></BreadcrumbItem>
        <BreadcrumbItem isCurrentPage><BreadcrumbLink>{item.title}</BreadcrumbLink></BreadcrumbItem>
      </Breadcrumb>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={10}>
        <Image rounded={'lg'} src={item.image} alt={item.title} fit={'cover'} w={'100%'} h={'500px'} boxShadow="lg" />
        <Stack spacing={6}>
          <Box>
            <Heading size="2xl">{item.title}</Heading>
            <Text fontSize="3xl" fontWeight="bold" color="blue.500" mt={2}>₹{item.price}</Text>
          </Box>
          <Stack divider={<StackDivider />} spacing={4}>
            <Text fontSize="lg" color="gray.600">{item.description}</Text>
            <Box bg="gray.50" p={4} rounded="md">
              <Flex align="center">
                <Avatar src={`https://i.pravatar.cc/150?u=${item.id}`} mr={4} />
                <Box>
                  <Text fontWeight="bold">{item.seller?.name || "Student Seller"}</Text>
                  {/* Applied the formatDate function here */}
                  <Text fontSize="xs" color="gray.500">Posted on {formatDate(item.postedDate)}</Text>
                </Box>
              </Flex>
            </Box>
          </Stack>
          <Stack direction="row" spacing={4}>
            <Button flex={2} colorScheme="blue" leftIcon={<MessageCircle />}>Contact Seller</Button>
            <Button flex={1} variant="outline" colorScheme="pink" leftIcon={<Heart fill={isSaved ? "currentColor" : "none"} />} onClick={handleSave}>
              {isSaved ? "Saved" : "Save"}
            </Button>
            <Button variant="ghost" onClick={handleShare}><Share2 /></Button>
          </Stack>
        </Stack>
      </SimpleGrid>
    </Container>
  );
}