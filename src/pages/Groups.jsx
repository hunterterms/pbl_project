import React from 'react';
import {
  Box, Container, Heading, SimpleGrid, Text, Badge, Button, Flex, useColorModeValue, Avatar, AvatarGroup
} from '@chakra-ui/react';

export default function Groups() {
  const cardBg = useColorModeValue('white', 'gray.800');

  // MOCK DATA: We will replace this with AWS fetch later
  const mockGroups = [
    { id: '1', name: 'Web Development Club', members: 85, description: 'Learn React, AWS, and build cool projects together.', tags: ['Tech', 'Coding'] },
    { id: '2', name: 'Outdoor Hiking Society', members: 42, description: 'Weekend trips to local trails and mountains. All skill levels welcome!', tags: ['Sports', 'Outdoors'] },
  ];

  return (
    <Box minH="100vh" py={8} bg={useColorModeValue('gray.50', 'gray.900')}>
      <Container maxW="container.xl">
        <Flex justify="space-between" align="center" mb={8}>
          <Heading size="lg">Student Groups</Heading>
          <Button colorScheme="green">Start a Group</Button>
        </Flex>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {mockGroups.map(group => (
            <Box key={group.id} bg={cardBg} p={5} rounded="lg" shadow="sm" borderWidth="1px">
              <Heading size="md" mb={2}>{group.name}</Heading>
              <Text color="gray.600" fontSize="sm" mb={4} noOfLines={2}>
                {group.description}
              </Text>
              
              <Flex gap={2} mb={4}>
                {group.tags.map(tag => (
                  <Badge key={tag} colorScheme="green" variant="subtle">{tag}</Badge>
                ))}
              </Flex>
              
              <Flex justify="space-between" align="center" mt={4} pt={4} borderTopWidth="1px">
                <AvatarGroup size="sm" max={3}>
                  <Avatar name="User 1" />
                  <Avatar name="User 2" />
                  <Avatar name="User 3" />
                </AvatarGroup>
                <Text fontSize="sm" color="gray.500">{group.members} members</Text>
                <Button size="sm" colorScheme="blue">Join</Button>
              </Flex>
            </Box>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}