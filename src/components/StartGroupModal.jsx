import React, { useState, useRef } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  Button, FormControl, FormLabel, FormErrorMessage, FormHelperText, Input, Textarea, SimpleGrid, Stack,
  Radio, RadioGroup, Tag, TagLabel, TagCloseButton, Wrap, WrapItem, useToast
} from '@chakra-ui/react';

const MAX_TAGS = 5;

const EMPTY_FORM = {
  name: '',
  description: '',
  tags: [],
  meetingSchedule: '',
  meetingPlace: '',
  joinPolicy: 'open',
};

// Adds the comma-separated tags in `text`, skipping blanks and duplicates, up to MAX_TAGS
const addTags = (tags, text) => {
  const updated = [...tags];
  text.split(',').forEach((part) => {
    const tag = part.trim();
    const isDuplicate = updated.some((t) => t.toLowerCase() === tag.toLowerCase());
    if (tag && !isDuplicate && updated.length < MAX_TAGS) updated.push(tag);
  });
  return updated;
};

const validate = (form) => {
  const errors = {};
  if (!form.name.trim()) errors.name = 'Give your group a name';
  if (!form.description.trim()) errors.description = 'Tell people what your group is about';
  return errors;
};

export default function StartGroupModal({ isOpen, onClose, onCreate }) {
  const toast = useToast();
  const nameRef = useRef(null);

  const [form, setForm] = useState(EMPTY_FORM);
  const [tagInput, setTagInput] = useState('');
  const [showErrors, setShowErrors] = useState(false);

  // Errors only show up after the first submit attempt, then update live as fields get fixed
  const errors = showErrors ? validate(form) : {};
  const isTagLimitReached = form.tags.length >= MAX_TAGS;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      setForm((prev) => ({ ...prev, tags: addTags(prev.tags, tagInput) }));
      setTagInput('');
    } else if (e.key === 'Backspace' && !tagInput) {
      // Backspace in an empty tag input removes the last tag
      setForm((prev) => ({ ...prev, tags: prev.tags.slice(0, -1) }));
    }
  };

  const removeTag = (tagToRemove) => {
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((tag) => tag !== tagToRemove) }));
  };

  const handleSubmit = () => {
    if (Object.keys(validate(form)).length > 0) {
      setShowErrors(true);
      return;
    }

    const name = form.name.trim();

    onCreate({
      id: Date.now().toString(),
      name,
      description: form.description.trim(),
      tags: addTags(form.tags, tagInput), // Keep a tag that was typed but never added with Enter
      meetingSchedule: form.meetingSchedule.trim(),
      meetingPlace: form.meetingPlace.trim(),
      joinPolicy: form.joinPolicy,
      members: 1, // The founder is the first member
      createdAt: new Date().toISOString(),
    });

    toast({
      title: "Group Created!",
      description: `"${name}" is now listed on Student Groups.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    // Reset Form
    setForm(EMPTY_FORM);
    setTagInput('');
    setShowErrors(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} initialFocusRef={nameRef} isCentered size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Start a Group</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            <FormControl isRequired isInvalid={!!errors.name}>
              <FormLabel>Group Name</FormLabel>
              <Input ref={nameRef} name="name" placeholder="e.g. Photography Club" value={form.name} onChange={handleChange} />
              <FormErrorMessage>{errors.name}</FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.description}>
              <FormLabel>Description</FormLabel>
              <Textarea
                name="description"
                placeholder="What does your group do, and who is it for?"
                value={form.description}
                onChange={handleChange}
              />
              <FormErrorMessage>{errors.description}</FormErrorMessage>
            </FormControl>

            <FormControl>
              <FormLabel>Tags</FormLabel>
              <Input
                placeholder={isTagLimitReached ? 'Tag limit reached' : 'e.g. Tech, Music, Sports'}
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                isDisabled={isTagLimitReached}
                maxLength={25}
              />
              <FormHelperText>Press Enter or comma to add a tag (up to {MAX_TAGS})</FormHelperText>
              {form.tags.length > 0 && (
                <Wrap mt={3}>
                  {form.tags.map((tag) => (
                    <WrapItem key={tag}>
                      <Tag colorScheme="green" borderRadius="full">
                        <TagLabel>{tag}</TagLabel>
                        <TagCloseButton aria-label={`Remove ${tag}`} onClick={() => removeTag(tag)} />
                      </Tag>
                    </WrapItem>
                  ))}
                </Wrap>
              )}
            </FormControl>

            <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
              <FormControl>
                <FormLabel>Meeting Schedule</FormLabel>
                <Input name="meetingSchedule" placeholder="e.g. Fridays at 5 PM" value={form.meetingSchedule} onChange={handleChange} />
              </FormControl>

              <FormControl>
                <FormLabel>Meeting Place</FormLabel>
                <Input name="meetingPlace" placeholder="e.g. Room 204, CS Block" value={form.meetingPlace} onChange={handleChange} />
              </FormControl>
            </SimpleGrid>

            <FormControl as="fieldset">
              <FormLabel as="legend">Who Can Join?</FormLabel>
              <RadioGroup value={form.joinPolicy} onChange={(value) => setForm((prev) => ({ ...prev, joinPolicy: value }))}>
                <Stack spacing={2}>
                  <Radio value="open">Anyone — students can join right away</Radio>
                  <Radio value="approval">Approval required — you review join requests</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>Cancel</Button>
          <Button colorScheme="green" onClick={handleSubmit}>Create Group</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
