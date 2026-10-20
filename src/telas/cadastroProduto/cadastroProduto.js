import React, { useEffect, useState } from 'react';
import {
    Alert,
    Image,
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
import * as ImagePicker from 'expo-image-picker';
import { COLORS, SIZES, FONTS } from '../../constants/theme';
import { useLoja } from '../../context/LojaContext';
import { CATEGORIAS } from '../../data/produtos';

export default function CadastroProdutoScreen(props) {

    const navigation = props.navigation;
    const produtoEdicao = props.route?.params?.produto;
    const { adicionarProduto, atualizarProduto } = useLoja();

    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [preco, setPreco] = useState('');
    const [estoque, setEstoque] = useState('');
    const [categoriaSelecionada, setCategoriaSelecionada] = useState('');
    const [foto, setFoto] = useState(null);

    useEffect(() => {
        if (!produtoEdicao) return;
        setNome(produtoEdicao.nome ?? '');
        setDescricao(produtoEdicao.descricao ?? '');
        setPreco(String(produtoEdicao.preco ?? '').replace('.', ','));
        setEstoque(String(produtoEdicao.estoque ?? ''));
        setCategoriaSelecionada(produtoEdicao.categoria ?? '');
        setFoto(produtoEdicao.foto ?? null);
    }, [produtoEdicao]);


    function selecionarCategoria(categoria) {
        setCategoriaSelecionada(categoria);
    }

    function handleCadastrarProduto() {
        const precoNumerico = Number(preco.replace(',', '.'));
        const estoqueNumerico = Number(estoque);

        if (
            nome.trim() === '' ||
            descricao.trim() === '' ||
            categoriaSelecionada === '' ||
            !Number.isFinite(precoNumerico) ||
            precoNumerico <= 0 ||
            !Number.isInteger(estoqueNumerico) ||
            estoqueNumerico < 0
        ) {
            Alert.alert('Dados inválidos', 'Preencha corretamente todos os campos obrigatórios.');
            return;
        }

        const dadosProduto = {
            nome: nome.trim(),
            marca: produtoEdicao?.marca ?? 'FortFit',
            descricao: descricao.trim(),
            categoria: categoriaSelecionada,
            preco: precoNumerico,
            estoque: estoqueNumerico,
            foto,
        };

        if (produtoEdicao) {
            atualizarProduto(produtoEdicao.id, dadosProduto);
        } else {
            adicionarProduto(dadosProduto);
        }

        Alert.alert(
            produtoEdicao ? 'Produto atualizado' : 'Produto cadastrado',
            produtoEdicao
                ? 'As informações do produto foram atualizadas.'
                : 'O produto foi adicionado à loja.',
            [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
    }

    async function handleAdicionarFoto() {
        const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissao.granted) {
            Alert.alert(
                'Permissão necessária',
                'Autorize o acesso às fotos para selecionar a imagem do produto.'
            );
            return;
        }

        const resultado = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!resultado.canceled && resultado.assets?.[0]?.uri) {
            setFoto(resultado.assets[0].uri);
        }
    }

    function voltar() {
        if (navigation) {
            navigation.goBack();
        } else {
            console.log('Navegação ainda não configurada');
        }
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView
                    contentContainerStyle={styles.container}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* ---------- CABEÇALHO ---------- */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={voltar} style={styles.backButton}>
                            <Feather name="chevron-left" size={24} color={COLORS.text} />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>
                            {produtoEdicao ? 'Editar produto' : 'Cadastrar produto'}
                        </Text>
                        <View style={styles.backButton} />
                    </View>

                    <Text style={styles.subtitle}>
                        {produtoEdicao
                            ? 'Atualize as informações do item selecionado.'
                            : 'Preencha os dados abaixo para adicionar um novo item à loja.'}
                    </Text>

                    {/* ---------- FOTO DO PRODUTO ---------- */}
                    <TouchableOpacity
                        style={styles.photoBox}
                        onPress={handleAdicionarFoto}
                    >
                        {foto ? (
                            <>
                                <Image
                                    source={typeof foto === 'string' ? { uri: foto } : foto}
                                    style={styles.fotoProduto}
                                />
                                <View style={styles.editarFoto}>
                                    <Feather name="edit-2" size={16} color={COLORS.background} />
                                    <Text style={styles.editarFotoTexto}>Trocar foto</Text>
                                </View>
                            </>
                        ) : (
                            <>
                                <Feather name="camera" size={26} color={COLORS.textSecondary} />
                                <Text style={styles.photoBoxText}>Adicionar foto do produto</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    {/* ---------- NOME ---------- */}
                    <Text style={styles.label}>NOME DO PRODUTO</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ex: Whey Protein Concentrado 900g"
                        placeholderTextColor={COLORS.placeholder}
                        value={nome}
                        onChangeText={function (textoDigitado) {
                            setNome(textoDigitado);
                        }}
                    />

                    {/* ---------- DESCRIÇÃO ---------- */}
                    <Text style={styles.label}>DESCRIÇÃO</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Conte os detalhes do produto..."
                        placeholderTextColor={COLORS.placeholder}
                        value={descricao}
                        onChangeText={function (textoDigitado) {
                            setDescricao(textoDigitado);
                        }}
                        multiline={true}
                        numberOfLines={4}
                        textAlignVertical="top"
                    />

                    {/* ---------- CATEGORIA ---------- */}
                    <Text style={styles.label}>CATEGORIA</Text>
                    <View style={styles.chipsRow}>
                        {CATEGORIAS.filter((categoria) => categoria !== 'Todos').map(function (categoria) {
                            const estaSelecionada = categoria === categoriaSelecionada;

                            let estiloChip = styles.chip;
                            if (estaSelecionada === true) {
                                estiloChip = styles.chipSelecionado;
                            }

                            let estiloTextoChip = styles.chipText;
                            if (estaSelecionada === true) {
                                estiloTextoChip = styles.chipTextSelecionado;
                            }

                            return (
                                <TouchableOpacity
                                    key={categoria}
                                    style={estiloChip}
                                    onPress={function () {
                                        selecionarCategoria(categoria);
                                    }}
                                >
                                    <Text style={estiloTextoChip}>{categoria}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {/* ---------- PREÇO E ESTOQUE ---------- */}
                    <View style={styles.rowFields}>
                        <View style={styles.halfField}>
                            <Text style={styles.label}>PREÇO (R$)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="0,00"
                                placeholderTextColor={COLORS.placeholder}
                                value={preco}
                                onChangeText={function (textoDigitado) {
                                    setPreco(textoDigitado);
                                }}
                                keyboardType="decimal-pad"
                            />
                        </View>

                        <View style={styles.halfField}>
                            <Text style={styles.label}>ESTOQUE</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="0"
                                placeholderTextColor={COLORS.placeholder}
                                value={estoque}
                                onChangeText={function (textoDigitado) {
                                    setEstoque(textoDigitado);
                                }}
                                keyboardType="number-pad"
                            />
                        </View>
                    </View>

                    {/* ---------- BOTÃO PRINCIPAL ---------- */}
                    <TouchableOpacity style={styles.button} onPress={handleCadastrarProduto}>
                        <Text style={styles.buttonText}>
                            {produtoEdicao ? 'SALVAR ALTERAÇÕES' : 'CADASTRAR PRODUTO'}
                        </Text>
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
    container: {
        flexGrow: 1,
        paddingHorizontal: SIZES.padding,
        paddingTop: 16,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    backButton: {
        width: 32,
        height: 32,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    headerTitle: {
        color: COLORS.text,
        fontSize: SIZES.h2,
        fontWeight: '700',
    },
    subtitle: {
        color: COLORS.textSecondary,
        fontSize: SIZES.body,
        marginTop: 8,
        marginBottom: 24,
    },
    photoBox: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderStyle: 'dashed',
        borderRadius: SIZES.radius,
        backgroundColor: COLORS.surface,
        minHeight: 120,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        overflow: 'hidden',
    },
    fotoProduto: {
        width: '100%',
        height: 190,
    },
    editarFoto: {
        position: 'absolute',
        right: 12,
        bottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 18,
        backgroundColor: COLORS.primary,
    },
    editarFotoTexto: {
        color: COLORS.background,
        fontSize: SIZES.small,
        fontWeight: '700',
        marginLeft: 7,
    },
    photoBoxText: {
        color: COLORS.textSecondary,
        fontSize: SIZES.small,
        marginTop: 8,
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
    textArea: {
        height: 100,
        paddingTop: 14,
    },
    chipsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 20,
    },
    chip: {
        backgroundColor: COLORS.surface,
        borderRadius: SIZES.radius,
        borderWidth: 1,
        borderColor: COLORS.border,
        paddingHorizontal: 14,
        paddingVertical: 10,
        marginRight: 8,
        marginBottom: 8,
    },
    chipSelecionado: {
        backgroundColor: COLORS.primary,
        borderRadius: SIZES.radius,
        borderWidth: 1,
        borderColor: COLORS.primary,
        paddingHorizontal: 14,
        paddingVertical: 10,
        marginRight: 8,
        marginBottom: 8,
    },
    chipText: {
        color: COLORS.textSecondary,
        fontSize: SIZES.small,
        fontWeight: '600',
    },
    chipTextSelecionado: {
        color: COLORS.background,
        fontSize: SIZES.small,
        fontWeight: '700',
    },
    rowFields: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfField: {
        width: '48%',
    },
    button: {
        backgroundColor: COLORS.primary,
        borderRadius: SIZES.radius,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonText: {
        color: COLORS.background,
        fontSize: SIZES.h3,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
});
