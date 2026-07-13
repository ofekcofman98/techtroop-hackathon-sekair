import React, { useState ,useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Container, Title, Grid, Card, Text, Badge, Group, Button, Stack, Box, Flex, ActionIcon } from '@mantine/core';
import { IconCheck, IconTrash, IconLock, IconWorld } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { userStore } from '../stores/userStore';
import { dashboardStore } from '../stores/dashboardStore';
import { getCategoryColor } from '../constants/categories';
import { SurveyVisibilityBadge } from './SurveyVisibiltyBadge';
import { voteSurveyStore } from '../stores/voteSurveyStore';

const SurveyCard = observer(({ survey }) => {
    const navigate = useNavigate();
    const [hasVoted, setHasVoted] = useState(false);

    useEffect(() => {
        const checkStatus = async () => {
            const voted = await voteSurveyStore.checkIfUserAnswered(survey.id);
            setHasVoted(voted);
        };
        checkStatus();
    }, [survey.id]);


    const handleDelete = (e) => {
        e.stopPropagation();
        if (window.confirm(`Are you sure you want to delete "${survey.title}"?`)) {
            dashboardStore.deleteSurvey(survey.id);
        }
    };

    function handleSurveyClick() {
        if (hasVoted) {
            navigate(`/results/${survey.id}`);
        } else {
            navigate(`/survey/${survey.id}`)
        }
    }

    const creatorName = survey.profiles?.name || survey.profiles?.username ||'Unknown User';

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
            <Stack justify="space-between" h="100%">
                <Box>
                    <Group justify="space-between" mb="xs">
                        <Badge color={getCategoryColor(survey.category)} variant="light">
                            {survey.category}
                        </Badge>

                        <Group gap="xs" mt="sm">
                            <SurveyVisibilityBadge isAnonymous={survey.is_anonymous} />
                        </Group>

                        {(userStore.isAdmin || userStore.user?.id === survey.created_by) && (
                            <ActionIcon
                                color="red"
                                variant="subtle"
                                onClick={handleDelete}
                                title="Delete Survey"
                            >
                                <IconTrash size={18} />
                            </ActionIcon>
                        )}
                    </Group>

                    <Text fw={600} size="lg" mt="sm" lh="sm">
                        {survey.title}
                    </Text>

                    <Text size="xs" c="dimmed" mt="xs">
                        Created by: {creatorName}
                    </Text>
                </Box>

                <Button
                    variant="light"
                    color={hasVoted ? "green" : "blue"}
                    fullWidth
                    mt="md"
                    leftSection={<IconCheck size={16} />}
                    onClick={handleSurveyClick}
                >
                    {hasVoted? 'View Results' : 'Take Survey'}
                </Button>
            </Stack>
        </Card>
    )
});

export default SurveyCard;