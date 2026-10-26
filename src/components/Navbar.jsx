import React from 'react';
import {
  Box,
  Flex,
  Button,
  Heading,
  useColorModeValue,
  Container,
  Stack,
  Input,
  InputGroup,
  InputLeftElement,
  IconButton,
  useColorMode,
  useDisclosure,
  Collapse,
  Text,
  VStack
} from '@chakra-ui/react';
import { 
  Plus, 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  Menu as MenuIcon, 
  X, 
  CalendarPlus,
  Users
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom'; // 1. Added useLocation
import AccountMenu from './AccountMenu';

const Navbar = ({ onSellItem, onCreateEvent, onStartGroup }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen: isMobileOpen, onToggle: onMobileToggle } = useDisclosure();
  const location = useLocation(); // 2. Get the current URL

  // 3. Dynamic logic for the Call-To-Action (CTA) button
  let ctaText = "Sell Item";
  let CtaIcon = Plus;
  let onCtaClick = onSellItem;

  if (location.pathname === '/events') {
    ctaText = "Create Event";
    CtaIcon = CalendarPlus;
    onCtaClick = onCreateEvent;
  } else if (location.pathname === '/groups') {
    ctaText = "Start Group";
    CtaIcon = Users;
    onCtaClick = onStartGroup;
  }

  return (
    <Box
      bg={useColorModeValue('white', 'gray.800')}
      boxShadow="sm"
      position="sticky"
      top="0"
      zIndex="100"
      borderBottom="1px"
      borderColor={useColorModeValue('gray.100', 'gray.700')}
    >
      <Container maxW="container.xl" px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          
          {/* Mobile Hamburger Menu Button */}
          <IconButton
            display={{ base: 'flex', md: 'none' }}
            onClick={onMobileToggle}
            icon={isMobileOpen ? <X size={20} /> : <MenuIcon size={20} />}
            variant="ghost"
            aria-label="Open Menu"
            mr={2}
          />

          {/* Logo & Desktop Links */}
          <Flex alignItems="center">
            <Heading size="md" color="blue.600" mr={8}>
              <Link to="/">UniHub</Link>
            </Heading>
            
            {/* Desktop Nav Links */}
            <Stack direction={'row'} spacing={6} display={{ base: 'none', md: 'flex' }}>
              <NavLink to="/">Marketplace</NavLink>
              <NavLink to="/events">Events</NavLink>
              <NavLink to="/groups">Groups</NavLink>
            </Stack>
          </Flex>

          {/* Right Side Actions */}
          <Flex alignItems={'center'} gap={2}>
            
            {/* Search Bar (Desktop only) */}
            <InputGroup display={{ base: 'none', md: 'block' }} w="200px" size="sm">
              <InputLeftElement pointerEvents="none">
                <Search size={16} color="gray" />
              </InputLeftElement>
              <Input placeholder={`Search ${location.pathname === '/' ? 'items' : location.pathname.substring(1)}...`} borderRadius="full" />
            </InputGroup>

            {/* Dark Mode Toggle */}
            <IconButton
              size="sm"
              variant="ghost"
              onClick={toggleColorMode}
              icon={colorMode === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              aria-label="Toggle Theme"
            />

            {/* Notifications */}
            <IconButton
              size="sm"
              variant="ghost"
              icon={<Bell size={18} />}
              aria-label="Notifications"
            />

            {/* Dynamic CTA Button (Desktop) */}
            <Button
              leftIcon={<CtaIcon size={18} />}
              colorScheme={'blue'}
              size={'sm'}
              onClick={onCtaClick}
              display={{ base: 'none', md: 'flex' }} 
            >
              {ctaText}
            </Button>

            {/* Dynamic CTA Icon (Mobile) */}
             <IconButton
              display={{ base: 'flex', md: 'none' }}
              icon={<CtaIcon size={18} />}
              colorScheme="blue"
              size="sm"
              onClick={onCtaClick}
              aria-label={ctaText}
            />

            {/* Sign-in button, or the signed-in user's account menu */}
            <AccountMenu />
          </Flex>
        </Flex>

        {/* Mobile Menu Collapse Area */}
        <Collapse in={isMobileOpen} animateOpacity>
          <Box pb={4} display={{ md: 'none' }}>
            <VStack as={'nav'} spacing={4} align="stretch">
              <InputGroup size="sm">
                <InputLeftElement pointerEvents="none">
                  <Search size={16} color="gray" />
                </InputLeftElement>
                <Input placeholder="Search..." borderRadius="full" />
              </InputGroup>
              <NavLink to="/">Marketplace</NavLink>
              <NavLink to="/events">Events</NavLink>
              <NavLink to="/groups">Groups</NavLink>
              <NavLink to="/profile">My Profile</NavLink>
            </VStack>
          </Box>
        </Collapse>

      </Container>
    </Box>
  );
};

// Helper Component for Links
const NavLink = ({ children, to }) => {
  const location = useLocation();
  const isActive = location.pathname === to; // Check if the link is the current page
  const inactiveColor = useColorModeValue('gray.600', 'gray.200'); // Hooks can't be called conditionally

  return (
    <Link to={to}>
      <Text 
        fontWeight="500" 
        color={isActive ? 'blue.500' : inactiveColor} // Highlight active tab
        _hover={{ color: 'blue.500', textDecoration: 'none' }}
      >
        {children}
      </Text>
    </Link>
  );
};

export default Navbar;