import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './src/navigation/autenticacao';
import { LojaProvider } from './src/context/LojaContext';

export default function App() {
    return (
        <LojaProvider>
            <NavigationContainer>
                <AuthStack />
                <StatusBar style="light" />
            </NavigationContainer>
        </LojaProvider>
    );
}
