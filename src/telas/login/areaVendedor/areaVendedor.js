import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../../constants/theme';
import { useLoja } from '../../../context/LojaContext';

function CartaoMetrica({ icone, rotulo, valor, destaque = false }) {
    return (
        <View style={[styles.cartaoMetrica, destaque && styles.cartaoDestaque]}>
            <Feather name={icone} size={21} color={destaque ? COLORS.background : COLORS.primary} />
            <Text style={[styles.valorMetrica, destaque && styles.textoEscuro]}>{valor}</Text>
            <Text style={[styles.rotuloMetrica, destaque && styles.textoEscuro]}>{rotulo}</Text>
        </View>
    );
}

export default function AreaVendedorScreen({ navigation }) {
    const { produtos } = useLoja();
    const estoqueTotal = produtos.reduce((total, produto) => total + produto.estoque, 0);
    const produtosEsgotados = produtos.filter((produto) => produto.estoque === 0).length;

    return (
        <SafeAreaView style={styles.areaSegura}>
            <ScrollView contentContainerStyle={styles.conteudo} showsVerticalScrollIndicator={false}>
                <View style={styles.cabecalho}>
                    <View>
                        <Text style={styles.saudacao}>PAINEL FORTFIT</Text>
                        <Text style={styles.titulo}>Área do vendedor</Text>
                    </View>
                    <TouchableOpacity style={styles.botaoSair} onPress={() => navigation.navigate('Login')}>
                        <Feather name="log-out" size={20} color={COLORS.textSecondary} />
                    </TouchableOpacity>
                </View>

                <Text style={styles.subtitulo}>Visão geral da loja</Text>
                <View style={styles.gradeMetricas}>
                    <CartaoMetrica icone="package" rotulo="Produtos" valor={produtos.length} destaque />
                    <CartaoMetrica icone="layers" rotulo="Itens em estoque" valor={estoqueTotal} />
                    <CartaoMetrica icone="alert-circle" rotulo="Esgotados" valor={produtosEsgotados} />
                    <CartaoMetrica icone="shopping-bag" rotulo="Pedidos simulados" valor="12" />
                </View>

                <Text style={styles.subtitulo}>Gerenciamento</Text>
                <TouchableOpacity
                    style={styles.acaoPrincipal}
                    onPress={() => navigation.navigate('ListaProdutosAdmin')}
                >
                    <View style={styles.iconeAcao}>
                        <Feather name="box" size={22} color={COLORS.primary} />
                    </View>
                    <View style={styles.textosAcao}>
                        <Text style={styles.tituloAcao}>Gerenciar produtos</Text>
                        <Text style={styles.descricaoAcao}>Consultar, editar ou excluir itens</Text>
                    </View>
                    <Feather name="chevron-right" size={21} color={COLORS.textSecondary} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.acaoPrincipal}
                    onPress={() => navigation.navigate('CadastroProduto')}
                >
                    <View style={styles.iconeAcao}>
                        <Feather name="plus" size={22} color={COLORS.primary} />
                    </View>
                    <View style={styles.textosAcao}>
                        <Text style={styles.tituloAcao}>Cadastrar produto</Text>
                        <Text style={styles.descricaoAcao}>Adicionar um novo item à loja</Text>
                    </View>
                    <Feather name="chevron-right" size={21} color={COLORS.textSecondary} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.acaoPrincipal}
                    onPress={() => navigation.navigate('ListaProdutosCliente')}
                >
                    <View style={styles.iconeAcao}>
                        <Feather name="eye" size={22} color={COLORS.primary} />
                    </View>
                    <View style={styles.textosAcao}>
                        <Text style={styles.tituloAcao}>Visualizar loja</Text>
                        <Text style={styles.descricaoAcao}>Abrir o catálogo como cliente</Text>
                    </View>
                    <Feather name="chevron-right" size={21} color={COLORS.textSecondary} />
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    areaSegura: { flex: 1, backgroundColor: COLORS.background },
    conteudo: { padding: SIZES.padding, paddingBottom: 40 },
    cabecalho: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    saudacao: { color: COLORS.primary, fontSize: 11, fontWeight: '700', letterSpacing: 1.2 },
    titulo: { color: COLORS.text, fontSize: SIZES.h1, fontWeight: '700', marginTop: 5 },
    botaoSair: {
        width: 42,
        height: 42,
        borderRadius: 21,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.surface,
    },
    subtitulo: { color: COLORS.text, fontSize: SIZES.h3, fontWeight: '700', marginTop: 30, marginBottom: 14 },
    gradeMetricas: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 },
    cartaoMetrica: {
        width: '48%',
        minHeight: 128,
        padding: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: SIZES.radius,
        backgroundColor: COLORS.surface,
    },
    cartaoDestaque: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
    valorMetrica: { color: COLORS.text, fontSize: 25, fontWeight: '700', marginTop: 14 },
    rotuloMetrica: { color: COLORS.textSecondary, fontSize: SIZES.small, marginTop: 3 },
    textoEscuro: { color: COLORS.background },
    acaoPrincipal: {
        minHeight: 74,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: SIZES.radius,
        backgroundColor: COLORS.surface,
    },
    iconeAcao: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.background,
    },
    textosAcao: { flex: 1, marginLeft: 12 },
    tituloAcao: { color: COLORS.text, fontSize: SIZES.body, fontWeight: '700' },
    descricaoAcao: { color: COLORS.textSecondary, fontSize: SIZES.small, marginTop: 4 },
});
