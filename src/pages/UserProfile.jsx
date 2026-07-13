import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container, Title, Text, Grid, SimpleGrid, LoadingOverlay, Box, Divider, Button } from '@mantine/core';
import { IconFilePlus, IconChecklist, IconArrowLeft } from '@tabler/icons-react';
import { userStore } from '../stores/userStore';
import { StatsCard } from '../components/StatsCard';
import SurveyCard from '../components/SurveyCard';
import SurveyFilters from '../components/SurveyFilters';

const UserProfile = observer(() => {
  const store = userStore;
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    store.fetchProfileDashboardData(id);
  }, [id]);

  const profile = store.displayedProfile;
  const createdSurveys = store.displayedCreatedSurveys;
  const answeredCount = store.displayedAnsweredSurveysCount;
  const isOwnProfile = store.isViewingOwnProfile;

  return (
    <Box style={{ position: 'relative', minHeight: '80vh' }}>
      <LoadingOverlay visible={store.isProfileLoading} overlayProps={{ blur: 2 }} />

      {!isOwnProfile && (
        <Button
            variant="outline"
            leftSection={<IconArrowLeft size={16} />}
            onClick={() => navigate('/users')}
        >
            Back to Dashboard
        </Button>
    )}

      <Container size="lg" py="xl">
        <Box mb="xl">
          <Title order={2} c="blue" fw={800}>
            {profile?.name || 'User Profile'}
          </Title>
          <Text size="sm" c="dimmed" mt="xs">
            Account Role: <strong style={{ textTransform: 'uppercase' }}>{profile?.role || 'Student'}</strong>
          </Text>
        </Box>

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg" mb="2xl">
          <StatsCard 
            title="Surveys Created"
            value={createdSurveys?.length || 0}
            label={isOwnProfile ? "Total surveys published by you" : `Total surveys published by ${profile?.name || 'this user'}`}
            color="blue"
            icon={IconFilePlus}
          />
          
          <StatsCard 
            title="Surveys Answered"
            value={answeredCount}
            label={isOwnProfile ? "Total unique surveys you voted on" : `Total unique surveys this user voted on`}
            color="teal"
            icon={IconChecklist}
          />
        </SimpleGrid>

        <Divider 
          my="xl" 
          label={isOwnProfile ? "My Created Surveys Dashboard" : `${profile?.name || 'User'}'s Surveys Dashboard`} 
          labelPosition="center" 
        />

        <SurveyFilters 
            searchQuery={store.searchQuery}
            onSearchQueryChange={(val) => store.setSearchQuery(val)}
            selectedCategory={store.selectedCategory}
            onCategoryChange={(val) => store.setSelectedCategory(val)}
            visibilityFilter={store.visibilityFilter}
            onVisibilityFilterChange={(val) => store.setVisibilityFilter(val)}
        />
       
        <Box mt="lg">
          {(createdSurveys || []).length === 0 ? (
            <Text ta="center" c="dimmed" fontStyle="italic" mt="xl">
              {isOwnProfile 
                ? "You haven't created any surveys yet. Go ahead and make your first one!"
                : "This user hasn't created any surveys yet."}
            </Text>
          ) : (
            <Grid>
              {createdSurveys.map((survey) => (
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