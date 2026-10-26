import React from 'react';
import { Button, HStack } from '@chakra-ui/react';

// A row of pill buttons for picking one option. On phones the row scrolls sideways.
export default function FilterChips({ options, value, onChange, label }) {
  return (
    <HStack
      role="group"
      aria-label={label}
      spacing={2}
      overflowX="auto"
      p={1}
      m={-1}
      sx={{ scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}
    >
      {options.map((option) => {
        const isSelected = option === value;
        return (
          <Button
            key={option}
            size="sm"
            borderRadius="full"
            flexShrink={0}
            variant={isSelected ? 'solid' : 'outline'}
            colorScheme={isSelected ? 'brand' : 'gray'}
            bg={isSelected ? undefined : 'bg.surface'}
            aria-pressed={isSelected}
            onClick={() => onChange(option)}
          >
            {option}
          </Button>
        );
      })}
    </HStack>
  );
}
