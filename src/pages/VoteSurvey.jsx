import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Title, Card, Text, Radio, Button, Stack, Loader, Center, Box, Flex } from '@mantine/core';
import { IconCheck, IconArrowLeft } from '@tabler/icons-react';
import { QuestionVoteCard } from '../components/QuestionVoteCard';
import { voteSurveyStore } from '../stores/VoteSurveyStore';

const VoteSurvey = observer(() => {
  const store = voteSurveyStore;
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    store.loadSurvey(id);
  }, [id]);

  const handleVoteSubmit = async () => {
    const totalQuestions = store.currentSurvey.questions.length;
    const answeredQuestions = Object.keys(store.selectedOptions).length;

    if (answeredQuestions < totalQuestions) {
      alert('Please answer all questions before submitting.');
      return;
    }

    const success = await store.submitVote();
    if (success) {
      alert('Your vote has been recorded successfully!');
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
    return (
      <Center style={{ height: '100vh' }}>
        <Container size="xs" ta="center">
          <Title order={3} c="blue" mb="sm">
            You have already voted!
          </Title>
          <Text size="sm" c="dimmed" mb="xl">
            Thank you for participating. You can only submit your answers once per survey.
          </Text>
          <Button
            variant="outline"
            color="blue"
            fullWidth
            onClick={() => navigate(`/results/${id}`)}>View Results</Button>
        </Container>
      </Center>
    )
  }


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
        <Text size="sm" c="dimmed">
          {store.currentSurvey.is_anonymous ? "🔒 This survey is anonymous" : "📢 Your vote will be public"}
        </Text>
      </Box>

      <Stack spacing="lg">
        {store.currentSurvey.questions.map((question) => (
          <QuestionVoteCard
            key={question.id}
            question={question}
            selectedValue={store.selectedOptions[question.id] || ''}
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