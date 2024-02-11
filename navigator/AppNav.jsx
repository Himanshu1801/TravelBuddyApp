import React from "react";
import { enableScreens } from "react-native-screens";
import SignIn from "../screens/SignIn";
import Home from "../screens/Home";
import Checklist from "../screens/Checklist";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

enableScreens();

const Stack = createStackNavigator();

export default function AppNav() {

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="SignIn">
                <Stack.Screen
                    name="Home"
                    component={Home}
                    options={{ headerShown: false }} />
                <Stack.Screen
                    name="SignIn"
                    component={SignIn}
                    options={{ headerShown: false }} />
                <Stack.Screen
                    name="Checklist"
                    component={Checklist}
                    options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}