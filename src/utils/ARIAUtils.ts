import ARIAEngine from "./ARIAEngine";

export function stringToByte(
  str: string,
  type: "ascii" | "unicode"
): Uint8Array {
  if (type === "unicode") {
    return new TextEncoder().encode(str);
  } else {
    const bytes: Uint8Array = new Uint8Array(str.length);
    Array.from(str).forEach((_, i) => {
      bytes[i] = str.charCodeAt(i);
    });
    return bytes;
  }
}

export function bytesToString(bytes: any, type: "ascii" | "unicode"): string {
  if (type === "unicode") {
    return new TextDecoder().decode(bytes);
  } else {
    return String.fromCharCode.apply(null, bytes);
  }
}

export function encryptProcess(plainText: string, encryptKey: string): string {
  const adminKey = encryptKey;
  const aria = new ARIAEngine(256);
  const mk = stringToByte(adminKey, "ascii");
  aria.setKey(mk);
  aria.setupRoundKeys();

  const pt = stringToByte(plainText, "unicode");
  const pt16: Uint8Array[] = [];

  pt.forEach((p, i) => {
    if ((i + 1) % 16 === 0 || i + 1 === pt.length) {
      pt16.push(pt.slice(Math.floor(i / 16) * 16, i + 1));
    }
  });

  const cipherBuffer = new Uint8Array(
    (Math.floor((pt.length - 1) / 16) + 1) * 16
  );
  pt16.forEach((p, idx) => {
    const c: Uint8Array = new Uint8Array(16);
    aria.encrypt(p, 0, c, 0);

    cipherBuffer.set(c, idx * 16);
  });
  const cipherText = bytesToString(cipherBuffer, "ascii");

  return cipherText;
}

export function decryptProcess(cipherText: string, decryptKey: string): string {
  const communityKey = decryptKey;
  const aria = new ARIAEngine(256);
  const mk = stringToByte(communityKey, "ascii");
  aria.setKey(mk);
  aria.setupRoundKeys();

  const dt = stringToByte(cipherText, "ascii");
  const dt16: Uint8Array[] = [];

  dt.forEach((d, i) => {
    if ((i + 1) % 16 === 0) {
      dt16.push(dt.slice(Math.floor(i / 16) * 16, i + 1));
    }
  });

  let decodedByte: Uint8Array = new Uint8Array();
  dt16.forEach((d) => {
    const c: Uint8Array = new Uint8Array(16);
    aria.decrypt(d, 0, c, 0);

    const merge = new Uint8Array(decodedByte.length + c.length);

    merge.set(decodedByte);
    merge.set(c, decodedByte.length);

    decodedByte = merge;
  });

  const isExistZero = decodedByte.indexOf(0);
  if (isExistZero !== -1) {
    decodedByte = decodedByte.slice(0, isExistZero);
  }

  const decodedText = bytesToString(decodedByte, "unicode");
  return decodedText;
}

export function responseDecrypt(
  body: any,
  decryptKey: string,
  exclude?: string[]
): any {
  Object.keys(body).forEach((key) => {
    if (Array.isArray(body[key])) {
      for (let i = 0; i < body[key].length; i++) {
        if (typeof body[key][i] === "object") {
          responseDecrypt(body[key][i], decryptKey, exclude);
        } else {
          body[key][i] = decryptProcess(body[key][i], decryptKey);
        }
      }
    } else if (typeof body[key] === "object") {
      responseDecrypt(body[key], decryptKey, exclude);
    } else {
      if (!exclude || !exclude.includes(key))
        body[key] = decryptProcess(body[key], decryptKey);
    }
  });
}

export function requestBodyEncrypt(body: any, encryptKey: string): any {
  Object.keys(body).forEach((key) => {
    if (typeof body[key] === "object") {
      requestBodyEncrypt(body[key], encryptKey);
    } else {
      body[key] = encryptProcess(body[key].toString(), encryptKey);
    }
  });
}
