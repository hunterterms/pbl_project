import React from 'react';
import {
  Box, Container, Heading, SimpleGrid, Text, Stack, Badge, Button, Flex, Spacer, useColorModeValue
} from '@chakra-ui/react';
import { Calendar, MapPin, Clock, User } from 'lucide-react';

// Dates are stored as YYYY-MM-DD and times as 24-hour HH:MM (the formats date/time inputs give us)
const formatDate = (date) =>
  new Date(`${date}T00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const formatTime = (time) =>
  new Date(`1970-01-01T${time}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

export default function Events({ createdEvents = [], onCreateEvent }) {
  const cardBg = useColorModeValue('white', 'gray.800');

  // MOCK DATA: We will replace this with AWS fetch later
  const mockEvents = [
    { id: '1', title: 'Computer Science Hackathon', date: '2026-10-15', startTime: '09:00', location: 'Innovation Lab', category: 'Academic', attendees: 45 },
    { id: '2', title: 'Campus Music Festival', date: '2026-10-20', startTime: '18:00', location: 'Main Quad', category: 'Social', attendees: 120 },
  ];

  // Events you create show up first
  const events = [...createdEvents, ...mockEvents];

  return (
    <Box minH="100vh" py={8} bg={useColorModeValue('gray.50', 'gray.900')}>
      <Container maxW="container.xl">
        <Flex justify="space-between" align="center" mb={8}>
          <Heading size="lg">Campus Events</Heading>
          <Button colorScheme="blue" onClick={onCreateEvent}>Create Event</Button>
        </Flex>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {events.map(event => (
            <Flex key={event.id} direction="column" bg={cardBg} p={5} rounded="lg" shadow="sm" borderWidth="1px">
              <Flex gap={2} mb={3}>
                <Badge colorScheme="purple">{event.category}</Badge>
                {event.entryFee === 0 && <Badge colorScheme="green">Free</Badge>}
                {event.entryFee > 0 && <Badge colorScheme="orange">₹{event.entryFee}</Badge>}
              </Flex>
              <Heading size="md" mb={2}>{event.title}</Heading>

              <Stack spacing={2} mb={4} color="gray.500" fontSize="sm">
                <Flex align="center"><Calendar size={14} style={{ marginRight: '6px' }}/> {formatDate(event.date)}</Flex>
                <Flex align="center">
                  <Clock size={14} style={{ marginRight: '6px' }}/> {formatTime(event.startTime)}
                  {event.endTime && ` – ${formatTime(event.endTime)}`}
                </Flex>
                <Flex align="center"><MapPin size={14} style={{ marginRight: '6px' }}/> {event.location}</Flex>
                {event.hostedBy && (
                  <Flex align="center"><User size={14} style={{ marginRight: '6px' }}/> Hosted by {event.hostedBy}</Flex>
                )}
              </Stack>

              {event.description && (
                <Text fontSize="sm" mb={4} noOfLines={2}>{event.description}</Text>
              )}

              {/* Pushes the footer to the bottom so it lines up across cards of different heights */}
              <Spacer />

              <Flex justify="space-between" align="center" mt={4}>
                <Text fontSize="sm" color="gray.500">
                  <b>{event.attendees}</b>{event.capacity && ` / ${event.capacity}`} attending
                </Text>
                <Button size="sm" colorScheme="blue" variant="outline">RSVP</Button>
              </Flex>
            </Flex>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}