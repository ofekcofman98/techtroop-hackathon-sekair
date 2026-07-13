import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Container, Title, Card, Text, Group, Avatar, Progress, Stack, Center, Loader, SimpleGrid, RingProgress, Badge } from '@mantine/core';
import { supabase } from '../services/supabaseClient';
import { userStore } from '../stores/userStore';

export const SocialMatches = observer(() => {
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    calculateMatches();
  }, []);

  const calculateMatches = async () => {
    try {
      setLoading(true);
      const myId = userStore.profile?.id;
      if (!myId) return;

      // 1. שליפת כל התשובות שלי
      const { data: myResponses, error: myErr } = await supabase
        .from('responses')
        .select('question_id, chosen_option_index, surveys(is_anonymous)')
        .eq('user_id', myId);

      if (myErr) throw myErr;

      // נסנן רק תשובות מסקרים שהם פומביים (לא אנונימיים)
      const myPublicResponses = myResponses.filter(r => r.surveys && !r.surveys.is_anonymous);

      if (myPublicResponses.length === 0) {
        setMatches([]);
        setLoading(false);
        return;
      }

      const questionIds = myPublicResponses.map(r => r.question_id);

      // 2. שליפת כל התשובות של שאר המשתמשים לאותן שאלות בדיוק
      const { data: othersResponses, error: othersErr } = await supabase
        .from('responses')
        .select(`
          user_id,
          question_id,
          chosen_option_index,
          profiles:user_id (
            name,
            role
          )
        `)
        .in('question_id', questionIds)
        .neq('user_id', myId); // לא כולל אותי

      if (othersErr) throw othersErr;

      // 3. חישוב אחוזי התאמה
      const userStats = {};

      othersResponses.forEach(resp => {
        const otherUserId = resp.user_id;
        const otherName = resp.profiles?.name || 'Student';
        const otherRole = resp.profiles?.role || 'user';

        if (!userStats[otherUserId]) {
          userStats[otherUserId] = {
            id: otherUserId,
            name: otherName,
            role: otherRole,
            sharedQuestions: 0,
            matchingAnswers: 0
          };
        }

        // נמצא מה המשתמש הנוכחי ענה על השאלה הזו
        const myAns = myPublicResponses.find(r => r.question_id === resp.question_id);
        if (myAns) {
          userStats[otherUserId].sharedQuestions += 1;
          if (myAns.chosen_option_index === resp.chosen_option_index) {
            userStats[otherUserId].matchingAnswers += 1;
          }
        }
      });

      // נהפוך למערך, נחשב אחוזים, ונסדר מהגבוה לנמוך
      const computedMatches = Object.values(userStats)
        .map(user => {
          const percentage = user.sharedQuestions > 0 
            ? Math.round((user.matchingAnswers / user.sharedQuestions) * 100)
            : 0;
          return { ...user, percentage };
        })
        .filter(user => user.sharedQuestions > 0) // רק כאלה שיש לנו לפחות שאלה משותפת איתם
        .sort((a, b) => b.percentage - a.percentage);

      setMatches(computedMatches);
    } catch (err) {
      console.error('Error calculating matches:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Center style={{ height: '70vh' }}>
        <Loader size="xl" />
      </Center>
    );
  }

  return (
    <Container size="md" py="xl">
      <Title order={2} c="blue" ta="center" mb="xs">
        Classmate Compatibility Matcher 🧬
      </Title>
      <Text size="sm" c="dimmed" ta="center" mb="xl">
        Discover who in your class thinks exactly like you based on your public survey responses!
      </Text>

      {matches.length === 0 ? (
        <Card shadow="sm" padding="lg" radius="md" withBorder ta="center" py="xl">
          <Text size="lg" fw={500} mb="xs">No Matches Yet</Text>
          <Text size="sm" c="dimmed">
            You need to vote in some public (non-anonymous) surveys first so we can compare your choices with your classmates!
          </Text>
        </Card>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          {matches.map(match => (
            <Card key={match.id} shadow="sm" padding="md" radius="md" withBorder>
              <Group justify="space-between" wrap="nowrap">
                <Group gap="sm">
                  <Avatar size="md" radius="xl" color="blue">
                    {match.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <div>
                    <Text fw={600} size="sm">{match.name}</Text>
                    <Text size="xs" c="dimmed" style={{ textTransform: 'capitalize' }}>
                      {match.role}
                    </Text>
                    <Text size="xxs" c="blue" mt={2}>
                      Based on {match.sharedQuestions} common questions answered
                    </Text>
                  </div>
                </Group>

                <RingProgress
                  size={75}
                  thickness={6}
                  roundCaps
                  sections={[{ value: match.percentage, color: match.percentage > 70 ? 'teal' : match.percentage > 40 ? 'blue' : 'orange' }]}
                  label={
                    <Text ta="center" fw={700} size="xs">
                      {match.percentage}%
                    </Text>
                  }
                />
              </Group>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </Container>
  );
});