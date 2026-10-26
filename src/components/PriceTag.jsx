import React from 'react';
import { Box } from '@chakra-ui/react';
import { formatPrice } from '../utils/format';

// Yellow sticker-style price tag, with a punched "hole" on the left
export default function PriceTag({ price, size = 'md', ...props }) {
  const isLarge = size === 'lg';

  return (
    <Box
      display="inline-flex"
      alignItems="center"
      position="relative"
      bg="highlight"
      color="highlight.fg"
      fontFamily="display"
      fontWeight="800"
      fontSize={isLarge ? '4xl' : '2xl'}
      lineHeight="1"
      pl={isLarge ? 8 : 6}
      pr={isLarge ? 4 : 3}
      py={isLarge ? 2 : 1}
      borderRadius="md"
      boxShadow="sm"
      _before={{
        content: '""',
        position: 'absolute',
        left: isLarge ? '13px' : '10px',
        top: '50%',
        boxSize: isLarge ? '9px' : '7px',
        transform: 'translateY(-50%)',
        borderRadius: 'full',
        bg: 'blackAlpha.300',
      }}
      {...props}
    >
      {formatPrice(price)}
    </Box>
  );
}
