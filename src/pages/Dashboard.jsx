import React from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { Container, Title, Grid, Card, Text, Badge, Group, Button, Stack, Box, Flex, Loader } from '@mantine/core';
import { IconPlus, IconCheck } from '@tabler/icons-react';
// import SurveyFilters from '../components/SurveyFilters';
import { dashboardStore } from '../stores/DashboardStore';
import SurveyCard from '../components/SurveyCard';
import { useEffect } from 'react';

const Dashboard = observer(() => {
  const store = dashboardStore;
  const navigate = useNavigate();

  useEffect(() => {
    store.fetchSurveys();
  }, []);


  if (store.isLoading) return <Loader />;
  if (store.error) return <Text c="red">Failed Fetching: {store.error}</Text>;

  return (
    <Container size="lg" py="xl">
      <Flex justify="space-between" align="center" mb="2xl" direction={{ base: 'column', sm: 'row' }} gap="md">
        <Title order={1} c="blue" style={{ fontFamily: 'sans-serif', fontWeight: 900 }}>
          SekAir 🚀
        </Title>
        
        <Button 
          leftSection={<IconPlus size={16} />} 
          color="blue" 
          radius="md"
          onClick={() => navigate('/create')} 
        >
          Create New Survey
        </Button>
      </Flex>

      {/* <SurveyFilters /> */}

      <Grid mt="lg">
        {store.filteredSurveys.map((survey) => (
          <Grid.Col key={survey.id} span={{ base: 12, sm: 6, md: 4 }}>
            <SurveyCard survey={survey}/>
          </Grid.Col>
        ))}
      </Grid>

      {store.filteredSurveys.length === 0 && (
        <Text ta="center" c="dimmed" mt="2xl" size="lg" fontStyle="italic">
          No surveys match your search or category selection.
        </Text>
      )}
    </Container>
  );
});

export default Dashboard;