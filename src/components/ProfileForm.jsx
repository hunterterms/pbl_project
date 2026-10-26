import React, { useState } from 'react';
import {
  Box, Button, Flex, FormControl, FormHelperText, FormLabel, Heading, Input, Select, SimpleGrid, Stack, Text, Textarea, useToast
} from '@chakra-ui/react';
import { YEARS_OF_STUDY } from '../constants';

// Keep these within the limits in infra/cognito.yaml, or Cognito rejects the save
const MAX_LENGTH = { displayName: 50, course: 80, bio: 160 };

const toForm = (user) => ({ displayName: user.displayName, course: user.course, year: user.year, bio: user.bio });

const isSameForm = (a, b) => Object.keys(a).every((field) => a[field].trim() === b[field].trim());

// The profile details students can edit. Their name and email come from Google/Apple.
export default function ProfileForm({ user, onSave }) {
  const toast = useToast();
  const [form, setForm] = useState(() => toForm(user));
  const [isSaving, setIsSaving] = useState(false);

  const savedForm = toForm(user);
  const hasChanges = !isSameForm(form, savedForm);
  const account = user.provider ? `${user.provider} account` : 'account';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(form);
      setForm((prev) => Object.fromEntries(Object.entries(prev).map(([field, value]) => [field, value.trim()])));
      toast({ title: 'Profile saved', status: 'success', duration: 3000, isClosable: true });
    } catch (error) {
      console.error('Could not save profile:', error);
      toast({ title: "Couldn't save your profile", description: error.message, status: 'error', isClosable: true });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit} bg="bg.surface" borderWidth="1px" borderColor="border.default" borderRadius="xl" p={{ base: 5, md: 6 }}>
      <Heading as="h2" size="md">Profile details</Heading>
      <Text mt={1} fontSize="sm" color="fg.muted">Shown on your ID card. Only you can see them for now.</Text>

      <Stack spacing={4} mt={5}>
        <FormControl>
          <FormLabel>Display name</FormLabel>
          <Input
            name="displayName"
            value={form.displayName}
            onChange={handleChange}
            placeholder={user.accountName || 'Your name'}
            maxLength={MAX_LENGTH.displayName}
          />
          <FormHelperText>
            {user.accountName
              ? `Leave blank to use "${user.accountName}", the name on your ${account}.`
              : 'How your name appears on UniHub.'}
          </FormHelperText>
        </FormControl>

        <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
          <FormControl>
            <FormLabel>Course</FormLabel>
            <Input
              name="course"
              value={form.course}
              onChange={handleChange}
              placeholder="e.g. B.Tech Computer Science"
              maxLength={MAX_LENGTH.course}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Year</FormLabel>
            <Select name="year" value={form.year} onChange={handleChange} placeholder="Select year">
              {YEARS_OF_STUDY.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </Select>
          </FormControl>
        </SimpleGrid>

        <FormControl>
          <FormLabel>Bio</FormLabel>
          <Textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            placeholder="What are you into, selling or looking for?"
            maxLength={MAX_LENGTH.bio}
            rows={3}
          />
          <FormHelperText textAlign="right">{form.bio.length}/{MAX_LENGTH.bio}</FormHelperText>
        </FormControl>
      </Stack>

      <Flex mt={6} justify="flex-end" gap={3}>
        <Button variant="ghost" onClick={() => setForm(savedForm)} isDisabled={!hasChanges || isSaving}>Discard</Button>
        <Button type="submit" colorScheme="brand" isLoading={isSaving} isDisabled={!hasChanges}>Save changes</Button>
      </Flex>
    </Box>
  );
}
