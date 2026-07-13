import React from 'react';
import { Card, Text, Group, Avatar, RingProgress } from '@mantine/core';

const MatchCard = ({ match }) => {
  const getProgressColor = (percent) => {
    if (percent > 70) return 'teal';
    if (percent > 40) return 'blue';
    return 'orange';
  };

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder>
      <Group justify="space-between" wrap="nowrap">
        <Group gap="sm">
          <Avatar size="md" radius="xl" color="blue">
            {match.name ? match.name.charAt(0).toUpperCase() : 'S'}
          </Avatar>
          <div>
            <Text fw={600} size="sm">{match.name}</Text>
            <Text size="xs" c="dimmed" style={{ textTransform: 'capitalize' }}>
              {match.role}
            </Text>
            <Text size="xxs" c="blue" mt={2}>
              Based on {match.sharedQuestions} common questions answered
            </Text>
          </div>
        </Group>

        <RingProgress
          size={75}
          thickness={6}
          roundCaps
          sections={[{ value: match.percentage, color: getProgressColor(match.percentage) }]}
          label={
            <Text ta="center" fw={700} size="xs">
              {match.percentage}%
            </Text>
          }
        />
      </Group>
    </Card>
  );
};

export default MatchCard;