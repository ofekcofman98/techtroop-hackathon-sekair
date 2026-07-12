import React from 'react';
import { Card, Group, Text, ActionIcon, TextInput, Stack } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';

export const QuestionFormCard = ({ 
  question, 
  index, 
  showDelete, 
  onDelete, 
  onQuestionTextChange, 
  onOptionTextChange 
}) => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between" mb="xs">
        <Text fw={600} size="sm" c="dimmed">
          Question #{index + 1}
        </Text>

        {showDelete && (
          <ActionIcon color="red" variant="light" onClick={onDelete}>
            <IconTrash size={16} />
          </ActionIcon>
        )}
      </Group>

      <TextInput
        placeholder="Enter your question here"
        value={question.question_text}
        onChange={(e) => onQuestionTextChange(e.target.value)}
        required
        mb="md"
      />

      <Text size="xs" fw={500} mb={5} c="dimmed">
        Answers Options (Provide exactly 4 options):
      </Text>

      <Stack gap="xs">
        {question.options.map((option, oIndex) => (
          <TextInput
            key={oIndex}
            placeholder={`Option ${oIndex + 1}`}
            value={option}
            onChange={(e) => onOptionTextChange(oIndex, e.target.value)}
            required
            size="sm"
          />
        ))}
      </Stack>
    </Card>
  );
};