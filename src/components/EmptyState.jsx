import React from 'react';
import { Box, Flex, Heading, Text } from '@chakra-ui/react';

// Shown when a list is empty, a search finds nothing, or something fails to load.
// The dashed border reads as an empty spot on the notice board.
export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <Flex
      direction="column"
      align="center"
      textAlign="center"
      py={{ base: 12, md: 16 }}
      px={6}
      bg="bg.surface"
      borderWidth="2px"
      borderStyle="dashed"
      borderColor="border.default"
      borderRadius="xl"
    >
      {Icon && (
        <Flex align="center" justify="center" boxSize={12} mb={4} borderRadius="full" bg="bg.subtle" color="fg.muted">
          <Icon size={22} />
        </Flex>
      )}
      <Heading as="h2" size="md">{title}</Heading>
      {description && <Text mt={2} color="fg.muted" maxW="44ch">{description}</Text>}
      {action && <Box mt={6}>{action}</Box>}
    </Flex>
  );
}
