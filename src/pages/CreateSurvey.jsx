import React from 'react';
import { observer } from 'mobx-react-lite';
import { Container, Title, TextInput, Switch, Button, Card, Text, ActionIcon, Stack, Group, Divider, Flex } from '@mantine/core';
import { IconTrash, IconPlus, IconSend, IconArrowLeft } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { newSurveyStore } from '../stores/NewSurveyStore';
import { SurveySettingsCard } from '../components/SurveySettingCard';
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

    const success = await store.submitSurvey();
    if (success) {
      alert('Survey created successfully (Mock)!');
    }
  };

  // תוקן: הוספנו const ומחקנו את מבנה ה-Class
  const handleLogout = async () => {
    await userStore.logout();
  };

  // תוקן: מחקנו את ה-()render המיותר. ה-return רץ ישירות בתוך הפונקציה.
  return (
    <Container size="sm" py="xl">

      {/* ה-Header של החבר (פרטי משתמש וניתוק) */}
      <Group justify="space-between" mb="xl" style={{ borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
        <div>
          <Title order={4} c="blue">SekAir System</Title>
          <Text size="xs" c="dimmed">
            Logged in as: <strong style={{ color: '#333' }}>{userStore.profile?.name || 'Student'}</strong> ({userStore.profile?.role})
          </Text>
        </div>

        {/* תוקן: handleLogout במקום this.handleLogout */}
        <Button color="red" variant="light" size="xs" onClick={handleLogout}>
          Logout
        </Button>
      </Group>

      <Flex justify="space-between" align="center" mb="lg" wrap="nowrap">
        <Title order={2} c="blue">
          Create New Survey
        </Title>
        <Button
          variant="outline"
          leftSection={<IconArrowLeft size={16} />}
          onClick={() => navigate('/')}
        >
          Back to Dashboard
        </Button>
      </Flex>

      <form onSubmit={handleSubmit}>
        <Stack spacing="md">
          
          <SurveySettingsCard
            title={store.title}
            isAnonymous={store.isAnonymous}
            onTitleChange={(val) => store.setTitle(val)}
            onAnonymousChange={(val) => store.setIsAnonymous(val)}
          />

          <Divider label="Survey Questions" labelPosition="center" my="lg" />

          {store.error && (
            <Text color="red" size="sm" ta="center" weight={500}>
              {store.error}
            </Text>
          )}

          {store.questions.map((question, qIndex) => (
            <Card key={qIndex} shadow="sm" padding="lg" radius="md" withBorder>
              <Group position="apart" mb="xs">
                <Text weight={600} size="sm" c="dimmed">
                  Question #{qIndex + 1}
                </Text>
                
                {store.questions.length > 1 && (
                  <ActionIcon
                    color="red"
                    variant="light"
                    onClick={() => store.removeQuestion(qIndex)}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                )}
              </Group>

              <TextInput
                placeholder="Enter your question here"
                value={question.question_text}
                onChange={(e) => store.updateQuestionText(qIndex, e.target.value)}
                required
                mb="md"
              />

              <Text size="xs" weight={500} mb={5} c="dimmed">
                Answers Options (Provide exactly 4 options):
              </Text>
              <Stack spacing="xs">
                {question.options.map((option, oIndex) => (
                  <TextInput
                    key={oIndex}
                    placeholder={`Option ${oIndex + 1}`}
                    value={option}
                    onChange={(e) => store.updateOptionText(qIndex, oIndex, e.target.value)}
                    required
                    size="sm"
                  />
                ))}
              </Stack>
            </Card>
          ))}

          <Group position="apart" mt="lg">
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
    </Container>
  );
}); // סגירת ה-observer בצורה תקינה

export default CreateSurvey;