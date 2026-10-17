import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { Pressable, Text } from 'react-native';

import { createMemoryStore } from '@/data/storage/keyValueStore';
import { createLibraryStorage } from '@/data/storage/libraryStorage';
import { LibraryProvider, useLibrary } from '@/features/library/LibraryProvider';

function Probe() {
  const { ready, favorites, history, toggleFavorite, recordWatch, clearHistory } = useLibrary();
  return (
    <>
      <Text testID="state">{`${ready}|${favorites.join(',')}|${history.map((h) => h.channelId).join(',')}`}</Text>
      <Pressable testID="fav" onPress={() => toggleFavorite('nessma')} />
      <Pressable testID="watch" onPress={() => recordWatch('hannibal')} />
      <Pressable testID="clear" onPress={clearHistory} />
    </>
  );
}

describe('LibraryProvider', () => {
  it('loads persisted state, then updates and persists changes', async () => {
    const store = createMemoryStore({ 'tunisietv:favorites:v1': JSON.stringify(['wataniya-1']) });
    const storage = createLibraryStorage(store);
    render(
      <LibraryProvider storage={storage}>
        <Probe />
      </LibraryProvider>,
    );

    await waitFor(() => expect(screen.getByTestId('state')).toHaveTextContent('true|wataniya-1|'));

    await act(async () => fireEvent.press(screen.getByTestId('fav')));
    await waitFor(() => expect(screen.getByTestId('state')).toHaveTextContent('true|wataniya-1,nessma|'));

    await act(async () => fireEvent.press(screen.getByTestId('watch')));
    await waitFor(() => expect(screen.getByTestId('state')).toHaveTextContent('true|wataniya-1,nessma|hannibal'));

    // Survives a "restart": a fresh storage instance over the same store sees the data.
    expect(await createLibraryStorage(store).getFavorites()).toEqual(['wataniya-1', 'nessma']);

    await act(async () => fireEvent.press(screen.getByTestId('clear')));
    await waitFor(() => expect(screen.getByTestId('state')).toHaveTextContent('true|wataniya-1,nessma|'));
  });

  it('throws a clear error outside the provider', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Probe />)).toThrow('useLibrary must be used inside <LibraryProvider>');
  });
});
