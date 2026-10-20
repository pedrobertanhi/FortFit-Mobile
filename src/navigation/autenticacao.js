import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../telas/login/login';
import CadastroScreen from '../telas/login/cadastro/cadastro';
import AreaVendedorScreen from '../telas/login/areaVendedor/areaVendedor';
import ValidarEmailScreen from '../telas/login/reset/validarEmail';
import ValidarCodigoScreen from '../telas/login/reset/validarCodigo';
import ResetScreen from '../telas/login/reset/reset';
import PagamentoScreen from '../telas/pagamento/pagamento';
import ConfirmacaoPagamentoScreen from '../telas/pagamento/confirmacaoPagamento';
import ListaProdutosClienteScreen from '../telas/listaProdutosCliente/listaProdutoCliente';
import DetalhesProdutoScreen from '../telas/detalhesProduto/detalhesProduto';
import CarrinhoScreen from '../telas/carrinho/carrinho';
import PerfilScreen from '../telas/perfil/perfil';
import ListaProdutosAdminScreen from '../telas/listaProdutosAdmin/listaProdutosAdmin';
import CadastroProdutoScreen from '../telas/cadastroProduto/cadastroProduto';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
    return (
        <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen
                name="Login"
                component={LoginScreen}
            />

            <Stack.Screen
                name="Cadastro"
                component={CadastroScreen}
            />

            <Stack.Screen
                name="EsqueciSenha"
                component={ValidarEmailScreen}
            />

            <Stack.Screen
                name="ValidarCodigo"
                component={ValidarCodigoScreen}
            />

            <Stack.Screen
                name="RedefinirSenha"
                component={ResetScreen}
            />

            <Stack.Screen
                name="AreaVendedor"
                component={AreaVendedorScreen}
            />

            <Stack.Screen
                name="ListaProdutosCliente"
                component={ListaProdutosClienteScreen}
            />

            <Stack.Screen
                name="DetalheProduto"
                component={DetalhesProdutoScreen}
            />

            <Stack.Screen
                name="Carrinho"
                component={CarrinhoScreen}
            />

            <Stack.Screen
                name="Perfil"
                component={PerfilScreen}
            />

            <Stack.Screen
                name="ListaProdutosAdmin"
                component={ListaProdutosAdminScreen}
            />

            <Stack.Screen
                name="CadastroProduto"
                component={CadastroProdutoScreen}
            />

            <Stack.Screen
                name="Pagamento"
                component={PagamentoScreen}
            />

            <Stack.Screen
                name="PagamentoConfirmado"
                component={ConfirmacaoPagamentoScreen}
            />
        </Stack.Navigator>
    );
}
