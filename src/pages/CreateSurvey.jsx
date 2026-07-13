import React from 'react';
import { observer } from 'mobx-react-lite';
import { Container, Title, TextInput, Switch, Button, Card, Text, ActionIcon, Stack, Group, Divider, Flex, Center } from '@mantine/core';
import { IconTrash, IconPlus, IconSend, IconArrowLeft } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { newSurveyStore } from '../stores/newSurveyStore';
import { SurveySettingsCard } from '../components/SurveySettingCard';
import { QuestionFormCard } from '../components/QuestionFormCard';
import { userStore } from '../stores/userStore';

const CreateSurvey = observer(() => {
  const store = newSurveyStore;
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!store.title.trim()) {
      alert('Please enter a survey title');
      return;
    }

    const userId = userStore.profile?.id;
    if (!userId) {
      alert('User profile not found. Please try logging in again.');
      return;
    }

    const success = await store.submitSurvey(userId);
    if (success) {
      setTimeout(() => {
        navigate('/dashboard');
        store.resetForm();
      }, 3000);
    }
  };

  const handleLogout = async () => {
    await userStore.logout();
  };

  return (
    <Container size="sm" py="xl">
      {store.isSuccess ? (
        <Center style={{ height: '40vh' }}>
          <Stack align="center" ta="center">
            <Title order={2} c="green">Survey Created Successfully!</Title>
            <Text size="sm" c="dimmed">
              Your survey has been published to Supabase.
            </Text>
            <Text size="xs" c="blue" fw={500} mt="xs">
              Redirecting you to the dashboard...
            </Text>
          </Stack>
        </Center>
      ) : (
        <>
          <Flex justify="space-between" align="center" mb="lg" wrap="nowrap">
            <Title order={2} c="blue">
              Create New Survey
            </Title>
            <Button
              variant="outline"
              leftSection={<IconArrowLeft size={16} />}
              onClick={() => navigate('/dashboard')}
            >
              Back to Dashboard
            </Button>
          </Flex>

          <form onSubmit={handleSubmit}>
            <Stack gap="md">
              <SurveySettingsCard
                title={store.title}
                isAnonymous={store.isAnonymous}
                category={store.category}
                onTitleChange={(val) => store.setTitle(val)}
                onAnonymousChange={(val) => store.setIsAnonymous(val)}
                onCategoryChange={(val) => store.setCategory(val)}
              />

              <Divider label="Survey Questions" labelPosition="center" my="lg" />

              {store.error && (
                <Text color="red" size="sm" ta="center" fw={500}>
                  {store.error}
                </Text>
              )}

              {store.questions.map((question, qIndex) => (
                <QuestionFormCard
                  key={qIndex}
                  question={question}
                  index={qIndex}
                  showDelete={store.questions.length > 1}
                  onDelete={() => store.removeQuestion(qIndex)}
                  onQuestionTextChange={(text) => store.updateQuestionText(qIndex, text)}
                  onOptionTextChange={(oIndex, text) => store.updateOptionText(qIndex, oIndex, text)}
                />
              ))}

              <Group justify="space-between" mt="lg">
                <Button
                  variant="outline"
                  leftSection={<IconPlus size={16} />}
                  onClick={store.addQuestion}
                  disabled={store.isLoading}
                >
                  Add Question
                </Button>

                <Button
                  type="submit"
                  color="blue"
                  rightSection={<IconSend size={16} />}
                  loading={store.isLoading}
                >
                  Publish Survey
                </Button>
              </Group>
            </Stack>
          </form>
        </>
      )}
    </Container>
  );
});

export default CreateSurvey;