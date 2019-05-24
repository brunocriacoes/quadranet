"use strict";

var tipo_error = [
    { id: '1', nome: "Dica"},
    { id: '2', nome: "Relatar error"},
    { id: '3', nome: "Dúvida"},
    { id: '4', nome: "Suporte"}
];

var sim_nao = [
    { id : "1", nome: "Sim" },
    { id : "0", nome: "Não" }
];

var is_admin = [
    { id: "1", nome: "Usuário"},
    { id: "2", nome: "Administrador"}
];
var status_pagamento = [
    { id: "0", nome: "Todos"},
    { id: "1", nome: "Aguardando pagamento"},
    { id: "2", nome: "Pago"},
    { id: "3", nome: "Parcial"},
    { id: "4", nome: "Cancelado"},
];
var status_compra = [
    { id: "0", nome: "Todos"},
    { id: "1", nome: "Aguardando pagamento"},
    { id: "2", nome: "Pago"},
    { id: "3", nome: "Parcial"},
    { id: "4", nome: "Cancelado"},
];

var estado = [
    { id: "AC", nome: "Acre"},
    { id: "AL", nome: "Alagoas"},
    { id: "AP", nome: "Amapá"},
    { id: "AM", nome: "Amazonas"},
    { id: "BA", nome: "Bahia"},
    { id: "CE", nome: "Ceará"},
    { id: "DF", nome: "Distrito Federal"},
    { id: "ES", nome: "Espírito Santo"},
    { id: "GO", nome: "Goiás"},
    { id: "MA", nome: "Maranhão"},
    { id: "MT", nome: "Mato Grosso"},
    { id: "MS", nome: "Mato Grosso do Sul"},
    { id: "MG", nome: "Minas Gerais"},
    { id: "PA", nome: "Pará "},
    { id: "PB", nome: "Paraíba"},
    { id: "PR", nome: "Paraná"},
    { id: "PE", nome: "Pernambuco"},
    { id: "PI", nome: "Piauí"},
    { id: "RJ", nome: "Rio de Janeiro"},
    { id: "RN", nome: "Rio Grande do Norte"},
    { id: "RS", nome: "Rio Grande do Sul"},
    { id: "RO", nome: "Rondônia"},
    { id: "RR", nome: "Roraima"},
    { id: "SC", nome: "Santa Catarina"},
    { id: "SP", nome: "São Paulo"},
    { id: "SE", nome: "Sergipe"},
    { id: "TO", nome: "Tocantins"}
];

var mes = [
    { id: '0', nome: "Todos" },
    { id: '01', nome: "Janeiro" },
    { id: '02', nome: "Fevereiro" },
    { id: '03', nome: "Março" },
    { id: '04', nome: "Abril" },
    { id: '05', nome: "Maio" },
    { id: '06', nome: "Junho" },
    { id: '07', nome: "Julho" },
    { id: '08', nome: "Agosto" },
    { id: '09', nome: "Setembro" },
    { id: '10', nome: "Outubro" },
    { id: '11', nome: "Novembro" },
    { id: '12', nome: "Dezembro" }
];

var anos = [
    { id: '0', nome: "Todos" }
];
for (let i = 2019; i < 2030; i++) {
    anos.push( { id: i, nome: i } )

}

var site_sistema = [
    { id: "0", nome: "Todos " },
    { id: 1, nome: "Site" },
    { id: 2, nome: "Sistema" },    
];

var mensal_avulso = [
    { id: "0", nome: "Todos" },
    { id: "1", nome: "Avulso" },
    { id: "2", nome: "Mensal" },    
];