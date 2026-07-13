import React from 'react';
import { Card, Group, Text, ThemeIcon } from '@mantine/core';

export const StatsCard = ({ title, value, label, color, icon: Icon }) => {
  return (
    <Card shadow="sm" padding="md" radius="md" withBorder>
      <Group justify="space-between">
        <div>
          <Text size="xs" c="dimmed" fw={700} style={{ textTransform: 'uppercase' }}>
            {title}
          </Text>
          <Text size="xl" fw={900} mt={4}>
            {value}
          </Text>
          <Text size="xs" c="dimmed" mt={2}>
            {label}
          </Text>
        </div>
        
        <ThemeIcon color={color} variant="light" size="xl" radius="md">
          <Icon size={24} />
        </ThemeIcon>
      </Group>
    </Card>
  );
};