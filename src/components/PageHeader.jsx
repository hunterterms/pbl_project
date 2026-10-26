import React from 'react';
import { Box, Flex, Heading, Text } from '@chakra-ui/react';

// Header shared by the main pages: poster-style title, a one-line description,
// then a toolbar row (search, filters) passed in as children.
// `action` is the page's main button. It only shows on phones, because on larger
// screens the same button is already in the navbar.
export default function PageHeader({ title, description, action, children }) {
  return (
    <Box as="header" mb={{ base: 6, md: 8 }}>
      <Heading
        as="h1"
        fontFamily="display"
        fontWeight="800"
        fontSize={{ base: '5xl', md: '7xl' }}
        lineHeight="0.9"
      >
        {title}
      </Heading>
      {description && (
        <Text mt={3} fontSize={{ base: 'md', md: 'lg' }} color="fg.muted" maxW="60ch">
          {description}
        </Text>
      )}
      {action && (
        <Box mt={5} display={{ base: 'block', md: 'none' }}>
          {action}
        </Box>
      )}
      {children && (
        <Flex mt={6} gap={3} direction={{ base: 'column', md: 'row' }} align={{ base: 'stretch', md: 'center' }}>
          {children}
        </Flex>
      )}
    </Box>
  );
}
