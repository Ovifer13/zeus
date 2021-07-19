const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
class Base64Utils {
    btoa = (input: string = '') => {
        let str = input;
        let output = '';

        for (
            let block = 0, charCode, i = 0, map = chars;
            str.charAt(i | 0) || ((map = '='), i % 1);
            output += map.charAt(63 & (block >> (8 - (i % 1) * 8)))
        ) {
            charCode = str.charCodeAt((i += 3 / 4));

            if (charCode > 0xff) {
                throw new Error(
                    "'btoa' failed: The string to be encoded contains characters outside of the Latin1 range."
                );
            }

            block = (block << 8) | charCode;
        }

        return output;
    };

    atob = (input: string = '') => {
        let str = input.replace(/=+$/, '');
        let output = '';

        if (str.length % 4 == 1) {
            throw new Error(
                "'atob' failed: The string to be decoded is not correctly encoded."
            );
        }
        for (
            let bc = 0, bs = 0, buffer, i = 0;
            (buffer = str.charAt(i++));
            ~buffer && ((bs = bc % 4 ? bs * 64 + buffer : buffer), bc++ % 4)
                ? (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6))))
                : 0
        ) {
            buffer = chars.indexOf(buffer);
        }

        return output;
    };

    hexStringToByte = (str: string = '') => {
        if (!str) {
            return new Uint8Array();
        }

        const a = [];
        for (let i = 0, len = str.length; i < len; i += 2) {
            a.push(parseInt(str.substr(i, 2), 16));
        }

        return new Uint8Array(a);
    };

    byteToBase64 = (buffer: Uint8Array) => {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return this.btoa(binary);
    };

    hexToBase64 = (str: string = '') =>
        this.byteToBase64(this.hexStringToByte(str));

    stringToUint8Array = (str: string) => {
        return Uint8Array.from(str, x => x.charCodeAt(0));
    };
    hexToUint8Array = (hexString: string) => {
        return new Uint8Array(
            hexString.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))
        );
    };
    bytesToHexString = bytes => {
        return bytes.reduce(function(memo, i) {
            return memo + ('0' + i.toString(16)).slice(-2); //padd with leading 0 if <16
        }, '');
    };
}

const base64Utils = new Base64Utils();
export default base64Utils;
