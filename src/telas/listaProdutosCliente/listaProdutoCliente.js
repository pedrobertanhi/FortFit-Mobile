import React, { useState } from 'react';
import {
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
import { CATEGORIAS } from '../../data/produtos';

export default function ListaProdutosClienteScreen(props) {

    const navigation = props.navigation;
    const {
        produtos,
        quantidadeCarrinho,
        adicionarAoCarrinho,
    } = useLoja();

    const [busca, setBusca] = useState('');
    const [categoriaFiltro, setCategoriaFiltro] = useState('Todos');


    function formatarPreco(preco) {
        return 'R$ ' + preco.toFixed(2).replace('.', ',');
    }

    function selecionarCategoriaFiltro(categoria) {
        setCategoriaFiltro(categoria);
    }

    function irParaDetalheProduto(produto) {
        if (navigation) {
            navigation.navigate('DetalheProduto', { produto });
        } else {
            console.log('Navegação ainda não configurada');
        }
    }

    function irParaCarrinho() {
        if (navigation) {
            navigation.navigate('Carrinho');
        } else {
            console.log('Navegação ainda não configurada');
        }
    }

    function handleAdicionarAoCarrinho(produto) {
        adicionarAoCarrinho(produto);
    }


    let produtosFiltrados = produtos;
    if (categoriaFiltro !== 'Todos') {
        produtosFiltrados = produtosFiltrados.filter(function (produto) {
            return produto.categoria === categoriaFiltro;
        });
    }
    if (busca.trim() !== '') {
        produtosFiltrados = produtosFiltrados.filter(function (produto) {
            return produto.nome.toLowerCase().includes(busca.toLowerCase());
        });
    }

    function renderizarCategoria({ item }) {
        const categoria = item;
        const estaSelecionada = categoria === categoriaFiltro;

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
                style={estiloChip}
                onPress={function () {
                    selecionarCategoriaFiltro(categoria);
                }}
            >
                <Text style={estiloTextoChip}>{categoria}</Text>
            </TouchableOpacity>
        );
    }

    function renderizarProduto({ item }) {
        const estaEsgotado = item.estoque === 0;

        let estiloBotaoComprar = styles.botaoComprar;
        if (estaEsgotado === true) {
            estiloBotaoComprar = styles.botaoComprarDesabilitado;
        }

        return (
            <TouchableOpacity
                style={styles.card}
                onPress={function () {
                    irParaDetalheProduto(item);
                }}
                activeOpacity={0.8}
            >
                <View style={styles.thumbnail} >
                    {item.foto ? (
                        <Image source={item.foto} style={styles.thumbnailImage} resizeMode="cover" />
                    ) : (
                        <Feather name = "image" size={28} color = {COLORS.textSecondary} />
                    )}
                    {estaEsgotado === true && (
                        <View style={styles.esgotadoOverlay}>
                            <Text style={styles.esgotadoTexto}>Esgotado</Text>
                        </View>
                    )}
                </View>

                <Text style={styles.cardCategoria}>{item.categoria}</Text>
                <Text style={styles.cardNome} numberOfLines={2}>{item.nome}</Text>
                <Text style={styles.cardPreco}>{formatarPreco(item.preco)}</Text>

                <TouchableOpacity
                    style={estiloBotaoComprar}
                    disabled={estaEsgotado}
                    onPress={function () {
                        handleAdicionarAoCarrinho(item);
                    }}
                >
                    <Feather name="shopping-cart" size={14} color={COLORS.background} />
                    <Text style={styles.botaoComprarTexto}>Adicionar</Text>
                </TouchableOpacity>
            </TouchableOpacity>
        );
    }

    function renderizarListaVazia() {
        return (
            <View style={styles.vazioContainer}>
                <Feather name="search" size={32} color={COLORS.textSecondary} />
                <Text style={styles.vazioTexto}>Nenhum produto encontrado</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* ---------- CABEÇALHO ---------- */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>FORTFIT</Text>
                    <Text style={styles.headerSubtitle}>Encontre seus itens fitness</Text>
                </View>
                <View style={styles.headerActions}>
                    <TouchableOpacity style={styles.cartButton} onPress={() => navigation.navigate('Perfil')}>
                        <Feather name="user" size={20} color={COLORS.text} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cartButton} onPress={irParaCarrinho}>
                        <Feather name="shopping-cart" size={20} color={COLORS.text} />
                        {quantidadeCarrinho > 0 && (
                            <View style={styles.cartBadge}>
                                <Text style={styles.cartBadgeTexto}>{quantidadeCarrinho}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            {/* ---------- BUSCA ---------- */}
            <View style={styles.searchWrapper}>
                <Feather name="search" size={18} color={COLORS.textSecondary} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar suplementos, roupas..."
                    placeholderTextColor={COLORS.placeholder}
                    value={busca}
                    onChangeText={function (textoDigitado) {
                        setBusca(textoDigitado);
                    }}
                />
            </View>

            {/* ---------- FILTRO DE CATEGORIAS ---------- */}
            <FlatList
                data={CATEGORIAS}
                keyExtractor={function (item) {
                    return item;
                }}
                renderItem={renderizarCategoria}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={styles.categoriasLista}
                contentContainerStyle={styles.categoriasContainer}
            />

            {/* ---------- GRADE DE PRODUTOS ---------- */}
            <FlatList
                data={produtosFiltrados}
                keyExtractor={function (item) {
                    return item.id;
                }}
                renderItem={renderizarProduto}
                numColumns={2}
                style={{flex: 1}}
                columnWrapperStyle={styles.colunas}
                contentContainerStyle={styles.gradeContainer}
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
        fontSize: SIZES.h2,
        fontWeight: '700',
        letterSpacing: 2,
    },
    headerSubtitle: {
        color: COLORS.textSecondary,
        fontSize: SIZES.small,
        marginTop: 4,
    },
    headerActions: {
        flexDirection: 'row',
        gap: 10,
    },
    cartButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cartBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: COLORS.primary,
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 4,
    },
    cartBadgeTexto: {
        color: COLORS.background,
        fontSize: 11,
        fontWeight: '700',
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
        marginTop: 12,
        marginBottom: 14,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 10,
        color: COLORS.text,
        fontSize: SIZES.body,
    },
    categoriasContainer: {
        paddingHorizontal: SIZES.padding,
        paddingBottom: 16,
    },

    categoriasLista: {
        flexGrow: 0,
    },

    chip: {
        backgroundColor: COLORS.surface,
        borderRadius: SIZES.radius,
        borderWidth: 1,
        borderColor: COLORS.border,
        paddingHorizontal: 14,
        paddingVertical: 8,
        marginRight: 8,
    },
    chipSelecionado: {
        backgroundColor: COLORS.primary,
        borderRadius: SIZES.radius,
        borderWidth: 1,
        borderColor: COLORS.primary,
        paddingHorizontal: 14,
        paddingVertical: 8,
        marginRight: 8,
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
    gradeContainer: {
        paddingHorizontal: SIZES.padding,
        paddingBottom: 24,
        flexGrow: 1,
    },
    colunas: {
        justifyContent: 'space-between',
    },
    card: {
        width: '48%',
        backgroundColor: COLORS.surface,
        borderRadius: SIZES.radius,
        borderWidth: 1,
        borderColor: COLORS.border,
        padding: 10,
        marginBottom: 14,
    },
    thumbnail: {
        width: '100%',
        height: 90,
        borderRadius: 10,
        backgroundColor: COLORS.background,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
        overflow: 'hidden',
    },

    thumbnailImage: {
        width: '100%',
        height: '100%',
    },

    esgotadoOverlay: {
        position: 'absolute',
        bottom: 6,
        alignSelf: 'center',
        backgroundColor: COLORS.danger,
        borderRadius: 20,
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    esgotadoTexto: {
        color: COLORS.text,
        fontSize: 10,
        fontWeight: '700',
    },
    cardCategoria: {
        color: COLORS.textSecondary,
        fontSize: 11,
        marginBottom: 2,
    },
    cardNome: {
        color: COLORS.text,
        fontSize: SIZES.small,
        fontWeight: '600',
        minHeight: 32,
    },
    cardPreco: {
        color: COLORS.primary,
        fontSize: SIZES.body,
        fontWeight: '700',
        marginTop: 6,
        marginBottom: 10,
    },
    botaoComprar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primary,
        borderRadius: 10,
        paddingVertical: 8,
    },
    botaoComprarDesabilitado: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.border,
        borderRadius: 10,
        paddingVertical: 8,
    },
    botaoComprarTexto: {
        color: COLORS.background,
        fontSize: SIZES.small,
        fontWeight: '700',
        marginLeft: 6,
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
