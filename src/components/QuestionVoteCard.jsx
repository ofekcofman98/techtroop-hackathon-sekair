import React from 'react';
import { Card, Text, Radio, Stack } from '@mantine/core';

export const QuestionVoteCard = ({ question, selectedValue, onSelect }) => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Text fw={600} size="md" mb="md">
        {question.question_text}
      </Text>

      <Radio.Group value={selectedValue} onChange={onSelect}>
        <Stack spacing="xs">
          {question.options.map((option, index) => (
            <Radio 
              key={index} 
              value={option} 
              label={option} 
            />
          ))}
        </Stack>
      </Radio.Group>
    </Card>
  );
};