import React from 'react';
import {
  Box, Container, Heading, SimpleGrid, Text, Stack, Badge, Button, Flex, useColorModeValue
} from '@chakra-ui/react';
import { Calendar, MapPin, Clock } from 'lucide-react';

export default function Events() {
  const cardBg = useColorModeValue('white', 'gray.800');

  // MOCK DATA: We will replace this with AWS fetch later
  const mockEvents = [
    { id: '1', title: 'Computer Science Hackathon', date: 'Oct 15, 2026', time: '9:00 AM', location: 'Innovation Lab', category: 'Academic', attendees: 45 },
    { id: '2', title: 'Campus Music Festival', date: 'Oct 20, 2026', time: '6:00 PM', location: 'Main Quad', category: 'Social', attendees: 120 },
  ];

  return (
    <Box minH="100vh" py={8} bg={useColorModeValue('gray.50', 'gray.900')}>
      <Container maxW="container.xl">
        <Flex justify="space-between" align="center" mb={8}>
          <Heading size="lg">Campus Events</Heading>
          <Button colorScheme="blue">Create Event</Button>
        </Flex>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {mockEvents.map(event => (
            <Box key={event.id} bg={cardBg} p={5} rounded="lg" shadow="sm" borderWidth="1px">
              <Badge colorScheme="purple" mb={3}>{event.category}</Badge>
              <Heading size="md" mb={2}>{event.title}</Heading>
              
              <Stack spacing={2} mb={4} color="gray.500" fontSize="sm">
                <Flex align="center"><Calendar size={14} style={{ marginRight: '6px' }}/> {event.date}</Flex>
                <Flex align="center"><Clock size={14} style={{ marginRight: '6px' }}/> {event.time}</Flex>
                <Flex align="center"><MapPin size={14} style={{ marginRight: '6px' }}/> {event.location}</Flex>
              </Stack>
              
              <Flex justify="space-between" align="center" mt={4}>
                <Text fontSize="sm" color="gray.500"><b>{event.attendees}</b> attending</Text>
                <Button size="sm" colorScheme="blue" variant="outline">RSVP</Button>
              </Flex>
            </Box>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}