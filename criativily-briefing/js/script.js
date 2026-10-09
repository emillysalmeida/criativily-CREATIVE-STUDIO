/**
 * Criativily — Creative Studio | Briefing Form Script
 * Vanilla JavaScript implementation (No external libraries)
 */

document.addEventListener('DOMContentLoaded', () => {
  // -------------------------------------------------------------------------
  // 1. Application State & Constants
  // -------------------------------------------------------------------------
  let currentStep = 1;
  const totalSteps = 5;

  const WHATSAPP_NUMBER = '5511934290169';
  const EMAIL_ADDRESS = 'emillyalmeida111@icloud.com';
  const EMAIL_SUBJECT = 'Novo briefing de projeto — Criativily';

  const STEP_TITLES = {
    1: 'Sobre o projeto',
    2: 'Objetivos e funcionalidades',
    3: 'Identidade visual e materiais',
    4: 'Requisitos e informações adicionais',
    5: 'Revisão e envio'
  };

  // -------------------------------------------------------------------------
  // 2. DOM Elements
  // -------------------------------------------------------------------------
  const form = document.getElementById('briefing-form');
  const stepPanels = document.querySelectorAll('.form-step');
  const stepCounter = document.getElementById('step-counter');
  const progressPercent = document.getElementById('progress-percent');
  const progressFill = document.getElementById('progress-fill');
  const progressTrack = document.getElementById('progress-bar');
  const stepDots = document.querySelectorAll('.step-dot');

  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const btnSendWhatsapp = document.getElementById('btn-send-whatsapp');
  const btnSendEmail = document.getElementById('btn-send-email');
  const sendNoticeBox = document.getElementById('send-notice-box');

  const reviewContainer = document.getElementById('review-summary-container');
  const currentYearSpan = document.getElementById('current-year');

  // Conditional fields
  const q2Options = document.querySelectorAll('input[name="q2_objetivo"]');
  const boxQ2Outro = document.getElementById('box-q2-outro');
  const inputQ2Outro = document.getElementById('q2_outro_detalhe');

  const q5Options = document.querySelectorAll('input[name="q5_paginas"]');
  const q5CheckNaoSei = document.getElementById('q5_check_nao_sei');
  const q5CheckOutro = document.getElementById('q5_check_outro');
  const boxQ5Outro = document.getElementById('box-q5-outro');
  const inputQ5Outro = document.getElementById('q5_outro_detalhe');

  // Set copyright year dynamically
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // -------------------------------------------------------------------------
  // 3. Step Navigation Functions
  // -------------------------------------------------------------------------
  function showStep(stepIndex) {
    if (stepIndex < 1 || stepIndex > totalSteps) return;

    // Update active step panel
    stepPanels.forEach(panel => {
      const panelStep = parseInt(panel.getAttribute('data-step'), 10);
      if (panelStep === stepIndex) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });

    currentStep = stepIndex;

    // Update progress bar
    const percentage = Math.round((currentStep / totalSteps) * 100);
    progressFill.style.width = `${percentage}%`;
    progressPercent.textContent = `${percentage}%`;
    stepCounter.textContent = `Etapa ${currentStep} de ${totalSteps}: ${STEP_TITLES[currentStep]}`;
    if (progressTrack) {
      progressTrack.setAttribute('aria-valuenow', currentStep);
    }

    // Update step dots
    stepDots.forEach(dot => {
      const dotStep = parseInt(dot.getAttribute('data-step'), 10);
      dot.classList.remove('active', 'completed');
      if (dotStep === currentStep) {
        dot.classList.add('active');
      } else if (dotStep < currentStep) {
        dot.classList.add('completed');
      }
    });

    // Handle button visibility
    if (currentStep === 1) {
      btnPrev.classList.add('hidden');
      btnNext.classList.remove('hidden');
    } else if (currentStep === totalSteps) {
      btnPrev.classList.remove('hidden');
      btnNext.classList.add('hidden');
      renderReviewSummary();
    } else {
      btnPrev.classList.remove('hidden');
      btnNext.classList.remove('hidden');
    }

    // Smooth scroll back to form top
    const formCard = document.querySelector('.form-card');
    if (formCard) {
      formCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // -------------------------------------------------------------------------
  // 4. Form Validation Logic
  // -------------------------------------------------------------------------
  function clearErrors(stepIndex) {
    const activePanel = document.getElementById(`step-panel-${stepIndex}`);
    if (!activePanel) return;

    const errorMsgs = activePanel.querySelectorAll('.error-message');
    errorMsgs.forEach(msg => msg.classList.remove('visible'));

    const errorGroups = activePanel.querySelectorAll('.form-group');
    errorGroups.forEach(group => group.classList.remove('has-error'));
  }

  function validateStep(stepIndex) {
    clearErrors(stepIndex);
    let isValid = true;

    if (stepIndex === 1) {
      // Q1 Validation: Required text input
      const q1Input = document.getElementById('q1_nome');
      if (!q1Input.value.trim()) {
        showError('group-q1', 'error-q1_nome');
        isValid = false;
      }

      // Q2 Validation: Single select radio
      const selectedQ2 = document.querySelector('input[name="q2_objetivo"]:checked');
      if (!selectedQ2) {
        showError('group-q2', 'error-q2_objetivo');
        isValid = false;
      } else if (selectedQ2.value === 'Outro') {
        const q2OutroDetail = document.getElementById('q2_outro_detalhe');
        if (!q2OutroDetail.value.trim()) {
          showError('group-q2', 'error-q2_outro_detalhe');
          isValid = false;
        }
      }
    }

    return isValid;
  }

  function showError(groupId, errorId) {
    const group = document.getElementById(groupId);
    const errorMsg = document.getElementById(errorId);
    if (group) group.classList.add('has-error');
    if (errorMsg) errorMsg.classList.add('visible');
  }

  // -------------------------------------------------------------------------
  // 5. Conditional Logic Listeners
  // -------------------------------------------------------------------------
  // Q2 conditional field (Outro)
  q2Options.forEach(radio => {
    radio.addEventListener('change', (e) => {
      if (e.target.value === 'Outro') {
        boxQ2Outro.classList.remove('hidden');
        inputQ2Outro.focus();
      } else {
        boxQ2Outro.classList.add('hidden');
        inputQ2Outro.value = '';
      }
      clearErrors(1);
    });
  });

  // Q5 multi-select logic (Ainda não sei vs others)
  q5Options.forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      const target = e.target;

      if (target === q5CheckNaoSei && target.checked) {
        // If "Ainda não sei" is checked, uncheck all other checkboxes
        q5Options.forEach(cb => {
          if (cb !== q5CheckNaoSei) {
            cb.checked = false;
          }
        });
        boxQ5Outro.classList.add('hidden');
        inputQ5Outro.value = '';
      } else if (target !== q5CheckNaoSei && target.checked) {
        // If any other checkbox is checked, uncheck "Ainda não sei"
        if (q5CheckNaoSei) {
          q5CheckNaoSei.checked = false;
        }
      }

      // Handle "Outro" field display
      if (q5CheckOutro && q5CheckOutro.checked) {
        boxQ5Outro.classList.remove('hidden');
      } else {
        boxQ5Outro.classList.add('hidden');
        inputQ5Outro.value = '';
      }
    });
  });

  // -------------------------------------------------------------------------
  // 6. Data Collection & Formatting
  // -------------------------------------------------------------------------
  function collectFormData() {
    // Q1
    const q1Nome = document.getElementById('q1_nome').value.trim();

    // Q2
    const q2Radio = document.querySelector('input[name="q2_objetivo"]:checked');
    let q2Objetivo = q2Radio ? q2Radio.value : '';
    if (q2Objetivo === 'Outro') {
      const detail = inputQ2Outro.value.trim();
      q2Objetivo = detail ? `Outro: ${detail}` : 'Outro';
    }

    // Q3
    const q3Publico = document.getElementById('q3_publico').value.trim();

    // Q4
    const q4Acao = document.getElementById('q4_acao').value.trim();

    // Q5
    const checkedQ5 = Array.from(document.querySelectorAll('input[name="q5_paginas"]:checked')).map(cb => cb.value);
    if (checkedQ5.includes('Outro')) {
      const outroDetail = inputQ5Outro.value.trim();
      const index = checkedQ5.indexOf('Outro');
      checkedQ5[index] = outroDetail ? `Outro: ${outroDetail}` : 'Outro';
    }
    const q5Paginas = checkedQ5.join(', ');
    const q5DetalhesGerais = document.getElementById('q5_detalhes_gerais').value.trim();

    // Q6
    const q6Links = document.getElementById('q6_links').value.trim();
    const q6Gostos = document.getElementById('q6_gostos').value.trim();

    // Q7
    const q7Radio = document.querySelector('input[name="q7_identidade"]:checked');
    const q7Identidade = q7Radio ? q7Radio.value : '';

    // Q8
    const q8Radio = document.querySelector('input[name="q8_materiais"]:checked');
    const q8Materiais = q8Radio ? q8Radio.value : '';
    const q8Observacoes = document.getElementById('q8_observacoes').value.trim();

    // Q9
    const q9Requisitos = document.getElementById('q9_requisitos').value.trim();

    // Q10
    const q10Informacoes = document.getElementById('q10_informacoes').value.trim();

    return {
      q1Nome,
      q2Objetivo,
      q3Publico,
      q4Acao,
      q5Paginas,
      q5DetalhesGerais,
      q6Links,
      q6Gostos,
      q7Identidade,
      q8Materiais,
      q8Observacoes,
      q9Requisitos,
      q10Informacoes
    };
  }

  // Build plain text message string (Used for both WhatsApp & Email)
  // Emoji-free & light ASCII formatting to prevent WhatsApp crashes/freezes
  function buildMessageText(data) {
    let msg = `BRIEFING DE PROJETO — Criativily — Creative Studio\n\n`;

    // Etapa 1
    msg += `--- ETAPA 1: SOBRE O PROJETO ---\n`;
    msg += `- Empresa / Projeto: ${data.q1Nome}\n`;
    if (data.q2Objetivo) {
      msg += `- Objetivo principal: ${data.q2Objetivo}\n`;
    }
    msg += `\n`;

    // Etapa 2
    msg += `--- ETAPA 2: OBJETIVOS E FUNCIONALIDADES ---\n`;
    if (data.q3Publico) {
      msg += `- Público-alvo: ${data.q3Publico}\n`;
    }
    if (data.q4Acao) {
      msg += `- Ação esperada dos visitantes: ${data.q4Acao}\n`;
    }
    if (data.q5Paginas) {
      msg += `- Páginas / Funcionalidades essenciais: ${data.q5Paginas}\n`;
    }
    if (data.q5DetalhesGerais) {
      msg += `- Detalhes das funcionalidades: ${data.q5DetalhesGerais}\n`;
    }
    msg += `\n`;

    // Etapa 3
    msg += `--- ETAPA 3: IDENTIDADE VISUAL E MATERIAIS ---\n`;
    if (data.q6Links || data.q6Gostos) {
      msg += `- Referências visuais: `;
      if (data.q6Links) msg += `${data.q6Links} `;
      if (data.q6Gostos) msg += `(${data.q6Gostos})`;
      msg += `\n`;
    }
    if (data.q7Identidade) {
      msg += `- Identidade visual: ${data.q7Identidade}\n`;
    }
    if (data.q8Materiais) {
      msg += `- Materiais disponíveis: ${data.q8Materiais}\n`;
    }
    if (data.q8Observacoes) {
      msg += `- Observações sobre materiais: ${data.q8Observacoes}\n`;
    }
    msg += `\n`;

    // Etapa 4
    msg += `--- ETAPA 4: REQUISITOS E INFORMAÇÕES ADICIONAIS ---\n`;
    if (data.q9Requisitos) {
      msg += `- Requisitos técnicos: ${data.q9Requisitos}\n`;
    }
    if (data.q10Informacoes) {
      msg += `- Informações complementares: ${data.q10Informacoes}\n`;
    }

    return msg.trim();
  }

  // -------------------------------------------------------------------------
  // 7. Render Review Summary (Step 5) safely using DOM methods
  // -------------------------------------------------------------------------
  function renderReviewSummary() {
    if (!reviewContainer) return;
    reviewContainer.innerHTML = '';
    const data = collectFormData();

    const sections = [
      {
        step: 1,
        title: 'Etapa 1: Sobre o projeto',
        items: [
          { label: 'Nome / Descrição da empresa:', value: data.q1Nome },
          { label: 'Objetivo principal do site:', value: data.q2Objetivo }
        ]
      },
      {
        step: 2,
        title: 'Etapa 2: Objetivos e funcionalidades',
        items: [
          { label: 'Público-alvo:', value: data.q3Publico },
          { label: 'Ação esperada dos visitantes:', value: data.q4Acao },
          { label: 'Páginas/Funcionalidades essenciais:', value: data.q5Paginas },
          { label: 'Detalhes adicionais de funcionalidades:', value: data.q5DetalhesGerais }
        ]
      },
      {
        step: 3,
        title: 'Etapa 3: Identidade visual e materiais',
        items: [
          { label: 'Links de referências:', value: data.q6Links },
          { label: 'O que gosta nas referências:', value: data.q6Gostos },
          { label: 'Identidade visual definida:', value: data.q7Identidade },
          { label: 'Materiais disponíveis:', value: data.q8Materiais },
          { label: 'Observações sobre materiais:', value: data.q8Observacoes }
        ]
      },
      {
        step: 4,
        title: 'Etapa 4: Requisitos e informações adicionais',
        items: [
          { label: 'Requisitos técnicos:', value: data.q9Requisitos },
          { label: 'Informações complementares:', value: data.q10Informacoes }
        ]
      }
    ];

    sections.forEach(sec => {
      const card = document.createElement('div');
      card.className = 'review-card';

      const header = document.createElement('div');
      header.className = 'review-card-header';

      const title = document.createElement('h3');
      title.className = 'review-card-title';
      title.textContent = sec.title;

      const editBtn = document.createElement('button');
      editBtn.type = 'button';
      editBtn.className = 'btn-edit';
      editBtn.textContent = '✏️ Editar';
      editBtn.setAttribute('aria-label', `Editar ${sec.title}`);
      editBtn.addEventListener('click', () => showStep(sec.step));

      header.appendChild(title);
      header.appendChild(editBtn);
      card.appendChild(header);

      let hasItems = false;
      sec.items.forEach(item => {
        if (item.value) {
          hasItems = true;
          const itemDiv = document.createElement('div');
          itemDiv.className = 'review-item';

          const qLabel = document.createElement('span');
          qLabel.className = 'review-question';
          qLabel.textContent = item.label;

          const aVal = document.createElement('p');
          aVal.className = 'review-answer';
          aVal.textContent = item.value;

          itemDiv.appendChild(qLabel);
          itemDiv.appendChild(aVal);
          card.appendChild(itemDiv);
        }
      });

      if (!hasItems) {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'review-item';
        const emptyText = document.createElement('p');
        emptyText.className = 'review-answer empty';
        emptyText.textContent = 'Nenhum detalhe adicional preenchido nesta etapa (opcional).';
        emptyDiv.appendChild(emptyText);
        card.appendChild(emptyDiv);
      }

      reviewContainer.appendChild(card);
    });
  }

  // -------------------------------------------------------------------------
  // 8. Event Listeners for Navigation & Submissions
  // -------------------------------------------------------------------------
  btnNext.addEventListener('click', () => {
    if (validateStep(currentStep)) {
      showStep(currentStep + 1);
    }
  });

  btnPrev.addEventListener('click', () => {
    showStep(currentStep - 1);
  });

  stepDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const targetStep = parseInt(dot.getAttribute('data-step'), 10);
      // Only allow navigating to past steps or current step, or step 5 if step 1 is valid
      if (targetStep < currentStep) {
        showStep(targetStep);
      } else if (targetStep > currentStep) {
        if (validateStep(currentStep)) {
          showStep(targetStep);
        }
      }
    });
  });

  // Submit Option A: WhatsApp
  btnSendWhatsapp.addEventListener('click', () => {
    if (!validateStep(1)) {
      showStep(1);
      return;
    }

    const data = collectFormData();
    const textMsg = buildMessageText(data);
    const encodedText = encodeURIComponent(textMsg);
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedText}`;

    if (sendNoticeBox) {
      sendNoticeBox.classList.remove('hidden');
    }

    window.open(waUrl, '_blank');
  });

  // Submit Option B: Email
  btnSendEmail.addEventListener('click', () => {
    if (!validateStep(1)) {
      showStep(1);
      return;
    }

    const data = collectFormData();
    const textMsg = buildMessageText(data);
    const encodedBody = encodeURIComponent(textMsg);
    const encodedSubject = encodeURIComponent(EMAIL_SUBJECT);
    const mailtoUrl = `mailto:${EMAIL_ADDRESS}?subject=${encodedSubject}&body=${encodedBody}`;

    if (sendNoticeBox) {
      sendNoticeBox.classList.remove('hidden');
    }

    window.location.href = mailtoUrl;
  });

  // Keyboard shortcut: Press Enter inside text input to go to next step
  form.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.tagName === 'INPUT' && e.target.type === 'text') {
      e.preventDefault();
      if (currentStep < totalSteps && validateStep(currentStep)) {
        showStep(currentStep + 1);
      }
    }
  });

  // Initialize step 1
  showStep(1);
});
