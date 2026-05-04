import React, { useEffect } from 'react';
import { useXPStore } from '../../stores/xpStore';
import { useStreakStore } from '../../stores/streakStore';
import { XPAwardAnimation } from './XPAwardAnimation';
import { LevelUpModal } from './LevelUpModal';
import { BadgeEarnedModal } from './BadgeEarnedModal';

export function RewardQueue() {
  const { pendingNotifications, dismissNotification, awardXP } = useXPStore();
  const { pendingMilestone, clearMilestone } = useStreakStore();

  // Watch for streak milestones from the streakStore and award XP.
  // This avoids circular dependencies between stores.
  useEffect(() => {
    if (pendingMilestone !== null) {
      awardXP('streak_milestone');
      // We clear the milestone here so we don't trigger it again.
      // Note: The streak celebration modal is handled in progress screen,
      // but the XP is awarded here globally if RewardQueue is mounted.
      clearMilestone();
    }
  }, [pendingMilestone, awardXP, clearMilestone]);

  if (pendingNotifications.length === 0) return null;

  // Always process the first notification in the queue
  const current = pendingNotifications[0];

  return (
    <>
      {current.type === 'xp' && (
        <XPAwardAnimation
          // key helps re-mount if multiple consecutive XP awards happen
          key={`xp-${current.source}-${current.amount}-${current.isBonus}`}
          amount={current.amount}
          isBonus={current.isBonus}
          onDone={dismissNotification}
        />
      )}

      {current.type === 'level_up' && (
        <LevelUpModal
          key={`level-${current.newLevel}`}
          newLevel={current.newLevel}
          onDismiss={dismissNotification}
        />
      )}

      {current.type === 'badge' && (
        <BadgeEarnedModal
          key={`badge-${current.conditionKey}`}
          conditionKey={current.conditionKey}
          onDismiss={dismissNotification}
        />
      )}
    </>
  );
}
