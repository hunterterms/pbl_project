import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Avatar, Box, Button, IconButton, Menu, MenuButton, MenuDivider, MenuItem, MenuList, SkeletonCircle, Text
} from '@chakra-ui/react';
import { LogIn, LogOut, Package, User } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

// Right end of the navbar: a "Sign in" button, or your avatar with the account menu
export default function AccountMenu() {
  const { status, user, signOut } = useAuth();

  if (status === 'loading') return <SkeletonCircle size="8" />;

  if (status !== 'signedIn') {
    return (
      <>
        <Button as={RouterLink} to="/profile" size="sm" variant="outline" display={{ base: 'none', md: 'inline-flex' }}>
          Sign in
        </Button>
        <IconButton
          as={RouterLink}
          to="/profile"
          size="sm"
          variant="ghost"
          icon={<LogIn size={18} />}
          aria-label="Sign in"
          display={{ base: 'inline-flex', md: 'none' }}
        />
      </>
    );
  }

  return (
    <Menu placement="bottom-end">
      <MenuButton as={Button} rounded="full" variant="link" cursor="pointer" minW={0} aria-label="Your account">
        <Avatar size="sm" name={user.name} src={user.picture} referrerPolicy="no-referrer" bg="brand.500" color="white" />
      </MenuButton>
      <MenuList>
        <Box px={3} py={2} maxW="260px">
          <Text fontWeight="700" noOfLines={1}>{user.name}</Text>
          {user.email && <Text fontSize="sm" color="fg.muted" noOfLines={1}>{user.email}</Text>}
        </Box>
        <MenuDivider />
        <MenuItem as={RouterLink} to="/profile" icon={<User size={16} />}>My Profile</MenuItem>
        <MenuItem icon={<Package size={16} />}>My Orders</MenuItem>
        <MenuDivider />
        <MenuItem color="red.400" icon={<LogOut size={16} />} onClick={signOut}>Log out</MenuItem>
      </MenuList>
    </Menu>
  );
}
