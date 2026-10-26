import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AspectRatio, Avatar, Badge, Box, Center, Heading, HStack, Image, LinkBox, LinkOverlay, Skeleton, SkeletonText, Text
} from '@chakra-ui/react';
import { ImageOff } from 'lucide-react';
import PriceTag from './PriceTag';
import { CATEGORY_COLORS } from '../constants';
import { timeAgo } from '../utils/format';

// A marketplace listing. The whole card links to the product page (LinkBox + LinkOverlay).
const ItemCard = ({ item }) => {
  return (
    <LinkBox
      as="article"
      bg="bg.surface"
      borderWidth="1px"
      borderColor="border.default"
      borderRadius="xl"
      overflow="hidden"
      transition="transform 0.2s, box-shadow 0.2s"
      _hover={{ transform: 'translateY(-3px)', boxShadow: 'lg' }}
      _focusWithin={{ boxShadow: 'outline' }}
    >
      <Box position="relative">
        <AspectRatio ratio={4 / 3}>
          {item.image ? (
            <Image src={item.image} alt="" objectFit="cover" />
          ) : (
            <Center bg="bg.subtle" color="fg.muted"><ImageOff size={28} /></Center>
          )}
        </AspectRatio>
        <PriceTag price={item.price} position="absolute" left={3} bottom={3} />
      </Box>

      <Box p={4}>
        <Heading as="h3" size="sm" noOfLines={1}>
          <LinkOverlay as={RouterLink} to={`/product/${item.id}`}>{item.title}</LinkOverlay>
        </Heading>

        <HStack mt={2} spacing={2}>
          <Badge colorScheme={CATEGORY_COLORS[item.category] || 'gray'}>{item.category}</Badge>
          {item.condition && <Text fontSize="sm" color="fg.muted" noOfLines={1}>{item.condition}</Text>}
        </HStack>

        <HStack mt={3} spacing={2} fontSize="sm" color="fg.muted">
          <Avatar size="2xs" name={item.seller?.name} src={item.seller?.avatar} />
          <Text flex="1" noOfLines={1}>{item.seller?.name || 'Student'}</Text>
          {item.postedDate && (
            <Text flexShrink={0} fontSize="xs" display={{ base: 'none', sm: 'block' }}>{timeAgo(item.postedDate)}</Text>
          )}
        </HStack>
      </Box>
    </LinkBox>
  );
};

// Placeholder with the same shape as ItemCard, shown while listings load
export const ItemCardSkeleton = () => (
  <Box bg="bg.surface" borderWidth="1px" borderColor="border.default" borderRadius="xl" overflow="hidden">
    <AspectRatio ratio={4 / 3}><Skeleton /></AspectRatio>
    <Box p={4}>
      <SkeletonText noOfLines={3} spacing={3} skeletonHeight={3} />
    </Box>
  </Box>
);

export default ItemCard;
