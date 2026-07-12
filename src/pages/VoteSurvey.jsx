import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Title, Card, Text, Radio, Button, Stack, Loader, Center, Box } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
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
            navigate('/');
        }
    };

    if (store.isLoading || !store.currentSurvey) {
        return (
        <Center style={{ height: '100vh' }}>
            <Loader size="xl" />
        </Center>
        );
    }
    

    return (
    <Container size="sm" py="xl">
      <Box mb="xl" ta="center">
        <Title order={2} c="blue">
          {store.currentSurvey.title}
        </Title>

        <Text size="sm" c="dimmed" mt="xs">
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