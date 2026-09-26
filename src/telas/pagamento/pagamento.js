import React, { useState } from 'react';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/theme';

const PRODUTO_EXEMPLO = {
    idProduto: 1,
    nomeProduto: 'Creatina Monohidratada 300g',
    precoProduto: 89.9,
    quantidadeProduto: 1,
    fotoProduto: null,
};

function CampoFormulario({
    rotulo,
    valor,
    aoAlterar,
    dica,
    teclado = 'default',
    tamanhoMaximo,
    opcional = false,
    maiusculo = false,
}) {
    return (
        <View style={styles.grupoCampo}>
            <Text style={styles.rotuloCampo}>
                {rotulo.toUpperCase()}
                {opcional ? ' (OPCIONAL)' : ' *'}
            </Text>

            <TextInput
                style={styles.campo}
                value={valor}
                onChangeText={aoAlterar}
                placeholder={dica}
                placeholderTextColor={COLORS.placeholder}
                keyboardType={teclado}
                maxLength={tamanhoMaximo}
                autoCapitalize={maiusculo ? 'characters' : 'sentences'}
            />
        </View>
    );
}

function EtapasCheckout() {
    return (
        <View style={styles.etapas}>
            <View style={styles.etapa}>
                <View
                    style={[
                        styles.numeroEtapa,
                        styles.numeroEtapaAtivo,
                    ]}
                >
                    <Feather
                        name="check"
                        size={14}
                        color={COLORS.background}
                    />
                </View>
                <Text style={styles.nomeEtapa}>Carrinho</Text>
            </View>

            <View
                style={[
                    styles.linhaEtapa,
                    styles.linhaEtapaAtiva,
                ]}
            />

            <View style={styles.etapa}>
                <View
                    style={[
                        styles.numeroEtapa,
                        styles.numeroEtapaAtivo,
                    ]}
                >
                    <Text style={styles.textoNumeroAtivo}>2</Text>
                </View>

                <Text
                    style={[
                        styles.nomeEtapa,
                        styles.nomeEtapaAtiva,
                    ]}
                >
                    Pagamento
                </Text>
            </View>

            <View style={styles.linhaEtapa} />

            <View style={styles.etapa}>
                <View style={styles.numeroEtapa}>
                    <Text style={styles.textoNumero}>3</Text>
                </View>
                <Text style={styles.nomeEtapa}>Confirmação</Text>
            </View>
        </View>
    );
}

export default function PagamentoScreen(props) {
    const navigation = props.navigation;
    const produtoRecebido = props.route?.params?.produto;

    const produto = {
        idProduto:
            produtoRecebido?.idProduto ??
            PRODUTO_EXEMPLO.idProduto,

        nomeProduto:
            produtoRecebido?.nomeProduto ??
            PRODUTO_EXEMPLO.nomeProduto,

        precoProduto:
            produtoRecebido?.precoProduto ??
            PRODUTO_EXEMPLO.precoProduto,

        quantidadeProduto:
            produtoRecebido?.quantidadeProduto ??
            PRODUTO_EXEMPLO.quantidadeProduto,

        fotoProduto:
            produtoRecebido?.fotoProduto ??
            PRODUTO_EXEMPLO.fotoProduto,
    };

    const [tipoCartao, setTipoCartao] = useState('credito');
    const [numeroCartao, setNumeroCartao] = useState('');
    const [nomeCartao, setNomeCartao] = useState('');
    const [validadeCartao, setValidadeCartao] = useState('');
    const [codigoSeguranca, setCodigoSeguranca] = useState('');

    const [cep, setCep] = useState('');
    const [mostrarEndereco, setMostrarEndereco] =
        useState(false);
    const [rua, setRua] = useState('');
    const [bairro, setBairro] = useState('');
    const [numeroEndereco, setNumeroEndereco] = useState('');
    const [complemento, setComplemento] = useState('');

    const valorTotal =
        produto.precoProduto * produto.quantidadeProduto;

    const fonteFoto = produto.fotoProduto
        ? typeof produto.fotoProduto === 'string'
            ? { uri: produto.fotoProduto }
            : produto.fotoProduto
        : null;

    function formatarDinheiro(valor) {
        return `R$ ${Number(valor)
            .toFixed(2)
            .replace('.', ',')}`;
    }

    function alterarNumeroCartao(texto) {
        const somenteNumeros = texto
            .replace(/\D/g, '')
            .slice(0, 16);

        const numeroFormatado = somenteNumeros
            .replace(/(.{4})/g, '$1 ')
            .trim();

        setNumeroCartao(numeroFormatado);
    }

    function alterarValidade(texto) {
        const somenteNumeros = texto
            .replace(/\D/g, '')
            .slice(0, 4);

        if (somenteNumeros.length > 2) {
            setValidadeCartao(
                `${somenteNumeros.slice(
                    0,
                    2
                )}/${somenteNumeros.slice(2)}`
            );
            return;
        }

        setValidadeCartao(somenteNumeros);
    }

    function alterarCodigoSeguranca(texto) {
        const somenteNumeros = texto
            .replace(/\D/g, '')
            .slice(0, 4);

        setCodigoSeguranca(somenteNumeros);
    }

    function alterarCep(texto) {
        const somenteNumeros = texto
            .replace(/\D/g, '')
            .slice(0, 8);

        const cepFormatado =
            somenteNumeros.length > 5
                ? `${somenteNumeros.slice(
                    0,
                    5
                )}-${somenteNumeros.slice(5)}`
                : somenteNumeros;

        setCep(cepFormatado);
        setMostrarEndereco(somenteNumeros.length === 8);
    }

    function gerarNumeroPedido() {
        const numeroAleatorio = Math.floor(
            100000 + Math.random() * 900000
        );

        return `FF-${numeroAleatorio}`;
    }

    function voltar() {
        if (navigation) {
            navigation.goBack();
        }
    }

    function finalizarPagamento() {
        const numerosCartao = numeroCartao.replace(
            /\D/g,
            ''
        ).length;

        const numerosValidade = validadeCartao.replace(
            /\D/g,
            ''
        ).length;

        const numerosCodigo = codigoSeguranca.replace(
            /\D/g,
            ''
        ).length;

        const numerosCep = cep.replace(/\D/g, '').length;

        const cartaoValido =
            numerosCartao === 16 &&
            nomeCartao.trim().length >= 3 &&
            numerosValidade === 4 &&
            numerosCodigo >= 3;

        const enderecoValido =
            numerosCep === 8 &&
            rua.trim() !== '' &&
            bairro.trim() !== '' &&
            numeroEndereco.trim() !== '';

        if (!cartaoValido || !enderecoValido) {
            Alert.alert(
                'Campos obrigatórios',
                'Preencha corretamente todos os campos marcados com *. O complemento é opcional.'
            );
            return;
        }

        const numeroPedido = gerarNumeroPedido();

        if (navigation) {
            navigation.navigate('PagamentoConfirmado', {
                numeroPedido,
                produto,
                valorTotal,
            });
        }
    }

    return (
        <SafeAreaView style={styles.areaSegura}>
            <KeyboardAvoidingView
                style={styles.areaSegura}
                behavior={
                    Platform.OS === 'ios'
                        ? 'padding'
                        : undefined
                }
            >
                <View style={styles.cabecalho}>
                    <TouchableOpacity
                        onPress={voltar}
                        style={styles.botaoVoltar}
                    >
                        <Feather
                            name="chevron-left"
                            size={26}
                            color={COLORS.text}
                        />
                    </TouchableOpacity>

                    <Text style={styles.tituloCabecalho}>
                        Pagamento
                    </Text>

                    <View style={styles.espacoCabecalho} />
                </View>

                <ScrollView
                    contentContainerStyle={styles.conteudo}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <EtapasCheckout />

                    <View style={styles.resumoProduto}>
                        {fonteFoto ? (
                            <Image
                                source={fonteFoto}
                                style={styles.fotoProduto}
                            />
                        ) : (
                            <View
                                style={styles.fotoProdutoVazia}
                            >
                                <Feather
                                    name="shopping-bag"
                                    size={28}
                                    color={COLORS.primary}
                                />
                            </View>
                        )}

                        <View style={styles.dadosProduto}>
                            <Text style={styles.nomeProduto}>
                                {produto.nomeProduto}
                            </Text>

                            <Text
                                style={styles.quantidadeProduto}
                            >
                                Quantidade:{' '}
                                {produto.quantidadeProduto}
                            </Text>

                            <Text style={styles.precoProduto}>
                                {formatarDinheiro(valorTotal)}
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.tituloSecao}>
                        Forma de pagamento
                    </Text>

                    <View style={styles.opcoesCartao}>
                        <TouchableOpacity
                            style={[
                                styles.opcaoCartao,
                                tipoCartao === 'credito' &&
                                    styles.opcaoCartaoAtiva,
                            ]}
                            onPress={() =>
                                setTipoCartao('credito')
                            }
                        >
                            <Feather
                                name={
                                    tipoCartao === 'credito'
                                        ? 'check-circle'
                                        : 'circle'
                                }
                                size={19}
                                color={
                                    tipoCartao === 'credito'
                                        ? COLORS.primary
                                        : COLORS.textSecondary
                                }
                            />

                            <Text
                                style={
                                    styles.textoOpcaoCartao
                                }
                            >
                                Crédito
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.opcaoCartao,
                                tipoCartao === 'debito' &&
                                    styles.opcaoCartaoAtiva,
                            ]}
                            onPress={() =>
                                setTipoCartao('debito')
                            }
                        >
                            <Feather
                                name={
                                    tipoCartao === 'debito'
                                        ? 'check-circle'
                                        : 'circle'
                                }
                                size={19}
                                color={
                                    tipoCartao === 'debito'
                                        ? COLORS.primary
                                        : COLORS.textSecondary
                                }
                            />

                            <Text
                                style={
                                    styles.textoOpcaoCartao
                                }
                            >
                                Débito
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <CampoFormulario
                        rotulo="Número do cartão"
                        valor={numeroCartao}
                        aoAlterar={alterarNumeroCartao}
                        dica="0000 0000 0000 0000"
                        teclado="numeric"
                        tamanhoMaximo={19}
                    />

                    <CampoFormulario
                        rotulo="Nome no cartão"
                        valor={nomeCartao}
                        aoAlterar={setNomeCartao}
                        dica="NOME COMPLETO"
                        maiusculo
                    />

                    <View style={styles.linhaCampos}>
                        <View style={styles.campoMetade}>
                            <CampoFormulario
                                rotulo="Validade"
                                valor={validadeCartao}
                                aoAlterar={alterarValidade}
                                dica="MM/AA"
                                teclado="numeric"
                                tamanhoMaximo={5}
                            />
                        </View>

                        <View style={styles.campoMetade}>
                            <CampoFormulario
                                rotulo="Código de segurança"
                                valor={codigoSeguranca}
                                aoAlterar={
                                    alterarCodigoSeguranca
                                }
                                dica="000"
                                teclado="numeric"
                                tamanhoMaximo={4}
                            />
                        </View>
                    </View>

                    <Text style={styles.tituloSecao}>
                        Endereço de entrega
                    </Text>

                    <Text style={styles.textoAjuda}>
                        Digite o CEP para liberar os demais
                        campos.
                    </Text>

                    <CampoFormulario
                        rotulo="CEP"
                        valor={cep}
                        aoAlterar={alterarCep}
                        dica="00000-000"
                        teclado="numeric"
                        tamanhoMaximo={9}
                    />

                    {mostrarEndereco && (
                        <View>
                            <CampoFormulario
                                rotulo="Rua"
                                valor={rua}
                                aoAlterar={setRua}
                                dica="Nome da rua"
                            />

                            <View style={styles.linhaCampos}>
                                <View
                                    style={styles.campoBairro}
                                >
                                    <CampoFormulario
                                        rotulo="Bairro"
                                        valor={bairro}
                                        aoAlterar={setBairro}
                                        dica="Bairro"
                                    />
                                </View>

                                <View
                                    style={styles.campoNumero}
                                >
                                    <CampoFormulario
                                        rotulo="Número"
                                        valor={numeroEndereco}
                                        aoAlterar={
                                            setNumeroEndereco
                                        }
                                        dica="100"
                                        teclado="numeric"
                                    />
                                </View>
                            </View>

                            <CampoFormulario
                                rotulo="Complemento"
                                valor={complemento}
                                aoAlterar={setComplemento}
                                dica="Apartamento, bloco..."
                                opcional
                            />
                        </View>
                    )}

                    <View style={styles.resumoValores}>
                        <View style={styles.linhaResumo}>
                            <Text style={styles.textoResumo}>
                                Subtotal
                            </Text>

                            <Text style={styles.valorResumo}>
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
                        style={styles.botaoFinalizar}
                        onPress={finalizarPagamento}
                    >
                        <Text
                            style={
                                styles.textoBotaoFinalizar
                            }
                        >
                            FINALIZAR PAGAMENTO
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    areaSegura: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
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
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        backgroundColor: COLORS.surface,
    },
    espacoCabecalho: {
        width: 40,
    },
    tituloCabecalho: {
        color: COLORS.text,
        fontSize: SIZES.h2,
        fontWeight: '700',
    },
    conteudo: {
        paddingHorizontal: SIZES.padding,
        paddingBottom: 36,
    },
    etapas: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center',
        marginVertical: 16,
    },
    etapa: {
        width: 74,
        alignItems: 'center',
    },
    numeroEtapa: {
        width: 28,
        height: 28,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 14,
        backgroundColor: COLORS.surface,
    },
    numeroEtapaAtivo: {
        backgroundColor: COLORS.primary,
    },
    textoNumero: {
        color: COLORS.textSecondary,
        fontSize: SIZES.small,
        fontWeight: '700',
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
    linhaEtapa: {
        width: 28,
        height: 2,
        marginTop: 13,
        backgroundColor: COLORS.border,
    },
    linhaEtapaAtiva: {
        backgroundColor: COLORS.primary,
    },
    resumoProduto: {
        minHeight: 110,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: SIZES.radius,
        backgroundColor: COLORS.surface,
    },
    fotoProduto: {
        width: 76,
        height: 76,
        marginRight: 12,
        borderRadius: 10,
    },
    fotoProdutoVazia: {
        width: 76,
        height: 76,
        marginRight: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        backgroundColor: COLORS.background,
    },
    dadosProduto: {
        flex: 1,
    },
    nomeProduto: {
        color: COLORS.text,
        fontSize: SIZES.body,
        fontWeight: '700',
        marginBottom: 4,
    },
    quantidadeProduto: {
        color: COLORS.textSecondary,
        fontSize: 11,
        marginBottom: 5,
    },
    precoProduto: {
        color: COLORS.primary,
        fontSize: 17,
        fontWeight: '700',
    },
    tituloSecao: {
        color: COLORS.text,
        fontSize: SIZES.h2,
        fontWeight: '700',
        marginBottom: 14,
    },
    opcoesCartao: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 22,
    },
    opcaoCartao: {
        flex: 1,
        height: 54,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 9,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 12,
        backgroundColor: COLORS.background,
    },
    opcaoCartaoAtiva: {
        borderWidth: 2,
        borderColor: COLORS.primary,
        backgroundColor: COLORS.surface,
    },
    textoOpcaoCartao: {
        color: COLORS.text,
        fontSize: SIZES.body,
        fontWeight: '700',
    },
    grupoCampo: {
        marginBottom: 16,
    },
    rotuloCampo: {
        color: COLORS.textSecondary,
        fontSize: 11,
        fontWeight: '700',
        marginBottom: 7,
    },
    campo: {
        height: 52,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 12,
        backgroundColor: COLORS.background,
        color: COLORS.text,
        fontSize: SIZES.body,
    },
    linhaCampos: {
        flexDirection: 'row',
        gap: 12,
    },
    campoMetade: {
        flex: 1,
    },
    campoBairro: {
        flex: 1.7,
    },
    campoNumero: {
        flex: 1,
    },
    textoAjuda: {
        color: COLORS.textSecondary,
        fontSize: SIZES.small,
        marginTop: -6,
        marginBottom: 16,
    },
    resumoValores: {
        padding: 16,
        marginTop: 4,
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
    textoResumo: {
        color: COLORS.textSecondary,
        fontSize: 13,
    },
    valorResumo: {
        color: COLORS.text,
        fontSize: 13,
        fontWeight: '700',
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
    botaoFinalizar: {
        minHeight: 58,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 18,
        borderRadius: SIZES.radius,
        backgroundColor: COLORS.primary,
    },
    textoBotaoFinalizar: {
        color: COLORS.background,
        fontSize: SIZES.body,
        fontWeight: '700',
    },
});