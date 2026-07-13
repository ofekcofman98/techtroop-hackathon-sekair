import React from 'react';
import { Table, Group, Avatar, Text, Anchor } from '@mantine/core';
import { Link } from 'react-router-dom';

export const UserRow = ({ user }) => {
  return (
    <Table.Tr>
      <Table.Td>
        <Group gap="sm">
          <Avatar radius="xl" size="sm" alt={user.name}>
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </Avatar>
          <Text size="sm" fw={500}>
            {user.name || 'Anonymous User'}
          </Text>
        </Group>
      </Table.Td>
      <Table.Td>
        <Text size="sm">
          {user.email || 'No Email'}
        </Text>
      </Table.Td>
      <Table.Td>
        <Text size="sm" style={{ textTransform: 'capitalize' }}>
          {user.role || 'student'}
        </Text>
      </Table.Td>
      <Table.Td>
        <Anchor component={Link} to={`/user/${user.id}`} size="sm" fw={500}>
          View Profile
        </Anchor>
      </Table.Td>
    </Table.Tr>
  );
};