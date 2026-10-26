import React, { useState } from 'react';
import { Box, Button, Container, Heading, SimpleGrid } from '@chakra-ui/react';
import { CalendarPlus, CalendarX2, SearchX } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import SearchInput from '../components/SearchInput';
import FilterChips from '../components/FilterChips';
import EmptyState from '../components/EmptyState';
import EventCard from '../components/EventCard';
import { EVENT_CATEGORIES } from '../constants';
import { byDate, isPastEvent } from '../utils/events';

// MOCK DATA: We will replace this with AWS fetch later
const mockEvents = [
  { id: '1', title: 'Computer Science Hackathon', date: '2026-10-15', startTime: '09:00', location: 'Innovation Lab', category: 'Academic', attendees: 45 },
  { id: '2', title: 'Campus Music Festival', date: '2026-10-20', startTime: '18:00', location: 'Main Quad', category: 'Social', attendees: 120 },
];

const GRID_COLUMNS = { base: 1, md: 2, xl: 3 };

export default function Events({ createdEvents = [], onCreateEvent }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');

  const myEventIds = new Set(createdEvents.map((event) => event.id));
  const query = searchTerm.trim().toLowerCase();
  const isFiltering = query !== '' || category !== 'All';

  const events = [...createdEvents, ...mockEvents].filter((event) => {
    const matchesSearch = !query || [event.title, event.location, event.hostedBy, event.description]
      .some((text) => text?.toLowerCase().includes(query));
    const matchesCategory = category === 'All' || event.category === category;
    return matchesSearch && matchesCategory;
  });

  // Soonest upcoming events first; past events go below, most recent first
  const upcoming = events.filter((event) => !isPastEvent(event)).sort(byDate);
  const past = events.filter(isPastEvent).sort((a, b) => byDate(b, a));

  const clearFilters = () => {
    setSearchTerm('');
    setCategory('All');
  };

  let upcomingContent;
  if (upcoming.length > 0) {
    upcomingContent = (
      <SimpleGrid columns={GRID_COLUMNS} spacing={6}>
        {upcoming.map((event) => <EventCard key={event.id} event={event} isMine={myEventIds.has(event.id)} />)}
      </SimpleGrid>
    );
  } else if (isFiltering) {
    upcomingContent = (
      <EmptyState
        icon={SearchX}
        title="No upcoming events match"
        description="Try a different search or category."
        action={<Button onClick={clearFilters}>Clear filters</Button>}
      />
    );
  } else {
    upcomingContent = (
      <EmptyState
        icon={CalendarX2}
        title="No upcoming events"
        description="Nothing's planned yet. Create one and it'll show up here."
        action={<Button colorScheme="brand" leftIcon={<CalendarPlus size={18} />} onClick={onCreateEvent}>Create event</Button>}
      />
    );
  }

  return (
    <Container maxW="container.xl" px={{ base: 4, md: 8 }} py={{ base: 8, md: 12 }}>
      <PageHeader
        title="Campus Events"
        description="Workshops, fests and meetups happening around campus."
        action={<Button w="full" colorScheme="brand" leftIcon={<CalendarPlus size={18} />} onClick={onCreateEvent}>Create event</Button>}
      >
        <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Search events" />
        <FilterChips options={['All', ...EVENT_CATEGORIES]} value={category} onChange={setCategory} label="Filter by category" />
      </PageHeader>

      {upcomingContent}

      {past.length > 0 && (
        <Box as="section" mt={14}>
          <Heading as="h2" size="md" mb={5} color="fg.muted">Past events</Heading>
          <SimpleGrid columns={GRID_COLUMNS} spacing={6}>
            {past.map((event) => <EventCard key={event.id} event={event} isPast isMine={myEventIds.has(event.id)} />)}
          </SimpleGrid>
        </Box>
      )}
    </Container>
  );
}
