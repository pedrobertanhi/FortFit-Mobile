import React from 'react';
import {
    Alert,
    FlatList,
    Image,
    SafeAreaView,
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

export default function CarrinhoScreen({ navigation }) {
    const {
        carrinho,
        totalCarrinho,
        alterarQuantidade,
        removerDoCarrinho,
        limparCarrinho,
    } = useLoja();

    function confirmarLimpezaCarrinho() {
        Alert.alert(
            'Esvaziar carrinho',
            'Deseja remover todos os produtos do carrinho?',
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Esvaziar', style: 'destructive', onPress: limparCarrinho },
            ]
        );
    }

    function continuarPagamento() {
        if (carrinho.length === 0) {
            Alert.alert('Carrinho vazio', 'Adicione pelo menos um produto antes de continuar.');
            return;
        }

        navigation.navigate('Pagamento', {
            produto: {
                idProduto: 'carrinho',
                nomeProduto: carrinho.length === 1
                    ? carrinho[0].produto.nome
                    : `Pedido com ${carrinho.length} produtos`,
                precoProduto: totalCarrinho,
                quantidadeProduto: 1,
                fotoProduto: carrinho.length === 1 ? carrinho[0].produto.foto : null,
            },
        });
    }

    function renderizarItem({ item }) {
        const quantidadeMaxima = item.quantidade >= item.produto.estoque;

        return (
            <View style={styles.card}>
                {item.produto.foto ? (
                    <Image source={item.produto.foto} style={styles.imagem} resizeMode="cover" />
                ) : (
                    <View style={[styles.imagem, styles.imagemVazia]}>
                        <Feather name="image" size={27} color={COLORS.textSecondary} />
                    </View>
                )}
                <View style={styles.informacoes}>
                    <Text style={styles.nome} numberOfLines={2}>{item.produto.nome}</Text>
                    <Text style={styles.preco}>{formatarPreco(item.produto.preco)}</Text>
                    <View style={styles.acoes}>
                        <TouchableOpacity
                            style={styles.botaoQuantidade}
                            onPress={() => alterarQuantidade(item.produto.id, item.quantidade - 1)}
                        >
                            <Feather name="minus" size={16} color={COLORS.text} />
                        </TouchableOpacity>
                        <Text style={styles.quantidade}>{item.quantidade}</Text>
                        <TouchableOpacity
                            style={[
                                styles.botaoQuantidade,
                                quantidadeMaxima && styles.botaoQuantidadeDesabilitado,
                            ]}
                            onPress={() => alterarQuantidade(item.produto.id, item.quantidade + 1)}
                            disabled={quantidadeMaxima}
                        >
                            <Feather
                                name="plus"
                                size={16}
                                color={quantidadeMaxima ? COLORS.textSecondary : COLORS.primary}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.botaoRemover}
                            onPress={() => removerDoCarrinho(item.produto.id)}
                        >
                            <Feather name="trash-2" size={17} color={COLORS.danger} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.areaSegura}>
            <View style={styles.cabecalho}>
                <TouchableOpacity style={styles.botaoVoltar} onPress={() => navigation.goBack()}>
                    <Feather name="chevron-left" size={26} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.titulo}>Carrinho</Text>
                {carrinho.length > 0 ? (
                    <TouchableOpacity
                        style={styles.botaoLimpar}
                        onPress={confirmarLimpezaCarrinho}
                    >
                        <Feather name="trash-2" size={19} color={COLORS.danger} />
                    </TouchableOpacity>
                ) : (
                    <View style={styles.espacoCabecalho} />
                )}
            </View>

            <FlatList
                data={carrinho}
                keyExtractor={(item) => item.produto.id}
                renderItem={renderizarItem}
                contentContainerStyle={carrinho.length === 0 ? styles.listaVazia : styles.lista}
                ListEmptyComponent={
                    <View style={styles.vazio}>
                        <Feather name="shopping-cart" size={54} color={COLORS.textSecondary} />
                        <Text style={styles.vazioTitulo}>Seu carrinho está vazio</Text>
                        <Text style={styles.vazioTexto}>Escolha um produto no catálogo para começar.</Text>
                        <TouchableOpacity
                            style={styles.botaoCatalogo}
                            onPress={() => navigation.navigate('ListaProdutosCliente')}
                        >
                            <Text style={styles.textoBotaoCatalogo}>VER PRODUTOS</Text>
                        </TouchableOpacity>
                    </View>
                }
            />

            {carrinho.length > 0 && (
                <View style={styles.rodape}>
                    <View style={styles.resumoLinha}>
                        <Text style={styles.resumoRotulo}>Subtotal</Text>
                        <Text style={styles.resumoValor}>{formatarPreco(totalCarrinho)}</Text>
                    </View>
                    <View style={styles.resumoLinha}>
                        <Text style={styles.resumoRotulo}>Entrega</Text>
                        <Text style={styles.entregaGratis}>Grátis</Text>
                    </View>
                    <View style={styles.totalLinha}>
                        <Text style={styles.totalRotulo}>Total</Text>
                        <Text style={styles.totalValor}>{formatarPreco(totalCarrinho)}</Text>
                    </View>
                    <TouchableOpacity style={styles.botaoContinuar} onPress={continuarPagamento}>
                        <Text style={styles.textoBotaoContinuar}>CONTINUAR PARA PAGAMENTO</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    areaSegura: { flex: 1, backgroundColor: COLORS.background },
    cabecalho: {
        height: 64,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SIZES.padding,
    },
    botaoVoltar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.surface,
    },
    titulo: { color: COLORS.text, fontSize: SIZES.h2, fontWeight: '700' },
    espacoCabecalho: { width: 40 },
    botaoLimpar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.surface,
    },
    lista: { padding: SIZES.padding, paddingTop: 8, paddingBottom: 20 },
    listaVazia: { flexGrow: 1, justifyContent: 'center', padding: SIZES.padding },
    card: {
        flexDirection: 'row',
        padding: 12,
        marginBottom: 12,
        borderRadius: SIZES.radius,
        borderWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: COLORS.surface,
    },
    imagem: { width: 82, height: 82, borderRadius: 10, backgroundColor: COLORS.background },
    imagemVazia: { alignItems: 'center', justifyContent: 'center' },
    informacoes: { flex: 1, marginLeft: 12 },
    nome: { color: COLORS.text, fontSize: SIZES.body, fontWeight: '700' },
    preco: { color: COLORS.primary, fontSize: SIZES.body, fontWeight: '700', marginTop: 5 },
    acoes: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
    botaoQuantidade: {
        width: 30,
        height: 30,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.background,
    },
    botaoQuantidadeDesabilitado: { opacity: 0.45 },
    quantidade: { color: COLORS.text, fontWeight: '700', paddingHorizontal: 12 },
    botaoRemover: { marginLeft: 'auto', padding: 7 },
    vazio: { alignItems: 'center' },
    vazioTitulo: { color: COLORS.text, fontSize: SIZES.h2, fontWeight: '700', marginTop: 18 },
    vazioTexto: { color: COLORS.textSecondary, textAlign: 'center', marginTop: 8 },
    botaoCatalogo: {
        marginTop: 22,
        paddingVertical: 14,
        paddingHorizontal: 28,
        borderRadius: SIZES.radius,
        backgroundColor: COLORS.primary,
    },
    textoBotaoCatalogo: { color: COLORS.background, fontWeight: '700' },
    rodape: {
        padding: SIZES.padding,
        paddingTop: 14,
        borderTopWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: COLORS.surface,
    },
    resumoLinha: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    resumoRotulo: { color: COLORS.textSecondary, fontSize: SIZES.small },
    resumoValor: { color: COLORS.text, fontSize: SIZES.small, fontWeight: '600' },
    entregaGratis: { color: COLORS.primary, fontSize: SIZES.small, fontWeight: '700' },
    totalLinha: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 12,
        marginTop: 4,
        marginBottom: 14,
        borderTopWidth: 1,
        borderColor: COLORS.border,
    },
    totalRotulo: { color: COLORS.text, fontSize: SIZES.h3, fontWeight: '700' },
    totalValor: { color: COLORS.primary, fontSize: SIZES.h2, fontWeight: '700' },
    botaoContinuar: {
        minHeight: 54,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: SIZES.radius,
        backgroundColor: COLORS.primary,
    },
    textoBotaoContinuar: { color: COLORS.background, fontWeight: '700' },
});

