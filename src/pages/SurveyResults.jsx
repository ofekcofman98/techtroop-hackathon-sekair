import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Title, Card, Text, Button, Stack, Loader, Center, Box, Progress, Group } from '@mantine/core';
import { voteSurveyStore } from '../stores/voteSurveyStore';

const SurveyResults = observer(() => {
    const store = voteSurveyStore;
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        store.loadSurvey(id);
        store.loadResults(id);
    }, [id]);

    if (store.isLoading || !store.currentSurvey) {
        return (
            <Center style={{ height: '100vh' }}>
                <Loader size="xl" />
            </Center>
        );
    }

    function getTotalVotesForQuestion(questionId) {
        if (!store.currentResults) {
            return 0;
        }

        const allAnswers = store.currentResults[questionId];
        if (!allAnswers) {
            return 0;
        }
        let total = 0;
        const values = Object.values(allAnswers);

        for (let i = 0; i < values.length; i++) {
            total += values[i];
        }
        return total;
    }

    function renderAnswerRow(answerText, index, allAnswers, totalVotes) {
        let votesForAnswer = 0;
        if (allAnswers && allAnswers[index]) {
            votesForAnswer = allAnswers[index];
        }
        let percent = 0;
        if (totalVotes > 0) {
            percent = Math.round((votesForAnswer / totalVotes) * 100);
        }
        return (
            <Box key={index} mb="sm">
                <Group justify="space-between" mb={5}>
                    <Text size="sm" weight={500}>{answerText}</Text>
                    <Text size="xs" c="dimmed">
                        {votesForAnswer} votes ({percent}%)
                    </Text>
                </Group>

                <Progress
                    value={percent}
                    color="blue"
                    size="md"
                    radius="sm"
                />
            </Box>
        );
    }

    function renderQuestionCard(question) {
        const allAnswers = store.currentResults ? store.currentResults[question.id] : null;
        const totalVotes = getTotalVotesForQuestion(question.id)

        return (
            <Card key={question.id} shadow="sm" padding="md" radius="md" withBorder mb="md">
                <Text weight={500} mb="md">
                    {question.question_text}
                </Text>

                <Stack spacing="xs">
                    {question.options.map((answerText, index) => {
                        return renderAnswerRow(answerText, index, allAnswers, totalVotes);
                    })}
                </Stack>
            </Card>
        );

    }

    const creatorName = store.currentSurvey.profiles?.name || 'Unknown User';

    return (
        <Container size="sm" py="xl">
            <Title order={2} c="blue" ta="center" mb="xl">
                {store.currentSurvey.title} - Results
            </Title>
            <Text size="sm" c="dimmed" ta="center" mb="xl">
                Created by: {creatorName}
            </Text>

            <Stack spacing="lg">
                {store.currentSurvey.questions.map(renderQuestionCard)}

                <Button variant="outline" fullWidth onClick={() => navigate('/dashboard')}>
                    Back to Dashboard
                </Button>
            </Stack>
        </Container>
    );
});

export default SurveyResults;