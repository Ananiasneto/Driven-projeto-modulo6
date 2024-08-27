
let nomeRemetente = prompt('Qual seu nome de usuário?');
let mensagem=[
];
let destinatario = "Todos";
let tipo = "message";
let todosUsuariosLogados= [];

const meuUUID = '91dce430-bbca-49ba-be15-85d0a060e11b '
const linkParticipantes = "https://mock-api.driven.com.br/api/v6/uol/participants/" + meuUUID
const linkMensagens = "https://mock-api.driven.com.br/api/v6/uol/messages/" + meuUUID
const linkStatus = "https://mock-api.driven.com.br/api/v6/uol/status/" + meuUUID

function atualizarUsuario() {
    let usuario= {
        name: nomeRemetente
    };
    return usuario;
}
function atualizartime() {
    let time=new Date().toLocaleTimeString();
    return time;
}
function abrirMenu(){
    const fundo=document.querySelector('.fundo');
    const habilitarMenu=document.querySelector('.menu');
    habilitarMenu.classList.remove('desabilitar');
    fundo.classList.remove('desabilitar');
    }

function fecharMenu(){
    const fundo=document.querySelector('.fundo');
    const habilitarMenu=document.querySelector('.menu');
    habilitarMenu.classList.add('desabilitar');
    fundo.classList.add('desabilitar');
    }

function selecionarPrivacidade(selecionado){
    const selecionadoAntes=document.querySelector('.privacidade .habilitado');
    if(selecionadoAntes!==null){   
    selecionadoAntes.classList.add('desabilitar');
    selecionadoAntes.classList.remove('habilitado');
    };
    const selecionadoAgora=selecionado.querySelector('span');
    selecionadoAgora.classList.remove('desabilitar');
    selecionadoAgora.classList.add('habilitado');
    MudarNomePrivacidade();
    
    }

function selecionarContato(selecionado){
    const selecionadoAntes=document.querySelector('.contato .habilitado');
    if(selecionadoAntes!==null){   
    selecionadoAntes.classList.add('desabilitar');
    selecionadoAntes.classList.remove('habilitado');
    };
    const selecionadoAgora=selecionado.querySelector('span');
    selecionadoAgora.classList.remove('desabilitar');
    selecionadoAgora.classList.add('habilitado');
    EnviandoPraQuem();
    }

function nomeDestinatario(){
        const filho=document.querySelector('.contato .habilitado');
        const pai=(filho.parentNode).parentNode;
        const nome=pai.querySelector('.nome');
        return nome.innerText;
    }

function tipoPrivacidade(){
        const filho=document.querySelector('.privacidade .habilitado');
        const pai=(filho.parentNode).parentNode;
        const tipo=pai.querySelector('.tipo');
        return tipo.innerText;
        
    }

function logar(){
    const promessa=axios.post(linkParticipantes,atualizarUsuario());
    promessa.then(acessoPermitido);
    promessa.catch(acessoNegado);
}
function acessoPermitido(){
    let type='status';
    mostrarMensagens();
    let time=atualizartime();
    let enviadas=document.querySelector('.mensagens-enviadas');
        enviadas.innerHTML+= `<h1 class="mensagem ${type}">
        <span class="hora"> (${time}) </span>
        <span class="usuario">  ${nomeRemetente} </span>
        <span class="conteudo">  Entrou na sala </span>
        </h1>`
    
}

function acessoNegado(error){
        if(error.response && error.response.status === 400){
            nomeRemetente=prompt("o nome de usuario ja existe,por favor escolha outro nome");
            logar();
        }else{
            console.log("falhou");
        }
}
function mostrarMensagens(){
    const promessa=axios.get(linkMensagens);
    promessa.then(MensagensCarregadas);
    promessa.catch(MensagensNaoCarregadas);
}
function MensagensCarregadas(resposta){
    
    mensagem=resposta.data;
    
  
    let enviadas=document.querySelector('.mensagens-enviadas');
    enviadas.innerHTML='';
    for(i=0;i<mensagem.length;i++){
        
        if(mensagem[i].type==='private_message'){
            if(mensagem[i].from===nomeRemetente||mensagem[i].to===nomeRemetente){
            enviadas.innerHTML+= `<h1 class="mensagem ${mensagem[i].type}">
            <span class="hora"> (${mensagem[i].time}) </span>
            <span class="usuario"> ${mensagem[i].from} </span><span class="conteudo">reservadamente para</span>
            <span class="usuario"> ${mensagem[i].to} :</span>
            <span class="conteudo"> ${mensagem[i].text} </span>
            </h1>`
            }
        }
        else if(mensagem[i].type==='message'){
            enviadas.innerHTML+= `<h1 class="mensagem ${mensagem[i].type}">
            <span class="hora"> (${mensagem[i].time}) </span>
            <span class="usuario"> ${mensagem[i].from} </span><span class="conteudo"> para </span>
             <span class="usuario"> ${mensagem[i].to} :</span>
            <span class="conteudo"> ${mensagem[i].text} </span>
            </h1>`
        }
        else{
            enviadas.innerHTML+= `<h1 class="mensagem ${mensagem[i].type}">
            <span class="hora"> (${mensagem[i].time}) </span>
            <span class="usuario"> ${mensagem[i].from} </span>
            <span class="conteudo"> ${mensagem[i].text} </span>
            </h1>`
        }
        
}
elementoQueQueroQueApareca=enviadas.lastElementChild;
elementoQueQueroQueApareca.scrollIntoView();
}

function MensagensNaoCarregadas(){
    console('erro ao carregar mensagens');
}

function enviarMensagem() 
{
    let testeTipo=tipoPrivacidade();
    let testeDestinatario=nomeDestinatario();
    const input=document.querySelector('input');
    let novaMensagem = input.value;
   if (testeTipo!=='Público') {
        tipo='private_message';
   }else{
        tipo='message';
   }
   if (destinatario!==testeDestinatario){
        destinatario=testeDestinatario;
   }
  const mensagemNova = {
    from: nomeRemetente,
    to: destinatario,
    text: novaMensagem,
    type: tipo,
  };
  const promessa = axios.post(linkMensagens, mensagemNova)
  promessa.then(mensagemEnviada);
  promessa.catch(erroEnviarMensagem);

  input.value = ''
}


function mensagemEnviada()
{
  mostrarMensagens()
}

function erroEnviarMensagem(erro) 
{
  console.error("Erro ao enviar mensagem", erro);
  alert("Não foi possível enviar a mensagem. Tente novamente.")
}
function usuarioOnline() 
{
  let usuario = 
  {
    name: nomeRemetente
  }

 const promessa=axios.post(linkStatus, usuario);
 promessa.then(tudoCerto);
 promessa.catch(usuarioOffline);
}
function tudoCerto(){

}
function usuarioOffline(){
    alert('voce foi desconectado,tente novamente');
    window.location.reload();
}

function meusContatos(){
    const promessa=axios.get(linkParticipantes);
    promessa.then(contatosOnline);
    promessa.catch(erroListaContato);
}

function contatosOnline(resposta){
    const contatos=document.querySelector('.ajusta');
    todosUsuariosLogados=resposta.data;

    contatos.innerHTML=`<div class="texto-principal">
    <h1>Escolha um contato <br> para enviar mensagem:</h1>
    </div>`


    contatos.innerHTML+= `
    <div onclick="selecionarContato(this)" class="contato">
        <div class="info">
            <ion-icon name="people"></ion-icon>
            <h2 class="nome">Todos</h2>
        </div>
    <div class="escolhido">
        <span class=" desabilitar habilitado"><ion-icon name="checkmark-sharp"></ion-icon></span>
    </div>
</div>`



    todosUsuariosLogados.forEach(nomeDoContato => {
        if(nomeDoContato.name!==nomeRemetente){
        contatos.innerHTML+= 
            `<div onclick="selecionarContato(this)" class="contato">
                <div class="info">
                    <ion-icon name="people"></ion-icon>
                    <h2 class="nome">${nomeDoContato.name}</h2>
                </div>
                <div class="escolhido">
                <span class=" desabilitar habilitado"><ion-icon name="checkmark-sharp"></ion-icon></span>
                </div>
            </div>`
        }     
    })
    EnviandoPraQuem();
    MudarNomePrivacidade();

}

function erroListaContato(erro){
    console.error("Erro ao ver lista contato", erro);
}

function EnviandoPraQuem(){
    const minhaMensagem=document.querySelector('.enviandoPara');
    minhaMensagem.innerHTML=nomeDestinatario();
}
function MudarNomePrivacidade(){
    const nomepriv=document.querySelector('.privacidadeEscolhida');
    nomepriv.innerHTML=`(${tipoPrivacidade()})`;
}

logar();
meusContatos();

setInterval(mostrarMensagens, 3000);
setInterval(usuarioOnline, 5000);
setInterval(meusContatos,10000)

