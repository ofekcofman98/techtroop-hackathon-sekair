import React from 'react';
import { Container, Title, Grid, Card, Text, Badge, Group, Button, Stack, Box, Flex } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

const SurveyCard = ({ survey }) => {
    const navigate = useNavigate();
    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
            <Stack justify="space-between" h="100%">
                <Box>
                  <Group justify="space-between" mb="xs">
                        <Badge color="blue" variant="light">
                            {survey.category}
                        </Badge>
                        <Badge color={survey.is_anonymous ? "indigo" : "teal"} variant="filled">
                            {survey.is_anonymous ? "Anonymous" : "Public"}
                        </Badge>
                  </Group>

                  <Text fw={600} size="lg" mt="sm" lh="sm">
                        {survey.title}
                  </Text>
                  
                  <Text size="xs" c="dimmed" mt="xs">
                        Created by: Classmate
                  </Text>
                </Box>

                <Button 
                  variant="light" 
                  color="blue" 
                  fullWidth 
                  mt="md"
                  leftSection={<IconCheck size={16} />}
                  onClick={() => navigate(`/survey/${survey.id}`)}
                  >
                    Take Survey
                </Button>
            </Stack>
        </Card>
    )
}

export default SurveyCard;