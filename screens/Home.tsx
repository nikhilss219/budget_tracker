import { useState } from 'react';
import { Text, View}  from 'react-native'

export default function Home(){

    const [categories,setCategories] = useState();

    return (
        <View>
            <Text>Home Screen</Text>
        </View>
    );
}