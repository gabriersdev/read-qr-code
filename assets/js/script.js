"use strict";

import { conteudos } from './modulos/conteudos.js';
import { isEmpty } from './modulos/utilitarios.js';

import QrScanner from './frameworks/qr-scanner.min.js'

// TODO - Implementar o uso do framework QR-Scanner para as imagens enviadas
(() => {
  // Testando qr-scanner
  const bs64 = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPoAAAD6AQMAAACyIsh+AAAABlBMVEX///8AAABVwtN+AAAACXBIWXMAAA7EAAAOxAGVKw4bAAABHklEQVRoge3YOw7CMBAE0LUoUnIEjuKjhaPlKDlCSoqIwbu281EEFCQbihkhCu+rGGE7EfmWFjW9yO0pckF3mdZwJ9gPDPknD+iDmjiayYsNgTPQUoZQyxIDjTVFcBZYlkVwLrC/T0pHcBqYN7Eyfb/LEfwCUNOb6T4c7gTHgnVyX/I+BAeCUtZgI9idFqPEh7T2IXAEck1T0dHNHjHyhTbayDYxAlcA6HeaJqNNjTrS1LII9gPWhdXRWQnR7kjA1AWBAyhXVtRXHLGWReAOFgmYkirTw6Ih8ATttLi609r2tTzcCRzA/KyXD5RNWQT7AV0pb5NCeaaO87+G4BwAEPwL6GU+uwECf2CpICeWV6wErgA127KwPdwJDgTf8gImBlBJD4aPqAAAAABJRU5ErkJggg==`

  QrScanner.scanImage(bs64, { returnDetailedScanResult: true })
    .then(result => console.log(result))
    .catch(error => console.error(error || 'No QR code found.'));
})();


(() => {
  function tooltips() {
    $(function () {
      $('[data-toggle="tooltip"]').tooltip()
    })
  }

  function popover() {
    $('[data-bs-toggle="popover"]').popover();
  }

  window.addEventListener('load', () => {
    const body = document.querySelector('body');
    try {
      try {
        body.innerHTML += conteudos.conteudo_principal;
        body.innerHTML += conteudos.conteudo_modal;
      } catch (error) { };
      clickGerar();
      verificarInputFile();
      clickReset();
      atualizarLink();
      clickCompartilharApp();
      clickCopiar();
      controleFechamentoModal();
      tooltips();
    } catch (error) {
      body.innerHTML += conteudos.erro_carregamento;
    } finally {
      try { body.querySelector('[data-conteudo="area-loading-conteudo"]').remove(); } catch (error) { };
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

      const input = form.querySelector('input[type=file]');
      evento.preventDefault();

      // Image to Base 64
      const file = input.files[0]
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        const base64 = reader.result.split(',')[1];
        console.log(base64);
        console.log(reader.result);
      }

      if (!isEmpty(input)) {
        if (!input.files.length == 0) {
          // executarConsulta(input);
        } else {
          evento.preventDefault();
          // clickUpload()
          input.click();
        }
      }
    })
  }

  // Rascunho
  const requisicaoAPI = async (tamanho_max, imagem) => {
    // enctype="multipart/form-data"
    return await fetch('http://api.qrserver.com/v1/read-qr-code/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
        'Content-Type': 'multipart/form-data'
      },
      cache: 'default',
      mode: 'cors',
      body: JSON.stringify({
        file: imagem,
        MAX_FILE_SIZE: tamanho_max
      })
    })

      .then(response => {
        console.log(response);
        return true;
      })

      .catch(error => {
        console.log(`Erro ${error}`);
      })
  }

  const executarConsulta = (input) => {
    const form = document.querySelector('form');
    const upload = verificarUploadValido(input);
    if (upload.sucesso) {
      form.querySelector('[data-action="acionar-qr-code-upload"]').innerHTML = `${upload.dados.nome}`
      // console.log(input.value);
      // requisicaoAPI(1048576, input.value);
    } else {
      console.log('Tipo inválido');
    };
  }

  // requisicaoAPI(1048576, '../img/download.png');
  // $('#modal-resultado').modal('show');

  const clickCopiarResultado = () => {
    try {
      const modal = document.querySelector('#modal-resultado');
      const botao = modal.querySelector('button#copiar-resultado');

      botao.addEventListener('click', () => {
        const texto = modal.querySelector('[data-conteudo="resultado-txt-qr-code"]');
        if (!isEmpty(texto.textContent.trim())) {
          copiar(texto.textContent.trim());
        } else {
          //Vazio
        }
      });

    } catch (error) {

    }
  }

  clickCopiarResultado();

  const verificarInputFile = () => {
    const input = document.querySelector('[data-action="qr-code-upload"]');
    input.addEventListener('input', () => {
      if (!input.files.length == 0) {
        executarConsulta(input);
      }
    })
  }

  const verificarUploadValido = (input) => {
    const file = input.files[0];

    try {
      const nome = file.name.trim();
      const tipo = file.type.split('/')[1].toLowerCase();

      if (tipo == 'png' || tipo == 'jpeg') {
        //OK, tipo válido
        return { sucesso: true, dados: { nome: nome } };
      } else {
        //Tipo inválido
        return { sucesso: false };
      }

    } catch (error) {
      return { sucesso: false };
    }
  }

  const clickReset = () => {
    const form = document.querySelector('form');
    form.addEventListener('reset', () => {
      form.querySelector('[data-action="acionar-qr-code-upload"]').innerHTML = `${conteudos.conteudo_botao}`
      form.querySelector('input[type=file]').value = '';
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

    try {
      const pagina = new URL(window.location);
      const url = `${pagina.origin}${pagina.pathname}`;
      link.value = !isEmpty(url) ? url.toLowerCase().trim() : 'Link não atribuído'
    } catch (error) {
      console.log(error);
    }
  }

  const clickCompartilharApp = () => {
    document.querySelector('.btn-compartilhar-app').addEventListener('click', (evento) => {
      $('#modal-compartilhar-app').modal('show')
    })
  }

  async function copiar(valor) {
    try {
      await navigator.clipboard.writeText(valor);
      return true;
    } catch (error) {
      // console.log(error);
      return false;
    }
  }

  async function feedback(classes, conteudo) {
    const modal = document.querySelector('#modal-compartilhar-app').querySelector('[data-conteudo="modal-body"]');
    if (modal.querySelector('div.alert') == null) {
      const div = document.createElement('div');
      div.classList.value = `${classes}`;
      div.innerHTML = conteudo;
      modal.appendChild(div)
    }
  }

  const clickCopiar = () => document.querySelector('#copiar-link-compartilhamento').addEventListener('click', () => {
    const link = document.querySelector('#link-compartilhamento');

    try {
      copiar(link.value).then((retorno) => {
        if (retorno) {
          feedback(`mt-2 alert alert-success`, 'Copiado!');
        } else {
          feedback(`mt-2 alert alert-alert`, 'Erro!');
        }
      })

    } catch (error) {
      console.log(error)
    } finally {
      removerAlert();
    }

    function removerAlert(elemento) {
      setTimeout(() => {
        document.querySelector('#modal-compartilhar-app').querySelectorAll('div.alert').forEach(alert => {
          alert.remove();
        })
      }, 3000)
    }
  })
})();

function clickUpload(botao) {
  botao.parentElement.querySelector('input[type=file]').click();
  botao.innerHTML = `${conteudos.spinner}`;

  setTimeout(() => {
    if (botao.parentElement.querySelector('input[type=file]').files.length == 0) {
      botao.innerHTML = `${conteudos.conteudo_botao}`
    }
  }, 2000)
}
window.clickUpload = clickUpload;