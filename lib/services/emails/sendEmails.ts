import { AXIOS_INSTANCE } from "@/lib/axios";
import { VerificationStatus } from "@/lib/types";
export type SendEmailData = {
    emails: string[],
    subject: string,
    senderName: string,
    textPart: string,
    htmlPart: string,
}
// send email
export const sendEmail = async (data: SendEmailData) => {
    try {
        const response = await AXIOS_INSTANCE.post("/sendEmails", data);
        return response.data;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};

// Envoie un email via ton endpoint Cloud Function
export async function sendAccountEmail({
    to,
    displayName,
    email,
    password,
    role,
}: {
    to: string;
    displayName: string;
    email: string;
    password: string;
    role: string;
}) {
    const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login`;

    const htmlPart = `
    <div style="font-family: sans-serif; line-height: 1.5; color: #333; max-width: 600px;">
      <h2 style="color: #000;">Bienvenue sur G-TEACH</h2>
      <p>Bonjour ${displayName},</p>
      <p>Votre compte a été créé avec succès.</p>
      
      <p><strong>Vos accès :</strong><br>
      Email : <strong>${email}</strong><br>
      Mot de passe : <strong>${password}</strong><br>
      Rôle : <strong>${role}</strong></p>

      <p>Vous pouvez vous connecter ici : <br>
      <a href="${loginUrl}">${loginUrl}</a></p>

      <p style="margin-top: 40px; font-size: 12px; color: #888; border-top: 1px solid #eee; padding-top: 10px;">
        G-TEACH Administration<br>
        © ${new Date().getFullYear()}
      </p>
    </div>
  `;

    const response = await sendEmail({
        emails: [to],
        subject: "Bienvenue sur G-TEACH – Vos accès",
        senderName: "G-TEACH Administration",
        textPart: `Bonjour ${displayName},\nVotre compte G-TEACH est prêt. Email: ${email} | Mot de passe: ${password}`,
        htmlPart,
    })
    console.log("Email side effect status:", response);
    return response;
}

export async function sendValidationEmail({
    to,
    displayName,
    email,
    role,
    status,
    feedbackMessage,
}: {
    to: string;
    displayName: string;
    email: string;
    role: string;
    status: VerificationStatus;
    feedbackMessage?: string;
}) {
    const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login`;
    const profileUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/profile`;

    const isVerified = status === "verified";

    const htmlPart = `
    <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: ${isVerified ? '#10b981' : '#ef4444'}; margin-top: 0;">
        ${isVerified ? 'Félicitations ! Votre profil est validé' : 'Mise à jour de votre demande de validation'}
      </h2>
      
      <p>Bonjour <strong>${displayName}</strong>,</p>
      
      ${isVerified ? `
        <p>Nous avons le plaisir de vous informer que votre profil de <strong>${role}</strong> sur G-TEACH a été validé par notre équipe administrative.</p>
        
        <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0;">
          <p style="margin: 0; font-weight: bold; color: #166534;">Prochaine étape importante :</p>
          <p style="margin: 5px 0 0 0;">N'oubliez pas de compléter l'intégralité de votre profil (biographie, matières, niveaux, etc.). Un profil incomplet ne sera pas visible par les élèves sur la plateforme.</p>
        </div>
      ` : `
        <p>Nous avons étudié votre demande de validation de profil sur G-TEACH et nous ne pouvons malheureusement pas l'approuver pour le moment.</p>
        
        ${feedbackMessage ? `
          <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; font-weight: bold; color: #991b1b;">Motif du refus :</p>
            <p style="margin: 5px 0 0 0;">${feedbackMessage}</p>
          </div>
        ` : ''}
        
        <p>Vous pouvez modifier votre profil et soumettre une nouvelle demande de validation ultérieurement.</p>
      `}
      
      <p><strong>Détails du compte :</strong><br>
      Email : <strong>${email}</strong><br>
      Rôle : <strong>${role}</strong></p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${isVerified ? profileUrl : loginUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
          ${isVerified ? 'Compléter mon profil' : 'Accéder à mon compte'}
        </a>
      </div>

      <p style="margin-top: 40px; font-size: 12px; color: #888; border-top: 1px solid #eee; padding-top: 15px; text-align: center;">
        L'équipe G-TEACH<br>
        © ${new Date().getFullYear()}
      </p>
    </div>
  `;

    const subject = isVerified
        ? "Félicitations ! Votre compte G-TEACH a été validé"
        : "Mise à jour concernant votre compte G-TEACH";

    const response = await sendEmail({
        emails: [to],
        subject: subject,
        senderName: "G-TEACH Administration",
        textPart: isVerified
            ? `Bonjour ${displayName}, votre compte G-TEACH a été validé. Complétez votre profil pour être visible.`
            : `Bonjour ${displayName}, votre demande de validation G-TEACH a été rejetée. ${feedbackMessage || ''}`,
        htmlPart,
    })
    console.log("Email side effect status:", response);
    return response;
}