import React from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Group, Button, Text, Menu, Avatar, UnstyledButton } from '@mantine/core';
import { IconLogout, IconUser, IconLayoutDashboard } from '@tabler/icons-react';
import { userStore } from '../stores/userStore';

export const Navbar = observer(() => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await userStore.logout();
  };

  if (!userStore.isAuthenticated) {
      return null;
  }

  return (
    <Box bg="white" style={{ borderBottom: '1px solid #eee' }} py="sm" mb="xl">
      <Container size="lg">
        <Group justify="space-between">
          
          <Group gap="md">
            <Text 
              fw={900} 
              c="blue" 
              style={{ cursor: 'pointer', fontFamily: 'sans-serif' }} 
              onClick={() => navigate('/dashboard')}
            >
              SekAir 🚀
            </Text>
            
            <Button 
              variant="subtle" 
              size="xs" 
              leftSection={<IconLayoutDashboard size={14} />}
              onClick={() => navigate('/dashboard')}
            >
              Dashboard
            </Button>
          </Group>

          {/* User Profile Dropdown Menu */}
          <Group gap="xs">
            <Menu shadow="md" width={200} position="bottom-end">
              <Menu.Target>
                <UnstyledButton style={{ display: 'block' }}>
                  <Group gap="xs">
                    <Avatar radius="xl" color="blue" size="sm">
                      {userStore.profile?.name?.charAt(0).toUpperCase() || 'U'}
                    </Avatar>
                    <Box>
                      <Text size="sm" fw={600}>
                        {userStore.profile?.name || 'Student'}
                      </Text>
                      <Text size="xxs" c="dimmed" style={{ textTransform: 'uppercase' }}>
                        {userStore.profile?.role || 'user'}
                      </Text>
                    </Box>
                  </Group>
                </UnstyledButton>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Label>Account Settings</Menu.Label>
                <Menu.Item 
                  leftSection={<IconUser size={14} />}
                  onClick={() => navigate(`/user/${userStore.user?.id}`)}
                >
                  My Profile
                </Menu.Item>

                <Menu.Divider />

                <Menu.Label>Actions</Menu.Label>
                <Menu.Item 
                  color="red" 
                  leftSection={<IconLogout size={14} />}
                  onClick={handleLogout}
                >
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>

        </Group>
      </Container>
    </Box>
  );
});