import crypto from "crypto";

class Cyber {

    public isValideBearer(header: string | undefined, expected: string): boolean {
        
        if (!header || !header.startsWith("Bearer ")) {
            return false;
        }

        const token = header.slice("Bearer ".length);

        const tokenBuffer = Buffer.from(token, 'utf-8');
        const expectedBuffer = Buffer.from(expected, 'utf-8');

        if (tokenBuffer.length !== expectedBuffer.length) {
            return false;
        }

        return crypto.timingSafeEqual(tokenBuffer, expectedBuffer);
    }

}

export const cyber = new Cyber();