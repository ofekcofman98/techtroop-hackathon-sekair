import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Title, Card, Text, Radio, Button, Stack, Loader, Center, Box, Flex } from '@mantine/core';
import { IconCheck, IconArrowLeft } from '@tabler/icons-react';
import { QuestionVoteCard } from '../components/QuestionVoteCard';
import { voteSurveyStore } from '../stores/voteSurveyStore';

const VoteSurvey = observer(() => {
  const store = voteSurveyStore;
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    store.loadSurvey(id);
  }, [id]);

  useEffect(() => {
    if (store.isAnswered) {
      navigate(`/results/${id}`);
    }
  }, [store.isAnswered, id, navigate]);

  const handleVoteSubmit = async () => {
    const totalQuestions = store.currentSurvey.questions.length;
    const answeredQuestions = Object.keys(store.selectedOptions).length;

    if (answeredQuestions < totalQuestions) {
      alert('Please answer all questions before submitting.');
      return;
    }

    const success = await store.submitVote();
    if (success) {
      navigate(`/results/${id}`);
    }
  };


  if (store.isLoading || !store.currentSurvey) {
    return (
      <Center style={{ height: '100vh' }}>
        <Loader size="xl" />
      </Center>
    );
  }

  if (store.isAnswered) {
    return null;
  }

  const creatorName = store.currentSurvey.profiles?.name || 'Unknown User';

  return (
    <Container size="sm" py="xl">
      <Flex justify="space-between" align="center" mb="lg" wrap="nowrap" gap="md">
        <Title order={2} c="blue">
          {store.currentSurvey.title}
        </Title>
        <Button
          variant="outline"
          leftSection={<IconArrowLeft size={16} />}
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </Button>
      </Flex>

      <Box mb="xl">
        <Text size="sm" c="dimmed" mb="xs">
          Created by: {creatorName}
        </Text>
        <Text size="sm" c="dimmed">
          {store.currentSurvey.is_anonymous ? "🔒 This survey is anonymous" : "📢 Your vote will be public"}
        </Text>
      </Box>

      <Stack spacing="lg">
        {store.currentSurvey.questions.map((question) => (
          <QuestionVoteCard
            key={question.id}
            question={question}
            selectedValue={store.selectedOptions[question.id] !== undefined ? store.selectedOptions[question.id] : null}
            onSelect={(value) => store.selectOption(question.id, value)}
          />
        ))}

        <Button
          color="blue"
          size="md"
          radius="md"
          mt="md"
          fullWidth
          loading={store.isSubmitting}
          leftSection={<IconCheck size={16} />}
          onClick={handleVoteSubmit}
        >
          Submit Vote
        </Button>
      </Stack>
    </Container>
  );
});

export default VoteSurvey;