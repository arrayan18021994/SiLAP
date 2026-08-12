import logging

logger = logging.getLogger(__name__)

class EmailService:
    def send_otp_email(self, to_email: str, otp: str):
        """
        Sends an OTP code via email.
        In this development phase, it mocks the sending process by printing to the console.
        """
        # In a real scenario, this would use smtplib or an email API like SendGrid
        print(f"\n{'='*50}")
        print(f"📧 EMAIL MOCK (Silakan ganti dengan SMTP asli nanti)")
        print(f"To: {to_email}")
        print(f"Subject: SiLAP - Kode Pemulihan Akun Anda")
        print(f"\nKode OTP Anda adalah: {otp}")
        print(f"Kode ini berlaku selama 5 menit. Jangan bagikan ke siapapun.")
        print(f"{'='*50}\n")
        logger.info(f"Mock OTP sent to {to_email}")

email_service = EmailService()
