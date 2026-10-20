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

export default function ResetPasswordScreen(props) {

    const navigation = props.navigation;
    const route = props.route;

    let emailRecebido = '';
    if (route && route.params && route.params.email) {
        emailRecebido = route.params.email;
    }

    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [senhaVisivel, setSenhaVisivel] = useState(false);

    function alternarVisibilidadeSenha() {
        if (senhaVisivel === true) {
            setSenhaVisivel(false);
        } else {
            setSenhaVisivel(true);
        }
    }

    // Função chamada ao tocar no botão de confirmar.
    // Verifica localmente se as senhas digitadas são iguais antes de
    // sequer tentar chamar o backend — evita uma chamada de API desnecessária.
    function confirmarNovaSenha() {
        if (senha.length < 6) {
            Alert.alert('Senha inválida', 'A nova senha deve possuir pelo menos 6 caracteres.');
            return;
        }

        if (senha !== confirmarSenha) {
            Alert.alert('Senhas diferentes', 'A confirmação deve ser igual à nova senha.');
            return;
        }

        if (navigation) {
            Alert.alert(
                'Senha redefinida',
                'Sua senha foi alterada. Entre novamente para continuar.',
                [{ text: 'ENTRAR', onPress: () => navigation.replace('Login') }]
            );
        } else {
            console.log('Navegação ainda não configurada');
        }
    }

    let nomeDoIconeDeSenha = 'eye-off';
    if (senhaVisivel === true) {
        nomeDoIconeDeSenha = 'eye';
    }

    let esconderTextoDaSenha = true;
    if (senhaVisivel === true) {
        esconderTextoDaSenha = false;
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
                    <Text style={styles.title}>Criar nova senha</Text>
                    <Text style={styles.subtitle}>
                        Defina uma nova senha para sua conta.
                    </Text>

                    <Text style={styles.label}>NOVA SENHA</Text>
                    <View style={styles.passwordWrapper}>
                        <TextInput
                            style={styles.passwordInput}
                            placeholder="••••••••"
                            placeholderTextColor={COLORS.placeholder}
                            value={senha}
                            onChangeText={function (textoDigitado) {
                                setSenha(textoDigitado);
                            }}
                            secureTextEntry={esconderTextoDaSenha}
                        />
                        <TouchableOpacity
                            onPress={alternarVisibilidadeSenha}
                            style={styles.eyeIcon}
                        >
                            <Feather
                                name={nomeDoIconeDeSenha}
                                size={20}
                                color={COLORS.textSecondary}
                            />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.label}>CONFIRMAR SENHA</Text>
                    <View style={styles.passwordWrapper}>
                        <TextInput
                            style={styles.passwordInput}
                            placeholder="••••••••"
                            placeholderTextColor={COLORS.placeholder}
                            value={confirmarSenha}
                            onChangeText={function (textoDigitado) {
                                setConfirmarSenha(textoDigitado);
                            }}
                            secureTextEntry={esconderTextoDaSenha}
                        />
                        <TouchableOpacity
                            onPress={alternarVisibilidadeSenha}
                            style={styles.eyeIcon}
                        >
                            <Feather
                                name={nomeDoIconeDeSenha}
                                size={20}
                                color={COLORS.textSecondary}
                            />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.button} onPress={confirmarNovaSenha}>
                        <Text style={styles.buttonText}>CONFIRMAR</Text>
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
    passwordWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        borderRadius: SIZES.radius,
        borderWidth: 1,
        borderColor: COLORS.border,
        paddingHorizontal: 16,
        marginBottom: 20,
    },
    passwordInput: {
        flex: 1,
        paddingVertical: 14,
        color: COLORS.text,
        fontSize: SIZES.body,
    },
    eyeIcon: {
        padding: 4,
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
});
