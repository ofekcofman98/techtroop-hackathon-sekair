import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Container, Title, Text, Grid, SimpleGrid, LoadingOverlay, Box, Divider, Stack } from '@mantine/core';
import { IconFilePlus, IconChecklist } from '@tabler/icons-react';
import { userStore } from '../stores/userStore';
import { StatsCard } from '../components/StatsCard';
import SurveyCard from '../components/SurveyCard';

const UserProfile = observer(() => {
  const store = userStore;

  useEffect(() => {
    store.fetchProfileDashboardData();
  }, []);

  return (
    <Box style={{ position: 'relative', minHeight: '80vh' }}>
      <LoadingOverlay visible={store.isProfileLoading} overlayProps={{ blur: 2 }} />

      <Container size="lg" py="xl">
        <Box mb="xl">
          <Title order={2} c="blue" fw={800}>
            {store.profile?.name || 'User Profile'}
          </Title>
          <Text size="sm" c="dimmed" mt="xs">
            Account Role: <strong style={{ textTransform: 'uppercase' }}>{store.profile?.role || 'Student'}</strong>
          </Text>
        </Box>

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg" mb="2xl">
          <StatsCard 
            title="Surveys Created"
            value={store.createdSurveys?.length || 0}
            label="Total surveys published by you"
            color="blue"
            icon={IconFilePlus}
          />
          
          <StatsCard 
            title="Surveys Answered"
            value={store.answeredSurveysCount}
            label="Total unique surveys you voted on"
            color="teal"
            icon={IconChecklist}
          />
        </SimpleGrid>

        <Divider my="xl" label="My Created Surveys Dashboard" labelPosition="center" />

        <Box mt="lg">
          {(store.createdSurveys || []).length === 0 ? (
            <Text ta="center" c="dimmed" fontStyle="italic" mt="xl">
              You haven't created any surveys yet. Go ahead and make your first one!
            </Text>
          ) : (
            <Grid>
              {store.createdSurveys.map((survey) => (
                <Grid.Col key={survey.id} span={{ base: 12, sm: 6, md: 4 }}>
                  <SurveyCard survey={survey} />
                </Grid.Col>
              ))}
            </Grid>
          )}
        </Box>
      </Container>
    </Box>
  );
});

export default UserProfile;