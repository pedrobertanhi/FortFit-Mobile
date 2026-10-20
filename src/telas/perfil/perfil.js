import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/theme';

function LinhaPerfil({ icone, rotulo, valor }) {
    return (
        <View style={styles.linha}>
            <View style={styles.iconeLinha}>
                <Feather name={icone} size={18} color={COLORS.primary} />
            </View>
            <View style={styles.textosLinha}>
                <Text style={styles.rotulo}>{rotulo}</Text>
                <Text style={styles.valor}>{valor}</Text>
            </View>
        </View>
    );
}

export default function PerfilScreen({ navigation }) {
    function sair() {
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    }

    return (
        <SafeAreaView style={styles.areaSegura}>
            <View style={styles.cabecalho}>
                <TouchableOpacity style={styles.botaoVoltar} onPress={() => navigation.goBack()}>
                    <Feather name="chevron-left" size={26} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.tituloCabecalho}>Meu perfil</Text>
                <View style={styles.espaco} />
            </View>

            <View style={styles.conteudo}>
                <View style={styles.avatar}>
                    <Feather name="user" size={42} color={COLORS.background} />
                </View>
                <Text style={styles.nome}>Cliente FortFit</Text>
                <Text style={styles.tipo}>Conta de cliente</Text>

                <View style={styles.cartao}>
                    <LinhaPerfil icone="mail" rotulo="E-mail" valor="cliente@fortfit.com" />
                    <View style={styles.separador} />
                    <LinhaPerfil icone="phone" rotulo="Telefone" valor="(11) 99999-9999" />
                    <View style={styles.separador} />
                    <LinhaPerfil icone="map-pin" rotulo="Localização" valor="São Paulo - SP" />
                </View>

                <TouchableOpacity style={styles.botaoPedidos} onPress={() => navigation.navigate('Carrinho')}>
                    <Feather name="shopping-bag" size={19} color={COLORS.text} />
                    <Text style={styles.textoPedidos}>Ver carrinho</Text>
                    <Feather name="chevron-right" size={19} color={COLORS.textSecondary} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.botaoSair} onPress={sair}>
                    <Feather name="log-out" size={19} color={COLORS.danger} />
                    <Text style={styles.textoSair}>Sair da conta</Text>
                </TouchableOpacity>
            </View>
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
    tituloCabecalho: { color: COLORS.text, fontSize: SIZES.h2, fontWeight: '700' },
    espaco: { width: 40 },
    conteudo: { flex: 1, alignItems: 'center', padding: SIZES.padding },
    avatar: {
        width: 92,
        height: 92,
        borderRadius: 46,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 14,
        backgroundColor: COLORS.primary,
    },
    nome: { color: COLORS.text, fontSize: SIZES.h2, fontWeight: '700', marginTop: 16 },
    tipo: { color: COLORS.textSecondary, fontSize: SIZES.small, marginTop: 5 },
    cartao: {
        width: '100%',
        padding: 16,
        marginTop: 28,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: SIZES.radius,
        backgroundColor: COLORS.surface,
    },
    linha: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
    iconeLinha: {
        width: 38,
        height: 38,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.background,
    },
    textosLinha: { marginLeft: 12 },
    rotulo: { color: COLORS.textSecondary, fontSize: 11 },
    valor: { color: COLORS.text, fontSize: SIZES.body, fontWeight: '600', marginTop: 3 },
    separador: { height: 1, backgroundColor: COLORS.border, marginVertical: 8 },
    botaoPedidos: {
        width: '100%',
        minHeight: 56,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: 16,
        marginTop: 16,
        borderRadius: SIZES.radius,
        backgroundColor: COLORS.surface,
    },
    textoPedidos: { flex: 1, color: COLORS.text, fontWeight: '600' },
    botaoSair: {
        width: '100%',
        minHeight: 54,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        marginTop: 'auto',
        borderWidth: 1,
        borderColor: COLORS.danger,
        borderRadius: SIZES.radius,
    },
    textoSair: { color: COLORS.danger, fontWeight: '700' },
});

