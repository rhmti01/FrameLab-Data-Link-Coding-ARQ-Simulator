export function validateBitString(bitString, maxLength = 100) {
  if (!bitString) {
    return { valid: false, error: 'رشته ورودی نباید خالی باشد.' };
  }

  if (bitString.length > maxLength) {
    return { valid: false, error: `طول رشته نباید بیشتر از ${maxLength} بیت باشد.` };
  }

  if (!/^[01]+$/.test(bitString)) {
    return { valid: false, error: 'رشته باید فقط شامل 0 و 1 باشد.' };
  }

  return { valid: true };
}

export function bitStuff(bitString) {
  let stuffed = '';
  let countOnes = 0;

  for (const bit of bitString) {
    stuffed += bit;

    if (bit === '1') {
      countOnes++;
      if (countOnes === 5) {
        stuffed += '0';
        countOnes = 0;
      }
    } else {
      countOnes = 0;
    }
  }

  return stuffed;
}

export function bitDestuff(stuffedString) {
  let destuffed = '';
  let countOnes = 0;

  for (let i = 0; i < stuffedString.length; i++) {
    const bit = stuffedString[i];
    destuffed += bit;

    if (bit === '1') {
      countOnes++;
      if (countOnes === 5) {
        if (stuffedString[i + 1] === '0') {
          i++;
        }
        countOnes = 0;
      }
    } else {
      countOnes = 0;
    }
  }

  return destuffed;
}

export function verifyBitStuffing(original, stuffed) {
  const recovered = bitDestuff(stuffed);
  return {
    recovered,
    isValid: recovered === original
  };
}
