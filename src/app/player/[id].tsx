import { VideoView } from 'expo-video';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  BackHandler,
  Pressable,
  ScrollView,
  StyleSheet,
  useTVEventHandler,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { channelDescription, channelTitle } from '@/components/channel/ChannelCard';
import { ChannelMonogram } from '@/components/channel/ChannelMonogram';
import { AppText } from '@/components/common/AppText';
import { Button } from '@/components/common/Button';
import { LiveBadge } from '@/components/common/LiveBadge';
import { PlayerStatusCard } from '@/components/player/PlayerStatusCard';
import { ZapStrip } from '@/components/player/ZapStrip';
import { type Channel, externalLiveUrl, isPlayable } from '@/domain/models/Channel';
import { useLibrary } from '@/features/library/LibraryProvider';
import { useAutoHide } from '@/features/player/useAutoHide';
import { type PlaybackState, usePlayback } from '@/features/player/usePlayback';
import { useChannel, useChannels } from '@/hooks/useChannels';
import { useClock } from '@/hooks/useClock';
import { useI18n } from '@/localization/i18n';
import { colors, radii, spacing, tvSafeArea } from '@/theme/tokens';
import { isTV } from '@/utils/platform';

type Playback = ReturnType<typeof usePlayback>;

interface LayoutProps {
  channel: Channel;
  channels: readonly Channel[];
  playback: Playback;
  zap: (channel: Channel) => void;
  zapBy: (step: 1 | -1) => void;
}

export default function PlayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const channel = useChannel(id);
  const channels = useChannels();
  const playback = usePlayback(channel);

  // Zapping swaps the route param, so history stays [screen, player] and BACK still leaves.
  const zap = useCallback((c: Channel) => router.setParams({ id: c.id }), []);
  const zapBy = useCallback(
    (step: 1 | -1) => {
      if (!channels?.length || !channel) return;
      const i = channels.findIndex((c) => c.id === channel.id);
      zap(channels[(i + step + channels.length) % channels.length]);
    },
    [channels, channel, zap],
  );

  if (!channel || !channels) {
    return (
      <View style={styles.screen}>
        {channel === null && <PlayerStatusCard state="unavailable" attempt={0} onRetry={() => undefined} />}
      </View>
    );
  }

  const props: LayoutProps = { channel, channels, playback, zap, zapBy };
  return isTV ? <TVPlayer {...props} /> : <PhonePlayer {...props} />;
}

/** Back to the previous screen, or Home when the player was opened by a deep link. */
function leavePlayer() {
  if (router.canGoBack()) router.back();
  else router.replace('/');
}

function useBackToLeave(onBack?: () => boolean) {
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (onBack?.()) return true;
      leavePlayer();
      return true;
    });
    return () => sub.remove();
  }, [onBack]);
}

/* ───────────────────────────── TV ───────────────────────────── */

const TV_IGNORED_EVENTS = new Set(['focus', 'blur']);

function TVPlayer({ channel, channels, playback, zap, zapBy }: LayoutProps) {
  const { t, locale } = useI18n();
  const clock = useClock();
  const { isFavorite, toggleFavorite } = useLibrary();
  const { player, state, attempt, retry, togglePlay } = playback;
  const chrome = useAutoHide(state === 'playing');

  useTVEventHandler((evt) => {
    if (!evt?.eventType || TV_IGNORED_EVENTS.has(evt.eventType)) return;
    if (evt.eventType === 'playPause') togglePlay();
    if (evt.eventType === 'channelUp' || evt.eventType === 'channelDown') {
      zapBy(evt.eventType === 'channelUp' ? 1 : -1);
    }
    chrome.show();
  });

  // First BACK only hides the chrome while a stream is playing, the next one leaves.
  const { visible, hide } = chrome;
  useBackToLeave(
    useCallback(() => {
      if (visible && state === 'playing') {
        hide();
        return true;
      }
      return false;
    }, [visible, state, hide]),
  );

  const favorite = isFavorite(channel.id);
  const externalUrl = externalLiveUrl(channel);
  // The status card's button takes focus when it's the main action (retry, or open YouTube).
  const cardHasFocus = state === 'error' || state === 'offline' || (state === 'unavailable' && !!externalUrl);

  return (
    <View style={styles.screen}>
      <VideoView player={player} style={StyleSheet.absoluteFill} contentFit="contain" nativeControls={false} />

      <View style={styles.tvCenter} pointerEvents="box-none">
        <PlayerStatusCard
          state={state}
          attempt={attempt}
          onRetry={retry}
          retryHasFocus={cardHasFocus}
          externalUrl={externalUrl}
        />
      </View>

      {!chrome.visible ? (
        // Invisible focus catcher: OK while the chrome is hidden only reveals it.
        <Pressable style={StyleSheet.absoluteFill} hasTVPreferredFocus onPress={chrome.show} />
      ) : (
        <>
          <LinearGradient
            colors={['rgba(0,0,0,0.9)', 'rgba(0,0,0,0.65)', 'transparent']}
            locations={[0, 0.6, 1]}
            style={styles.tvTop}
            pointerEvents="none"
          >
            <ChannelMonogram logo={channel.logo} size={44} />
            <View style={styles.tvTitle}>
              <View style={styles.inline}>
                <AppText variant="section" numberOfLines={1}>
                  {channelTitle(channel, locale)}
                </AppText>
                {isPlayable(channel) && <LiveBadge label={t.live} />}
              </View>
              <AppText variant="meta" color={colors.textSecondary} numberOfLines={1}>
                {channel.authorizationStatus === 'TEST_STREAM'
                  ? `${t.player.testStream} · ${channelDescription(channel, locale) ?? ''}`
                  : (channelDescription(channel, locale) ?? t.category[channel.category])}
              </AppText>
            </View>
            <AppText variant="section" style={styles.ltr}>
              {clock}
            </AppText>
          </LinearGradient>

          {/* Strong scrim: the chrome must stay readable over bright video. */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)', 'rgba(0,0,0,0.95)']}
            locations={[0, 0.3, 1]}
            style={styles.tvBottom}
          >
            <View style={styles.inline}>
              <AppText variant="badge" color={colors.textPrimary}>
                {t.player.liveChannels}
              </AppText>
              <AppText variant="meta" color={colors.textSecondary}>
                {`· ${t.player.quickZap}`}
              </AppText>
            </View>
            <ZapStrip channels={channels} currentId={channel.id} onSelect={zap} />
            <View style={styles.tvControls}>
              <Button round icon="skip-previous" accessibilityLabel={t.player.previous} onPress={() => zapBy(-1)} />
              <PlayPauseButton state={state} onPress={togglePlay} preferredFocus={!cardHasFocus} label={t} />
              <Button round icon="skip-next" accessibilityLabel={t.player.next} onPress={() => zapBy(1)} />
              <View style={styles.separator} />
              <Button
                round
                icon={favorite ? 'favorite' : 'favorite-border'}
                iconColor={favorite ? colors.accent : undefined}
                accessibilityLabel={favorite ? t.removeFavorite : t.addFavorite}
                onPress={() => toggleFavorite(channel.id)}
              />
            </View>
          </LinearGradient>
        </>
      )}
    </View>
  );
}

function PlayPauseButton({
  state,
  onPress,
  preferredFocus,
  label,
}: {
  state: PlaybackState;
  onPress: () => void;
  preferredFocus?: boolean;
  label: ReturnType<typeof useI18n>['t'];
}) {
  // Stays focusable on TV even without a stream, so the D-pad always has a landing spot.
  const inactive = state !== 'playing' && state !== 'paused';
  return (
    <Button
      round
      kind="primary"
      icon={state === 'playing' ? 'pause' : 'play-arrow'}
      accessibilityLabel={state === 'playing' ? label.player.pause : label.player.play}
      onPress={inactive ? undefined : onPress}
      hasTVPreferredFocus={preferredFocus}
      style={[styles.playButton, inactive && styles.dim]}
    />
  );
}

/* ──────────────────────────── Phone ─────────────────────────── */

function PhonePlayer({ channel, channels, playback, zap, zapBy }: LayoutProps) {
  const { t, locale, isRTL } = useI18n();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const landscape = width > height;
  const { isFavorite, toggleFavorite } = useLibrary();
  const { player, state, attempt, retry, togglePlay } = playback;
  const chrome = useAutoHide(state === 'playing', 4_000);
  const videoRef = useRef<VideoView>(null);
  useBackToLeave();

  const others = useMemo(() => channels.filter((c) => c.id !== channel.id), [channels, channel.id]);
  const favorite = isFavorite(channel.id);
  const busy = state === 'loading' || state === 'retrying';

  const video = (
    <Pressable
      onPress={chrome.visible ? chrome.hide : chrome.show}
      style={landscape ? styles.phoneVideoFull : [styles.phoneVideo, { marginTop: insets.top }]}
    >
      <VideoView
        ref={videoRef}
        player={player}
        style={StyleSheet.absoluteFill}
        contentFit="contain"
        nativeControls={false}
      />
      {busy && (
        <View style={styles.phoneCenter} pointerEvents="none">
          <PlayerStatusCard state={state} attempt={attempt} onRetry={retry} />
        </View>
      )}
      {chrome.visible && (
        <View style={styles.phoneChrome} pointerEvents="box-none">
          <View style={styles.phoneChromeTop} pointerEvents="box-none">
            <Button
              round
              // Material icons don't mirror themselves.
              icon={isRTL ? 'arrow-forward' : 'arrow-back'}
              accessibilityLabel={t.back}
              onPress={leavePlayer}
            />
            {isPlayable(channel) && <LiveBadge label={t.live} />}
            <View style={styles.flex} />
            {isPlayable(channel) && (
              <Button
                round
                icon="fullscreen"
                accessibilityLabel={t.player.fullscreen}
                onPress={() => videoRef.current?.enterFullscreen()}
              />
            )}
          </View>
          {/* While loading, the centre belongs to the spinner. */}
          {!busy && (
            <View style={styles.phoneChromeCenter} pointerEvents="box-none">
              <Button round icon="skip-previous" accessibilityLabel={t.player.previous} onPress={() => zapBy(-1)} />
              {(state === 'playing' || state === 'paused') && (
                <PlayPauseButton state={state} onPress={togglePlay} label={t} />
              )}
              <Button round icon="skip-next" accessibilityLabel={t.player.next} onPress={() => zapBy(1)} />
            </View>
          )}
        </View>
      )}
    </Pressable>
  );

  if (landscape) return <View style={styles.screen}>{video}</View>;

  return (
    <View style={styles.phoneScreen}>
      {video}
      <ScrollView contentContainerStyle={[styles.phoneBody, { paddingBottom: insets.bottom + spacing.xl }]}>
        <View style={styles.phoneCard}>
          <ChannelMonogram logo={channel.logo} size={56} />
          <View style={styles.flex}>
            <AppText variant="cardTitle" numberOfLines={1}>
              {channelTitle(channel, locale)}
            </AppText>
            <AppText variant="meta" color={colors.gold} numberOfLines={1}>
              {channel.authorizationStatus === 'TEST_STREAM' ? t.player.testStream : t.category[channel.category]}
            </AppText>
            {channelDescription(channel, locale) && (
              <AppText variant="meta" color={colors.textSecondary} numberOfLines={2}>
                {channelDescription(channel, locale)}
              </AppText>
            )}
          </View>
          <Button
            round
            icon={favorite ? 'favorite' : 'favorite-border'}
            iconColor={favorite ? colors.accent : undefined}
            accessibilityLabel={favorite ? t.removeFavorite : t.addFavorite}
            onPress={() => toggleFavorite(channel.id)}
          />
        </View>

        {!busy && (
          <PlayerStatusCard state={state} attempt={attempt} onRetry={retry} externalUrl={externalLiveUrl(channel)} />
        )}

        <View style={styles.sectionHeader}>
          <View style={styles.sectionMark} />
          <AppText variant="section" style={styles.flex}>
            {t.player.otherChannels}
          </AppText>
          <AppText variant="meta" color={colors.textSecondary}>
            {t.player.quickZap}
          </AppText>
        </View>
        <View style={styles.phoneZap}>
          <ZapStrip channels={others} currentId={channel.id} onSelect={zap} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' },
  flex: { flex: 1 },
  inline: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  ltr: { writingDirection: 'ltr' },
  dim: { opacity: 0.5 },

  // TV
  tvCenter: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center', padding: spacing.xxxl },
  tvTop: {
    position: 'absolute',
    top: 0,
    start: 0,
    end: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    paddingHorizontal: tvSafeArea.horizontal,
    paddingTop: tvSafeArea.vertical,
    paddingBottom: spacing.xxxl,
  },
  tvTitle: { flex: 1, gap: 2 },
  tvBottom: {
    position: 'absolute',
    bottom: 0,
    start: 0,
    end: 0,
    gap: spacing.md,
    paddingHorizontal: tvSafeArea.horizontal - 12,
    paddingTop: spacing.xxxl * 2,
    paddingBottom: tvSafeArea.vertical,
  },
  // Media controls keep LTR order in Arabic too (Material: playback controls aren't mirrored).
  tvControls: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, direction: 'ltr' },
  separator: { width: 1, height: 28, backgroundColor: colors.dividerStrong, marginHorizontal: spacing.sm },
  playButton: { width: isTV ? 56 : 64, height: isTV ? 56 : 64, borderRadius: radii.full },

  // Phone
  phoneScreen: { flex: 1, backgroundColor: colors.bg },
  phoneVideo: { width: '100%', aspectRatio: 16 / 9, backgroundColor: '#000' },
  phoneVideoFull: { ...StyleSheet.absoluteFill, backgroundColor: '#000' },
  phoneCenter: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center' },
  phoneChrome: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(0,0,0,0.35)', padding: spacing.md },
  phoneChromeTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  phoneChromeCenter: {
    direction: 'ltr',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xxl,
  },
  phoneBody: { padding: spacing.lg, gap: spacing.lg },
  phoneCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    padding: spacing.lg,
    borderRadius: radii.lg,
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.sm },
  sectionMark: { width: 4, height: 18, borderRadius: 2, backgroundColor: colors.gold },
  phoneZap: { marginHorizontal: -spacing.lg },
});
