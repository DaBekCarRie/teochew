import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

function tabIcon(active: IoniconName, inactive: IoniconName) {
  return ({ color, focused }: { color: string; focused: boolean }) => (
    <Ionicons name={focused ? active : inactive} size={24} color={color} />
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#C9A84C',
        tabBarInactiveTintColor: '#A08060',
        tabBarStyle: {
          backgroundColor: '#FAF6EE',
          borderTopColor: '#D9C9A8',
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
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: 'เรียนรู้',
          tabBarIcon: tabIcon('school', 'school-outline'),
        }}
      />
      <Tabs.Screen
        name="translate"
        options={{
          title: 'แปลภาษา',
          tabBarIcon: tabIcon('language', 'language-outline'),
        }}
      />
      <Tabs.Screen
        name="voice"
        options={{
          title: 'เสียง',
          tabBarIcon: tabIcon('mic', 'mic-outline'),
        }}
      />
      <Tabs.Screen
        name="culture"
        options={{
          title: 'ความก้าวหน้า',
          tabBarIcon: tabIcon('stats-chart', 'stats-chart-outline'),
        }}
      />
    </Tabs>
  );
}
