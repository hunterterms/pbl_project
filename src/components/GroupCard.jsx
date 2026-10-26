import React from 'react';
import {
  Avatar, AvatarGroup, Badge, Box, Button, Flex, Heading, HStack, Spacer, Stack, Text, Wrap, WrapItem, useColorModeValue
} from '@chakra-ui/react';
import { Clock, Lock, MapPin } from 'lucide-react';
import MetaRow from './MetaRow';
import { CURRENT_USER } from '../constants';
import { useAuth } from '../auth/AuthContext';

const EMBLEM_COLORS = ['orange', 'teal', 'pink', 'purple', 'green', 'cyan', 'red', 'yellow'];

// Same name → same colour, so a group keeps its emblem colour across reloads
const colorFor = (name) => EMBLEM_COLORS[[...name].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % EMBLEM_COLORS.length];

// "Web Development Club" → "WD"
const initialsOf = (name) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((word) => word[0].toUpperCase()).join('');

// A student group, with a club-badge style emblem made from its initials
export default function GroupCard({ group, isMine = false }) {
  const { user } = useAuth();
  const me = user ?? CURRENT_USER; // Your own avatar when you're signed in
  const color = colorFor(group.name);
  const emblemBg = useColorModeValue(`${color}.100`, `${color}.900`);
  const emblemFg = useColorModeValue(`${color}.800`, `${color}.100`);
  const needsApproval = group.joinPolicy === 'approval';

  return (
    <Flex as="article" direction="column" bg="bg.surface" borderWidth="1px" borderColor="border.default" borderRadius="xl" p={5}>
      <HStack spacing={4}>
        <Flex
          align="center"
          justify="center"
          boxSize={14}
          flexShrink={0}
          borderRadius="lg"
          bg={emblemBg}
          color={emblemFg}
          fontFamily="display"
          fontWeight="800"
          fontSize="2xl"
          aria-hidden="true"
        >
          {initialsOf(group.name)}
        </Flex>
        <Box minW={0}>
          <Heading as="h3" size="md" noOfLines={1}>{group.name}</Heading>
          <Text fontSize="sm" color="fg.muted">
            {group.members} {group.members === 1 ? 'member' : 'members'}
          </Text>
        </Box>
      </HStack>

      <Text mt={4} fontSize="sm" noOfLines={2}>{group.description}</Text>

      {(group.meetingSchedule || group.meetingPlace) && (
        <Stack spacing={1.5} mt={3} fontSize="sm" color="fg.muted">
          {group.meetingSchedule && <MetaRow icon={Clock}>{group.meetingSchedule}</MetaRow>}
          {group.meetingPlace && <MetaRow icon={MapPin}>{group.meetingPlace}</MetaRow>}
        </Stack>
      )}

      {group.tags.length > 0 && (
        <Wrap mt={4} spacing={2}>
          {group.tags.map((tag) => (
            <WrapItem key={tag}>
              <Badge variant="outline" colorScheme="gray" borderRadius="full" fontWeight="500">{tag}</Badge>
            </WrapItem>
          ))}
        </Wrap>
      )}

      <Spacer />

      <Flex mt={5} pt={4} borderTopWidth="1px" borderColor="border.default" align="center" justify="space-between" gap={3}>
        <AvatarGroup size="sm" max={3}>
          {/* One avatar per member, up to 3. If you started the group, you're the first one. */}
          {Array.from({ length: Math.min(group.members, 3) }, (_, i) =>
            isMine && i === 0 ? (
              <Avatar key="me" name={me.name} src={me.picture} referrerPolicy="no-referrer" bg="brand.500" color="white" borderColor="bg.surface" />
            ) : (
              <Avatar key={i} name={`Member ${i + 1}`} src={`https://i.pravatar.cc/80?u=unihub-${group.id}-${i}`} borderColor="bg.surface" />
            )
          )}
        </AvatarGroup>
        {isMine ? (
          <Text fontSize="sm" fontWeight="600" color="fg.accent">Your group</Text>
        ) : (
          <Button size="sm" colorScheme="brand" leftIcon={needsApproval ? <Lock size={14} /> : undefined}>
            {needsApproval ? 'Request to join' : 'Join'}
          </Button>
        )}
      </Flex>
    </Flex>
  );
}
