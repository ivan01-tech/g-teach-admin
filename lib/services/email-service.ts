/**
 * Email Service for Contact Inquiry Replies
 * This service handles sending email replies to contact inquiries
 */

export interface EmailPayload {
  to: string
  subject: string
  htmlBody: string
  textBody?: string
}

export const emailService = {
  /**
   * Send an email reply to a contact inquiry
   * This calls a backend endpoint that should use SendGrid, Nodemailer, or similar
   */
  sendReplyEmail: async (payload: EmailPayload): Promise<boolean> => {
    try {
      const response = await fetch("/api/emails/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`Email send failed: ${response.statusText}`)
      }

      return true
    } catch (error) {
      console.error("Failed to send email:", error)
      throw error
    }
  },

  /**
   * Send a contact inquiry reply with standard template
   */
  sendInquiryReply: async (
    recipientEmail: string,
    recipientName: string,
    subject: string,
    replyMessage: string
  ): Promise<boolean> => {
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
          <h2 style="color: #333; margin-top: 0;">We've Received Your Inquiry</h2>
          <p style="color: #666; line-height: 1.6;">
            Dear ${recipientName},
          </p>
          <p style="color: #666; line-height: 1.6;">
            Thank you for reaching out to us. Here's our response to your inquiry:
          </p>
          
          <div style="background-color: #ffffff; padding: 15px; border-left: 4px solid #007bff; margin: 20px 0;">
            <p style="color: #333; margin: 0; white-space: pre-wrap; line-height: 1.6;">
              ${replyMessage}
            </p>
          </div>

          <p style="color: #666; line-height: 1.6;">
            If you have any further questions, please don't hesitate to contact us.
          </p>

          <div style="border-top: 1px solid #ddd; margin-top: 30px; padding-top: 20px;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              This is an automated message. Please do not reply to this email.
            </p>
            <p style="color: #999; font-size: 12px; margin: 5px 0;">
              G-Teach Admin Team
            </p>
          </div>
        </div>
      </div>
    `

    const textBody = `
Dear ${recipientName},

Thank you for reaching out to us. Here's our response to your inquiry:

${replyMessage}

If you have any further questions, please don't hesitate to contact us.

---
This is an automated message. Please do not reply to this email.
G-Teach Admin Team
    `.trim()

    return emailService.sendReplyEmail({
      to: recipientEmail,
      subject: `Re: ${subject}`,
      htmlBody,
      textBody,
    })
  },

  /**
   * Send notification email to admin when new inquiry is received
   */
  sendAdminNotification: async (
    adminEmail: string,
    inquisitorName: string,
    subject: string,
    message: string,
    inquiryId: string
  ): Promise<boolean> => {
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <p style="color: #856404; margin: 0; font-weight: bold;">
            ⚠️ New Contact Inquiry Received
          </p>
        </div>

        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
          <h3 style="color: #333; margin-top: 0;">Inquiry Details</h3>
          
          <p style="margin: 10px 0;"><strong>From:</strong> ${inquisitorName}</p>
          <p style="margin: 10px 0;"><strong>Subject:</strong> ${subject}</p>
          
          <div style="background-color: #ffffff; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0;">
            <p style="color: #333; margin: 0; white-space: pre-wrap; line-height: 1.6;">
              ${message}
            </p>
          </div>

          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd;">
            <a href="dashboard/contact-inquiries" style="display: inline-block; background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              View in Admin Panel
            </a>
          </div>
        </div>
      </div>
    `

    return emailService.sendReplyEmail({
      to: adminEmail,
      subject: `[New Inquiry] ${subject}`,
      htmlBody,
    })
  },
}
