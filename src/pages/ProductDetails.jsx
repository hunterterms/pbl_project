import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  AspectRatio, Avatar, Badge, Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Container, Flex,
  Heading, HStack, IconButton, Image, SimpleGrid, Skeleton, SkeletonText, Stack, Text, useToast
} from '@chakra-ui/react';
import { ChevronRight, Heart, MessageCircle, SearchX, Share2 } from 'lucide-react';
import EmptyState from '../components/EmptyState';
import PriceTag from '../components/PriceTag';
import { CATEGORY_COLORS } from '../constants';
import { formatDate } from '../utils/format';

const API_URL = 'https://h7dv27961g.execute-api.us-east-1.amazonaws.com/items';

// Same two-column shape as the real page, shown while the item loads
const ProductSkeleton = () => (
  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 6, md: 12 }}>
    <AspectRatio ratio={4 / 3}><Skeleton borderRadius="xl" /></AspectRatio>
    <Stack spacing={5}>
      <Skeleton h="20px" w="140px" />
      <Skeleton h="44px" />
      <Skeleton h="52px" w="160px" />
      <SkeletonText noOfLines={3} spacing={3} />
    </Stack>
  </SimpleGrid>
);

export default function ProductDetails() {
  const { id } = useParams();
  const toast = useToast();
  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
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
    } catch {
      navigator.clipboard.writeText(window.location.href);
      toast({ title: "Link copied", status: "info", duration: 2000 });
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

  let content;
  if (isLoading) {
    content = <ProductSkeleton />;
  } else if (!item) {
    content = (
      <EmptyState
        icon={SearchX}
        title="Item not found"
        description="It may have been sold or removed by the seller."
        action={<Button as={RouterLink} to="/" colorScheme="brand">Back to marketplace</Button>}
      />
    );
  } else {
    content = (
      <>
        <Breadcrumb spacing="8px" separator={<ChevronRight size={14} />} mb={6} fontSize="sm" color="fg.muted">
          <BreadcrumbItem><BreadcrumbLink as={RouterLink} to="/">Marketplace</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbItem isCurrentPage><BreadcrumbLink color="fg.default">{item.title}</BreadcrumbLink></BreadcrumbItem>
        </Breadcrumb>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 6, md: 12 }} alignItems="start">
          <AspectRatio ratio={4 / 3} borderRadius="xl" overflow="hidden" bg="bg.subtle">
            <Image src={item.image} alt={item.title} objectFit="cover" />
          </AspectRatio>

          <Stack spacing={6}>
            <Box>
              <HStack spacing={2}>
                <Badge colorScheme={CATEGORY_COLORS[item.category] || 'gray'}>{item.category}</Badge>
                {item.condition && <Badge variant="outline" colorScheme="gray">{item.condition}</Badge>}
              </HStack>
              <Heading as="h1" mt={3} fontSize={{ base: '3xl', md: '4xl' }} lineHeight="1.15">{item.title}</Heading>
              <PriceTag price={item.price} size="lg" mt={5} />
            </Box>

            <Text fontSize="lg" lineHeight="tall">{item.description}</Text>

            <Flex align="center" gap={4} p={4} bg="bg.subtle" borderRadius="xl">
              <Avatar src={item.seller?.avatar || `https://i.pravatar.cc/150?u=${item.id}`} name={item.seller?.name} />
              <Box>
                <Text fontWeight="700">{item.seller?.name || "Student seller"}</Text>
                {item.postedDate && <Text fontSize="sm" color="fg.muted">Posted on {formatDate(item.postedDate)}</Text>}
              </Box>
            </Flex>

            <HStack spacing={3}>
              <Button flex={1} colorScheme="brand" leftIcon={<MessageCircle size={18} />}>Contact seller</Button>
              <Button
                variant="outline"
                colorScheme="pink"
                leftIcon={<Heart size={18} fill={isSaved ? "currentColor" : "none"} />}
                onClick={handleSave}
                aria-pressed={isSaved}
              >
                {isSaved ? "Saved" : "Save"}
              </Button>
              <IconButton variant="outline" icon={<Share2 size={18} />} aria-label="Share" onClick={handleShare} />
            </HStack>
          </Stack>
        </SimpleGrid>
      </>
    );
  }

  return (
    <Container maxW="container.xl" px={{ base: 4, md: 8 }} py={{ base: 6, md: 10 }}>
      {content}
    </Container>
  );
}
