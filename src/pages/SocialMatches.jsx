import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Container, Title, Card, Text, Group, Avatar, Center, Loader, SimpleGrid, RingProgress } from '@mantine/core';
import { userStore } from '../stores/userStore';
import MatchCard from '../components/socialMatching/MatchCard';
import EmptyMatchesState from '../components/socialMatching/EmptyMatchesState';

export const SocialMatches = observer(() => {
  useEffect(() => {
    userStore.loadSocialMatches();
  }, []);

  if (userStore.isMatchesLoading) {
    return (
      <Center style={{ height: '70vh' }}>
        <Loader size="xl" />
      </Center>
    );
  }

  return (
    <Container size="md" py="xl">
      <Title order={2} c="blue" ta="center" mb="xs">
        Classmate Compatibility Matcher
      </Title>
      <Text size="sm" c="dimmed" ta="center" mb="xl">
        Discover who in your class thinks exactly like you based on your public survey responses!
      </Text>

      {userStore.matches.length === 0 ? (
        <EmptyMatchesState />
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          {userStore.matches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </SimpleGrid>
      )}
    </Container>
  );
});