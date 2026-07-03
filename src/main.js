import './style.css';

import {
  validateBitString,
  bitStuff,
  bitDestuff,
  verifyBitStuffing
} from './modules/bitStuffing.js';

import {
  validateCRCInput,
  createCodeword,
  checkCodeword,
  corruptCodeword
} from './modules/crc.js';

import { StopAndWaitSim } from './modules/stopAndWait.js';

function setupBitStuffing() {
  const input = document.getElementById('bitInput');
  const stuffBtn = document.getElementById('stuffBtn');
  const verifyBtn = document.getElementById('verifyStuffBtn');

  const originalOut = document.getElementById('bitOriginalOut');
  const stuffedOut = document.getElementById('bitStuffedOut');
  const destuffedOut = document.getElementById('bitDestuffedOut');
  const bitStatus = document.getElementById('bitStatus');

  const errorBox = document.getElementById('bitError');

  stuffBtn.addEventListener('click', () => {
    errorBox.textContent = '';
    const value = input.value.trim();

    const validation = validateBitString(value, 100);
    if (!validation.valid) {
      errorBox.textContent = validation.error;
      return;
    }

    const stuffed = bitStuff(value);
    const destuffed = bitDestuff(stuffed);

    originalOut.textContent = value;
    stuffedOut.textContent = stuffed;
    destuffedOut.textContent = destuffed;
    bitStatus.textContent = destuffed === value ? 'صحت بازیابی: درست' : 'صحت بازیابی: نادرست';
  });

  verifyBtn.addEventListener('click', () => {
    errorBox.textContent = '';
    const original = input.value.trim();
    const stuffed = stuffedOut.textContent.trim();

    if (!original) {
      errorBox.textContent = 'ابتدا رشته اصلی را وارد و Stuffing را انجام دهید.';
      return;
    }

    if (!stuffed || stuffed === '-') {
      errorBox.textContent = 'ابتدا عملیات Stuffing را انجام دهید.';
      return;
    }

    const result = verifyBitStuffing(original, stuffed);
    destuffedOut.textContent = result.recovered;
    bitStatus.textContent = result.isValid ? 'صحت بازیابی: درست' : 'صحت بازیابی: نادرست';
  });
}

function setupCRC() {
  const dataInput = document.getElementById('crcData');
  const generatorInput = document.getElementById('crcGenerator');
  const codewordInput = document.getElementById('codewordInput');
  const calcBtn = document.getElementById('crcCalcBtn');
  const injectBtn = document.getElementById('injectBtn');
  const checkBtn = document.getElementById('crcCheckBtn');
  const crcOut = document.getElementById('crcOut');
  const checkOut = document.getElementById('crcCheckOut');
  const crcError = document.getElementById('crcError');

  const clearStatus = () => {
    crcError.textContent = '';
    checkOut.textContent = '---';
    checkOut.className = 'result-value';
  };

  calcBtn.addEventListener('click', () => {
    const data = dataInput.value.trim();
    const generator = generatorInput.value.trim();

    clearStatus();

    const validation = validateCRCInput(data, generator);
    if (!validation.valid) {
      crcError.textContent = validation.error;
      crcOut.textContent = '---';
      codewordInput.value = '';
      return;
    }

    const { crc, codeword } = createCodeword(data, generator);
    crcOut.textContent = crc;
    codewordInput.value = codeword;
  });

  injectBtn.addEventListener('click', () => {
    const codeword = codewordInput.value.trim();

    if (!codeword || !/^[01]+$/.test(codeword)) {
      crcError.textContent = 'ابتدا یک Codeword معتبر تولید یا وارد کنید.';
      return;
    }

    crcError.textContent = '';
    codewordInput.value = corruptCodeword(codeword);
    checkOut.textContent = '---';
    checkOut.className = 'result-value';
  });

  checkBtn.addEventListener('click', () => {
    const generator = generatorInput.value.trim();
    const codeword = codewordInput.value.trim();

    crcError.textContent = '';

    if (!generator || !codeword) {
      crcError.textContent = 'Generator و Codeword نباید خالی باشند.';
      return;
    }

    if (!/^[01]+$/.test(generator) || !/^[01]+$/.test(codeword)) {
      crcError.textContent = 'فقط 0 و 1 مجاز است.';
      return;
    }

    if (generator.length < 2 || generator[0] !== '1') {
      crcError.textContent = 'Generator باید با 1 شروع شود و حداقل 2 بیت باشد.';
      return;
    }

    if (codeword.length < generator.length) {
      crcError.textContent = 'طول Codeword باید از Generator بیشتر یا مساوی باشد.';
      return;
    }

    const result = checkCodeword(codeword, generator);

    if (result.hasError) {
      checkOut.textContent = `خطا تشخیص داده شد | Remainder: ${result.finalRemainder}`;
      checkOut.className = 'result-value error';
    } else {
      checkOut.textContent = `بدون خطا | Remainder: ${result.finalRemainder}`;
      checkOut.className = 'result-value success';
    }
  });
}

function setupStopAndWait() {
  const logBox = document.getElementById('arqLog');
  const startBtn = document.getElementById('arqStartBtn');
  const clearBtn = document.getElementById('arqClearBtn');

  const log = (msg) => {
    const p = document.createElement('p');
    p.textContent = msg;
    logBox.appendChild(p);
    logBox.scrollTop = logBox.scrollHeight;
  };

  startBtn.addEventListener('click', async () => {
    logBox.innerHTML = '';
    const sim = new StopAndWaitSim(log);
    await sim.run(4);
  });

  clearBtn.addEventListener('click', () => {
    logBox.innerHTML = '';
  });
}

setupBitStuffing();
setupCRC();
setupStopAndWait();
