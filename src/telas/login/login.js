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
    Image,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../../constants/theme';
import LogoFortFit from '../../../assets/images/LogoFortFit.svg';

export default function LoginScreen(props) {

    const navigation = props.navigation;


    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [senhaVisivel, setSenhaVisivel] = useState(false);


    function handleEntrar() {
        if (email.trim() === '' || senha.trim() === '') {
            Alert.alert('Campos obrigatórios', 'Preencha o e-mail e a senha para entrar.');
            return;
        }

        navigation.replace('ListaProdutosCliente');
    }

    function alternarVisibilidadeSenha() {
        setSenhaVisivel(!senhaVisivel);
    }

    function irParaEsqueciSenha() {
        if (navigation) {
            navigation.navigate('EsqueciSenha');
        } else {
            console.log('Navegação ainda não configurada');
        }
    }

    function irParaCadastro() {
        if (navigation) {
            navigation.navigate('Cadastro');
        } else {
            console.log('Navegação ainda não configurada');
        }
    }

    function irParaAreaVendedor() {
        if (navigation) {
            navigation.navigate('AreaVendedor');
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
            {/* Círculo decorativo verde no canto superior direito, imitando o glow do Figma */}
            <View style={styles.glowCircle} />

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView
                    contentContainerStyle={styles.container}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* ---------- LOGO ---------- */}
                    <View style={styles.logoRow}>
                        <LogoFortFit width={60} height={60}/>
                        <Text style={styles.logoText}>FORTFIT</Text>
                    </View>

                    {/* ---------- TÍTULO E SUBTÍTULO ---------- */}
                    <Text style={styles.title}>
                        Evolua um treino{'\n'}
                        <Text style={styles.titleHighlight}>por vez.</Text>
                    </Text>
                    <Text style={styles.subtitle}>
                        Entre para encontrar suplementos e itens fitness.
                    </Text>

                    {/* ---------- CAMPO DE E-MAIL ---------- */}
                    <Text style={styles.label}>E-MAIL</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="seuemail@exemplo.com"
                        placeholderTextColor={COLORS.placeholder}
                        value={email}
                        onChangeText={function (textoDigitado) {
                            setEmail(textoDigitado);
                        }}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    {/* ---------- CAMPO DE SENHA ---------- */}
                    <Text style={styles.label}>SENHA</Text>
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

                    {/* ---------- LINK "ESQUECI MINHA SENHA" ---------- */}
                    <TouchableOpacity
                        style={styles.forgotPassword}
                        onPress={irParaEsqueciSenha}
                    >
                        <Text style={styles.linkText}>Esqueci minha senha</Text>
                    </TouchableOpacity>

                    {/* ---------- BOTÃO PRINCIPAL DE ENTRAR ---------- */}
                    <TouchableOpacity style={styles.button} onPress={handleEntrar}>
                        <Text style={styles.buttonText}>ENTRAR</Text>
                    </TouchableOpacity>

                    {/* ---------- LINK PARA CRIAR CONTA ---------- */}
                    <View style={styles.signupRow}>
                        <Text style={styles.signupText}>Ainda não tem uma conta? </Text>
                        <TouchableOpacity onPress={irParaCadastro}>
                            <Text style={styles.signupLink}>Criar conta</Text>
                        </TouchableOpacity>
                    </View>

                    {/* ---------- CARTÃO "ÁREA DO VENDEDOR" ---------- */}
                    <TouchableOpacity
                        style={styles.sellerCard}
                        onPress={irParaAreaVendedor}
                    >
                        <View style={styles.sellerLeft}>
                            <View style={styles.sellerIcon}>
                                <Feather name="plus" size={14} color={COLORS.primary} />
                            </View>
                            <Text style={styles.sellerText}>Acessar área do vendedor</Text>
                        </View>
                        <Feather name="chevron-right" size={18} color={COLORS.textSecondary} />
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

// Todos os estilos ficam agrupados aqui, separados da lógica e do JSX.
// Isso segue a mesma ideia didática: cada responsabilidade em seu lugar.
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
        flexDirection: 'column',
    },
    logoRow: {
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 32,

    },
    logoFortFit: {
        width: 28,
        height: 28,
        borderRadius: 8,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    logoText: {
        color: COLORS.text,
        fontSize: SIZES.h2,
        fontWeight: '700',
        letterSpacing: 5,
        padding: 20,
    },
    title: {
        color: COLORS.text,
        fontSize: SIZES.h1,
        fontWeight: '700',
        lineHeight: 32,
    },
    titleHighlight: {
        color: COLORS.primary,
    },
    subtitle: {
        color: COLORS.textSecondary,
        fontSize: SIZES.body,
        marginTop: 8,
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
        fontSize: SIZES.body,
        marginBottom: 20,
    },
    passwordWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        borderRadius: SIZES.radius,
        borderWidth: 1,
        borderColor: COLORS.border,
        paddingHorizontal: 16,
        marginBottom: 8,
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
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 28,
    },
    linkText: {
        color: COLORS.primary,
        fontSize: SIZES.body,
        fontWeight: '600',
    },
    button: {
        backgroundColor: COLORS.primary,
        borderRadius: SIZES.radius,
        paddingVertical: 16,
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: COLORS.background,
        fontSize: SIZES.h3,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    signupRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 32,
    },
    signupText: {
        color: COLORS.textSecondary,
        fontSize: SIZES.body,
    },
    signupLink: {
        color: COLORS.text,
        fontSize: SIZES.body,
        fontWeight: '700',
    },
    sellerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.surface,
        borderRadius: SIZES.radius,
        borderWidth: 1,
        borderColor: COLORS.border,
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    sellerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sellerIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    sellerText: {
        color: COLORS.text,
        fontSize: SIZES.body,
        fontWeight: '500',
    },
});
