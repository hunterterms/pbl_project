import React from 'react';
import {
  Badge, Box, Button, Container, Grid, Heading, SimpleGrid, Skeleton, SkeletonText, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Text
} from '@chakra-ui/react';
import { CalendarPlus, Users } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import EmptyState from '../components/EmptyState';
import EventCard from '../components/EventCard';
import GroupCard from '../components/GroupCard';
import ProfileCard from '../components/ProfileCard';
import ProfileForm from '../components/ProfileForm';
import SignInCard from '../components/SignInCard';
import { useAuth } from '../auth/AuthContext';
import { byDate, isPastEvent } from '../utils/events';

const LAYOUT_COLUMNS = { base: '1fr', lg: '340px 1fr' };

// Same shape as the signed-in page, shown while we check who's signed in
const ProfileSkeleton = () => (
  <>
    <Skeleton h={{ base: '48px', md: '64px' }} w="280px" mb={{ base: 6, md: 8 }} />
    <Grid templateColumns={LAYOUT_COLUMNS} gap={{ base: 6, lg: 10 }}>
      <Skeleton h="460px" borderRadius="xl" />
      <Stack spacing={4}>
        <Skeleton h="24px" w="200px" />
        <SkeletonText noOfLines={6} spacing={4} skeletonHeight={3} />
      </Stack>
    </Grid>
  </>
);

// Events and groups created in this browser (they aren't stored in the cloud yet)
function Activity({ events, groups, onCreateEvent, onStartGroup }) {
  // Upcoming events first (soonest at the top), then past ones (most recent first)
  const upcoming = events.filter((event) => !isPastEvent(event)).sort(byDate);
  const past = events.filter(isPastEvent).sort((a, b) => byDate(b, a));

  return (
    <Box as="section" aria-labelledby="activity-heading">
      <Heading id="activity-heading" as="h2" size="md">Your activity</Heading>
      <Text mt={1} fontSize="sm" color="fg.muted">Events and groups you've created on this device.</Text>

      <Tabs mt={4} variant="solid-rounded" colorScheme="brand" isLazy>
        <TabList gap={2}>
          <Tab>Events <Badge ml={2} variant="subtle">{events.length}</Badge></Tab>
          <Tab>Groups <Badge ml={2} variant="subtle">{groups.length}</Badge></Tab>
        </TabList>
        <TabPanels mt={4}>
          <TabPanel p={0}>
            {events.length > 0 ? (
              <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={6}>
                {[...upcoming, ...past].map((event) => (
                  <EventCard key={event.id} event={event} isPast={isPastEvent(event)} isMine />
                ))}
              </SimpleGrid>
            ) : (
              <EmptyState
                icon={CalendarPlus}
                title="No events yet"
                description="Events you create show up here."
                action={<Button colorScheme="brand" leftIcon={<CalendarPlus size={18} />} onClick={onCreateEvent}>Create event</Button>}
              />
            )}
          </TabPanel>
          <TabPanel p={0}>
            {groups.length > 0 ? (
              <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={6}>
                {groups.map((group) => <GroupCard key={group.id} group={group} isMine />)}
              </SimpleGrid>
            ) : (
              <EmptyState
                icon={Users}
                title="No groups yet"
                description="Groups you start show up here."
                action={<Button colorScheme="brand" leftIcon={<Users size={18} />} onClick={onStartGroup}>Start group</Button>}
              />
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}

export default function Profile({ createdEvents = [], createdGroups = [], onCreateEvent, onStartGroup }) {
  const { status, user, signOut, updateProfile } = useAuth();

  let content;
  if (status === 'loading') {
    content = <ProfileSkeleton />;
  } else if (status !== 'signedIn') {
    content = <SignInCard />;
  } else {
    content = (
      <>
        <PageHeader title="My Profile" description="Your UniHub ID card, and the events and groups you've started." />

        <Grid templateColumns={LAYOUT_COLUMNS} gap={{ base: 8, lg: 10 }} alignItems="start">
          {/* On wide screens the ID card stays in view while you scroll */}
          <Box position={{ lg: 'sticky' }} top={{ lg: '88px' }}>
            <ProfileCard user={user} onSignOut={signOut} />
          </Box>

          <Stack spacing={10} minW={0}>
            {/* Keyed by user, so a different account starts with its own details */}
            <ProfileForm key={user.id} user={user} onSave={updateProfile} />
            <Activity events={createdEvents} groups={createdGroups} onCreateEvent={onCreateEvent} onStartGroup={onStartGroup} />
          </Stack>
        </Grid>
      </>
    );
  }

  return (
    <Container maxW="container.xl" px={{ base: 4, md: 8 }} py={{ base: 8, md: 12 }}>
      {content}
    </Container>
  );
}
