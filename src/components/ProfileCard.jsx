import React from 'react';
import { Avatar, Box, Button, Flex, Heading, Stack, Text } from '@chakra-ui/react';
import { CalendarDays, LogOut, Mail } from 'lucide-react';
import MetaRow from './MetaRow';
import { AppleLogo, GoogleLogo } from './ProviderLogos';

const PROVIDER_LOGOS = { Google: GoogleLogo, Apple: AppleLogo };

// "Oct 2026"
const formatMonth = (date) => date.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });

// The signed-in student, styled like a campus ID card: a punched lanyard slot, photo, and details below
export default function ProfileCard({ user, onSignOut }) {
  const ProviderLogo = PROVIDER_LOGOS[user.provider];
  const studies = [user.course, user.year].filter(Boolean).join(' · ');

  return (
    <Box as="section" aria-label="Your ID card" bg="bg.surface" borderWidth="1px" borderColor="border.default" borderRadius="xl" overflow="hidden">
      <Box bg="brand.500" color="white" px={5} pt={3} pb={14}>
        <Box w="44px" h="8px" mx="auto" borderRadius="full" bg="bg.canvas" />
        <Flex mt={3} justify="space-between" align="baseline">
          <Text fontFamily="display" fontWeight="800" fontSize="2xl" lineHeight="1">UniHub</Text>
          <Text fontSize="xs" fontWeight="700" letterSpacing="wider" textTransform="uppercase" opacity={0.85}>Student ID</Text>
        </Flex>
      </Box>

      <Flex direction="column" align="center" textAlign="center" px={6} mt={-12}>
        <Avatar
          size="2xl"
          name={user.name}
          src={user.picture}
          referrerPolicy="no-referrer"
          bg="brand.500"
          color="white"
          showBorder
          borderWidth="4px"
          borderColor="bg.surface"
        />
        <Heading as="h2" mt={4} fontFamily="display" fontWeight="800" fontSize="4xl" lineHeight="1" wordBreak="break-word">
          {user.name}
        </Heading>
        <Text mt={2} fontWeight="600" color={studies ? 'fg.default' : 'fg.muted'}>
          {studies || 'Add your course and year'}
        </Text>
        {user.bio && <Text mt={3} fontSize="sm" color="fg.muted" whiteSpace="pre-line">{user.bio}</Text>}
      </Flex>

      <Stack spacing={2} mx={6} mt={6} pt={5} borderTopWidth="2px" borderTopStyle="dashed" borderColor="border.default" fontSize="sm" color="fg.muted">
        {user.email && <MetaRow icon={Mail}><Text as="span" wordBreak="break-all">{user.email}</Text></MetaRow>}
        {ProviderLogo && <MetaRow icon={ProviderLogo}>Signed in with {user.provider}</MetaRow>}
        {user.memberSince && <MetaRow icon={CalendarDays}>Member since {formatMonth(user.memberSince)}</MetaRow>}
      </Stack>

      <Box p={6}>
        <Button w="full" variant="outline" leftIcon={<LogOut size={16} />} onClick={onSignOut}>Log out</Button>
      </Box>
    </Box>
  );
}
