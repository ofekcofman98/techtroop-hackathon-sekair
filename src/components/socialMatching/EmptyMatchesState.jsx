import React from 'react';
import { Card, Text } from '@mantine/core';

const EmptyMatchesState = () => (
  <Card shadow="sm" padding="lg" radius="md" withBorder ta="center" py="xl">
    <Text size="lg" fw={500} mb="xs">No Matches Yet</Text>
    <Text size="sm" c="dimmed">
      You need to vote in some public (non-anonymous) surveys first so we can compare your choices with your classmates!
    </Text>
  </Card>
);

export default EmptyMatchesState;