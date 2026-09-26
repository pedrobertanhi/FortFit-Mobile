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
import { COLORS, SIZES } from '../../constants/theme';

const PRODUTO_EXEMPLO = {
    nomeProduto: 'Creatina Monohidratada 300g',
    quantidadeProduto: 1,
};

function EtapasCheckout() {
    return (
        <View style={styles.etapas}>
            <View style={styles.etapa}>
                <View style={styles.numeroEtapaAtivo}>
                    <Feather
                        name="check"
                        size={14}
                        color={COLORS.background}
                    />
                </View>
                <Text style={styles.nomeEtapa}>Carrinho</Text>
            </View>

            <View style={styles.linhaEtapaAtiva} />

            <View style={styles.etapa}>
                <View style={styles.numeroEtapaAtivo}>
                    <Feather
                        name="check"
                        size={14}
                        color={COLORS.background}
                    />
                </View>
                <Text style={styles.nomeEtapa}>Pagamento</Text>
            </View>

            <View style={styles.linhaEtapaAtiva} />

            <View style={styles.etapa}>
                <View style={styles.numeroEtapaAtivo}>
                    <Text style={styles.textoNumeroAtivo}>3</Text>
                </View>

                <Text
                    style={[
                        styles.nomeEtapa,
                        styles.nomeEtapaAtiva,
                    ]}
                >
                    Confirmação
                </Text>
            </View>
        </View>
    );
}

export default function ConfirmacaoPagamentoScreen(props) {
    const navigation = props.navigation;
    const parametros = props.route?.params;

    const numeroPedido =
        parametros?.numeroPedido ?? 'FF-000000';

    const produto =
        parametros?.produto ?? PRODUTO_EXEMPLO;

    const valorTotal =
        parametros?.valorTotal ?? 89.9;

    function formatarDinheiro(valor) {
        return `R$ ${Number(valor)
            .toFixed(2)
            .replace('.', ',')}`;
    }

    function voltarParaLoja() {
        if (navigation) {
            navigation.navigate('Login');
        }
    }

    return (
        <SafeAreaView style={styles.areaSegura}>
            <ScrollView
                contentContainerStyle={styles.conteudo}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.tituloCabecalho}>
                    Pedido confirmado
                </Text>

                <EtapasCheckout />

                <View style={styles.iconeConfirmacao}>
                    <Feather
                        name="check"
                        size={46}
                        color={COLORS.background}
                    />
                </View>

                <Text style={styles.titulo}>
                    Compra realizada!
                </Text>

                <Text style={styles.subtitulo}>
                    Obrigado por comprar na FortFit.
                </Text>

                <View style={styles.cartaoPedido}>
                    <Text style={styles.rotuloPedido}>
                        NÚMERO DO PEDIDO
                    </Text>

                    <Text style={styles.numeroPedido}>
                        {numeroPedido}
                    </Text>

                    <Text style={styles.textoAuxiliar}>
                        Gerado automaticamente no aplicativo
                    </Text>
                </View>

                <Text style={styles.mensagem}>
                    Recebemos seu pedido e já estamos preparando
                    tudo. Guarde o número acima para identificar
                    sua compra.
                </Text>

                <View style={styles.resumoCompra}>
                    <View style={styles.linhaResumo}>
                        <Text style={styles.nomeProduto}>
                            {produto.nomeProduto} ×{' '}
                            {produto.quantidadeProduto}
                        </Text>

                        <Text style={styles.valorProduto}>
                            {formatarDinheiro(valorTotal)}
                        </Text>
                    </View>

                    <View style={styles.linhaResumo}>
                        <Text style={styles.textoResumo}>
                            Entrega
                        </Text>

                        <Text style={styles.entregaGratis}>
                            Grátis
                        </Text>
                    </View>

                    <View style={styles.separador} />

                    <View style={styles.linhaResumo}>
                        <Text style={styles.textoTotal}>
                            Total
                        </Text>

                        <Text style={styles.valorTotal}>
                            {formatarDinheiro(valorTotal)}
                        </Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.botaoVoltarLoja}
                    onPress={voltarParaLoja}
                >
                    <Text style={styles.textoBotao}>
                        VOLTAR PARA A LOJA
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    areaSegura: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    conteudo: {
        flexGrow: 1,
        alignItems: 'center',
        paddingHorizontal: SIZES.padding,
        paddingTop: 24,
        paddingBottom: 32,
    },
    tituloCabecalho: {
        color: COLORS.text,
        fontSize: SIZES.h2,
        fontWeight: '700',
        alignSelf: 'flex-start',
    },
    etapas: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center',
        marginTop: 26,
        marginBottom: 30,
    },
    etapa: {
        width: 74,
        alignItems: 'center',
    },
    numeroEtapaAtivo: {
        width: 28,
        height: 28,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 14,
        backgroundColor: COLORS.primary,
    },
    textoNumeroAtivo: {
        color: COLORS.background,
        fontSize: SIZES.small,
        fontWeight: '700',
    },
    nomeEtapa: {
        color: COLORS.textSecondary,
        fontSize: 10,
        marginTop: 6,
    },
    nomeEtapaAtiva: {
        color: COLORS.primary,
        fontWeight: '700',
    },
    linhaEtapaAtiva: {
        width: 28,
        height: 2,
        marginTop: 13,
        backgroundColor: COLORS.primary,
    },
    iconeConfirmacao: {
        width: 88,
        height: 88,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 44,
        backgroundColor: COLORS.primary,
        marginBottom: 20,
    },
    titulo: {
        color: COLORS.text,
        fontSize: SIZES.h1,
        fontWeight: '700',
        textAlign: 'center',
    },
    subtitulo: {
        color: COLORS.textSecondary,
        fontSize: SIZES.body,
        textAlign: 'center',
        marginTop: 8,
        marginBottom: 22,
    },
    cartaoPedido: {
        width: '100%',
        alignItems: 'center',
        padding: 18,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: SIZES.radius,
        backgroundColor: COLORS.surface,
    },
    rotuloPedido: {
        color: COLORS.textSecondary,
        fontSize: 11,
        fontWeight: '700',
    },
    numeroPedido: {
        color: COLORS.primary,
        fontSize: 27,
        fontWeight: '700',
        marginVertical: 8,
    },
    textoAuxiliar: {
        color: COLORS.placeholder,
        fontSize: 11,
    },
    mensagem: {
        color: COLORS.textSecondary,
        fontSize: 13,
        lineHeight: 19,
        textAlign: 'center',
        marginVertical: 20,
    },
    resumoCompra: {
        width: '100%',
        padding: 16,
        marginBottom: 18,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: SIZES.radius,
        backgroundColor: COLORS.surface,
    },
    linhaResumo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 5,
    },
    nomeProduto: {
        flex: 1,
        color: COLORS.text,
        fontSize: SIZES.small,
        fontWeight: '700',
        marginRight: 12,
    },
    valorProduto: {
        color: COLORS.text,
        fontSize: SIZES.small,
        fontWeight: '700',
    },
    textoResumo: {
        color: COLORS.textSecondary,
        fontSize: 13,
    },
    entregaGratis: {
        color: COLORS.primary,
        fontSize: 13,
        fontWeight: '700',
    },
    separador: {
        height: 1,
        marginVertical: 10,
        backgroundColor: COLORS.border,
    },
    textoTotal: {
        color: COLORS.text,
        fontSize: SIZES.h3,
        fontWeight: '700',
    },
    valorTotal: {
        color: COLORS.primary,
        fontSize: SIZES.h2,
        fontWeight: '700',
    },
    botaoVoltarLoja: {
        width: '100%',
        minHeight: 58,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: SIZES.radius,
        backgroundColor: COLORS.primary,
    },
    textoBotao: {
        color: COLORS.background,
        fontSize: SIZES.body,
        fontWeight: '700',
    },
});