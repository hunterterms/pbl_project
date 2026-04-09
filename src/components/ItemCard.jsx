import {
  Box,
  Image,
  Badge,
  Text,
  Stack,
  Heading,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';

const ItemCard = ({ product }) => {
  return (
    <Box
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg={useColorModeValue('white', 'gray.700')}
      transition="transform 0.2s"
      _hover={{ transform: 'scale(1.02)', boxShadow: 'lg' }}
    >
      <Image
        src={product.image || 'https://via.placeholder.com/300'}
        alt={product.name}
        h="200px"
        w="100%"
        objectFit="cover"
      />

      <Box p="6">
        <Stack spacing={2}>
          <Box display="flex" alignItems="baseline">
            <Badge borderRadius="full" px="2" colorScheme="blue">
              {product.category}
            </Badge>
          </Box>

          <Heading size="md" fontWeight="semibold" lineHeight="short" noOfLines={1}>
            {product.name}
          </Heading>

          <Text fontWeight="bold" fontSize="xl" color="blue.600">
            ${product.price}
          </Text>

          <Text color="gray.500" fontSize="sm" noOfLines={2}>
            {product.description}
          </Text>

          <Button colorScheme="blue" variant="outline" size="sm" mt={2}>
            View Details
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default ItemCard;
