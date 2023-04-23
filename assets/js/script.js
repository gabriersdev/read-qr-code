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
      try{body.innerHTML += conteudos.html_base;}catch(error){};
      clickGerar();
      clickReset();
      clickBaixar();
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
    document.querySelector('form').addEventListener('submit', (evento) => {
      evento.preventDefault();
      const conteudo = document.querySelector('[data-conteudo="texto"]');
      const valor = conteudo.value.trim();
      
      if(!isEmpty(valor)){
        if(valor.length <= 1750){
          const img = document.querySelector('[data-conteudo="imagem-gerada"]');
          if(img !== null){
            img.setAttribute('src', `https://api.qrserver.com/v1/create-qr-code/?data=${valor}&amp;size=100x100`);
            $('#modal-qr-code').modal('show');
          }else{
            console.log('Link muito grande...');
          }
        }
      }else{
        conteudo.value = '';
        conteudo.focus();
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