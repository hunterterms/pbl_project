import React, { useState, useRef } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  Button, FormControl, FormLabel, FormErrorMessage, Input, Select, Textarea, SimpleGrid, Stack, useToast
} from '@chakra-ui/react';

const CATEGORIES = ['Academic', 'Workshop', 'Social', 'Cultural', 'Sports', 'Career', 'Other'];

const EMPTY_FORM = {
  title: '',
  category: 'Academic',
  hostedBy: '',
  date: '',
  startTime: '',
  endTime: '',
  location: '',
  capacity: '',
  entryFee: '',
  description: '',
};

// Today's date as YYYY-MM-DD in local time (toISOString() would give the UTC date instead)
const getToday = () => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
};

const isWholeNumber = (value, min) => Number.isInteger(Number(value)) && Number(value) >= min;

const validate = (form) => {
  const errors = {};

  if (!form.title.trim()) errors.title = 'Give your event a title';

  if (!form.date) errors.date = 'Pick a date';
  else if (form.date < getToday()) errors.date = "Date can't be in the past";

  if (!form.startTime) errors.startTime = 'Pick a start time';
  else if (!errors.date && new Date(`${form.date}T${form.startTime}`) < new Date()) {
    errors.startTime = 'This time has already passed';
  }

  if (form.endTime && form.startTime && form.endTime <= form.startTime) {
    errors.endTime = 'Must be after the start time';
  }

  if (!form.location.trim()) errors.location = 'Where is it happening?';
  if (form.capacity && !isWholeNumber(form.capacity, 1)) errors.capacity = 'Enter a whole number (1 or more)';
  if (form.entryFee && !isWholeNumber(form.entryFee, 0)) errors.entryFee = 'Enter a whole amount (0 or more)';
  if (!form.description.trim()) errors.description = 'Tell people what to expect';

  return errors;
};

export default function CreateEventModal({ isOpen, onClose, onCreate }) {
  const toast = useToast();
  const titleRef = useRef(null);

  const [form, setForm] = useState(EMPTY_FORM);
  const [showErrors, setShowErrors] = useState(false);

  // Errors only show up after the first submit attempt, then update live as fields get fixed
  const errors = showErrors ? validate(form) : {};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (Object.keys(validate(form)).length > 0) {
      setShowErrors(true);
      return;
    }

    const title = form.title.trim();

    onCreate({
      id: Date.now().toString(),
      title,
      category: form.category,
      hostedBy: form.hostedBy.trim(),
      date: form.date,
      startTime: form.startTime,
      endTime: form.endTime,
      location: form.location.trim(),
      capacity: form.capacity ? Number(form.capacity) : null,
      entryFee: Number(form.entryFee) || 0,
      description: form.description.trim(),
      attendees: 0,
      createdAt: new Date().toISOString(),
    });

    toast({
      title: "Event Created!",
      description: `"${title}" is now listed on Campus Events.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    // Reset Form
    setForm(EMPTY_FORM);
    setShowErrors(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} initialFocusRef={titleRef} isCentered size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create an Event</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            <FormControl isRequired isInvalid={!!errors.title}>
              <FormLabel>Event Title</FormLabel>
              <Input ref={titleRef} name="title" placeholder="e.g. Intro to Machine Learning Workshop" value={form.title} onChange={handleChange} />
              <FormErrorMessage>{errors.title}</FormErrorMessage>
            </FormControl>

            <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
              <FormControl isRequired>
                <FormLabel>Category</FormLabel>
                <Select name="category" value={form.category} onChange={handleChange}>
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Hosted By</FormLabel>
                <Input name="hostedBy" placeholder="e.g. Coding Club" value={form.hostedBy} onChange={handleChange} />
              </FormControl>
            </SimpleGrid>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              <FormControl isRequired isInvalid={!!errors.date}>
                <FormLabel>Date</FormLabel>
                <Input type="date" name="date" min={getToday()} value={form.date} onChange={handleChange} />
                <FormErrorMessage>{errors.date}</FormErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={!!errors.startTime}>
                <FormLabel>Start Time</FormLabel>
                <Input type="time" name="startTime" value={form.startTime} onChange={handleChange} />
                <FormErrorMessage>{errors.startTime}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.endTime}>
                <FormLabel>End Time</FormLabel>
                <Input type="time" name="endTime" value={form.endTime} onChange={handleChange} />
                <FormErrorMessage>{errors.endTime}</FormErrorMessage>
              </FormControl>
            </SimpleGrid>

            <FormControl isRequired isInvalid={!!errors.location}>
              <FormLabel>Location</FormLabel>
              <Input name="location" placeholder="e.g. Innovation Lab, or a Google Meet link" value={form.location} onChange={handleChange} />
              <FormErrorMessage>{errors.location}</FormErrorMessage>
            </FormControl>

            <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
              <FormControl isInvalid={!!errors.capacity}>
                <FormLabel>Capacity</FormLabel>
                <Input type="number" name="capacity" min={1} placeholder="Leave blank for no limit" value={form.capacity} onChange={handleChange} />
                <FormErrorMessage>{errors.capacity}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.entryFee}>
                <FormLabel>Entry Fee (₹)</FormLabel>
                <Input type="number" name="entryFee" min={0} placeholder="Leave blank if free" value={form.entryFee} onChange={handleChange} />
                <FormErrorMessage>{errors.entryFee}</FormErrorMessage>
              </FormControl>
            </SimpleGrid>

            <FormControl isRequired isInvalid={!!errors.description}>
              <FormLabel>Description</FormLabel>
              <Textarea
                name="description"
                placeholder="What's happening, who should come, anything to bring..."
                value={form.description}
                onChange={handleChange}
              />
              <FormErrorMessage>{errors.description}</FormErrorMessage>
            </FormControl>
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>Cancel</Button>
          <Button colorScheme="blue" onClick={handleSubmit}>Create Event</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
