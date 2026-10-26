import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertIcon, Box, Button, Code, Flex, Heading, Stack, Text } from '@chakra-ui/react';
import { UserRound } from 'lucide-react';
import { AppleLogo, GoogleLogo } from './ProviderLogos';
import { useAuth } from '../auth/AuthContext';
import { AUTH_PROVIDERS } from '../auth/config';

// Shown on My Profile when nobody is signed in. Students sign in with Google or Apple only (no UniHub passwords).
export default function SignInCard() {
  const { status, error, signIn } = useAuth();
  const [pendingProvider, setPendingProvider] = useState(null);
  const isConfigured = status !== 'unconfigured';

  // Coming back with the browser's Back button can restore this page as it was, spinner and all
  useEffect(() => {
    const reset = (event) => {
      if (event.persisted) setPendingProvider(null);
    };
    window.addEventListener('pageshow', reset);
    return () => window.removeEventListener('pageshow', reset);
  }, []);

  // The spinner stays on until the browser leaves for Google/Apple
  const handleSignIn = async (provider) => {
    setPendingProvider(provider);
    const isLeaving = await signIn(provider);
    if (!isLeaving) setPendingProvider(null);
  };

  return (
    <Box
      maxW="md"
      mx="auto"
      mt={{ base: 2, md: 8 }}
      p={{ base: 6, md: 8 }}
      bg="bg.surface"
      borderWidth="1px"
      borderColor="border.default"
      borderRadius="xl"
      textAlign="center"
    >
      <Flex align="center" justify="center" boxSize={14} mx="auto" borderRadius="full" bg="bg.subtle" color="fg.muted">
        <UserRound size={26} />
      </Flex>
      <Heading as="h1" mt={5} fontFamily="display" fontWeight="800" fontSize={{ base: '4xl', md: '5xl' }} lineHeight="0.95">
        Sign in to UniHub
      </Heading>
      <Text mt={3} color="fg.muted">
        Use your Google or Apple account to see your profile and the events and groups you've started.
      </Text>

      {error && (
        <Alert status="error" mt={6} borderRadius="lg" textAlign="left">
          <AlertIcon />
          <AlertDescription fontSize="sm">{error}</AlertDescription>
        </Alert>
      )}
      {!isConfigured && (
        <Alert status="info" mt={6} borderRadius="lg" textAlign="left" alignItems="flex-start">
          <AlertIcon />
          <AlertDescription fontSize="sm">
            Sign-in isn't set up on this copy of UniHub yet. Add the Cognito settings to <Code fontSize="xs">.env.local</Code> (see <Code fontSize="xs">infra/README.md</Code>).
          </AlertDescription>
        </Alert>
      )}

      {/* Colours follow Google's and Apple's rules for sign-in buttons */}
      <Stack spacing={3} mt={6}>
        {AUTH_PROVIDERS.includes('google') && (
          <Button
            size="lg"
            leftIcon={<GoogleLogo size={20} />}
            bg="white"
            color="#1F1F1F"
            borderWidth="1px"
            borderColor="#747775"
            _hover={{ bg: '#F2F2F2' }}
            _active={{ bg: '#E8E8E8' }}
            _dark={{ bg: '#131314', color: '#E3E3E3', borderColor: '#8E918F', _hover: { bg: '#202124' }, _active: { bg: '#2D2E30' } }}
            isLoading={pendingProvider === 'google'}
            isDisabled={!isConfigured || pendingProvider !== null}
            onClick={() => handleSignIn('google')}
          >
            Continue with Google
          </Button>
        )}
        {AUTH_PROVIDERS.includes('apple') && (
          <Button
            size="lg"
            leftIcon={<AppleLogo size={20} />}
            bg="black"
            color="white"
            _hover={{ bg: '#1F1F1F' }}
            _active={{ bg: '#333333' }}
            _dark={{ bg: 'white', color: 'black', _hover: { bg: '#E8E8E8' }, _active: { bg: '#D6D6D6' } }}
            isLoading={pendingProvider === 'apple'}
            isDisabled={!isConfigured || pendingProvider !== null}
            onClick={() => handleSignIn('apple')}
          >
            Continue with Apple
          </Button>
        )}
      </Stack>

      <Text mt={6} fontSize="xs" color="fg.muted">
        UniHub gets your name and email address from your account. It never sees your password.
      </Text>
    </Box>
  );
}
