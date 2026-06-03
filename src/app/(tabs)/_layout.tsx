import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../utils/theme';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

function tabIcon(active: IoniconName, inactive: IoniconName) {
  return ({ color, focused }: { color: string; focused: boolean }) => (
    <Ionicons name={focused ? active : inactive} size={24} color={color} />
  );
}

// Re-pressing an already-focused tab should return to that tab's list screen
// (the nested stack's `index`) instead of staying on a pushed detail screen.
function resetToIndex(tabName: string) {
  return ({
    navigation,
  }: {
    navigation: { isFocused: () => boolean; navigate: (name: string, params?: object) => void };
  }) => ({
    tabPress: (e: { preventDefault: () => void }) => {
      if (navigation.isFocused()) {
        e.preventDefault();
        navigation.navigate(tabName, { screen: 'index' });
      }
    },
  });
}

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.gold,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.tabBorder,
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="dictionary"
        options={{
          title: 'พจนานุกรม',
          tabBarIcon: tabIcon('book', 'book-outline'),
        }}
        listeners={resetToIndex('dictionary')}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: 'เรียนรู้',
          tabBarIcon: tabIcon('school', 'school-outline'),
        }}
        listeners={resetToIndex('learn')}
      />
      <Tabs.Screen
        name="translate"
        options={{
          title: 'แปลภาษา',
          tabBarIcon: tabIcon('language', 'language-outline'),
        }}
        listeners={resetToIndex('translate')}
      />
      <Tabs.Screen
        name="culture"
        options={{
          title: 'วัฒนธรรม',
          tabBarIcon: tabIcon('compass', 'compass-outline'),
        }}
        listeners={resetToIndex('culture')}
      />
      <Tabs.Screen name="culture/[id]" options={{ href: null }} />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'โปรไฟล์',
          tabBarIcon: tabIcon('person', 'person-outline'),
        }}
        listeners={resetToIndex('profile')}
      />

      {/* Hidden tabs that we still want to route to but not show in the bottom bar */}
      <Tabs.Screen
        name="voice"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
