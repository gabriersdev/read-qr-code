"use strict";

import { conteudos } from './modulos/conteudos.js';
import { isEmpty } from './modulos/utilitarios.js';

import QrScanner from './frameworks/qr-scanner.min.js'

(() => {
  function tooltips() {
    $(function () {
      $('[data-toggle="tooltip"]').tooltip()
    })
  }

  function popover() {
    $('[data-bs-toggle="popover"]').popover();
  }

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

      if (!isEmpty(input)) {
        if (input.files.length == 0) {
          Swal.fire({
            icon: 'error',
            title: 'Primeiro, carregue um arquivo!',
            text: 'Tente novamente.',
            footer: 'Erro: VL69'
          })
        } else if (!executarConsulta(input)) {
          Swal.fire({
            icon: 'error',
            title: 'Tipo de arquivo inválido',
            text: 'Tente novamente.',
            footer: 'Erro: VL92'
          })
        } else {

          // Image to Base 64
          const file = input.files[0]
          const reader = new FileReader();
          reader.readAsDataURL(file);

          reader.onload = () => {
            QrScanner.scanImage(reader.result, { returnDetailedScanResult: true })
              .then((result) => {
                if (!result.data) {
                  Swal.fire({
                    icon: 'error',
                    title: 'A imagem não é um QR Code',
                    text: 'Tente novamente.',
                    footer: 'Erro: VL85'
                  })
                  return false;
                }

                const value = result.data;

                Swal.fire({
                  title: `Resultado:`,
                  text: value,
                  cancelButtonText: 'Fechar',
                  showCloseButton: true,
                  showLoaderOnConfirm: true,
                })

                // $('#modal-resultado').modal('show');
              })
              .catch((error) => {
                console.log(error, input.files[0]);
                Swal.fire({
                  icon: 'error',
                  title: error.message || 'A imagem não é um QR Code',
                  text: 'Tente novamente.',
                  footer: 'Erro: VL101'
                })

                console.error(error);
              });
          }
        }
      }
    })
  }

  const executarConsulta = (input) => {
    const [form, upload] = [document.querySelector('form'), verificarUploadValido(input)];
    if (upload.success) form.querySelector('[data-action="acionar-qr-code-upload"]').innerHTML = `${upload.dados.nome}`
    else {
      Swal.fire({
        icon: 'error',
        title: 'Tipo de arquivo inválido',
        text: 'Tente novamente.',
        footer: 'Erro: VL106'
      })
    }
    return upload.success;
  }

  const verificarInputFile = () => {
    const input = document.querySelector('[data-action="qr-code-upload"]');
    input.addEventListener('input', () => {
      if (!input.files.length == 0) {
        if (executarConsulta(input));
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
        return { success: true, dados: { nome: nome } };
      } else {
        //Tipo inválido
        return { success: false };
      }

    } catch (error) {
      return { success: false };
    }
  }

  const clickReset = () => {
    const form = document.querySelector('form');
    form.addEventListener('reset', () => {
      form.querySelector('[data-action="acionar-qr-code-upload"]').innerHTML = `${conteudos.conteudo_botao}`
      form.querySelector('input[type=file]').value = '';
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
    document.querySelector('.btn-compartilhar-app').addEventListener('click', () => {
      $('#modal-compartilhar-app').modal('show')
    })
  }

  // TODO - Refatorar
  async function copiar(valor) {
    try {
      await navigator.clipboard.writeText(valor);
      return true;
    } catch (error) {
      // console.log(error);
      return false;
    }
  }

  // TODO - Refatorar
  function feedback(classes, conteudo) {
    const modal = document.querySelector('#modal-compartilhar-app').querySelector('[data-conteudo="modal-body"]');
    if (modal.querySelector('div.alert') == null) {
      const div = document.createElement('div');
      div.classList.value = `${classes}`;
      div.innerHTML = conteudo;
      modal.appendChild(div)
    }
  }

  // TODO - Refatorar
  const clickCopiarLinkCompartilhamento = () => document.querySelector('#copiar-link-compartilhamento').addEventListener('click', () => {
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

    function removerAlert() {
      setTimeout(() => {
        document.querySelector('#modal-compartilhar-app').querySelectorAll('div.alert').forEach(alert => {
          alert.remove();
        })
      }, 3000)
    }
  })

  window.addEventListener('load', () => {
    const body = document.querySelector('body');
    try {
      try {
        body.innerHTML += conteudos.conteudo_principal;
        body.innerHTML += conteudos.conteudo_modal;
        body.innerHTML += conteudos.conteudo_modal_resultado;

        // $('#modal-resultado').modal('show');

        clickGerar();
        verificarInputFile();
        clickReset();
        atualizarLink();
        clickCompartilharApp();
        clickCopiarLinkCompartilhamento();
        controleFechamentoModal();
        tooltips();
      } catch (error) {

      };
    } catch (error) {
      body.innerHTML += conteudos.erro_carregamento;
    } finally {
      try { body.querySelector('[data-conteudo="area-loading-conteudo"]').remove(); } catch (error) { };
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