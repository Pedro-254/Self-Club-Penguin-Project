var array_elemento = ["W", "F", "S"];
var array_number = ["01","02","03","04","05","06","07","08","09","10","11","12"];
var array_color = ["P","O","Y","B","R","G"];

//Poder
var array_poder = ["+2","-2","INV","BF","BW","BS","BB","BG","BO","BP","BR","BY"]
var poder_ativo = []

//Registro do placar 
var placar1 = []
var placar2 = []


//PEGAR NUMERO ALEATÓRIO
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
//TIMER ENTRE CODIGOS
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

// ---------------------------------------- ALEATORIZADORES ---------------------------------------
function aleatorizar_elemento() {

    return array_elemento[getRandomInt(0,2)];
}

function aleatorizar_number() {

    return array_number[getRandomInt(0,11)];
}

function aleatorizar_color() {

    return array_color[getRandomInt(0,5)];
}

function aleatorizar_poder() {
    return array_poder[getRandomInt(0,11)]
}

function aleatorizar_carta() {
    var E = aleatorizar_elemento()
    var N = aleatorizar_number()
    var C = aleatorizar_color()

    return (E + N + C)
}


function comparar_elementos(element1,element2) {
    //Comparar elementos
    //Player 1 win
    if ((element1 == "W" && element2 == "F") || (element1 == "F" && element2 == "S") || (element1 == "S" && element2 == "W")) {
        return 1
    }
    //Player 2 win
    else if((element2 == "W" && element1 == "F") || (element2 == "F" && element1 == "S") || (element2 == "S" && element1 == "W")){
        return 2
    }
    //Empate
    else{
        return 3
    }
}

function comparar_numeros(number1,number2,inverter) {
    if (inverter == 1) {
        if (number1 < number2) {
            return 1
        }
        else if (number1 > number2){
            return 2
        }
        else{
            return 3
        }
    } else {
        if (number1 > number2) {
            return 1
        }
        else if (number1 < number2){
            return 2
        }
        else{
            return 3
        }
    }
    
}

function combate(carta1) {
    // Gera e printa carta do BOT
    var carta2 = aleatorizar_carta()
    var espaco = document.getElementById('mao0')
    espaco.innerHTML = ""
    let img = document.createElement("IMG");
    img.src = "Cartas/" + carta2 + ".png";
    img.id = carta2;
    img.style.width = "112px";
    img.style.height = "124px;";
    document.getElementById('mao0').appendChild(img);

    //Conferir poder das cartas
    if (carta2.substr(1,2) >= 9){
        let img = document.createElement("IMG");
        var poder = aleatorizar_poder()
        img.src = "Poderes/" + poder + ".png";
        img.id = poder
        document.getElementById('res_pow2').appendChild(img);
    }


    

    //Comparar as cartas
    element1 = carta1[0]
    element2 = carta2[0]
    number1 = parseInt((carta1[1] + carta1[2]), 10)
    number2 = parseInt((carta2[1] + carta2[2]), 10)
    color1 = carta1[3]
    color2 = carta2[3]
    var inverter = 0
    // Se tiver poder de modificação de valores
    if (poder_ativo != null){
        if(poder_ativo[0] == "+2"){
            if (poder_ativo[1] == "1") {
                number1 += 2
            } else {
                number2 += 2
            }
        }
        else if(poder_ativo[0] == "-2"){
            if (poder_ativo[1] == "1") {
                number1 -= 2
            } else {
                number2 -= 2
            }
        }
        else if(poder_ativo[0] == "INV"){
            inverter = 1
        }
        poder_ativo = []
        document.getElementById("poderes_ativos").innerHTML = ""
    }
    //Comparar
    var resultado = comparar_elementos(element1,element2)
    if (resultado == 3){
        resultado = comparar_numeros(number1,number2,inverter)
    }

//---------------------PRINTAR VENCEDOR E EXECUTAR PODER---------------------
    if (resultado == 1){
        printar_resultado(1,element1,color1)
        if (conferir_resultado(1,element1,color1) != true){
            pow = document.getElementById('res_pow1')
            if (pow.firstChild){
                pow = pow.children[0].id
                executar_poder(1,pow)
            }
        }
    }
    else if (resultado == 2){
        printar_resultado(2,element2,color2)
        if (conferir_resultado(2,element2,color2) != true){
            pow = document.getElementById('res_pow2')
            if (pow.firstChild){
                pow = pow.children[0].id
                executar_poder(2,pow)
            }
        }
        
    }

    
    


    
}

//-------------------PODERES-----------------
function executar_poder(player,poder) {
    var x = poder.substr(0,1)
    if (x == "B"){
        poder_bomba(player,poder.substr(1,1))
    }
    else if(poder == "+2" || poder == "-2"){
        poder_as(player,poder)
    }
    else if(poder == "INV"){
        poder_inv(player,poder)
    }
    
}
//-----------------------PODER AS------------------------
function poder_as(player,poder) {
    if (poder == "+2") {
    }
    else if (poder == "-2"){
        //Inverter players
        if (player == 1) {player = 2} else {player = 1}
    }
    poder_ativo.push(poder)
    poder_ativo.push(player)

    var img = document.createElement("IMG");
    img.src = "Poderes/" + poder + ".png";
    document.getElementById("poderes_ativos").appendChild(img);
}
//--------------------PODER INV--------------------------
function poder_inv(player,poder) {
    poder_ativo.push(poder)
    poder_ativo.push(player)

    var img = document.createElement("IMG");
    img.src = "Poderes/" + poder + ".png";
    document.getElementById("poderes_ativos").appendChild(img);
}

//------------------PODER BOMBA--------------------------
function poder_bomba(player,elemento) {
    //Inverter players
    if (player == 1){
        player = 2
    } 
    else{
        player = 1
    }
    //-----------------------------BOMBA DE ELEMENTOS
    if (elemento == "W" || elemento == "F" || elemento == "S"){
        res_modificado = document.getElementById(player + 'res_' + elemento);
        if(res_modificado.firstChild){
            res_modificado.removeChild(res_modificado.firstChild);
            if (player == 1){
                for (let i = 0; i < placar1.length; i++) {

                    if (placar1 != null) {
                        if (placar1[i].substr(0,1) == elemento){
                            var index = placar1.indexOf(placar1[i]);
                            if (index > -1) {
                                placar1.splice(index, 1);
                                break
                            }
                        }
                    }
                            
                    
                } 
            }

            if (player == 2){
                for (let i = 0; i < placar2.length; i++) {
                    if (placar2 != null) {
                        if (placar2[i].substr(0,1) == elemento){
                            var index = placar2.indexOf(placar2[i]);
                            if (index > -1) {
                                placar2.splice(index, 1);
                                break
                            }
                        }
                    }
                } 
            }
        }
        
    }
    //-----------------------------------BOMBA DE CORES
    else{
        if (player == 1){
            for (let i = 0; i < placar1.length; i++) {
                if (placar1 != null) {
                    if (placar1[i].substr(1,1) == elemento){
                        var index = placar1.indexOf(placar1[i]);
                        var element = placar1[i].substr(0,1)
                        var color = placar1[i].substr(1,1)
                        if (index > -1) {
                        res_modificado = document.getElementById(player + 'res_' + element);
                        res_modificado.removeChild(document.getElementById(element + color))
                            placar1.splice(index, 1);
                            break
                        }
                    }
                }
            }
        }

        if (player == 2) {
            for (let i = 0; i < placar2.length; i++) {
                if (placar2 != null) {
                    if (placar2[i].substr(1,1) == elemento){
                        var index = placar2.indexOf(placar2[i]);
                        var element = placar2[i].substr(0,1)
                        var color = placar2[i].substr(1,1)
                        if (index > -1) {
                        res_modificado = document.getElementById(player + 'res_' + element);
                        res_modificado.removeChild(document.getElementById(element + color))
                            placar2.splice(index, 1);
                            break
                        }
                    }
                }
            }
        }
    }
}

// --------------------------------------------------Printar resultado----------------------------------------------------------------
function printar_resultado(player,element,color) {

    let img = document.createElement("IMG");
    img.src = "Resultados/" + element + color + ".png";
    img.id = element + color
    document.getElementById(player + "res_" + element).appendChild(img);
    
}

//Conferir se ouve algum vencedor 
function conferir_resultado(player, element, color) {
    var resultado_cor = []
    var resultado_elemento_W = []
    var resultado_elemento_F = []
    var resultado_elemento_S = []

    if (player == 1){
        placar1.push(element + color)
        for (let i = 0; i < placar1.length; i++) {

            //Armazenar cor do elemento jogado
            if ((placar1[i]).substr(0,1) == element){
                resultado_cor.push((placar1[i]).substr(1,1))
            }

            // Armazenar cores de cada elemento
            if ((placar1[i]).substr(0,1) == "W"){
                resultado_elemento_W.push((placar1[i]).substr(1,1))
            }
            else if ((placar1[i]).substr(0,1) == "F"){
                resultado_elemento_F.push((placar1[i]).substr(1,1))
            }
            else if ((placar1[i]).substr(0,1) == "S"){
                resultado_elemento_S.push((placar1[i]).substr(1,1))
            }

            
        }
    }
    else if (player == 2){
        placar2.push(element + color)
        for (let i = 0; i < placar2.length; i++) {

            if ((placar2[i]).substr(0,1) == element){
                resultado_cor.push((placar2[i]).substr(1,1))
            }

            // Armazenar cores de cada elemento
            if ((placar2[i]).substr(0,1) == "W"){
                resultado_elemento_W.push((placar2[i]).substr(1,1))
            }
            else if ((placar2[i]).substr(0,1) == "F"){
                resultado_elemento_F.push((placar2[i]).substr(1,1))
            }
            else if ((placar2[i]).substr(0,1) == "S"){
                resultado_elemento_S.push((placar2[i]).substr(1,1))
            }
            
        }
    } 
    
    
    //Loop para conferir se existe 3 cores diferentes
    let B = 0
    let G = 0
    let O = 0
    let P = 0
    let R = 0
    let Y = 0
    var contador = 0
    var resultado_armazem = []
    for (let i = 0; i < resultado_cor.length; i++) {
        if (B == 0 && resultado_cor[i] == "B"){
            B++
            contador++
            resultado_armazem.push(resultado_cor[i])
        }
        else if (G == 0 && resultado_cor[i] == "G"){
            G++
            contador++
            resultado_armazem.push(resultado_cor[i])
        }
        else if (O == 0 && resultado_cor[i] == "O"){
            O++
            contador++
            resultado_armazem.push(resultado_cor[i])
        }
        else if (P == 0 && resultado_cor[i] == "P"){
            P++
            contador++
            resultado_armazem.push(resultado_cor[i])
        }
        else if (R == 0 && resultado_cor[i] == "R"){
            R++
            contador++
            resultado_armazem.push(resultado_cor[i])
        }
        else if (Y == 0 && resultado_cor[i] == "Y"){
            Y++
            contador++
            resultado_armazem.push(resultado_cor[i])
        }
        
    }

    if (contador >= 3) {
        var printar_resultado = 1
    }

    // Conferir se tem 3 elementos de cor diferente
    if (contador < 3){
        resultado_armazem = []
        for (let i = 0; i < resultado_elemento_W.length; i++) {
            var corW = resultado_elemento_W[i]
            for (let j = 0; j < resultado_elemento_F.length; j++) {
                var corF = resultado_elemento_F[j]
                for (let k = 0; k < resultado_elemento_S.length; k++) {
                    var corS = resultado_elemento_S[k]
                    if ((corW != corF) && (corW != corS) && (corF != corS)){
                        contador = 3
                        var printar_resultado = 2
                        resultado_armazem.push('W' + corW)
                        resultado_armazem.push('F' + corF)
                        resultado_armazem.push('S' + corS)
                        break
                    }
                }
                if (contador == 3) { break }
            }
            if (contador == 3) { break }
        }  
    }
    
    //Printar resultado
    if (printar_resultado == 1) {
        for (let i = 0; i < 3; i++) {
            var node = document.getElementById("resultados");
            if (i == 0) {
            node.parentNode.removeChild(node);
            }
            let img = document.createElement("IMG");
            img.src = "Resultados/" + element + resultado_armazem[i] + ".png";
            document.getElementById("res_p" + player).appendChild(img);
        }
        
    }
    else if(printar_resultado == 2){
        for (let i = 0; i < 3; i++) {
            var node = document.getElementById("resultados");
            if (i == 0) {
            node.parentNode.removeChild(node);
            }
            let img = document.createElement("IMG");
            img.src = "Resultados/" + resultado_armazem[i] + ".png";
            document.getElementById("res_p" + player).appendChild(img);
        }
    }
    
    // Enviar resultado
    if (contador >= 3){
        return true
    }
    else{
        return false
    }
}

function nova_carta(number,posicao_top,posicao_left) {
    //Gerar nova carta e printar na tela
    
    var carta = aleatorizar_carta()
    var espaco = document.getElementById('mao' + number)
    espaco.innerHTML = ""
    var img = document.createElement("IMG");
    img.src = "Cartas/" + carta + ".png";
    img.id = carta;
    img.style.width = "112px";
    img.style.height = "124px;";
    document.getElementById('mao' + number).appendChild(img);

    var div_carta = document.getElementById('mao' + number)
    div_carta.style.top = posicao_top;
    div_carta.style.left = posicao_left;

    if (carta.substr(1,2) >= 9){
        var img = document.createElement("IMG");
        var poder = aleatorizar_poder()
        img.src = "Poderes/" + poder + ".png";
        img.id = poder
        document.getElementById('pow' + number).appendChild(img);
    }

    var carta2 = document.getElementById('mao0')
    carta2.innerHTML = ""
    
}


var jogado = 0

async function jogar(number) {
    
    if (jogado == 0) {
        //Colocar carta no meio
        var div_carta = document.getElementById('mao' + number)
        var posicao_top = div_carta.style.top
        var posicao_left = div_carta.style.left
        div_carta.style.top = "-300px";
        div_carta.style.left = "600px";
        
        //Colocar poder no meio
        var div_poderes = document.getElementById('pow' + number)
        img_poder = div_poderes.innerHTML
        div_poderes.innerHTML = ""
        var div_res_poderes = document.getElementById('res_pow1')
        div_res_poderes.innerHTML = img_poder

        jogado = 1

        var carta = document.getElementsByTagName('img');
        combate((carta[number]).id)
        await sleep(2000);
        document.getElementById('res_pow1').innerHTML = ""
        document.getElementById('res_pow2').innerHTML = ""
        nova_carta(number,posicao_top,posicao_left) 
        

        jogado = 0 
    }
    
    
}

//Gera a mao
function gerar_mao() {

    for (let i = 1; i < 6; i++) {
        var carta = aleatorizar_carta()

        var espaco = document.getElementById("mao" + i)
        espaco.innerHTML = ""
        let img = document.createElement("IMG");
        img.src = "Cartas/" + carta + ".png";
        img.id = carta;
        img.style.width = "112px";
        img.style.height = "124px;";
        document.getElementById("mao" + i).appendChild(img);

        //Se a carta tiver PODER
        if (carta.substr(1,2) >= 9){
            var poder = aleatorizar_poder()
            //Printar poder ao lado da carta
            let img = document.createElement("IMG");
            img.src = "Poderes/" + poder + ".png";
            img.id = poder;
            document.getElementById("pow" + [i]).appendChild(img);
        }
        
    }
}