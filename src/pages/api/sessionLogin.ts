import type { NextApiRequest, NextApiResponse } from "next";
import { adminAuth } from "../../../lib/firebaseAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).end();

    try {
        const { idToken } = req.body;
        const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

        const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

        res.setHeader("Set-Cookie", `session=${sessionCookie}; Path=/; HttpOnly; Secure; Max-Age=${expiresIn / 1000}`);

        return res.status(200).json({ status: "success" });
    } catch (e: any) {
        return res.status(500).json({ error: e.message });
    }
}
