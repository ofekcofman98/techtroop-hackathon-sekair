import React from 'react';
import { Table, Text } from '@mantine/core';
import { UserRow } from './UserRow';

export const UsersTable = ({ users }) => {
  return (
    <Table highlightOnHover verticalSpacing="sm">
      <Table.Thead>
        <Table.Tr>
          <Table.Th>User</Table.Th>
          <Table.Th>Email</Table.Th>
          <Table.Th>Role</Table.Th>
          <Table.Th>Actions</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {users.length > 0 ? (
          users.map((user) => (
            <UserRow key={user.id} user={user} />
          ))
        ) : (
          <Table.Tr>
            <Table.Td colSpan={4}>
              <Text ta="center" c="dimmed" my="md">
                No users found
              </Text>
            </Table.Td>
          </Table.Tr>
        )}
      </Table.Tbody>
    </Table>
  );
};