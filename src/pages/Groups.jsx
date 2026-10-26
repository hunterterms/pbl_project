import React from 'react';
import {
  Box, Container, Heading, SimpleGrid, Text, Stack, Badge, Button, Flex, Spacer, useColorModeValue, Avatar, AvatarGroup
} from '@chakra-ui/react';
import { Clock, MapPin, Lock } from 'lucide-react';

export default function Groups({ createdGroups = [], onStartGroup }) {
  const cardBg = useColorModeValue('white', 'gray.800');

  // MOCK DATA: We will replace this with AWS fetch later
  const mockGroups = [
    { id: '1', name: 'Web Development Club', members: 85, description: 'Learn React, AWS, and build cool projects together.', tags: ['Tech', 'Coding'] },
    { id: '2', name: 'Outdoor Hiking Society', members: 42, description: 'Weekend trips to local trails and mountains. All skill levels welcome!', tags: ['Sports', 'Outdoors'] },
  ];

  // Groups you start show up first
  const groups = [...createdGroups, ...mockGroups];

  return (
    <Box minH="100vh" py={8} bg={useColorModeValue('gray.50', 'gray.900')}>
      <Container maxW="container.xl">
        <Flex justify="space-between" align="center" mb={8}>
          <Heading size="lg">Student Groups</Heading>
          <Button colorScheme="green" onClick={onStartGroup}>Start a Group</Button>
        </Flex>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {groups.map(group => (
            <Flex key={group.id} direction="column" bg={cardBg} p={5} rounded="lg" shadow="sm" borderWidth="1px">
              <Heading size="md" mb={2}>{group.name}</Heading>
              <Text color="gray.600" fontSize="sm" mb={4} noOfLines={2}>
                {group.description}
              </Text>

              {(group.meetingSchedule || group.meetingPlace || group.joinPolicy === 'approval') && (
                <Stack spacing={2} mb={4} color="gray.500" fontSize="sm">
                  {group.meetingSchedule && (
                    <Flex align="center"><Clock size={14} style={{ marginRight: '6px' }}/> {group.meetingSchedule}</Flex>
                  )}
                  {group.meetingPlace && (
                    <Flex align="center"><MapPin size={14} style={{ marginRight: '6px' }}/> {group.meetingPlace}</Flex>
                  )}
                  {group.joinPolicy === 'approval' && (
                    <Flex align="center"><Lock size={14} style={{ marginRight: '6px' }}/> Approval required to join</Flex>
                  )}
                </Stack>
              )}

              <Flex gap={2} mb={4} wrap="wrap">
                {group.tags.map(tag => (
                  <Badge key={tag} colorScheme="green" variant="subtle">{tag}</Badge>
                ))}
              </Flex>

              {/* Pushes the footer to the bottom so it lines up across cards of different heights */}
              <Spacer />

              <Flex justify="space-between" align="center" mt={4} pt={4} borderTopWidth="1px">
                <AvatarGroup size="sm" max={3}>
                  {/* One avatar per member, up to 3 */}
                  {Array.from({ length: Math.min(group.members, 3) }, (_, i) => (
                    <Avatar key={i} name={`User ${i + 1}`} />
                  ))}
                </AvatarGroup>
                <Text fontSize="sm" color="gray.500">{group.members} {group.members === 1 ? 'member' : 'members'}</Text>
                <Button size="sm" colorScheme="blue">Join</Button>
              </Flex>
            </Flex>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}