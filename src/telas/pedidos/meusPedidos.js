import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, RefreshControl, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/theme';
import { useLoja } from '../../context/LojaContext';
import { consultarPagamentoMercadoPago } from '../../services/mercadoPago';

function formatarDinheiro(valor) {
    return `R$ ${Number(valor).toFixed(2).replace('.', ',')}`;
}

function formatarData(data) {
    return new Date(data).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function MeusPedidosScreen({ navigation }) {
    const { finalizarPedido, listarMeusPedidos, listarPagamentosPendentes, removerPagamentoPendente } = useLoja();
    const [pedidos, setPedidos] = useState([]);
    const [pendentes, setPendentes] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [verificando, setVerificando] = useState(false);

    const carregar = useCallback(async () => {
        setCarregando(true);
        const [pedidosDoUsuario, pagamentosPendentes] = await Promise.all([
            listarMeusPedidos(),
            listarPagamentosPendentes(),
        ]);
        setPedidos(pedidosDoUsuario);
        setPendentes(pagamentosPendentes);
        setCarregando(false);
    }, [listarMeusPedidos, listarPagamentosPendentes]);

    React.useEffect(() => { carregar(); }, [carregar]);

    async function verificarPagamentosPendentes() {
        if (!pendentes.length) return;
        setVerificando(true);
        let aprovados = 0;

        try {
            for (const pendente of pendentes) {
                const pagamento = await consultarPagamentoMercadoPago(pendente.numeroPedido);

                if (pagamento.status === 'approved') {
                    const registrado = await finalizarPedido({
                        numeroPedido: pendente.numeroPedido,
                        formaPagamento: 'mercado_pago',
                        pagamentoId: pagamento.paymentId,
                        statusPagamento: pagamento.status,
                        endereco: pendente.endereco,
                    });

                    if (registrado) {
                        await removerPagamentoPendente(pendente.numeroPedido);
                        aprovados += 1;
                    }
                }

                if (pagamento.status === 'rejected' || pagamento.status === 'cancelled') {
                    await removerPagamentoPendente(pendente.numeroPedido);
                }
            }

            await carregar();
            Alert.alert(
                aprovados ? 'Pagamento confirmado' : 'Pagamento ainda não confirmado',
                aprovados
                    ? `${aprovados} pedido(s) foi(ram) adicionado(s) à sua lista.`
                    : 'Ainda não identificamos um pagamento aprovado. Tente novamente em alguns instantes.'
            );
        } catch (erro) {
            Alert.alert('Não foi possível verificar', erro.message || 'Tente novamente em alguns instantes.');
        } finally {
            setVerificando(false);
        }
    }

    if (carregando) {
        return <SafeAreaView style={styles.areaSegura}><View style={styles.centro}><ActivityIndicator color={COLORS.primary}/></View></SafeAreaView>;
    }

    return (
        <SafeAreaView style={styles.areaSegura}>
            <View style={styles.cabecalho}>
                <TouchableOpacity style={styles.voltar} onPress={() => navigation.goBack()}>
                    <Feather name="chevron-left" size={26} color={COLORS.text}/>
                </TouchableOpacity>
                <Text style={styles.titulo}>Meus pedidos</Text>
                <View style={styles.espaco}/>
            </View>

            <FlatList
                data={pedidos}
                keyExtractor={(pedido) => String(pedido.id)}
                refreshControl={<RefreshControl refreshing={carregando} onRefresh={carregar} tintColor={COLORS.primary}/>}
                contentContainerStyle={pedidos.length ? styles.lista : styles.listaVazia}
                ListHeaderComponent={pendentes.length ? (
                    <View style={styles.pendente}>
                        <View style={styles.pendenteTexto}>
                            <Text style={styles.pendenteTitulo}>Pagamento pendente</Text>
                            <Text style={styles.pendenteDescricao}>Você tem {pendentes.length} pagamento(s) aguardando confirmação.</Text>
                        </View>
                        <TouchableOpacity style={styles.botaoVerificar} onPress={verificarPagamentosPendentes} disabled={verificando}>
                            {verificando ? <ActivityIndicator color={COLORS.background}/> : <Text style={styles.textoBotaoVerificar}>VERIFICAR</Text>}
                        </TouchableOpacity>
                    </View>
                ) : null}
                ListEmptyComponent={
                    <View style={styles.vazio}>
                        <Feather name="package" size={46} color={COLORS.primary}/>
                        <Text style={styles.tituloVazio}>Nenhum pedido ainda</Text>
                        <Text style={styles.textoVazio}>Quando finalizar uma compra, ela aparecerá aqui.</Text>
                        <TouchableOpacity style={styles.botaoLoja} onPress={() => navigation.navigate('ListaProdutosCliente')}>
                            <Text style={styles.textoBotao}>IR PARA A LOJA</Text>
                        </TouchableOpacity>
                    </View>
                }
                renderItem={({ item }) => (
                    <View style={styles.cartao}>
                        <View style={styles.linha}>
                            <View>
                                <Text style={styles.numero}>Pedido {item.id}</Text>
                                <Text style={styles.data}>{formatarData(item.criado_em)}</Text>
                            </View>
                            <View style={styles.status}><Text style={styles.textoStatus}>EM PREPARO</Text></View>
                        </View>
                        <View style={styles.separador}/>
                        {item.itens.map((produto, indice) => (
                            <View style={styles.item} key={produto.id ?? indice}>
                                <Text style={styles.nomeProduto} numberOfLines={1}>{produto.nome_produto ?? produto.produto?.nome} × {produto.quantidade}</Text>
                                <Text style={styles.preco}>{formatarDinheiro((produto.preco_unitario ?? produto.produto?.preco) * produto.quantidade)}</Text>
                            </View>
                        ))}
                        <View style={styles.separador}/>
                        <View style={styles.linha}><Text style={styles.total}>Total</Text><Text style={styles.valorTotal}>{formatarDinheiro(item.total)}</Text></View>
                    </View>
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    areaSegura:{flex:1,backgroundColor:COLORS.background},
    centro:{flex:1,alignItems:'center',justifyContent:'center'},
    cabecalho:{height:64,flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:SIZES.padding},
    voltar:{width:40,height:40,borderRadius:20,alignItems:'center',justifyContent:'center',backgroundColor:COLORS.surface},
    titulo:{color:COLORS.text,fontSize:SIZES.h2,fontWeight:'700'},
    espaco:{width:40},
    lista:{padding:SIZES.padding,paddingTop:10,paddingBottom:30},
    listaVazia:{flexGrow:1,padding:SIZES.padding},
    pendente:{flexDirection:'row',alignItems:'center',gap:12,padding:14,marginBottom:14,borderWidth:1,borderColor:COLORS.primary,borderRadius:SIZES.radius,backgroundColor:COLORS.surface},
    pendenteTexto:{flex:1},
    pendenteTitulo:{color:COLORS.text,fontWeight:'700',fontSize:SIZES.body},
    pendenteDescricao:{color:COLORS.textSecondary,fontSize:SIZES.small,marginTop:4},
    botaoVerificar:{minWidth:94,alignItems:'center',justifyContent:'center',paddingHorizontal:10,paddingVertical:12,borderRadius:10,backgroundColor:COLORS.primary},
    textoBotaoVerificar:{color:COLORS.background,fontSize:10,fontWeight:'800'},
    cartao:{padding:16,marginBottom:14,borderWidth:1,borderColor:COLORS.border,borderRadius:SIZES.radius,backgroundColor:COLORS.surface},
    linha:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
    numero:{color:COLORS.text,fontSize:SIZES.body,fontWeight:'700'},
    data:{color:COLORS.textSecondary,fontSize:SIZES.small,marginTop:4},
    status:{paddingHorizontal:8,paddingVertical:5,borderRadius:6,backgroundColor:'rgba(204,255,0,0.14)'},
    textoStatus:{color:COLORS.primary,fontSize:9,fontWeight:'700'},
    separador:{height:1,backgroundColor:COLORS.border,marginVertical:14},
    item:{flexDirection:'row',justifyContent:'space-between',marginBottom:9},
    nomeProduto:{flex:1,color:COLORS.textSecondary,fontSize:SIZES.small,marginRight:10},
    preco:{color:COLORS.text,fontSize:SIZES.small,fontWeight:'600'},
    total:{color:COLORS.text,fontWeight:'700'},
    valorTotal:{color:COLORS.primary,fontSize:SIZES.h3,fontWeight:'700'},
    vazio:{flex:1,alignItems:'center',justifyContent:'center',paddingBottom:70},
    tituloVazio:{color:COLORS.text,fontSize:SIZES.h2,fontWeight:'700',marginTop:18},
    textoVazio:{color:COLORS.textSecondary,textAlign:'center',marginTop:8},
    botaoLoja:{marginTop:28,paddingHorizontal:22,paddingVertical:14,borderRadius:SIZES.radius,backgroundColor:COLORS.primary},
    textoBotao:{color:COLORS.background,fontWeight:'700'},
});
