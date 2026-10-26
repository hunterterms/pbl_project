import React, { useState } from 'react';
import { Button, Container, SimpleGrid } from '@chakra-ui/react';
import { SearchX, Users } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import SearchInput from '../components/SearchInput';
import EmptyState from '../components/EmptyState';
import GroupCard from '../components/GroupCard';

// MOCK DATA: We will replace this with AWS fetch later
const mockGroups = [
  { id: '1', name: 'Web Development Club', members: 85, description: 'Learn React, AWS, and build cool projects together.', tags: ['Tech', 'Coding'] },
  { id: '2', name: 'Outdoor Hiking Society', members: 42, description: 'Weekend trips to local trails and mountains. All skill levels welcome!', tags: ['Sports', 'Outdoors'] },
];

export default function Groups({ createdGroups = [], onStartGroup }) {
  const [searchTerm, setSearchTerm] = useState('');

  const myGroupIds = new Set(createdGroups.map((group) => group.id));
  const query = searchTerm.trim().toLowerCase();

  // Groups you start show up first
  const groups = [...createdGroups, ...mockGroups].filter((group) =>
    !query || [group.name, group.description, ...group.tags].some((text) => text?.toLowerCase().includes(query))
  );

  return (
    <Container maxW="container.xl" px={{ base: 4, md: 8 }} py={{ base: 8, md: 12 }}>
      <PageHeader
        title="Student Groups"
        description="Clubs and societies run by students. Join one or start your own."
        action={<Button w="full" colorScheme="brand" leftIcon={<Users size={18} />} onClick={onStartGroup}>Start group</Button>}
      >
        <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Search groups" />
      </PageHeader>

      {groups.length > 0 ? (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {groups.map((group) => <GroupCard key={group.id} group={group} isMine={myGroupIds.has(group.id)} />)}
        </SimpleGrid>
      ) : (
        <EmptyState
          icon={SearchX}
          title="No matching groups"
          description="Try another search, or start the group you're looking for."
          action={<Button colorScheme="brand" leftIcon={<Users size={18} />} onClick={onStartGroup}>Start group</Button>}
        />
      )}
    </Container>
  );
}
