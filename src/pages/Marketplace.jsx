import React, { useState, useEffect } from 'react';
import { Button, Container, SimpleGrid } from '@chakra-ui/react';
import { CloudOff, PackageOpen, Plus, SearchX } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import SearchInput from '../components/SearchInput';
import FilterChips from '../components/FilterChips';
import EmptyState from '../components/EmptyState';
import ItemCard, { ItemCardSkeleton } from '../components/ItemCard';
import { ITEM_CATEGORIES } from '../constants';

const API_URL = 'https://h7dv27961g.execute-api.us-east-1.amazonaws.com/items';
const GRID_COLUMNS = { base: 2, md: 3, lg: 4 };
const GRID_SPACING = { base: 3, md: 6 };

// `refreshKey` changes after you post an item, which reloads the list
const Marketplace = ({ refreshKey, onSellItem }) => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');

  // Fetch listings from AWS (API Gateway + DynamoDB)
  useEffect(() => {
    let ignore = false; // Stops a slow, older request from overwriting a newer one

    const fetchItems = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        if (!ignore) {
          setItems(data);
          setHasError(false);
        }
      } catch (error) {
        console.error('Error fetching items:', error);
        if (!ignore) setHasError(true);
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };

    fetchItems();
    return () => { ignore = true; };
  }, [refreshKey, retryCount]);

  const retry = () => {
    setIsLoading(true);
    setRetryCount((count) => count + 1);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCategory('All');
  };

  // Newest listings first (item ids are creation timestamps), then apply search + category
  const query = searchTerm.trim().toLowerCase();
  const filteredItems = [...items]
    .sort((a, b) => Number(b.id) - Number(a.id))
    .filter((item) => {
      const matchesSearch = !query || [item.title, item.description].some((text) => text?.toLowerCase().includes(query));
      const matchesCategory = category === 'All' || item.category === category;
      return matchesSearch && matchesCategory;
    });

  let content;
  if (isLoading) {
    content = (
      <SimpleGrid columns={GRID_COLUMNS} spacing={GRID_SPACING}>
        {Array.from({ length: 8 }, (_, i) => <ItemCardSkeleton key={i} />)}
      </SimpleGrid>
    );
  } else if (hasError) {
    content = (
      <EmptyState
        icon={CloudOff}
        title="Couldn't load listings"
        description="The marketplace server didn't respond. Check your connection and try again."
        action={<Button onClick={retry}>Try again</Button>}
      />
    );
  } else if (items.length === 0) {
    content = (
      <EmptyState
        icon={PackageOpen}
        title="Nothing for sale yet"
        description="List something you no longer need and it'll show up here."
        action={<Button colorScheme="brand" leftIcon={<Plus size={18} />} onClick={onSellItem}>Sell item</Button>}
      />
    );
  } else if (filteredItems.length === 0) {
    content = (
      <EmptyState
        icon={SearchX}
        title="No matching items"
        description="Try a different search or category."
        action={<Button onClick={clearFilters}>Clear filters</Button>}
      />
    );
  } else {
    content = (
      <SimpleGrid columns={GRID_COLUMNS} spacing={GRID_SPACING}>
        {filteredItems.map((item) => <ItemCard key={item.id} item={item} />)}
      </SimpleGrid>
    );
  }

  return (
    <Container maxW="container.xl" px={{ base: 4, md: 8 }} py={{ base: 8, md: 12 }}>
      <PageHeader
        title="Campus Marketplace"
        description="Textbooks, gadgets and hostel essentials from students on campus."
        action={<Button w="full" colorScheme="brand" leftIcon={<Plus size={18} />} onClick={onSellItem}>Sell item</Button>}
      >
        <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Search items" />
        <FilterChips options={['All', ...ITEM_CATEGORIES]} value={category} onChange={setCategory} label="Filter by category" />
      </PageHeader>

      {content}
    </Container>
  );
};

export default Marketplace;
