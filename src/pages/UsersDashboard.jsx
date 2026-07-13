import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Container, Title, Table, Avatar, Group, Text, Anchor, Loader, Alert } from '@mantine/core';
import { Link } from 'react-router-dom';
import { usersStore } from '../stores/UsersStore';
import { userStore } from '../stores/userStore';
import { IconAlertCircle } from '@tabler/icons-react';
import { UsersTable } from '../components/usersDashboard/UsersTable';

export const UsersDashboard = observer(() => {
  useEffect(() => {
    usersStore.fetchUsers();
  }, []);

  if (usersStore.isLoading) {
    return (
      <Container size="md" pt="xl" style={{ display: 'flex', justifyContent: 'center' }}>
        <Loader size="xl" />
      </Container>
    );
  }

  if (usersStore.error) {
    return (
      <Container size="md" pt="xl">
        <Alert icon={<IconAlertCircle size="1rem" />} title="Error" color="red">
          {usersStore.error}
        </Alert>
      </Container>
    );
  }

  const filteredUsers = usersStore.users.filter((user) => user.id !== userStore.user?.id);

  return (
    <Container size="md" pt="xl">
      <Title order={2} mb="lg">Users Dashboard</Title>
      <UsersTable users={filteredUsers} />
    </Container>
  );
});

