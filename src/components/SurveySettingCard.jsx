import React from 'react';
import { Card, TextInput, Switch } from '@mantine/core';

export const SurveySettingsCard = ({ title, isAnonymous, onTitleChange, onAnonymousChange }) => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <TextInput
        label="Survey Title"
        placeholder="e.g., What are your favorite weekend hobbies?"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        required
        mb="md"
      />

      <Switch
        label="Make responses anonymous"
        description="If enabled, votes will not be linked to student profiles"
        checked={isAnonymous}
        onChange={(e) => onAnonymousChange(e.currentTarget.checked)}
      />
    </Card>
  );
};