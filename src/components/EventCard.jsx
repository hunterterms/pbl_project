import React from 'react';
import {
  Badge, Button, Flex, Heading, HStack, Spacer, Stack, Text, useColorModeValue
} from '@chakra-ui/react';
import { Clock, MapPin, User } from 'lucide-react';
import MetaRow from './MetaRow';
import { CATEGORY_COLORS } from '../constants';
import { formatPrice, formatTime, toDate } from '../utils/format';

// The two notches where the ticket "tears", cut out with circles the colour of the page
const notch = {
  content: '""',
  position: 'absolute',
  right: '-9px',
  boxSize: '18px',
  borderRadius: 'full',
  bg: 'bg.canvas',
};

// Events look like ticket stubs: the date sits on a tear-off stub coloured by category
export default function EventCard({ event, isPast = false, isMine = false }) {
  const color = isPast ? 'gray' : CATEGORY_COLORS[event.category] || 'gray';
  const stubBg = useColorModeValue(`${color}.100`, `${color}.900`);
  const stubFg = useColorModeValue(`${color}.800`, `${color}.100`);

  const date = toDate(event.date);
  const time = formatTime(event.startTime) + (event.endTime ? ` – ${formatTime(event.endTime)}` : '');

  return (
    <Flex
      as="article"
      bg="bg.surface"
      borderRadius="xl"
      boxShadow="0 0 0 1px var(--chakra-colors-border-default)"
      opacity={isPast ? 0.8 : 1}
    >
      {/* Stub */}
      <Flex
        as="time"
        dateTime={event.date}
        direction="column"
        align="center"
        justify="center"
        flexShrink={0}
        w={{ base: '76px', md: '88px' }}
        py={6}
        bg={stubBg}
        color={stubFg}
        borderLeftRadius="xl"
        borderRightWidth="2px"
        borderRightStyle="dashed"
        borderRightColor="border.default"
        position="relative"
        _before={{ ...notch, top: '-9px' }}
        _after={{ ...notch, bottom: '-9px' }}
      >
        <Text fontSize="sm" fontWeight="700">{date?.toLocaleDateString('en-GB', { month: 'short' })}</Text>
        <Text fontFamily="display" fontWeight="800" fontSize="5xl" lineHeight="1">{date?.getDate()}</Text>
        <Text fontSize="xs" fontWeight="600">{date?.toLocaleDateString('en-GB', { weekday: 'short' })}</Text>
      </Flex>

      {/* Details */}
      <Flex direction="column" flex="1" minW={0} p={5} pl={6}>
        <HStack spacing={2}>
          <Badge colorScheme={CATEGORY_COLORS[event.category] || 'gray'}>{event.category}</Badge>
          {event.entryFee === 0 && <Badge colorScheme="green">Free</Badge>}
          {event.entryFee > 0 && <Badge bg="highlight" color="highlight.fg">{formatPrice(event.entryFee)}</Badge>}
        </HStack>

        <Heading as="h3" size="md" mt={3} lineHeight="short">{event.title}</Heading>

        <Stack spacing={1.5} mt={3} fontSize="sm" color="fg.muted">
          <MetaRow icon={Clock}>{time}</MetaRow>
          <MetaRow icon={MapPin}>{event.location}</MetaRow>
          {event.hostedBy && <MetaRow icon={User}>Hosted by {event.hostedBy}</MetaRow>}
        </Stack>

        {event.description && <Text mt={3} fontSize="sm" noOfLines={2}>{event.description}</Text>}

        <Spacer />

        <Flex mt={5} align="center" justify="space-between" gap={3}>
          <Text fontSize="sm" color="fg.muted">
            <Text as="span" fontWeight="700" color="fg.default">{event.attendees}</Text>
            {event.capacity ? ` of ${event.capacity}` : ''} {isPast ? 'went' : 'going'}
          </Text>
          {isPast ? (
            <Text fontSize="sm" fontWeight="600" color="fg.muted">Ended</Text>
          ) : isMine ? (
            <Text fontSize="sm" fontWeight="600" color="fg.accent">Your event</Text>
          ) : (
            <Button size="sm" colorScheme="brand" variant="outline">RSVP</Button>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
}
