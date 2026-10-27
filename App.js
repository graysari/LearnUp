import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserProvider } from './context/UserContext';

import Home from './screens/Home';
import Subject from './screens/Subject';
import Topic from './screens/Topic';
import Question from './screens/Question';
import Login from './screens/Login';
import EditProfile from './screens/EditProfile';
import AdminPanel from './screens/AdminPanel';
import ManageSubjects from './screens/ManageSubjects';
import AddSubject from './screens/AddSubjects';
import ManageTopics from './screens/ManageTopics';
import AddTopic from './screens/AddTopic';
import ManageQuestions from './screens/ManageQuestions';
import AddQuestion from './screens/AddQuestion';
import CreateAccount from './screens/CreateAccount';
import ForgetPassword from './screens/ForgetPassword';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Subject" component={Subject} />
          <Stack.Screen name="Topic" component={Topic} />
          <Stack.Screen name="Question" component={Question} />
          <Stack.Screen name="EditProfile" component={EditProfile} options={{ headerShown: false }} />
          <Stack.Screen name="AdminPanel" component={AdminPanel} options={{ headerShown: false }} />
          
          <Stack.Screen
            name="ManageSubjects"
            component={ManageSubjects}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="AddSubject"
            component={AddSubject}
            options={{ headerShown: false }}
          />

           <Stack.Screen
            name="ManageTopics"
            component={ManageTopics}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="AddTopic"
            component={AddTopic}
            options={{ headerShown: false }}
          />

          <Stack.Screen
    name="ManageQuestions"
    component={ManageQuestions}
    options={{ headerShown: false }}
/>

<Stack.Screen
  name="AddQuestion"
  component={AddQuestion}
  options={{ headerShown: false }}
/>


<Stack.Screen
  name="CreateAccount"
  component={CreateAccount}
  options={{ headerShown: false }}
/>


<Stack.Screen
  name="ForgetPassword"
  component={ForgetPassword}
  options={{ headerShown: false }}
/>
 
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}