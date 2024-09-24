"use strict";

import { conteudos } from './modulos/conteudos.js';
import QrScanner from './frameworks/qr-scanner.min.js'

(() => {
  // Utility functions
  const showError = (message, footer) => {
    Swal.fire({
      icon: 'error',
      title: message,
      text: 'Try again.',
      footer: footer
    });
  };

  const showSuccess = (title, message) => {
    Swal.fire({
      title: title,
      text: message,
      cancelButtonText: 'Close',
      showCloseButton: true,
      showLoaderOnConfirm: true,
    });
  };

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      return false;
    }
  };

  // File handling functions
  const isValidFileType = (type) => ['png', 'jpeg'].includes(type);

  const getFileInfo = (file) => {
    try {
      const name = file.name.trim();
      const type = file.type.split('/')[1].toLowerCase();

      return { name, type };
    } catch (error) {
      return { name: null, type: null };
    }
  };

  // QR Code handling functions
  const readQRCodeFromImage = (imageBase64) => {
    return QrScanner.scanImage(imageBase64, { returnDetailedScanResult: true })
      .then((result) => {
        if (!result.data) {
          throw new Error('The image is not a QR Code');
        }
        return result.data;
      });
  };

  // DOM manipulation functions
  const updateFileInput = (input, text) => {
    input.parentElement.querySelector('[data-action="acionar-qr-code-upload"]').innerHTML = text;
  };

  const displayFeedback = (modal, message, type) => {
    const div = document.createElement('div');
    div.classList.value = `mt-2 mb-0 alert alert-${type}`;
    div.innerHTML = message;

    const modalContent = modal.querySelector('[data-conteudo="modal-body"]');
    modalContent.appendChild(div);

    setTimeout(() => div.remove(), 3000);
  };

  // Event Listeners
  const addEventListeners = () => {
    const form = document.querySelector('form');
    const fileInput = form.querySelector('input[type=file]');
    const uploadButton = form.querySelector('[data-action="acionar-qr-code-upload"]');

    // Share modal elements
    const shareButton = document.querySelector('.btn-compartilhar-app');
    const copyLinkButton = document.querySelector('#copiar-link-compartilhamento');
    const shareModal = document.querySelector('#modal-compartilhar-app');

    // Result modal elements
    const copyResultButton = document.querySelector('#copiar-resultado');
    const resultModal = document.querySelector('#modal-resultado');

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      if (fileInput.files.length === 0) {
        showError('First, upload a file!', 'Error: VL69');
        // Click the hidden file input to open the file picker dialog
        form.querySelector('input[type=file]').click();
        return;
      }

      const { name, type } = getFileInfo(fileInput.files[0]);

      if (!isValidFileType(type)) {
        showError('Invalid file type', 'Error: VL92');
        return;
      }

      updateFileInput(fileInput, name);

      const reader = new FileReader();
      reader.readAsDataURL(fileInput.files[0]);

      reader.onload = () => {
        readQRCodeFromImage(reader.result)
          .then((qrCodeContent) => {
            const modal = document.querySelector('#modal-resultado');
            if (modal) {
              modal.querySelector('[data-conteudo="resultado-txt-qr-code"]').value = qrCodeContent;
              $('#modal-resultado').modal('show');
            } else {
              showSuccess('Result:', qrCodeContent);
            }
          })
          .catch((error) => showError(error.message || 'The image is not a QR Code', 'Error: VL101'));
      };
    });

    // Event listeners for the form reset
    form.addEventListener('reset', () => {
      // Set the button text to the initial state
      updateFileInput(fileInput, conteudos.conteudo_botao);
      // Clear the file input
      fileInput.value = '';
    });

    fileInput.addEventListener('change', () => {
      if (fileInput.files.length > 0) {
        const { name, type } = getFileInfo(fileInput.files[0]);
        if (isValidFileType(type)) {
          updateFileInput(fileInput, name);
        } else {
          showError('Invalid file type', 'Error: VL130');
          // Reset the form, clear the file input and update the button text to the initial state
          // Dispatch the reset event, monitor the reset event listener
          form.reset();
        }
      }
    });

    uploadButton.addEventListener('click', () => fileInput.click());

    shareButton.addEventListener('click', () => {
      $('#modal-compartilhar-app').modal('show');
    });

    copyLinkButton.addEventListener('click', async () => {
      const link = document.querySelector('#link-compartilhamento').value;
      const success = await copyText(link);
      displayFeedback(shareModal, success ? 'Copiado!' : 'Erro!', success ? 'success' : 'danger');
    });

    copyResultButton.addEventListener('click', async () => {
      const qrCodeContent = document.querySelector('[data-conteudo="resultado-txt-qr-code"]').value;
      const success = await copyText(qrCodeContent);
      displayFeedback(resultModal, success ? 'Copiado!' : 'Erro!', success ? 'success' : 'danger');
    });
  };

  // Initialization
  window.addEventListener('load', () => {
    const body = document.querySelector('body');

    try {
      body.innerHTML += conteudos.conteudo_principal;
      body.innerHTML += conteudos.conteudo_modal;
      body.innerHTML += conteudos.conteudo_modal_resultado;

      addEventListeners();

      document.querySelectorAll('[data-recarrega-pagina]').forEach(button => {
        button.addEventListener('click', () => {
          window.location.reload();
        });
      });

      document.querySelectorAll('.modal').forEach(modal => {
        modal.querySelector('[data-modal-fecha]').addEventListener('click', () => {
          $(`#${modal.id}`).modal('hide');
        });
      });

      $('[data-toggle="tooltip"]').tooltip();
      $('[data-bs-toggle="popover"]').popover();

      document.querySelector('#link-compartilhamento').value = window.location.href;
    } catch (error) {
      body.innerHTML += conteudos.erro_carregamento;
    } finally {
      try {
        body.querySelector('[data-conteudo="area-loading-conteudo"]').remove();
      } catch (error) { }
    }
  });
})();
