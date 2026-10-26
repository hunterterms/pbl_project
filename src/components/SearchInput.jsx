import React from 'react';
import { IconButton, Input, InputGroup, InputLeftElement, InputRightElement } from '@chakra-ui/react';
import { Search, X } from 'lucide-react';

export default function SearchInput({ value, onChange, placeholder }) {
  return (
    <InputGroup w={{ base: '100%', md: '320px' }} flexShrink={0}>
      <InputLeftElement pointerEvents="none" color="fg.muted">
        <Search size={18} />
      </InputLeftElement>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        bg="bg.surface"
      />
      {value && (
        <InputRightElement>
          <IconButton size="xs" variant="ghost" icon={<X size={14} />} aria-label="Clear search" onClick={() => onChange('')} />
        </InputRightElement>
      )}
    </InputGroup>
  );
}
