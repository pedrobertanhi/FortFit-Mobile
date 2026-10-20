import React, { useState } from 'react';
import {
    Alert,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../../../constants/theme';

export default function ValidarCodigo(props) {

    const navigation = props.navigation;
    const route = props.route;

    // Pegamos o e-mail que foi enviado como parâmetro pela tela anterior.
    // Verificamos se "route" e "route.params" existem antes de acessar,
    // para não quebrar caso essa tela seja testada sozinha, sem navegação.
    let emailRecebido = '';
    if (route && route.params && route.params.email) {
        emailRecebido = route.params.email;
    }

    const [codigo, setCodigo] = useState('');

    // Função chamada ao tocar no botão "Validar código".
    // Futuramente vai chamar a API do backend para conferir se o código
    // digitado bate com o que foi gerado e enviado, e se ainda não expirou.
    function handleValidarCodigo() {
        if (codigo.length !== 6) {
            Alert.alert('Código inválido', 'Digite os 6 números enviados para seu e-mail.');
            return;
        }

        if (navigation) {
            navigation.navigate('RedefinirSenha', { email: emailRecebido });
        } else {
            console.log('Navegação ainda não configurada');
        }
    }

    // Função para reenviar o código, caso o usuário não tenha recebido.
    function handleReenviarCodigo() {
        Alert.alert('Código reenviado', `Enviamos um novo código para ${emailRecebido}.`);
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.glowCircle} />

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView
                    contentContainerStyle={styles.container}
                    keyboardShouldPersistTaps="handled"
                >
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Feather name="chevron-left" size={24} color={COLORS.text} />
                    </TouchableOpacity>
                    <Text style={styles.title}>Verifique seu e-mail</Text>
                    <Text style={styles.subtitle}>
                        Enviamos um código de 6 dígitos para {emailRecebido}
                    </Text>

                    <Text style={styles.label}>CÓDIGO</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="000000"
                        placeholderTextColor={COLORS.placeholder}
                        value={codigo}
                        onChangeText={function (textoDigitado) {
                            setCodigo(textoDigitado.replace(/\D/g, ''));
                        }}
                        keyboardType="number-pad"
                        maxLength={6}
                    />

                    <TouchableOpacity style={styles.button} onPress={handleValidarCodigo}>
                        <Text style={styles.buttonText}>VALIDAR CÓDIGO</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.resendButton} onPress={handleReenviarCodigo}>
                        <Text style={styles.resendText}>Não recebeu? Reenviar código</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    glowCircle: {
        position: 'absolute',
        top: -80,
        right: -80,
        width: 220,
        height: 220,
        borderRadius: 110,
        backgroundColor: COLORS.primary,
        opacity: 0.08,
    },
    container: {
        flexGrow: 1,
        paddingHorizontal: SIZES.padding,
        paddingTop: 40,
        paddingBottom: 24,
    },
    backButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        borderRadius: 20,
        backgroundColor: COLORS.surface,
    },
    title: {
        color: COLORS.text,
        fontSize: SIZES.h1,
        fontWeight: '700',
        marginBottom: 8,
    },
    subtitle: {
        color: COLORS.textSecondary,
        fontSize: SIZES.body,
        marginBottom: 32,
    },
    label: {
        color: COLORS.textSecondary,
        fontSize: SIZES.small,
        fontWeight: '600',
        letterSpacing: 0.5,
        marginBottom: 8,
    },
    input: {
        backgroundColor: COLORS.surface,
        borderRadius: SIZES.radius,
        borderWidth: 1,
        borderColor: COLORS.border,
        paddingHorizontal: 16,
        paddingVertical: 14,
        color: COLORS.text,
        fontSize: SIZES.h2,
        letterSpacing: 8,
        textAlign: 'center',
        marginBottom: 20,
    },
    button: {
        backgroundColor: COLORS.primary,
        borderRadius: SIZES.radius,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 12,
    },
    buttonText: {
        color: COLORS.background,
        fontSize: SIZES.h3,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    resendButton: {
        alignItems: 'center',
        marginTop: 20,
    },
    resendText: {
        color: COLORS.primary,
        fontSize: SIZES.body,
        fontWeight: '600',
    },
});
