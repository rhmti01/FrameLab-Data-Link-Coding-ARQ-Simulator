export function validateCRCInput(data, generator) {
  if (!data || !generator) {
    return { valid: false, error: 'فیلدها نباید خالی باشند.' };
  }

  if (!/^[01]+$/.test(data) || !/^[01]+$/.test(generator)) {
    return { valid: false, error: 'فقط 0 و 1 مجاز است.' };
  }

  if (data.length > 32) {
    return { valid: false, error: 'داده حداکثر 32 بیت باشد.' };
  }

  if (generator.length < 2 || generator[0] !== '1') {
    return { valid: false, error: 'Generator باید با 1 شروع شود و حداقل 2 بیت باشد.' };
  }

  return { valid: true };
}

export function xor(a, b) {
  let result = '';
  for (let i = 1; i < b.length; i++) {
    result += a[i] === b[i] ? '0' : '1';
  }
  return result;
}

export function calculateCRC(data, generator) {
  const paddedData = data + '0'.repeat(generator.length - 1);
  let remainder = paddedData.slice(0, generator.length);

  for (let i = generator.length; i <= paddedData.length; i++) {
    if (remainder[0] === '1') {
      remainder = xor(remainder, generator);
    } else {
      remainder = remainder.slice(1);
    }

    if (i < paddedData.length) {
      remainder += paddedData[i];
    }
  }

  return remainder;
}

export function createCodeword(data, generator) {
  const crc = calculateCRC(data, generator);
  return {
    crc,
    codeword: data + crc
  };
}

export function checkCodeword(codeword, generator) {
  if (!codeword || !generator || codeword.length < generator.length) {
    return {
      finalRemainder: '',
      hasError: true
    };
  }

  let remainder = codeword.slice(0, generator.length);

  for (let i = generator.length; i <= codeword.length; i++) {
    if (remainder[0] === '1') {
      remainder = xor(remainder, generator);
    } else {
      remainder = remainder.slice(1);
    }

    if (i < codeword.length) {
      remainder += codeword[i];
    }
  }

  return {
    finalRemainder: remainder,
    hasError: /1/.test(remainder)
  };
}

export function corruptCodeword(codeword) {
  if (!codeword || !/^[01]+$/.test(codeword)) return codeword;
  const index = Math.floor(Math.random() * codeword.length);
  const flippedBit = codeword[index] === '0' ? '1' : '0';
  return codeword.slice(0, index) + flippedBit + codeword.slice(index + 1);
}
