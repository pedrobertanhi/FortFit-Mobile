import React, { useState } from 'react';
import {
    Alert,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    FlatList,
    Image,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../../constants/theme';
import { useLoja } from '../../context/LojaContext';


export default function ListaProdutosAdminScreen(props) {

    const navigation = props.navigation;
    const { produtos, excluirProduto } = useLoja();

    const [busca, setBusca] = useState('');


    function formatarPreco(preco) {
        return 'R$ ' + preco.toFixed(2).replace('.', ',');
    }

    function irParaCadastroProduto() {
        if (navigation) {
            navigation.navigate('CadastroProduto');
        } else {
            console.log('Navegação ainda não configurada');
        }
    }

    function handleEditarProduto(produto) {
        navigation.navigate('CadastroProduto', { produto });
    }

    function handleExcluirProduto(produto) {
        Alert.alert(
            'Excluir produto',
            `Deseja excluir "${produto.nome}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: () => excluirProduto(produto.id),
                },
            ]
        );
    }


    let produtosFiltrados = produtos;
    if (busca.trim() !== '') {
        produtosFiltrados = produtos.filter(function (produto) {
            return produto.nome.toLowerCase().includes(busca.toLowerCase());
        });
    }

    function renderizarProduto({ item }) {
        let estiloEstoque = styles.estoqueBadge;
        let textoEstoque = item.estoque + ' em estoque';
        if (item.estoque === 0) {
            estiloEstoque = styles.estoqueBadgeVazio;
            textoEstoque = 'Esgotado';
        }

        return (
            <View style={styles.card}>
                <View style={styles.thumbnail}>
                    {item.foto ? (
                        <Image source={item.foto} style={styles.thumbnailImage} resizeMode="cover" />
                    ) : (
                        <Feather name="image" size={22} color={COLORS.textSecondary} />
                    )}
                </View>

                <View style={styles.cardInfo}>
                    <Text style={styles.cardNome} numberOfLines={1}>{item.nome}</Text>
                    <Text style={styles.cardCategoria}>{item.categoria}</Text>
                    <View style={styles.cardRodape}>
                        <Text style={styles.cardPreco}>{formatarPreco(item.preco)}</Text>
                        <View style={estiloEstoque}>
                            <Text style={styles.estoqueTexto}>{textoEstoque}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.cardAcoes}>
                    <TouchableOpacity
                        style={styles.acaoBotao}
                        onPress={function () {
                            handleEditarProduto(item);
                        }}
                    >
                        <Feather name="edit-2" size={16} color={COLORS.textSecondary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.acaoBotao}
                        onPress={function () {
                            handleExcluirProduto(item);
                        }}
                    >
                        <Feather name="trash-2" size={16} color={COLORS.danger} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    function renderizarListaVazia() {
        return (
            <View style={styles.vazioContainer}>
                <Feather name="package" size={32} color={COLORS.textSecondary} />
                <Text style={styles.vazioTexto}>Nenhum produto encontrado</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* ---------- CABEÇALHO ---------- */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Produtos</Text>
                    <Text style={styles.headerSubtitle}>{produtos.length} cadastrados</Text>
                </View>
                <TouchableOpacity style={styles.addButton} onPress={irParaCadastroProduto}>
                    <Feather name="plus" size={22} color={COLORS.background} />
                </TouchableOpacity>
            </View>

            {/* ---------- BUSCA ---------- */}
            <View style={styles.searchWrapper}>
                <Feather name="search" size={18} color={COLORS.textSecondary} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar produto..."
                    placeholderTextColor={COLORS.placeholder}
                    value={busca}
                    onChangeText={function (textoDigitado) {
                        setBusca(textoDigitado);
                    }}
                />
            </View>

            {/* ---------- LISTA ---------- */}
            <FlatList
                data={produtosFiltrados}
                keyExtractor={function (item) {
                    return item.id;
                }}
                renderItem={renderizarProduto}
                contentContainerStyle={styles.listaContainer}
                ListEmptyComponent={renderizarListaVazia}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SIZES.padding,
        paddingTop: 16,
        paddingBottom: 8,
    },
    headerTitle: {
        color: COLORS.text,
        fontSize: SIZES.h1,
        fontWeight: '700',
    },
    headerSubtitle: {
        color: COLORS.textSecondary,
        fontSize: SIZES.small,
        marginTop: 4,
    },
    addButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        borderRadius: SIZES.radius,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginHorizontal: SIZES.padding,
        paddingHorizontal: 14,
        marginBottom: 16,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 10,
        color: COLORS.text,
        fontSize: SIZES.body,
    },
    listaContainer: {
        paddingHorizontal: SIZES.padding,
        paddingBottom: 24,
        flexGrow: 1,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        borderRadius: SIZES.radius,
        borderWidth: 1,
        borderColor: COLORS.border,
        padding: 12,
        marginBottom: 12,
    },
    thumbnail: {
        width: 56,
        height: 56,
        borderRadius: 10,
        backgroundColor: COLORS.background,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        overflow: 'hidden',
    },
    thumbnailImage: {
        width: '100%',
        height: '100%',
    },
    cardInfo: {
        flex: 1,
    },
    cardNome: {
        color: COLORS.text,
        fontSize: SIZES.body,
        fontWeight: '600',
    },
    cardCategoria: {
        color: COLORS.textSecondary,
        fontSize: SIZES.small,
        marginTop: 2,
    },
    cardRodape: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    cardPreco: {
        color: COLORS.primary,
        fontSize: SIZES.body,
        fontWeight: '700',
        marginRight: 10,
    },
    estoqueBadge: {
        backgroundColor: COLORS.background,
        borderRadius: 20,
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    estoqueBadgeVazio: {
        backgroundColor: COLORS.danger,
        borderRadius: 20,
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    estoqueTexto: {
        color: COLORS.textSecondary,
        fontSize: 11,
        fontWeight: '600',
    },
    cardAcoes: {
        alignItems: 'center',
        marginLeft: 8,
    },
    acaoBotao: {
        padding: 6,
    },
    vazioContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 60,
    },
    vazioTexto: {
        color: COLORS.textSecondary,
        fontSize: SIZES.body,
        marginTop: 12,
    },
});
