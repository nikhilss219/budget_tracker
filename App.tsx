import * as React from 'react'
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import * as FileSystem from 'expo-file-system'
import { Asset } from 'expo-asset';
import { SQLiteProvider } from 'expo-sqlite/next'; 
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Home from './screens/Home';



const Stack =createNativeStackNavigator();

const loadDatabase = async () => {
  const dbName ="mySQLiteDB.db";
  const dbAsset =require("./assets/mySQLiteDB.db");
  const dbUri = Asset.fromModule(dbAsset).uri;
  const dbFilePath = `${FileSystem.documentDirectory}SQLite/${dbName}`;

  const fileInfo =  await FileSystem.getInfoAsync(dbFilePath);
  console.info(fileInfo)
  if (!fileInfo.exists) {
    await FileSystem.makeDirectoryAsync(
      `${FileSystem.documentDirectory}SQLite`,
      { intermediates: true}
    );
    await FileSystem.downloadAsync(dbUri,dbFilePath);
  }
};

export default function App() {
  
  const [dbLoaded,setdbLoaded] = React.useState<boolean>(false);

  React.useEffect(() => {
    loadDatabase()
      .then(()=>setdbLoaded(true))
      .catch((e) => console.error(e));
  }, []);

  if (!dbLoaded) 
    return(
    <View style={{flex:1}}>
      <ActivityIndicator size={"large"}/>
      <Text>Loading Database</Text>
    </View>
  );

  return (
    <NavigationContainer>
      <React.Suspense
      fallback={
        <View style={{flex:1,backgroundColor:"red"}}>
            <ActivityIndicator size={"large"}/>
            <Text>Loading DB</Text>
        </View>
      }>
        <SQLiteProvider databaseName="mySQLiteDB.db" useSuspense>
          <Stack.Navigator>
            <Stack.Screen name="Home" component={Home}
            options={{
              headerTitle:"Budget Tracker",
              headerLargeTitle:true,
            }}
            />
          </Stack.Navigator>
        </SQLiteProvider>
      </React.Suspense>
      </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
