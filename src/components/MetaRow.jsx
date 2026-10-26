import React from 'react';
import { Box, Flex } from '@chakra-ui/react';

// One line of details with a small icon in front (time, place, host...)
export default function MetaRow({ icon: Icon, children }) {
  return (
    <Flex align="flex-start" gap={2}>
      <Box as="span" mt="3px" flexShrink={0}>
        <Icon size={15} aria-hidden="true" />
      </Box>
      <Box as="span" minW={0}>{children}</Box>
    </Flex>
  );
}
