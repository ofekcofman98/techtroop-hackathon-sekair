import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { Container, Title, Grid, Card, Text, Badge, Group, Button, Stack, Box, Flex, Loader, LoadingOverlay } from '@mantine/core';
import { IconPlus, IconCheck } from '@tabler/icons-react';
import SurveyFilters from '../components/SurveyFilters';
import { dashboardStore } from '../stores/DashboardStore';
import SurveyCard from '../components/SurveyCard';
import { voteSurveyStore } from '../stores/voteSurveyStore';

const Dashboard = observer(() => {
  const store = dashboardStore;
  const navigate = useNavigate();

  useEffect(() => {
    voteSurveyStore.resetAnsweredSurveys();
    store.fetchSurveys();
  }, [store]);

  return (
    <Box style={{ position: 'relative', minHeight: '100vh' }}>
      <LoadingOverlay visible={store.isLoading} overlayProps={{ blur: 2 }} />

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

        <SurveyFilters 
          searchQuery={store.searchQuery}
          onSearchQueryChange={(val) => store.setSearchQuery(val)}
          selectedCategory={store.selectedCategory}
          onCategoryChange={(val) => store.setSelectedCategory(val)}
          visibilityFilter={store.visibilityFilter}
          onVisibilityFilterChange={(val) => store.setVisibilityFilter(val)}
        />

        <Grid mt="lg">
          {store.filteredSurveys.map((survey) => (
            <Grid.Col key={survey.id} span={{ base: 12, sm: 6, md: 4 }}>
              <SurveyCard survey={survey} />
            </Grid.Col>
          ))}
        </Grid>

        {!store.isLoading && store.filteredSurveys.length === 0 && (
          <Text ta="center" c="dimmed" mt="2xl" size="lg" fontStyle="italic">
            No surveys match your search or category selection.
          </Text>
        )}
      </Container>
    </Box>
  );
});

export default Dashboard;