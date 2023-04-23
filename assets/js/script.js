"use strict";

import { conteudos } from './modulos/conteudos.js';
import { isEmpty } from './modulos/utilitarios.js';

(() => {
  function tooltips(){
    $(function () {
      $('[data-toggle="tooltip"]').tooltip()
    })
  }
  
  function popover(){
    $('[data-bs-toggle="popover"]').popover();  
  }

  window.addEventListener('load', () => {
    const body = document.querySelector('body');
    try{
      // try{body.innerHTML += conteudos.html_base;}catch(error){};
      clickGerar();
      verificarInputFile();
      clickReset();
      // clickBaixar();
      atualizarLink();
      clickCompartilharApp();
      clickCopiar();
      controleFechamentoModal();
      tooltips();
    }catch(error){
      body.innerHTML += conteudos.erro_carregamento;
    }finally{
      try{body.querySelector('[data-conteudo="area-loading-conteudo"]').remove();}catch(error){};
    }
  })
  
  document.querySelectorAll('[data-recarrega-pagina]').forEach(botao => {
    botao.addEventListener('click', () => {
      window.location.reload();
    })
  })
  
  const controleFechamentoModal = () => {
    const modais = document.querySelectorAll('.modal');
    modais.forEach(modal => {
      const btnFecha = modal.querySelector('[data-modal-fecha]');
      btnFecha.addEventListener('click', () => {
        $('#' + modal.id).modal('hide');
      })
    })
  }
  
  const clickGerar = () => {
    const form = document.querySelector('form');
    form.addEventListener('submit', (evento) => {
      evento.preventDefault();
      
      const input = form.querySelector('input[type=file]');
      if(!isEmpty(input)){
        if(!input.files.length == 0){
          
        }else{
          // clickUpload()
          input.click();
        }
      }
    })
  }

  $('#modal-resultado').modal('show')

  const clickCopiarResultado = () => {
    try{
      const modal = document.querySelector('#modal-resultado');
      const botao = modal.querySelector('button#copiar-resultado');

      botao.addEventListener('click', () => {
        const texto = modal.querySelector('[data-conteudo="resultado-txt-qr-code"]');
        if(!isEmpty(texto.textContent.trim())){
          copiar(texto.textContent.trim());
        }else{
          //Vazio
        }
      });
      
    }catch(error){

    }
  }

  clickCopiarResultado();

  const verificarInputFile = () => {
    const input = document.querySelector('[data-action="qr-code-upload"]');
    input.addEventListener('input', () => {
      if(!input.files.length == 0){
        const file = input.files[0];
        
        try{
          const nome = file.name.trim();
          const tipo = file.type.split('/')[1].toLowerCase();

          if(tipo == 'png' || tipo == 'jpeg'){
            //OK, tipo válido
          }else{
            //Tipo inválido
          }

        }catch(error){

        }

      }
    })
  }

  const clickReset = () => {
    document.querySelector('form').addEventListener('reset', () => {
      document.querySelector('[data-conteudo="texto"]').focus();
    })
  }
  
  const clickBaixar = () => {
    document.querySelector('#baixar-qr-code').addEventListener('click', (evento) => {
      evento.preventDefault();
      
      const img = document.querySelector('[data-conteudo="imagem-gerada"]');
      // const download_capture = document.querySelector('a[data-acao="download-capture"]');
      window.location.href = img.getAttribute('src');
      // download_capture.setAttribute('src', img.getAttribute('src'));
      // download_capture.click();
    })
  }  
  
  /* Link de compartilhamento */
  const atualizarLink = () => {
    const link = document.querySelector('#link-compartilhamento');
    
    try{
      const pagina = new URL(window.location);
      const url = `${pagina.origin}${pagina.pathname}`;
      link.value = !isEmpty(url) ? url.toLowerCase().trim() : 'Link não atribuído'
    }catch(error){
      console.log(error);
    }
  }
  
  const clickCompartilharApp = () => {
    document.querySelector('.btn-compartilhar-app').addEventListener('click', (evento) => {
      $('#modal-compartilhar-app').modal('show')
    })
  }
  
  async function copiar(valor){
    try{
      await navigator.clipboard.writeText(valor);
      return true;
    }catch(error){
      // console.log(error);
      return false;
    }
  }
  
  async function feedback(classes, conteudo){
    const modal = document.querySelector('#modal-compartilhar-app').querySelector('[data-conteudo="modal-body"]');
    if(modal.querySelector('div.alert') == null){
      const div = document.createElement('div');
      div.classList.value = `${classes}`;
      div.innerHTML = conteudo;
      modal.appendChild(div)
    }
  }
  
  const clickCopiar = () => document.querySelector('#copiar-link-compartilhamento').addEventListener('click', () => {
    const link = document.querySelector('#link-compartilhamento');
    
    try{
      copiar(link.value).then((retorno) => {
        if(retorno){
          feedback(`mt-2 alert alert-success`,'Copiado!');
        }else{
          feedback(`mt-2 alert alert-alert`,'Erro!');
        }
      })
      
    }catch(error){
      console.log(error)
    }finally{
      removerAlert();
    }
    
    function removerAlert(elemento){
      setTimeout(() => {
        document.querySelector('#modal-compartilhar-app').querySelectorAll('div.alert').forEach(alert => {
          alert.remove();
        }) 
      }, 3000)
    }
  })
})();