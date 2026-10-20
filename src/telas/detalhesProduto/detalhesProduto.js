import React, { useState } from 'react';
import {
    Alert,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/theme';
import { useLoja } from '../../context/LojaContext';

function formatarPreco(valor) {
    return `R$ ${Number(valor).toFixed(2).replace('.', ',')}`;
}

export default function DetalhesProdutoScreen({ navigation, route }) {
    const { produtos, adicionarAoCarrinho, quantidadeCarrinho } = useLoja();
    const produtoRecebido = route?.params?.produto;
    const produtoId = route?.params?.produtoId;
    const produto = produtoRecebido ?? produtos.find((item) => item.id === produtoId) ?? produtos[0];
    const [quantidade, setQuantidade] = useState(1);

    if (!produto) {
        return (
            <SafeAreaView style={styles.areaSegura}>
                <View style={styles.naoEncontrado}>
                    <Text style={styles.titulo}>Produto não encontrado</Text>
                    <TouchableOpacity style={styles.botaoPrincipal} onPress={() => navigation.goBack()}>
                        <Text style={styles.textoBotaoPrincipal}>VOLTAR</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    const esgotado = produto.estoque === 0;

    function adicionar() {
        adicionarAoCarrinho(produto, quantidade);
        Alert.alert('Produto adicionado', `${quantidade} unidade(s) adicionada(s) ao carrinho.`);
    }

    return (
        <SafeAreaView style={styles.areaSegura}>
            <View style={styles.cabecalho}>
                <TouchableOpacity style={styles.botaoIcone} onPress={() => navigation.goBack()}>
                    <Feather name="chevron-left" size={26} color={COLORS.text} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.botaoIcone} onPress={() => navigation.navigate('Carrinho')}>
                    <Feather name="shopping-cart" size={21} color={COLORS.text} />
                    {quantidadeCarrinho > 0 && (
                        <View style={styles.badgeCarrinho}>
                            <Text style={styles.badgeCarrinhoTexto}>{quantidadeCarrinho}</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.conteudo} showsVerticalScrollIndicator={false}>
                <View style={styles.caixaImagem}>
                    {produto.foto ? (
                        <Image source={produto.foto} style={styles.imagem} resizeMode="contain" />
                    ) : (
                        <Feather name="image" size={70} color={COLORS.textSecondary} />
                    )}
                </View>

                <Text style={styles.categoria}>{produto.categoria.toUpperCase()}</Text>
                <Text style={styles.titulo}>{produto.nome}</Text>
                <Text style={styles.marca}>{produto.marca ?? 'FortFit'}</Text>
                <Text style={styles.preco}>{formatarPreco(produto.preco)}</Text>

                <View style={styles.separador} />

                <View style={styles.quantidadeLinha}>
                    <View>
                        <Text style={styles.subtitulo}>Quantidade</Text>
                        <Text style={styles.estoque}>{esgotado ? 'Produto esgotado' : `${produto.estoque} disponíveis`}</Text>
                    </View>
                    <View style={styles.seletorQuantidade}>
                        <TouchableOpacity
                            style={styles.botaoQuantidade}
                            onPress={() => setQuantidade((valor) => Math.max(1, valor - 1))}
                        >
                            <Feather name="minus" size={18} color={COLORS.textSecondary} />
                        </TouchableOpacity>
                        <Text style={styles.quantidade}>{quantidade}</Text>
                        <TouchableOpacity
                            style={styles.botaoQuantidade}
                            onPress={() => setQuantidade((valor) => Math.min(produto.estoque, valor + 1))}
                        >
                            <Feather name="plus" size={18} color={COLORS.primary} />
                        </TouchableOpacity>
                    </View>
                </View>

                <Text style={styles.subtitulo}>Descrição</Text>
                <Text style={styles.descricao}>{produto.descricao}</Text>
            </ScrollView>

            <View style={styles.rodape}>
                <TouchableOpacity
                    style={[styles.botaoPrincipal, esgotado && styles.botaoDesabilitado]}
                    onPress={adicionar}
                    disabled={esgotado}
                >
                    <Feather name="shopping-cart" size={20} color={COLORS.background} />
                    <Text style={styles.textoBotaoPrincipal}>
                        {esgotado ? 'PRODUTO ESGOTADO' : 'ADICIONAR AO CARRINHO'}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    areaSegura: { flex: 1, backgroundColor: COLORS.background },
    cabecalho: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: SIZES.padding,
        paddingVertical: 12,
    },
    botaoIcone: {
        width: 42,
        height: 42,
        borderRadius: 21,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.surface,
    },
    badgeCarrinho: {
        position: 'absolute',
        top: -3,
        right: -3,
        minWidth: 18,
        height: 18,
        paddingHorizontal: 4,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primary,
    },
    badgeCarrinhoTexto: { color: COLORS.background, fontSize: 10, fontWeight: '700' },
    conteudo: { paddingHorizontal: SIZES.padding, paddingBottom: 24 },
    caixaImagem: {
        height: 300,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        borderRadius: 24,
        overflow: 'hidden',
        backgroundColor: COLORS.surface,
    },
    imagem: { width: '78%', height: '78%' },
    categoria: { color: COLORS.primary, fontSize: 11, fontWeight: '700', letterSpacing: 1 },
    titulo: { color: COLORS.text, fontSize: SIZES.h1, fontWeight: '700', marginTop: 8 },
    marca: { color: COLORS.textSecondary, fontSize: SIZES.body, marginTop: 5 },
    preco: { color: COLORS.primary, fontSize: 27, fontWeight: '700', marginTop: 16 },
    separador: { height: 1, backgroundColor: COLORS.border, marginVertical: 22 },
    quantidadeLinha: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 26,
    },
    subtitulo: { color: COLORS.text, fontSize: SIZES.h3, fontWeight: '700' },
    estoque: { color: COLORS.textSecondary, fontSize: SIZES.small, marginTop: 5 },
    seletorQuantidade: { flexDirection: 'row', alignItems: 'center' },
    botaoQuantidade: {
        width: 38,
        height: 38,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.surface,
    },
    quantidade: { color: COLORS.text, fontWeight: '700', paddingHorizontal: 18 },
    descricao: { color: COLORS.textSecondary, fontSize: SIZES.body, lineHeight: 22, marginTop: 10 },
    rodape: { padding: SIZES.padding, paddingTop: 12, borderTopWidth: 1, borderColor: COLORS.border },
    botaoPrincipal: {
        minHeight: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingHorizontal: 22,
        borderRadius: SIZES.radius,
        backgroundColor: COLORS.primary,
    },
    botaoDesabilitado: { opacity: 0.45 },
    textoBotaoPrincipal: { color: COLORS.background, fontWeight: '700', fontSize: SIZES.body },
    naoEncontrado: { flex: 1, justifyContent: 'center', padding: SIZES.padding, gap: 24 },
});

