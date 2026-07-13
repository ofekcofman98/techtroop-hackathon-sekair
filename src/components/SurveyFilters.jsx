import React from 'react';
import { observer } from 'mobx-react-lite';
import { TextInput, Stack, Box, Group, Button, SegmentedControl, Center } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { dashboardStore } from '../stores/DashboardStore';
import { CATEGORIES_CONFIG } from '../constants/categories';
import { VISIBILITY_CONFIG } from '../constants/visibility';
import { Categories } from './Categories';

const SurveyFilters = observer(({
  searchQuery,
  onSearchQueryChange,
  selectedCategory,
  onCategoryChange,
  visibilityFilter,
  onVisibilityFilterChange
}) => {

  const visibilityData = [
    { label: 'All Types', value: 'all' },
    ...VISIBILITY_CONFIG.map(item => {
      const Icon = item.icon;
      return {
        value: item.value,
        label: (
          <Center gap={4}>
            <Icon size={14} />
            <span>{item.label}</span>
          </Center>
        )
      };
    })
  ];

  return (
    <Box mb="xl">
      <Stack gap="md">
        <TextInput
          placeholder="Search for a survey by title, content or creator name..."
          leftSection={<IconSearch size={16} />}
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          size="md"
          radius="md"
        />

        <Categories 
          value={selectedCategory} 
          onChange={onCategoryChange} 
          showAll={true} 
        />

        <SegmentedControl
          size="xs"
          radius="md"
          value={visibilityFilter}
          onChange={onVisibilityFilterChange}
          data={visibilityData}
          color={
            visibilityFilter === 'anonymous' ? 'indigo' : 
            visibilityFilter === 'public' ? 'teal' : 'blue'
          }
        />
      </Stack>
    </Box>
  );
});

export default SurveyFilters;