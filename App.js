import React from 'react';
import { ActivityIndicator, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './src/navigation/autenticacao';
import { LojaProvider, useLoja } from './src/context/LojaContext';
import { COLORS } from './src/constants/theme';
function ConteudoApp(){const {usuario,carregando}=useLoja();if(carregando)return <SafeAreaView style={{flex:1,alignItems:'center',justifyContent:'center',backgroundColor:COLORS.background}}><ActivityIndicator color={COLORS.primary}/><StatusBar style="light"/></SafeAreaView>;const rotaInicial=usuario?.perfil==='admin'?'AreaVendedor':usuario?'ListaProdutosCliente':'Login';return <NavigationContainer><AuthStack initialRouteName={rotaInicial}/><StatusBar style="light"/></NavigationContainer>}
export default function App(){return <LojaProvider><ConteudoApp/></LojaProvider>}
