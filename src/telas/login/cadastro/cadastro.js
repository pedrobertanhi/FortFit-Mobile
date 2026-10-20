import React, { useState } from 'react';
import { 
    Alert,
    View, 
    Text, 
    StyleSheet, 
    SafeAreaView, 
    TextInput, 
    TouchableOpacity, 
    ScrollView,
    KeyboardAvoidingView,
    Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../../constants/theme';

export default function CadastroScreen({ navigation }) {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [senhaVisivel, setSenhaVisivel] = useState(false);
    const [aceitoTermos, setAceitoTermos] = useState(false);

    function alterarTelefone(texto) {
        const numeros = texto.replace(/\D/g, '').slice(0, 11);
        let telefoneFormatado = numeros;

        if (numeros.length > 2) {
            telefoneFormatado = `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
        }
        if (numeros.length > 7) {
            telefoneFormatado = `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
        }

        setTelefone(telefoneFormatado);
    }

    function cadastrar() {
        const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
        const telefoneValido = telefone.replace(/\D/g, '').length >= 10;

        if (nome.trim().length < 3) {
            Alert.alert('Nome inválido', 'Informe seu nome completo.');
            return;
        }
        if (!emailValido) {
            Alert.alert('E-mail inválido', 'Informe um endereço de e-mail válido.');
            return;
        }
        if (!telefoneValido) {
            Alert.alert('Telefone inválido', 'Informe um telefone com DDD.');
            return;
        }
        if (senha.length < 6) {
            Alert.alert('Senha inválida', 'A senha deve possuir pelo menos 6 caracteres.');
            return;
        }
        if (senha !== confirmarSenha) {
            Alert.alert('Senhas diferentes', 'A confirmação deve ser igual à senha.');
            return;
        }
        if (!aceitoTermos) {
            Alert.alert('Termos de uso', 'Aceite os termos de uso para criar sua conta.');
            return;
        }

        Alert.alert(
            'Conta criada',
            'Cadastro concluído. Agora você já pode entrar.',
            [{ text: 'ENTRAR', onPress: () => navigation.replace('Login') }]
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                    
                    {/* Botão de Voltar */}
                    <TouchableOpacity 
                        style={styles.backButton} 
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="chevron-back" size={24} color="#FFF" />
                    </TouchableOpacity>

                    {/* Títulos */}
                    <View style={styles.headerContainer}>
                        <Text style={styles.title}>Crie sua conta</Text>
                        <Text style={styles.subtitle}>Leva menos de dois minutos.</Text>
                    </View>

                    {/* Formulário */}
                    <View style={styles.formContainer}>
                        
                        {/* Nome Completo */}
                        <Text style={styles.label}>NOME COMPLETO</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Como podemos te chamar?"
                            placeholderTextColor="#7A7A7A"
                            value={nome}
                            onChangeText={setNome}
                        />

                        {/* E-mail */}
                        <Text style={styles.label}>E-MAIL</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="seuemail@exemplo.com"
                            placeholderTextColor="#7A7A7A"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail}
                        />

                        {/* Telefone */}
                        <Text style={styles.label}>TELEFONE</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="(11) 99999-9999"
                            placeholderTextColor="#7A7A7A"
                            keyboardType="phone-pad"
                            value={telefone}
                            onChangeText={alterarTelefone}
                        />

                        {/* Senha */}
                        <Text style={styles.label}>SENHA</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="••••••••"
                            placeholderTextColor="#7A7A7A"
                            secureTextEntry={!senhaVisivel}
                            value={senha}
                            onChangeText={setSenha}
                        />

                        <Text style={styles.label}>CONFIRMAR SENHA</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="••••••••"
                            placeholderTextColor="#7A7A7A"
                            secureTextEntry={!senhaVisivel}
                            value={confirmarSenha}
                            onChangeText={setConfirmarSenha}
                        />

                        <TouchableOpacity
                            style={styles.mostrarSenha}
                            onPress={() => setSenhaVisivel(!senhaVisivel)}
                        >
                            <Ionicons
                                name={senhaVisivel ? 'eye-off-outline' : 'eye-outline'}
                                size={18}
                                color="#CCFF00"
                            />
                            <Text style={styles.mostrarSenhaTexto}>
                                {senhaVisivel ? 'Ocultar senhas' : 'Mostrar senhas'}
                            </Text>
                        </TouchableOpacity>

                        {/* Botão Cadastrar */}
                        <TouchableOpacity
                            style={styles.button}
                            activeOpacity={0.8}
                            onPress={cadastrar}
                        >
                            <Text style={styles.buttonText}>CADASTRAR</Text>
                        </TouchableOpacity>

                        {/* Termos de uso */}
                        <TouchableOpacity 
                            style={styles.termsContainer} 
                            activeOpacity={0.8}
                            onPress={() => setAceitoTermos(!aceitoTermos)}
                        >
                            <View style={[styles.checkbox, aceitoTermos && styles.checkboxChecked]}>
                                {aceitoTermos && <Ionicons name="checkmark" size={14} color="#000" />}
                            </View>
                            <Text style={styles.termsText}>Aceito os termos de uso e a política de privacidade.</Text>
                        </TouchableOpacity>

                        {/* Rodapé: Já possui conta? Entrar */}
                        <View style={styles.footerContainer}>
                            <Text style={styles.footerText}>Já possui conta? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                <Text style={styles.loginLink}>Entrar</Text>
                            </TouchableOpacity>
                        </View>

                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212', // Fundo escuro padrão do app
    },
    scrollContainer: {
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 30,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#262626',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerContainer: {
        marginBottom: 24,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 6,
    },
    subtitle: {
        color: '#A0A0A0',
        fontSize: 14,
    },
    formContainer: {
        width: '100%',
    },
    label: {
        color: '#A0A0A0',
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 1,
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#1E1E1E',
        borderRadius: 12,
        height: 52,
        paddingHorizontal: 16,
        color: '#FFFFFF',
        fontSize: 15,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },
    button: {
        backgroundColor: '#CCFF00', // Verde limão característico do design
        borderRadius: 12,
        height: 52,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 20,
    },
    mostrarSenha: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-end',
        gap: 7,
        marginTop: -5,
        marginBottom: 10,
    },
    mostrarSenhaTexto: {
        color: '#CCFF00',
        fontSize: 12,
        fontWeight: '600',
    },
    buttonText: {
        color: '#000000',
        fontSize: 15,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    termsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 1.5,
        borderColor: '#CCFF00',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        backgroundColor: 'transparent',
    },
    checkboxChecked: {
        backgroundColor: '#CCFF00',
    },
    termsText: {
        color: '#A0A0A0',
        fontSize: 13,
        flex: 1,
    },
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: {
        color: '#A0A0A0',
        fontSize: 14,
    },
    loginLink: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
    },
});
